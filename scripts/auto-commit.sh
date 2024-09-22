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

COMMITLINT_CONFIG=".commitlintrc.js"

# Define your commitlint format
TYPES=$(grep -oP '(?<=type-enum).*\[.*?\]' $COMMITLINT_CONFIG | sed -E 's/.*\[([^\]]*)\].*/\1/' | tr -d '\n' | tr -d '"' | tr ',' ' ')
SCOPES=$(grep -oP '(?<=scope-enum).*\[.*?\]' $COMMITLINT_CONFIG | sed -E 's/.*\[([^\]]*)\].*/\1/' | tr -d '\n' | tr -d '"' | tr ',' ' ')

log_info "Valid Scopes: ${SCOPES}"
log_info "Valid Types: ${TYPES}"

# Define the API endpoint and model
API_URL="https://api.openai.com/v1/chat/completions"
MODEL="gpt-4"

clean_exit() {
  rm -rf /tmp/auto-commit.lock
  exit 1
}

# Function to make the API request with file changes and filenames
make_request() {
  log_info "Preparing payload for OpenAI API request..."

  # Get the list of changed files
  CHANGED_FILES="$(git diff --name-only HEAD)"

  # Get the actual changes (diffs)
  FILE_DIFFS="$(git diff HEAD)"


  # Escape special characters for JSON
  ESCAPED_CHANGED_FILES=$(echo "$CHANGED_FILES" | jq -Rsa '.' | sed 's/\\n/\\n/g')


  # Check if the API key is set
  if [ -z "$OPENAI_API_KEY" ]; then
    log_error "OPENAI_API_KEY is not set. Please set it in your environment."
    clean_exit
  fi

  # Check if there are changes
  if [ -z "$CHANGED_FILES" ]; then
    log_warn "No files have changed."
    return 1
  fi

  # Create the payload for OpenAI API request using the escaped values
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
        {role: "system", content: "Here are the file names that have been modified:\n\($changed_files)"},
        {role: "system", content: "Do not use the folowing as scopes: scripts, automation"},
        {role: "system", content: "aynything in ./scrpts falls into Ci/CD"},
        {role: "system", content: "there can only be 1 scope"},
        {role: "user", content: "Please generate a commit message with both a subject based on these changes."}
      ],
      temperature: 0.7
    }')

  log_info "Payload created"

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
  reply=$(echo "$response" | jq -r '.choices[0].message.content' | sed -E 's/^"(.+)"$/\1/') # Remove any unnecessary quotes

  # Add a default commit type and scope if OpenAI response doesn't include them correctly
  if [[ "$reply" != *":"* ]]; then
    log_warn "No valid type or scope detected in the response. Adding default 'chore(ci/cd)'."
    reply="chore(ci/cd): $reply"
  fi

  log_info "Commit message generated: $reply"

  if [ -z "$reply" ] || [ "$reply" = "null" ]; then
    log_error "Received an invalid response from OpenAI."
    return 1
  fi

  log_info "Commit message generated: $reply"
  return 0
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

# Function to check the reply with commitlint
check_commitlint() {
  # Run commitlint with the reply
  log_info "Reply: $reply"
  echo "$reply" | npx --no-install commitlint
  if [ $? -ne 0 ]; then
    log_error "Commit message failed commitlint check. Retrying..."
    return 1  # Failed
  else
    log_info "Commit message passed commitlint check."
    return 0  # Passed
  fi
}

verify_commitmessage() {
  while true; do
    # Make the API request to get the commit message
    make_request
    if [ $? -ne 0 ]; then
      log_error "Failed to generate commit message. Retrying..."
      continue  # Retry the request
    fi

    # Check the commit message with commitlint
    if check_commitlint; then
      log_info "Commit message passed commitlint check."
      break  # Exit the loop if commitlint passes
    else
      log_warn "Commitlint check failed with the message: $reply. Retrying..."
      sleep 1  # Sleep for 1 second before retrying
    fi
  done

  log_info "Commit message is valid. Proceeding with the commit."
}

commit_and_push() {
  # Commit the changes and push to the remote repository
  log_info "Committing changes..."
  git add .
  git commit -m "$reply"
  if [ $? -eq 0 ]; then
    git push
    if [ $? -eq 0 ]; then
      log_info "Changes pushed successfully."
    else
      log_error "Failed to push changes to the remote repository."
    fi
  else
    log_error "Failed to create commit."
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

    # Verify the commit message with commitlint
    verify_commitmessage

    # Commit and push the changes
    commit_and_push
  fi

  # Check if the script was interrupted during the commit process
  if [ $? -ne 0 ]; then
    break
  fi

  # Wait for 5 minutes before the next iteration
  wait_for_5_minutes
done

# Ensure lock file is removed on exit
rm -f /tmp/auto-commit.lock
