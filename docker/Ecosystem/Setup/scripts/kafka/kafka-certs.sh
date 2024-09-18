#!/bin/bash

# Directories
CERTS_DIR="/certs"
CA_DIR="$CERTS_DIR/certificate_authority"
KAFKA_CERTS_DIR="/kafka/certs"

# Function to move the CA certificate
move_ca_cert() {
  echo "Moving CA certificate..."

  if [ ! -f "$CA_DIR/certificate_authority.crt" ]; then
    echo "Error: CA certificate not found at $CA_DIR"
    exit 1
  fi

  cp "$CA_DIR/certificate_authority.crt" "$KAFKA_CERTS_DIR/ca.crt"

  echo "CA certificate moved."
}

# Function to create truststore files
create_truststores() {
  echo "Creating truststores..."

  for component in kafka-1 kafka-2 kafka-3 zookeeper kafdrop; do
    keytool -keystore "$KAFKA_CERTS_DIR/$component.truststore.jks" -alias CARoot -import -file "$KAFKA_CERTS_DIR/ca.crt" -storepass "lhsdghzvuawnlh8suvjli2360" -noprompt
    echo "Truststore created for $component."
  done
}

# Function to create keystore files
create_keystores() {
  echo "Creating keystores..."

  for component in kafka-1 kafka-2 kafka-3 zookeeper kafdrop; do
    keytool -genkey -noprompt \
      -alias "$component" \
      -dname "CN=$component, OU=Helix, O=HelixAI, L=City, S=State, C=US" \
      -keystore "$KAFKA_CERTS_DIR/$component.keystore.jks" \
      -keyalg RSA \
      -storepass "$KEYSTORE_PASSWORD" \
      -keypass "$KEYSTORE_PASSWORD"

    # Create a CSR
    keytool -certreq -alias "$component" -keystore "$KAFKA_CERTS_DIR/$component.keystore.jks" -file "$KAFKA_CERTS_DIR/$component.csr" -storepass "lhsdghzvuawnlh8suvjli2360"

    # Sign the certificate with the CA
    openssl x509 -req -CA "$KAFKA_CERTS_DIR/ca.crt" -CAkey "$CA_DIR/certificate_authority.key" -in "$KAFKA_CERTS_DIR/$component.csr" -out "$KAFKA_CERTS_DIR/$component.crt" -days 365 -CAcreateserial -passin pass:"$KEYSTORE_PASSWORD"

    # Import the CA certificate and signed certificate into the keystore
    keytool -import -keystore "$KAFKA_CERTS_DIR/$component.keystore.jks" -file "$KAFKA_CERTS_DIR/ca.crt" -alias CARoot -storepass "lhsdghzvuawnlh8suvjli2360" -noprompt
    keytool -import -keystore "$KAFKA_CERTS_DIR/$component.keystore.jks" -file "$KAFKA_CERTS_DIR/$component.crt" -alias "$component" -storepass "lhsdghzvuawnlh8suvjli2360" -noprompt

    echo "Keystore created and signed for $component."
  done
}

# Function to validate keystore and truststore
validate_stores() {
  echo "Validating keystores and truststores..."

  for component in kafka-1 kafka-2 kafka-3 zookeeper kafdrop; do
    echo "Validating $component.keystore.jks"
    keytool -list -v -keystore "$KAFKA_CERTS_DIR/$component.keystore.jks" -storepass "lhsdghzvuawnlh8suvjli2360"

    echo "Validating $component.truststore.jks"
    keytool -list -v -keystore "$KAFKA_CERTS_DIR/$component.truststore.jks" -storepass "lhsdghzvuawnlh8suvjli2360"
  done
}

# Main execution
run() {
  move_ca_cert
  create_truststores
  create_keystores
  validate_stores
}

run
