# =======================================================
# ==                                                   ==
# ==                  Global Config                    ==
# ==                                                   ==
# =======================================================


# =======================================================
# ==                                                   ==
# ==                      Exports                      ==
# ==                                                   ==
# =======================================================

# Path to your oh-my-zsh installation.
export ZSH=/home/node/.oh-my-zsh

# Go config
export GOPATH="$HOME/go"
export PATH="$PATH:/usr/local/go/bin:$GOPATH/bin"

# Add Python to path
export PATH="/usr/local/opt/python/libexec/bin:$PATH"

# Add Yarn to path
export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"

# Add pnpm to path
export PATH="$HOME/.pnpm-global/bin:$PATH"

# Add Poetry to path
export PATH="$HOME/.poetry/bin:$PATH"

export PATH="$HOME/.local/bin:$PATH"


# =======================================================
# ==                                                   ==
# ==                  Oh-My-Zsh Config                 ==
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
# ==                       Sources                     ==
# ==                                                   ==
# =======================================================

# Source Oh-My-Zsh
source /home/node/.oh-my-zsh/oh-my-zsh.sh

# Enable direnv
eval "$(direnv hook zsh)"

# =======================================================
# ==                                                   ==
# ==                      Aliases                      ==
# ==                                                   ==
# =======================================================

# kubectl aliases
alias k='kubectl'
alias kns='kubectl config set-context --current --namespace'
alias klogs='kubectl logs -f'
alias kpods='kubectl get pods'
alias ksvc='kubectl get svc'
alias kapply='kubectl apply -f'
alias kdel='kubectl delete -f'

# Helm aliases
alias h='helm'
alias hls='helm list'
alias hdel='helm delete'

# Istio aliases
alias istioctl="istioctl"
alias istio-status="istioctl proxy-status"
alias istio-logs="kubectl logs -l istio-pilot"

# Get information about Istio configuration
alias istio-config="istioctl proxy-config"
alias istio-metrics="kubectl get --raw '/apis/metrics.k8s.io/v1beta1/namespaces/istio-system/pods' | jq ."

# =======================================================
# ==                                                   ==
# ==                  Custom Functions                 ==
# ==                                                   ==
# =======================================================

# View Vitess tablet logs
vitess_logs() {
    kubectl logs -f -l app=vitess
}

# View Istio logs for a specific pod
istio_pod_logs() {
    kubectl logs -f $(kubectl get pods -l istio=$1 -o jsonpath='{.items[0].metadata.name}')
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

check_if_nodes_are_ready() {
    kubectl get nodes | grep -v "Ready"
}

get_nodes() {
    kubectl get nodes
}


# =======================================================
# ==                                                   ==
# ==                  Custom Aliases                   ==
# ==                                                   ==
# =======================================================

# Alias for ls
if [ -x "$(command -v colorls)" ]; then
    alias ls="colorls"
    alias la="colorls -al"
fi

# Alias for ls
if [ -x "$(command -v exa)" ]; then
    alias ls="exa"
    alias la="exa --long --all --group"
fi
