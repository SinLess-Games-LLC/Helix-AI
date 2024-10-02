FROM mcr.microsoft.com/devcontainers/python:3.12-bookworm

# Set ARGs for directories
ARG OH_MY_ZSH_CUSTOM_PLUGINS_DIR="/home/vscode/.oh-my-zsh/custom/plugins"

# Enable passwordless sudo for vscode user
RUN echo "vscode ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/vscode

# Install necessary apt packages
RUN sudo apt-get update -y --fix-missing \
    && sudo apt-get install -y --no-install-recommends \
      genisoimage qemu-utils qemu-system ovmf cloud-image-utils make curtain git curl \
      zsh tzdata iputils-ping git-flow direnv dos2unix ruby-full fonts-powerline \
    && sudo rm -rf /var/lib/apt/lists/*

# Install Oh-My-Zsh
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" || true

# Correct plugin directory paths
RUN git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-/home/vscode/.oh-my-zsh/custom}/plugins/zsh-autosuggestions \
    && git clone https://github.com/zsh-users/zsh-syntax-highlighting ${ZSH_CUSTOM:-/home/vscode/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting \
    && git clone https://github.com/zsh-users/zsh-completions ${ZSH_CUSTOM:-/home/vscode/.oh-my-zsh/custom}/plugins/zsh-completions \
    && git clone https://github.com/fabiogibson/envrc-zsh-plugin.git ${ZSH_CUSTOM:-/home/vscode/.oh-my-zsh/custom}/plugins/envrc \
    && git clone https://github.com/superbrothers/zsh-kubectl-prompt.git ${ZSH_CUSTOM:-/home/vscode/.oh-my-zsh/custom}/plugins/zsh-kubectl-prompt \
    && git clone https://github.com/zdharma-continuum/fast-syntax-highlighting.git ${ZSH_CUSTOM:-/home/vscode/.oh-my-zsh/custom}/plugins/fast-syntax-highlighting \
    && git clone https://github.com/zsh-users/zsh-history-substring-search ${ZSH_CUSTOM:-/home/vscode/.oh-my-zsh/custom}/plugins/zsh-history-substring-search \
    && git clone https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-/home/vscode/.oh-my-zsh/custom}/themes/powerlevel10k

#
RUN sudo gem install colorls

# Copy SSH keys
COPY .ssh /home/vscode/.ssh
RUN chmod 700 /home/vscode/.ssh && chmod 600 /home/vscode/.ssh/*

# Set up authorized keys
RUN curl -sL 'https://github.com/SinLess-Games.keys' >> /home/vscode/.ssh/authorized_keys

# Copy .zshrc configuration
COPY .zshrc /home/vscode/.zshrc

RUN dos2unix /home/vscode/.zshrc

# Copy GPG key
COPY gpg-pubkey /home/vscode/.gnupg/pub.gpg
RUN chmod 600 /home/vscode/.gnupg/pub.gpg

# Set SSH key permissions
RUN sudo chmod 600 /home/vscode/.ssh/id_ed25519

# Import GPG key
RUN gpg --import /home/vscode/.gnupg/pub.gpg

# Change ownership of the home directory to vscode user
RUN chown -R vscode:vscode /home/vscode

# Switch to non-root user
USER vscode
WORKDIR /home/vscode

# Source .zshrc in the post attach command to apply changes
CMD ["zsh"]
