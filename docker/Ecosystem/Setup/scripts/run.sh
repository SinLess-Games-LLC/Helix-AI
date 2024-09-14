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
  printf "==================== Running certs.sh =====================\n\n"

  # Run the certs.sh script
  bash /app/security/certs.sh

  printf "==================== Completed certs.sh =====================\n\n"
  printf "===========================================================\n"

  printf "===========================================================\n"
  printf "==================== Running consul.sh =====================\n\n"

  # Run the consul.sh script
  bash /app/consul/consul.sh

  printf "==================== Completed consul.sh =====================\n\n"
  printf "===========================================================\n"
}

runtime
