#!/bin/bash
GENERATED_DIR=../.data/consul/generated
CONFIGS_DIR=/consul/config

create_or_check_directory() {
    printf "==================== Creating Directory =====================\n"
    local directory="$1"
    printf "Checking for directory\n"
    if [ ! -d "$directory" ]; then
        printf "Creating directory %s\n" "$directory"
        mkdir -p "$directory"
        printf "Directory %s created\n" "$directory"
    fi
    printf "Changing directory to %s\n" "$directory"
    cd "$directory" || exit
    printf "Changed directory to %s\n" "$directory"
}
create_or_check_token_key_file() {
    local file_path="consul-intro-token-key"
    printf "==================== Creating Token Key File =====================\n"
    if [ -e "$file_path" ]; then
        echo "File $file_path already exists."
    else
        echo "Creating $file_path..."
        # You can add your logic here to generate the content of the file.
        # For example, generating a random key and storing it in the file.
        # Replace the following line with your own logic.
        touch $file_path > /dev/null 2>&1
        echo "File $file_path created with a random key."
    fi
}
gen_encryption_key() {
    local key_file="consul-encryption-key.txt"
    printf "========== Generating base64 encoded encryption key =========\n"
    if [ -f "$key_file" ]; then
        printf "Deleting existing %s\n" "$key_file"
        rm "$key_file"
    fi
    consul keygen > "$key_file"
    printf "Generated encryption key\n"
}

update_encrypt_key() {
    local config_file="$1"
    local key_value
    printf "==================== Updating Configs =======================\n"
    printf "Updating 'encrypt' key in %s\n" "$config_file"
    # Assign the value separately to avoid SC2155 warning
    key_value="\"$(cat $GENERATED_DIR/consul-encryption-key.txt)\""
    # Check if 'encrypt' key is present
    if grep -q "^encrypt\s*=" "$config_file"; then
        # 'encrypt' key is present, update its value
        sed -i.bak "s|^\\(encrypt\\s*=\\s*\\).*\$|\\1$key_value|" "$config_file"
    else
        # 'encrypt' key is not present, add it
        echo "encrypt = $key_value" >> "$config_file"
    fi
    # Remove any commented-out lines for 'encrypt'
    sed -i.bak "/^\\s*#.*encrypt/d" "$config_file"
    rm "$config_file.bak"
    printf "Updated 'encrypt' key in %s\n" "$config_file"
}

update_configs() {
    printf "==================== Updating Configs =======================\n"
    for config_file in "$CONFIGS_DIR"/*.hcl; do
        if [ -f "$config_file" ]; then
            update_encrypt_key "$config_file"
        fi
    done
    printf "configs updated\n"
}

change_permissions_in_directory() {
    local directory="$1"
    local permission="$2"
    printf "==================== Changing Permissions ===================\n"
    # Check if the directory exists
    if [ ! -d "$directory" ]; then
        echo "Error: Directory $directory does not exist."
        return 1
    fi
    # Change permissions for all files in the directory
    find "$directory" -type f -exec chmod "$permission" {} +
    echo "Changed permissions of all files in $directory to $permission."
}
create_certs() {
    printf "==================== Creating Certs =========================\n"
    local cert_dir="$GENERATED_DIR/consul-certs"
    if [ -d "$cert_dir" ]; then
        printf "Deleting existing %s\n" "$cert_dir"
        sudo rm -rf "$cert_dir"
    fi
    if [ ! -d "$cert_dir" ]; then
        printf "Creating directory %s\n" "$cert_dir"
        mkdir -p "$cert_dir" > /dev/null 2>&1
    fi
    # Change directory to cert_dir
    cd "$cert_dir" > /dev/null 2>&1 || exit
    # create the ca cert
    printf "Creating CA cert\n"
    consul tls ca create > /dev/null 2>&1
    # federated consul server datacenter
    # consul tls cert create -server -dc <dc_name> -additional-dnsname=<secondary_consul_server_name>
    # Single Consul Server datacenter
    # consul tls cert create -server -dc <dc_name>
    printf "Creating Consul Server cert\n"
    consul tls cert create -server -dc helix-dc-1 > /dev/null 2>&1
    # change file permissions
    change_permissions_in_directory "$cert_dir" 644
    # Back out to the previous directory
    cd - > /dev/null 2>&1 || exit
}
run() {
    printf "=============================================================\n"
    printf "=============================================================\n"
    printf "====================== Configuring Consul ===================\n"
    printf "=============================================================\n"
    printf "=============================================================\n"
    create_or_check_directory "$GENERATED_DIR"
    create_certs
    gen_encryption_key
    update_configs
    create_or_check_token_key_file
    chmod 777 $GENERATED_DIR
    printf "=============================================================\n"
    printf "=============================================================\n"
    printf "================= Completed Automated Tasks =================\n"
    printf "=============================================================\n"
    printf "=============================================================\n"
}
run
