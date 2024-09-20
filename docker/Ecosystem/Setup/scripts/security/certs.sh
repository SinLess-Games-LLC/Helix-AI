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
CA_P12=$CA_DIR/ca.p12
CA_ZIP=$CA_DIR/certificate_authority.zip
CA_CERT=$CA_DIR/ca.crt
CA_KEY=$CA_DIR/ca.key

CONFIG=$CONFIG_DIR/config.yaml

# Check if java is installed and if not install it
check_install_java_keytool() {
  if ! command -v "keytool" &>/dev/null; then
    echo "Java not found. Installing Java..."
    # Update package lists
    sudo apt-get update -y > /dev/null 2>&1

    # Attempt to install OpenJDK 11, fallback to OpenJDK 8 if not available
    if ! sudo apt-get install -y openjdk-11-jre-headless > /dev/null 2>&1; then
      echo "OpenJDK 11 not found, trying OpenJDK 8..."
      if ! sudo apt-get install -y openjdk-8-jre-headless > /dev/null 2>&1; then
        echo "Error: Failed to install Java. Exiting."
        exit 1
      fi
    fi
    echo "Java installed."
  else
    echo "Java already installed."
  fi
}

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

  if ! sudo openssl req -x509 -newkey rsa:4096 -keyout "$CA_KEY" -out "$CA_CERT" -days 365 -nodes -subj "/CN=HelixAICertificateAuthority" > /dev/null 2>&1; then
    echo "Error: Failed to generate self-signed CA certificate. Exiting."
    exit 1
  fi
}

create_ca_p12() {
  echo "Creating CA P12 file..."

  if ! sudo openssl pkcs12 -export -out "$CA_P12" -inkey "$CA_KEY" -in "$CA_CERT" -passout pass:"$KEYSTORE_PASSWORD" > /dev/null 2>&1; then
    echo "Error: Failed to create CA P12 file. Exiting."
    exit 1
  fi
}

create_ca_zip() {
  echo "Creating CA ZIP file..."

  if ! sudo zip "$CA_ZIP" "$CA_CERT" "$CA_KEY" > /dev/null 2>&1; then
    echo "Error: Failed to create CA ZIP file. Exiting."
    exit 1
  fi
}

create_jks() {
  local p12_file=$1
  local jks_file=$2
  local password=$3

  echo "Creating JKS keystore from $p12_file..."

  if ! sudo keytool -importkeystore -srckeystore "$p12_file" -srcstoretype pkcs12 -srcstorepass "$password" -destkeystore "$jks_file" -deststoretype jks -deststorepass "$KEYSTORE_PASSWORD" > /dev/null 2>&1; then
    echo "Error: Failed to create JKS keystore from $p12_file. Exiting."
    exit 1
  fi
}

create_certificates() {
  echo "Generating certificates for instances..."

  instances=$(yq '.instances[].name' "$CONFIG")

  for instance in $instances; do
    sanitized_instance=$(echo "$instance" | tr -cd '[:alnum:]-_')
    echo 'sanitized_instance: $sanitized_instance'

    instance_cert_dir="$CERT_DIR/$sanitized_instance"
    instance_keystore_dir="$KEY_STORES_DIR/$sanitized_instance"

    p12_filename="$instance_keystore_dir/$sanitized_instance.p12"
    jks_filename="$instance_keystore_dir/$sanitized_instance.jks"
    key_filename="$instance_cert_dir/$sanitized_instance.key"
    csr_filename="$instance_cert_dir/$sanitized_instance.csr"
    pem_filename="$instance_cert_dir/$sanitized_instance.pem"

    echo "checking if instance is consul"
    if $sanitized_instance == "consul"; then
      echo "consul instance: $sanitized_instance"
      echo "Creating CA cert..."
      cd $instance_cert_dir

      if consul tls ca create; then
        echo "Error: Failed to create CA certificate."
        exit 1
      fi

      echo "Creating Consul Server cert..."
      if consul tls cert create -server -dc helix-dc-1; then
        echo "Error: Failed to create Consul server certificate."
        exit 1
      fi
    fi

    # Generate .p12 file
    if ! sudo openssl pkcs12 -export -out "$p12_filename" -inkey "$CA_KEY" -in "$CA_CERT" -passout pass:"$KEYSTORE_PASSWORD" > /dev/null 2>&1; then
      echo "Error: Failed to create p12 certificate for $sanitized_instance. Exiting."
      exit 1
    fi

    # Convert .p12 to .jks
    create_jks "$p12_filename" "$jks_filename" "$KEYSTORE_PASSWORD"

    # Generate CSR and PEM
    if ! sudo openssl req -new -newkey rsa:4096 -keyout "$key_filename" -out "$csr_filename" -nodes -subj "/CN=$sanitized_instance" > /dev/null 2>&1; then
      echo "Error: Failed to create CSR for $sanitized_instance. Exiting."
      exit 1
    fi

    if ! sudo openssl x509 -req -days 365 -in "$csr_filename" -signkey "$key_filename" -out "$pem_filename" > /dev/null 2>&1; then
      echo "Error: Failed to create PEM certificate for $sanitized_instance. Exiting."
      exit 1
    fi

    echo "Certificates for $sanitized_instance created successfully."
  done
}

run() {
  echo "===== Starting Helix AI Certificate Generation ====="

  check_install_java_keytool

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
