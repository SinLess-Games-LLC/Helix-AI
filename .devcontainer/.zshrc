# =======================================================
# ==                                                   ==
# ==                  Global Config                    ==
# ==                                                   ==
# =======================================================

# Set the Zsh theme
ZSH_THEME="powerlevel10k/powerlevel10k"

# Which plugins would you like to load?
plugins=(
  git
  git-extras
  history
  docker
  docker-compose
  sudo
  zsh-autosuggestions
  zsh-syntax-highlighting
  zsh-completions
  zsh-kubectl-prompt
  fast-syntax-highlighting
  zsh-history-substring-search
)

# Set personal aliases
DISABLE_AUTO_UPDATE=false
DISABLE_UPDATE_PROMPT=true

# =======================================================
# ==                                                   ==
# ==                      Exports                      ==
# ==                                                   ==
# =======================================================


# Path to your oh-my-zsh installation.
export ZSH="/home/$USER/.oh-my-zsh"

# Go config
export GOPATH="$HOME/go"
export PATH="$PATH:/usr/local/go/bin:$GOPATH/bin"

# Add Python to PATH
export PATH="/usr/local/opt/python/libexec/bin:$PATH"

# Add Node and NVM to PATH
export NVM_DIR="$HOME/.nvm"
# Homebrew path (update to your installation location)
export PATH="/home/linuxbrew/.linuxbrew/Homebrew/bin:$PATH"
export PATH="/home/linuxbrew/.linuxbrew/Homebrew/sbin:$PATH"

# Add Yarn to PATH
export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"

# Add pnpm to PATH
export PATH="$HOME/.pnpm-global/bin:$PATH"

# Add Poetry to PATH
export PATH="$HOME/.poetry/bin:$PATH"

# Add Homebrew to PATH
export PATH="/opt/homebrew/bin:$PATH"

# Add Kubernetes CLI (kubectl) to PATH
export PATH="$PATH:/usr/local/bin/kubectl"

# Add Helm to PATH
export PATH="$PATH:/usr/local/bin/helm"

# Export environment variables for AWS CLI
export AWS_REGION="us-east-1"  # Adjust the region as needed
export AWS_DEFAULT_OUTPUT="json"

# Export environment variable for Kubernetes CLI
export KUBECONFIG="./kubeconfig"
export K8S_AUTH_KUBECONFIG="./kubeconfig"

# Ansible environment variables
export ANSIBLE_VARS_ENABLED="host_group_vars"
export ANSIBLE_LOCALHOST_WARNING="False"
export ANSIBLE_INVENTORY_UNPARSED_WARNING="False"

# Terraform environment variables
export TF_DATA_DIR="./.terraform"
export TF_LOG_PATH="./.logs/terraform/terraform.log"

# K0s environment variables
export DISABLE_TELEMETRY="true"
export DISABLE_UPGRADE_CHECK="true"

# SOPS Age key
export SOPS_AGE_KEY_FILE="./.age.key"

# =======================================================
# ==                                                   ==
# ==                       Sources                     ==
# ==                                                   ==
# =======================================================

# Source Oh-My-Zsh
source $ZSH/oh-my-zsh.sh

# Enable direnv
eval "$(direnv hook zsh)"

# Source Powerlevel10k theme
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh

# Add SSH key to ssh-agent
eval "$(ssh-agent -s)"

# load .env
source .env

# Set Homebrew environment variables
eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"

# =======================================================
# ==                                                   ==
# ==                      Aliases                      ==
# ==                                                   ==
# =======================================================

# Kubernetes aliases
alias k='kubectl'
alias kns='kubectl config set-context --current --namespace'
alias klogs='kubectl logs -f'
alias kpods='kubectl get pods'
alias ksvc='kubectl get svc'
alias kapply='kubectl apply -f'
alias kdel='kubectl delete -f'
alias kctx='kubectl config use-context'  # Switch context

# Helm aliases
alias h='helm'
alias hls='helm list'
alias hdel='helm delete'

# Docker aliases
alias d='docker'
alias dc='docker-compose'

# Terraform aliases
alias tf='terraform'
alias tfa='terraform apply'
alias tfd='terraform destroy'
alias tfp='terraform plan'

# Ansible aliases
alias ans='ansible'
alias anspl='ansible-playbook'

# Python virtual environment alias
alias venv='source ./.venv/bin/activate'

# Git shortcuts
alias gs='git status'
alias gp='git pull'
alias gco='git checkout'
alias gd='git diff'
alias gl='git log'
alias ga='git add .'
alias gc='git commit -m'
alias gpush='git push'

# Networking and Speedtest
alias pingg='gping'
alias speedtest='speedtest-cli'

# Directory Navigation
alias ll='colorls -la'  # Use exa as a replacement for ls
alias ..='cd ..'

# =======================================================
# ==                                                   ==
# ==                  Custom Functions                 ==
# ==                                                   ==
# =======================================================

# Check if Homebrew is installed, and install if necessary
check_and_install_homebrew() {
    if ! command -v brew &> /dev/null; then
        echo "Homebrew not found. Installing..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    else
        echo "Homebrew is already installed."
    fi
}

# View Vitess tablet logs
vitess_logs() {
    kubectl logs -f -l app=vitess
}

# View Istio logs for a specific pod
istio_pod_logs() {
    pod_name=$(kubectl get pods -l istio="$1" -o jsonpath='{.items[0].metadata.name}')
    kubectl logs -f "$pod_name"
}

# Countdown timer
countdown() {
    secs=$1
    while [ $secs -gt 0 ]; do
        echo -ne "Sleeping for $secs seconds...\033[0K\r"
        sleep 1
        : $((secs--))
    done
    echo "Sleeping for 0 seconds... Done."
}

# Check if Kubernetes nodes are ready
check_if_nodes_are_ready() {
    kubectl get nodes | grep -v "Ready"
}

# Get Kubernetes nodes
get_nodes() {
    kubectl get nodes
}

# Direnv auto-allow
direnv allow


# =======================================================
# ==                                                   ==
# ==                  Conditional Logic                ==
# ==                                                   ==
# =======================================================

# Add SSH key
if [ -f ~/.ssh/id_rsa ]; then
    ssh-add ~/.ssh/id_rsa
elif [ -f ~/.ssh/id_ed25519 ]; then
    ssh-add ~/.ssh/id_ed25519
fi

# activate virtual environment if it exists
if [ -d ".venv" ]; then
    venv
fi

# Check if Homebrew is installed
check_and_install_homebrew
