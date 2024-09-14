#!/bin/bash

# Exit on Error and display the error message with the failed line number
set -e
trap 'error_exit $? $LINENO $BASH_COMMAND' ERR

# Error handler function
error_exit() {
  local exit_code=$1
  local line_no=$2
  local command=$3
  echo "Error: Command '$command' failed at line $line_no with exit code $exit_code."
  exit $exit_code
}

GENERATED_DIR=/consul/generated
CONFIGS_DIR=/consul/config

# Function to create/check directory with error handling
create_or_check_directory() {
  local directory="$1"
  echo "==================== Creating Directory ====================="
  echo "Checking for directory: $directory"
  if [ ! -d "$directory" ]; then
    echo "Creating directory $directory"
    if ! mkdir -p "$directory"; then
      echo "Error: Failed to create directory $directory"
      exit 1
    fi
    echo "Directory $directory created."
  fi
  echo "Changing directory to $directory"
  cd "$directory" || exit
  echo "Changed directory to $directory"
}

# Function to generate encryption key and handle errors
gen_encryption_key() {
  local key_file="consul-encryption-key.txt"
  echo "========== Generating base64 encoded encryption key ========="
  if [ -f "$key_file" ]; then
    echo "Deleting existing $key_file"
    rm "$key_file"
  fi
  if ! consul keygen > "$key_file"; then
    echo "Error: Failed to generate encryption key."
    exit 1
  fi
  echo "Generated encryption key."
}

# Function to update encryption key in configuration file
update_encrypt_key() {
  local config_file="$1"
  echo "==================== Updating Configs ======================="
  echo "Updating 'encrypt' key in $config_file"
  local key_value="\"$(cat $GENERATED_DIR/consul-encryption-key.txt)\""
  if grep -q "^encrypt\s*=" "$config_file"; then
    sed -i.bak "s|^\\(encrypt\\s*=\\s*\\).*\$|\\1$key_value|" "$config_file"
  else
    echo "encrypt = $key_value" >> "$config_file"
  fi
  sed -i.bak "/^\\s*#.*encrypt/d" "$config_file"
  rm "$config_file.bak"
  echo "Updated 'encrypt' key in $config_file"
}

# Function to update all configuration files
update_configs() {
  echo "==================== Updating Configs ======================="
  for config_file in "$CONFIGS_DIR"/*.hcl; do
    if [ -f "$config_file" ]; then
      update_encrypt_key "$config_file"
    else
      echo "Warning: No config files found in $CONFIGS_DIR."
    fi
  done
}

# Function to create token key file if it doesn't exist
create_or_check_token_key_file() {
  local file_path="consul-intro-token-key"
  echo "==================== Creating Token Key File ====================="
  if [ -e "$file_path" ]; then
    echo "File $file_path already exists."
  else
    echo "Creating $file_path..."
    if ! touch "$file_path"; then
      echo "Error: Failed to create token key file."
      exit 1
    fi
    echo "File $file_path created with a random key."
  fi
}

# Function to create certificates
create_certs() {
  echo "==================== Creating Certs ========================="
  local cert_dir="$GENERATED_DIR/consul-certs"
  if [ -d "$cert_dir" ]; then
    echo "Deleting existing $cert_dir"
    sudo rm -rf "$cert_dir"
  fi
  if [ ! -d "$cert_dir" ]; then
    echo "Creating directory $cert_dir"
    mkdir -p "$cert_dir"
  fi
  cd "$cert_dir" || exit

  echo "Creating CA cert..."
  if ! consul tls ca create > /dev/null 2>&1; then
    echo "Error: Failed to create CA certificate."
    exit 1
  fi

  echo "Creating Consul Server cert..."
  if ! consul tls cert create -server -dc helix-dc-1 > /dev/null 2>&1; then
    echo "Error: Failed to create Consul server certificate."
    exit 1
  fi

  cd - || exit
}

# Main function to run the script
run() {
  echo "============================================================="
  echo "====================== Configuring Consul ==================="
  echo "============================================================="
  create_or_check_directory "$GENERATED_DIR"
  create_certs
  gen_encryption_key
  update_configs
  create_or_check_token_key_file
  echo "============================================================="
  echo "================= Completed Automated Tasks ================="
  echo "============================================================="
}

run
