#!/bin/bash

# Exit on Error
set -e

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



install_dependencies() {
  printf "================= DEPENDENCIES CHECK ========================\n"

  # check if jq is installed
  if ! command -v jq >/dev/null; then
    echo "Error: jq is not installed."
    echo "Installing jq..."
    sudo apt-get install jq -y > /dev/null 2>&1
    echo "jq installed."
  fi

  # check for yq
  if ! command -v yq >/dev/null; then
    echo "Error: yq is not installed."
    echo "Installing yq..."
    pip3 install yq > /dev/null 2>&1
    echo "yq installed."
  fi

  # Check if python3 is installed
  if ! command -v python3 >/dev/null; then
    echo "Error: python3 is not installed."
    echo "Installing python3..."
    apt-get install python3 -y > /dev/null 2>&1
    echo "Python3 installed."
  fi

  # Check if pip is installed
  if ! command -v pip >/dev/null; then
    echo "Error: pip is not installed."
    echo "Installing pip..."
    apt-get install python3-pip -y > /dev/null 2>&1
    echo "Pip installed."
  fi

  # Check if openssl is installed
  if ! command -v openssl >/dev/null; then
    echo "Error: openssl is not installed."
    echo "Installing openssl..."
    apt-get install openssl -y > /dev/null 2>&1
    echo "Openssl installed."
  fi

  # Check if zip is installed
  if ! command -v zip >/dev/null; then
    echo "Error: zip is not installed."
    echo "Installing zip..."
    apt-get install zip -y > /dev/null 2>&1
    echo "Zip installed."
  fi

  # Check if shyaml is installed
  if ! command -v shyaml >/dev/null; then
    echo "Error: shyaml is not installed."
    echo "Installing shyaml..."
    python3 -m pip install shyaml > /dev/null 2>&1
    echo "Shyaml installed."
  fi

  echo "All dependencies are installed."
}

delete_old_structure() {
  printf "=================== Delete Old Files ========================\n"
  echo "Deleting old file structure, keeping the 'certs' folder..."
  # Remove the old structure, keeping the 'certs' folder
  sudo rm -rf "$CA_DIR" "$KEY_STORES_DIR" "$CERT_DIR"  > /dev/null 2>&1

  echo "Old file structure deleted, 'certs' folder reset."
}

create_directory_structure() {
  printf "================= Create Directories ========================\n"

  output_dir=$OUTPUT_DIR
  ca_dir=$CA_DIR
  cert_dir=$CERT_DIR
  keystore_dir=$KEY_STORES_DIR

  # Check and create the main output directory
  if [ ! -d "$output_dir" ]; then
    echo "Creating directory: $output_dir"
    sudo mkdir -p "$output_dir"  > /dev/null 2>&1
  fi

  # Check and create the certificate authority directory
  if [ ! -d "$ca_dir" ]; then
    printf "\n\n"
    echo "Creating directory: $ca_dir"
    sudo mkdir -p "$ca_dir"  > /dev/null 2>&1
  fi

  # Check and create the certificates directory
  if [ ! -d "$cert_dir" ]; then
    printf "\n\n"
    echo "Creating directory: $cert_dir"
    sudo mkdir -p "$cert_dir"  > /dev/null 2>&1
  fi

  # Check and create the keystores directory
  if [ ! -d "$keystore_dir" ]; then
    printf "\n\n"
    echo "Creating directory: $keystore_dir"
    sudo mkdir -p "$keystore_dir"  > /dev/null 2>&1
  fi

  # Use shyaml to extract the list of instance names from the YAML configuration file
  instances=$(yq '.instances[].name' "$CONFIG")

  echo "Instances: $instances"

  # Create certificate and keystore directories for each instance
  for instance in $instances; do
    # Sanitize the instance name by removing special characters
    sanitized_instance=$(echo "$instance" | tr -cd '[:alnum:]-_')

    instance_cert_dir="$cert_dir/$sanitized_instance"
    instance_keystore_dir="$keystore_dir/$sanitized_instance"

    # Check if instance directory exists, create it if not
    if [ ! -d "$instance_cert_dir" ]; then
      printf "\n\n"
      echo "Creating directory: $instance_cert_dir"
      sudo mkdir -p "$instance_cert_dir" > /dev/null 2>&1
    fi

    # Check if keystore directory exists, create it if not
    if [ ! -d "$instance_keystore_dir" ]; then
      printf "\n\n"
      echo "Creating directory: $instance_keystore_dir"
      sudo mkdir -p "$instance_keystore_dir" > /dev/null 2>&1
    fi
  done
}

create_self_signed_ca() {
  printf "================ Create CA Certificate ======================\n"

  ca_dir=$CA_DIR
  ca_cert_path=$CA_CERT
  ca_key_path=$CA_KEY

  # Generate a self-signed CA certificate and private key for Helix AI ecosystem
  if sudo openssl req -x509 -newkey rsa:4096 -keyout "$ca_key_path" -out "$ca_cert_path" -days 365 -nodes -subj "/CN=HelixAICertificateAuthority" > /dev/null 2>&1; then
    echo "Self-signed CA certificate for Helix AI ecosystem created."
    echo "Private key for the Helix AI CA created."
  else
    echo "Error: Unable to generate self-signed CA certificate for Helix AI ecosystem. Exiting."
    exit 1
  fi
}

create_ca_p12() {
  printf "=============== Create P12 Certificate ======================\n"

  echo "Creating CA P12 file..."
  ca_cert_path=$CA_CERT
  ca_key_path=$CA_KEY
  ca_p12_path=$CA_P12

  sudo openssl pkcs12 -export -out "$ca_p12_path" -inkey "$ca_key_path" -in "$ca_cert_path" -passout pass: >/dev/null 2>&1 || {
    echo "Error: Unable to create P12 file for CA certificate. Exiting."
    exit 1
  }

  echo "CA P12 file created."
}

create_ca_zip() {
  printf "=============== Create CA Zip Certificate ===================\n"
  echo "Creating CA ZIP file..."
  ca_cert_path=$CA_CERT
  ca_key_path=$CA_KEY
  ca_zip_path=$CA_ZIP

  # Create a ZIP file containing the CA certificate and key
  sudo zip "$ca_zip_path" "$ca_cert_path" "$ca_key_path" > /dev/null 2>&1

  echo "CA ZIP file created."
}

create_certificates() {
  printf "\n====== Generating Certificate Keystores ======\n"

  # Use shyaml to extract the list of instance names from the YAML configuration file
  instances=$(yq '.instances[].name' "$CONFIG")

  for instance in $instances; do
    instance_name=$(basename "$instance" .yml)  # Extracting instance name from the file name
    sanitized_instance=$(echo "$instance_name" | tr -cd '[:alnum:]-_')  # Sanitize instance name

    instance_cert_dir="$CERT_DIR/$sanitized_instance"
    instance_keystore_dir="$KEY_STORES_DIR/$sanitized_instance"

    # Create p12 certificate keystores
    p12_filename="$instance_keystore_dir/$sanitized_instance.p12"
    sudo openssl pkcs12 -export -out "$p12_filename" -inkey "$CA_KEY" -in "$CA_CERT" -passout pass: > /dev/null 2>&1 || {
      echo "Error: Unable to create p12 certificate keystores for $sanitized_instance. Exiting."
      exit 1
    }

    # Create crt, key, and pem certificates
    key_filename="$instance_cert_dir/$sanitized_instance.key"
    csr_filename="$instance_cert_dir/$sanitized_instance.csr"
    pem_filename="$instance_cert_dir/$sanitized_instance.pem"

    sudo openssl req -new -newkey rsa:4096 -keyout "$key_filename" -out "$csr_filename" -nodes -subj "/CN=$sanitized_instance" > /dev/null 2>&1 || {
      echo "Error: Unable to create crt and key certificates for $sanitized_instance. Exiting."
      exit 1
    }

    sudo openssl x509 -req -days 365 -in "$csr_filename" -signkey "$key_filename" -out "$pem_filename" > /dev/null 2>&1 || {
      echo "Error: Unable to create pem certificate for $sanitized_instance. Exiting."
      exit 1
    }

    echo "Certificates for $sanitized_instance created successfully"
  done
}



run() {
  printf "=============================================================\n"
  printf "=============================================================\n"
  printf "========== Creating certificates For Helix Ecosystem ========\n"
  printf "=============================================================\n"
  printf "=============================================================\n\n\n"
  # Sleep for 1 seconds
  sleep 1

  # Install dependencies
  install_dependencies
  # Sleep for 1 seconds
  sleep 1

  # Delete the old file structure if it exists
  delete_old_structure
  # Sleep for 1 seconds
  sleep 1

  # Create the new file structure
  create_directory_structure
  # Sleep for 1 seconds
  sleep 1

  # Create the certificates
  create_self_signed_ca
  # Sleep for 1 seconds
  sleep 1


  create_ca_p12
  # Sleep for 1 seconds
  sleep 1


  create_ca_zip
  # Sleep for 1 seconds
  sleep 1


  create_certificates
  # Sleep for 1 seconds
  sleep 1

  # Create Sucess marker file
  sudo touch /certs/success

  printf "=========================================================\n"
  printf "=========================================================\n"
  printf "=========== Certificates created successfully ===========\n"
  printf "=========================================================\n\n"
  printf "=========================================================\n\n"
}

run
