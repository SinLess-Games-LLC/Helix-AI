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

# Directories
CONFIG_DIR=/app
OUTPUT_DIR=/certs
CA_DIR=$OUTPUT_DIR/certificate_authority
KEY_STORES_DIR=$OUTPUT_DIR/keystores
CERT_DIR=$OUTPUT_DIR/certificates

# File names
CA_P12=$CA_DIR/certificate_authority.p12
CA_ZIP=$CA_DIR/certificate_authority.zip
CA_CERT=$CA_DIR/certificate_authority.crt
CA_KEY=$CA_DIR/certificate_authority.key

CONFIG=$CONFIG_DIR/config.yaml

# Install a package if not already installed
install_if_missing() {
  local package=$1
  local install_command=$2

  if ! command -v "$package" &>/dev/null; then
    echo "Installing $package..."
    if ! eval "$install_command" > /dev/null 2>&1; then
      echo "Error: Failed to install $package. Exiting."
      exit 1
    fi
    echo "$package installed."
  else
    echo "$package already installed."
  fi
}

install_dependencies() {
  echo "Installing required dependencies..."

  install_if_missing "jq" "sudo apt-get install jq -y"
  install_if_missing "yq" "pip3 install yq"
  install_if_missing "python3" "sudo apt-get install python3 -y"
  install_if_missing "pip" "sudo apt-get install python3-pip -y"
  install_if_missing "openssl" "sudo apt-get install openssl -y"
  install_if_missing "zip" "sudo apt-get install zip -y"
  install_if_missing "shyaml" "pip3 install shyaml"

  echo "All dependencies installed successfully."
}

# Function to create directories and handle errors
create_directory() {
  local dir=$1
  if [ ! -d "$dir" ]; then
    if ! sudo mkdir -p "$dir"; then
      echo "Error: Failed to create directory '$dir'. Exiting."
      exit 1
    fi
    echo "Created directory: $dir"
  fi
}

delete_old_structure() {
  echo "Cleaning up old files, keeping 'certs' directory..."
  if ! sudo rm -rf "$CA_DIR" "$KEY_STORES_DIR" "$CERT_DIR"; then
    echo "Error: Failed to delete old directory structure. Exiting."
    exit 1
  fi
}

create_directory_structure() {
  echo "Creating directory structure..."

  create_directory "$OUTPUT_DIR"
  create_directory "$CA_DIR"
  create_directory "$CERT_DIR"
  create_directory "$KEY_STORES_DIR"

  instances=$(yq '.instances[].name' "$CONFIG")

  for instance in $instances; do
    sanitized_instance=$(echo "$instance" | tr -cd '[:alnum:]-_')

    create_directory "$CERT_DIR/$sanitized_instance"
    create_directory "$KEY_STORES_DIR/$sanitized_instance"
  done
}

create_self_signed_ca() {
  echo "Generating self-signed CA certificate..."

  if ! sudo openssl req -x509 -newkey rsa:4096 -keyout "$CA_KEY" -out "$CA_CERT" -days 365 -nodes -subj "/CN=HelixAICertificateAuthority"; then
    echo "Error: Failed to generate self-signed CA certificate. Exiting."
    exit 1
  fi
}

create_ca_p12() {
  echo "Creating CA P12 file..."

  if ! sudo openssl pkcs12 -export -out "$CA_P12" -inkey "$CA_KEY" -in "$CA_CERT" -passout pass:; then
    echo "Error: Failed to create CA P12 file. Exiting."
    exit 1
  fi
}

create_ca_zip() {
  echo "Creating CA ZIP file..."

  if ! sudo zip "$CA_ZIP" "$CA_CERT" "$CA_KEY"; then
    echo "Error: Failed to create CA ZIP file. Exiting."
    exit 1
  fi
}

create_certificates() {
  echo "Generating certificates for instances..."

  instances=$(yq '.instances[].name' "$CONFIG")

  for instance in $instances; do
    sanitized_instance=$(echo "$instance" | tr -cd '[:alnum:]-_')

    instance_cert_dir="$CERT_DIR/$sanitized_instance"
    instance_keystore_dir="$KEY_STORES_DIR/$sanitized_instance"

    p12_filename="$instance_keystore_dir/$sanitized_instance.p12"
    key_filename="$instance_cert_dir/$sanitized_instance.key"
    csr_filename="$instance_cert_dir/$sanitized_instance.csr"
    pem_filename="$instance_cert_dir/$sanitized_instance.pem"

    if ! sudo openssl pkcs12 -export -out "$p12_filename" -inkey "$CA_KEY" -in "$CA_CERT" -passout pass:; then
      echo "Error: Failed to create p12 certificate for $sanitized_instance. Exiting."
      exit 1
    fi

    if ! sudo openssl req -new -newkey rsa:4096 -keyout "$key_filename" -out "$csr_filename" -nodes -subj "/CN=$sanitized_instance"; then
      echo "Error: Failed to create CSR for $sanitized_instance. Exiting."
      exit 1
    fi

    if ! sudo openssl x509 -req -days 365 -in "$csr_filename" -signkey "$key_filename" -out "$pem_filename"; then
      echo "Error: Failed to create PEM certificate for $sanitized_instance. Exiting."
      exit 1
    fi

    echo "Certificates for $sanitized_instance created successfully."
  done
}

run() {
  echo "===== Starting Helix AI Certificate Generation ====="

  install_dependencies
  delete_old_structure
  create_directory_structure
  create_self_signed_ca
  create_ca_p12
  create_ca_zip
  create_certificates

  if ! sudo touch /certs/success; then
    echo "Error: Unable to create success marker file. Exiting."
    exit 1
  fi

  echo "===== Certificate generation completed successfully ====="
}

run
