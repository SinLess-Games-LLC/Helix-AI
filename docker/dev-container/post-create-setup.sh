#!/bin/bash

# Define color codes
GREEN="\e[32m"
BOLD_RED="\e[1;31m"
BLUE="\e[34m"
ORANGE="\e[33m"
RESET="\e[0m"

# Function to print messages in green
print_success() {
    echo -e "${GREEN}✅ Success: $1 🎉${RESET}"
}

# Function to print warning messages in orange
print_warning() {
    echo -e "${ORANGE}⚠️ Warning: $1 ⚠️${RESET}"
}

# Function to print error messages in bold red and exit with a specific code
print_error() {
    echo -e "${BOLD_RED}❌ Error: $1 ${RESET}💥"
    exit $2
}

# Function to print information messages in blue
print_info() {
    echo -e "${BLUE}🔵 Info: $1 ${RESET}"
}

# Function to change ownership and permissions
change_permissions() {
    local target=$1
    local perms=$2
    if sudo chown -R $(whoami):$(whoami) "$target" && sudo chmod -R "$perms" "$target"; then
        print_success "Changed permissions for $target."
    else
        print_error "Failed to change permissions for $target." 2
    fi
}

# Function to clone a GitHub repository if the directory doesn't exist
clone_repo_if_needed() {
    local repo_url=$1
    local target_dir=$2
    if [ -d "$target_dir" ]; then
        print_info "$(basename $target_dir) already exists. Skipping clone."
    else
        print_info "Cloning $(basename $target_dir) from $repo_url..."
        if git clone "$repo_url" "$target_dir"; then
            print_success "Successfully cloned $(basename $target_dir)."
        else
            print_error "Failed to clone $(basename $target_dir) from $repo_url." 3
        fi
    fi
}

# Set Zsh custom directory
ZSH_CUSTOM=/home/node/.oh-my-zsh/custom

# Change ownership of Zsh custom plugins directory
change_permissions "$ZSH_CUSTOM" "755"

# Clone Zsh plugins
clone_repo_if_needed "https://github.com/zsh-users/zsh-autosuggestions" "$ZSH_CUSTOM/plugins/zsh-autosuggestions"
clone_repo_if_needed "https://github.com/zsh-users/zsh-syntax-highlighting" "$ZSH_CUSTOM/plugins/zsh-syntax-highlighting"
clone_repo_if_needed "https://github.com/zsh-users/zsh-completions" "$ZSH_CUSTOM/plugins/zsh-completions"
clone_repo_if_needed "https://github.com/zdharma-continuum/fast-syntax-highlighting" "$ZSH_CUSTOM/plugins/fast-syntax-highlighting"
clone_repo_if_needed "https://github.com/zsh-users/zsh-history-substring-search" "$ZSH_CUSTOM/plugins/zsh-history-substring-search"

# Change permissions for .zshrc
change_permissions "/home/node/.zshrc" "755"

# Convert .zshrc to Unix format
print_info "Converting .zshrc to Unix format..."
if sudo dos2unix /home/node/.zshrc; then
    print_success ".zshrc converted to Unix format."
else
    print_error "Failed to convert .zshrc to Unix format." 4
fi

# Make Zsh the default shell for the node user
print_info "Setting Zsh as the default shell for the node user..."
if sudo chsh -s $(which zsh) node; then
    print_success "Zsh set as the default shell for the node user."
else
    print_error "Failed to set Zsh as the default shell for the node user." 5
fi

# Update apt-get
print_info "Updating apt-get..."
if sudo apt-get update; then
    print_success "apt-get updated."
else
    print_error "Failed to update apt-get." 6
fi

# Install direnv
print_info "Installing direnv..."
if sudo apt-get install direnv -y; then
    print_success "direnv installed."
else
    print_error "Failed to install direnv." 7
fi

# Allow direnv
print_info "Allowing direnv..."
if direnv allow; then
    print_success "direnv allowed."
else
    print_warning "Failed to allow direnv."
    print_info "Creating a blank .envrc file"
    if touch .envrc; then
        print_success ".envrc file created."
    else
        print_error "Failed to create .envrc file." 8
    fi
fi

npm install

# Change permissions for node_modules
change_permissions "node_modules" "755"

# Check if running inside Zsh, skip sourcing if true
if [ -n "$ZSH_VERSION" ]; then
    print_success "Zsh is already the default shell. Skipping sourcing .zshrc."
else
    print_info "Sourcing .zshrc..."
    if source /home/node/.zshrc; then
        print_success ".zshrc sourced successfully."
    else
        print_error "Failed to source .zshrc." 14
    fi
fi
