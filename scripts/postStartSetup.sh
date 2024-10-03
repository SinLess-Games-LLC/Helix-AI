reset_color="\033[0m"

# Define logging functions
log_info() {
    echo -e "\033[1;34m[INFO] | $reset_color $1\033[0m"  # Bold blue
}

log_warn() {
    echo -e "\033[1;33m[WARN] | $reset_color $1\033[0m"  # Bold yellow (used instead of orange as terminal doesn't support orange)
}

log_error() {
    echo -e "\033[1;31m[ERROR] | $reset_color $1\033[0m" # Bold red
}

# Copy .zshrc configuration
log_info "Copying .zshrc to home directory..."
cp ./.devcontainer/.zshrc ~/.zshrc > /dev/null
log_info "Copying .p10k.zsh to home directory..."
cp ./.devcontainer/.p10k.zsh ~/.p10k.zsh

# Convert .zshrc and .p10k.zsh to Unix format
log_info "Converting .zshrc and .p10k.zsh to Unix format..."
log_info `(sudo dos2unix ~/.zshrc)`
log_info `(sudo dos2unix ~/.p10k.zsh)`
log_info `(sudo dos2unix .envrc)`
log_info `(sudo dos2unix .env)`

# Source the .zshrc to apply changes
log_info "Sourcing .zshrc..."
if [ -f ~/.zshrc ]; then
    source ~/.zshrc
else
    log_warn ".zshrc not found, skipping..."
fi

# Check if .venv exists, if not create it
if [ ! -d ".venv" ]; then
    log_info "Creating virtual environment..."
    python3 -m venv .venv
    chown -R $USER:$USER .venv
    venv
else
    log_info "Virtual environment already exists. Skipping creation."
    venv
fi

# Install Python requirements
log_info "Installing Python requirements..."
if ! python3 -m pip install -r ./requirements.txt > /dev/null; then
    log_error "Failed to install Python requirements."
    exit 1
fi

# Install Ansible requirements
log_info "Installing Ansible requirements..."
if ! ansible-galaxy install --role-file ./requirements.yaml > /dev/null; then
    log_error "Failed to install Ansible requirements."
fi


# Install k9s
log_info "Installing k9s..."
if ! command -v k9s &> /dev/null; then
    log_warn "k9s not found, installing..."
    go install github.com/derailed/k9s@latest
else
    log_info "k9s already installed, skipping..."
fi

# Configure Git
log_info "Configuring Git..."
git config --global user.email "disdainful777@gmail.com"
git config --global user.name "Sinless777"

# Install packages using Homebrew
log_info "Checking Homebrew installation..."
if ! command -v brew &> /dev/null; then
    log_warn "Homebrew not found, installing..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    sudo chown -R vscode /home/linuxbrew/.linuxbrew/Homebrew
else
    log_info "Homebrew is already installed."
fi

log_info "Installing packages from Brewfile..."
if ! brew update > /dev/null && brew bundle install --file=./Brewfile; then
    log_error "Failed to install packages from Brewfile."
fi

# GPG configuration
log_info "Configuring GPG..."
if ! command -v gpg &> /dev/null; then
    log_warn "GPG not found, installing..."
    sudo apt-get update > /dev/null
    sudo apt-get install -y gnupg > /dev/null
fi

cp ./.devcontainer/gpg-pubkey /home/vscode/.gnupg/pub.gpg
sudo chmod 600 /home/vscode/.gnupg/pub.gpg

# Verify ownership of .venv and node_modules
if [ -d ".venv" ]; then
    sudo chown -R $USER:$USER .venv
fi

if [ -d "node_modules" ]; then
    sudo chown -R $USER:$USER node_modules
else
    log_warn "node_modules not found, installing..."
    npm install
fi

log_info "Post-start setup completed!"
