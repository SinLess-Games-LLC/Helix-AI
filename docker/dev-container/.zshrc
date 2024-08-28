# Path to your oh-my-zsh installation.
export ZSH=/home/node/.oh-my-zsh

# Set the Zsh theme
ZSH_THEME="strug"

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
  fast-syntax-highlighting
  zsh-history-substring-search
)

# Set personal aliases
DISABLE_AUTO_UPDATE=false
DISABLE_UPDATE_PROMPT=true

# Custom functions
countdown() {
    secs=$1
    while [ $secs -gt 0 ]; do
        echo -ne "Sleeping for $secs seconds...\033[0K\r"
        sleep 1
        : $((secs--))
    done
    echo "Sleeping for 0 seconds... Done."
}

# Source Oh-My-Zsh
source /home/node/.oh-my-zsh/oh-my-zsh.sh

# Add Poetry to the PATH
export PATH="$PATH:~/.local/bin"
