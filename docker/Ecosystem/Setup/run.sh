#!/bin/bash

# Exit on Error and display the error message with the failed line number
set -e

# Error handler function
error_exit() {
  local exit_code=$?
  local line_no=$1
  local command=$BASH_COMMAND
  echo "Error: Command '$command' failed at line $line_no with exit code $exit_code."
  exit $exit_code
}

# Trap any error and call the error handler
trap 'error_exit $LINENO' ERR

runtime() {
  printf "===========================================================\n"
  printf "==================== Running certs.sh =====================\n"

  # Run the certs.sh script
  bash /app/security/certs.sh

  printf "==================== Completed certs.sh =====================\n\n"
  printf "===========================================================\n\n\n\n"

  # Run the kafka.sh script
  printf "===========================================================\n"
  printf "==================== Running kafka.sh =====================\n\n\n\n"

  bash /app/kafka/kafka-certs.sh

  printf "==================== Completed kafka.sh =====================\n\n"
  printf "===========================================================\n\n"

}

runtime
