#!/bin/zsh

# Define color codes
BLUE="\033[1;34m"
ORANGE="\033[0;33m"
RED="\033[1;31m"
BOLD_RED="\033[1;31m\033[1m"
RESET="\033[0m"

# Trap for cleanup on exit (handles INT and TERM signals)
trap "log_info 'Script interrupted. Cleaning up...'; rm -f /tmp/auto-commit.lock; exit" INT TERM

# Logging functions for info, warn, and error
log_info() {
  echo -e "${BLUE}INFO:${RESET} $1"
}

log_warn() {
  echo -e "${ORANGE}WARN:${RESET} $1"
}

log_error() {
  echo -e "${BOLD_RED}ERROR:${RESET} $1"
}

# ----------------------  DO NOT CHANGE  ----------------------
# Replace with your OpenAI API Key
OPENAI_ORG_ID="org-wlCKckgkuIxvlsdhXmzeWzkS"
OPENAI_PROJECT_ID="proj_SPeb8ul5y6WNrRw0Ri7SJE0h"

# Define your commitlint format
TYPES='["feat", "fix", "docs", "style", "refactor", "test", "chore", "revert"]'
SCOPES='["docs","config","core","components","utils","authentication","frontend","backend","ci/cd","docker","kubernetes","testing","linting","formatting","security","dependencies","performance","accessibility","workflow"]'

# Define the API endpoint and model
API_URL="https://api.openai.com/v1/chat/completions"
MODEL="gpt-4"

clean_exit() {
  rm -rf /tmp/auto-commit.lock
  exit 1
}

# Function to make the API request
make_request() {
  log_info "Preparing payload for OpenAI API request..."

  # Get the list of changed files
  CHANGED_FILES=$(git diff --name-only HEAD)

  # Escape newlines and double quotes for valid JSON
  ESCAPED_CHANGED_FILES=$(echo "$CHANGED_FILES" | sed ':a;N;$!ba;s/\n/\\n/g' | sed 's/"/\\"/g')

  # Check if there are changed files
  if [ -z "$CHANGED_FILES" ]; then
    log_warn "No files have changed."
  fi

  # Create the messages object using jq
  PAYLOAD=$(jq -n \
    --arg model "$MODEL" \
    --arg types "$TYPES" \
    --arg scopes "$SCOPES" \
    --arg changed_files "$ESCAPED_CHANGED_FILES" \
    '{
      model: $model,
      messages: [
        {role: "system", content: "Your job is to create commit messages for me following my commit lint rules."},
        {role: "system", content: "Commitlint types: \($types)"},
        {role: "system", content: "Commitlint scopes: \($scopes)"},
        {role: "system", content: "scope must be one of [docs, config, core, components, utils, authentication, frontend, backend, ci/cd, docker, kubernetes, testing, linting, formatting, security, dependencies, performance, accessibility, workflow, helix, auth-server, discord-bot, frontend, DevSecOps-Dashboard, core, database, logger, ui] [scope-enum]"},
        {role: "user", content: "Create a commit message for the following changes:\n\($changed_files)"}
      ],
      temperature: 0.7,
    }')
  log_info "Paylod created"

  log_info "Sending payload to $API_URL"
  # Make the API request using curl
  response=$(curl -s -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d "$PAYLOAD")

  if [ $? -ne 0 ]; then
    log_error "Failed to make the request to OpenAI API."
    clean_exit
  fi

  # Check if the API call was successful
  log_info "Formatting Response"
  reply=$(echo "$response" | jq -r '.choices[0].message.content')

  if [ "$reply" = "null" ]; then
    log_error "Null response returned exiting"
    clean_exit
  fi

  if [ -z "$reply" ]; then
    # Output error details and return failure
    error_message=$(echo "$response" | jq -r '.error.message')
    log_error "Error from OpenAI: $error_message"
    clean_exit
  else
    log_info "OpenAI response received successfully."
    echo "Reply: $reply"

    log_info "Commitlint rules followed. Pushing changes..."
    log_info "adding files to commit"
    git add .

    log_info "Pushing changes to the remote repository..."
    git commit -m "$reply"
    if git push; then
      log_info "Changes pushed successfully."
    else
      log_error "Failed to push changes to the remote repository."
    fi
  fi
}

# Function to wait for 5 minutes
wait_for_5_minutes() {
  log_info "Waiting for 5 minutes..."
  sleep 300
}

# Check if the stop file exists and exit if it does
check_for_stop_file() {
  if [ -f /tmp/stop-auto-commit ]; then
    log_info "Stop file detected. Exiting..."
    rm -f /tmp/auto-commit.lock  # Clean up the lock file
    exit 0
  fi
}

# Main logic: create the lock file and enter the loop
if [ -f /tmp/auto-commit.lock ]; then
  log_warn "Script is already running. Exiting to prevent multiple instances."
  exit 1
fi

# Create a lock file to ensure only one instance runs
touch /tmp/auto-commit.lock

# Main loop to check for changes every 5 minutes
while true; do
  check_for_stop_file

  # Perform the commit if there are changes in git
  if git diff-index --quiet HEAD; then
    log_info "No changes detected. Skipping commit..."
  else
    log_info "Changes detected. Making commit..."
    make_request
  fi

  # Check if the script was interrupted during the commit process
  if [ $? -ne 0 ]; then
    break
  fi


  # Check if the script was interrupted during the API request
  if [ $? -ne 0 ]; then
    break
  fi

  # Wait for 5 minutes before the next iteration
  wait_for_5_minutes
done

# Ensure lock file is removed on exit
rm -f /tmp/auto-commit.lock
