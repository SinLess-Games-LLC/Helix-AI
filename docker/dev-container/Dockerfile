FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:22-bullseye@sha256:f33facce7c14957a952778eff9cfde2eaff29770bf549645e9655f4e8cdb1f07

# Set DEBIAN_FRONTEND to noninteractive for non-interactive installations
ENV DEBIAN_FRONTEND=noninteractive

# Define a variable for apt packages
ENV APT_PACKAGES="zsh wget git curl net-tools dos2unix iputils-ping git-flow"

# Install additional packages and set up for vscode user
RUN sudo apt-get update && \
    sudo apt-get install -y --no-install-recommends $APT_PACKAGES && \
    # Install Nx CLI globally
    npm install -g nx && \
    # Clean up APT cache
    sudo apt-get clean && \
    sudo rm -rf /var/lib/apt/lists/*

# Install Oh My Zsh
RUN wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | zsh || true

# Copy the .zshrc file into the container's home directory
COPY ./.zshrc /home/node/.zshrc

# Ensure the .zshrc file has Unix line endings
RUN sudo dos2unix /home/node/.zshrc

# Fix permissions for .zshrc
RUN sudo chown node:node /home/node/.zshrc && \
    sudo chmod 644 /home/node/.zshrc

# Set the default shell to zsh
SHELL ["/bin/zsh", "-c"]

# Grant passwordless sudo to the node user
RUN echo "node ALL=(ALL) NOPASSWD:ALL" | sudo tee /etc/sudoers.d/node && \
    sudo chmod 0440 /etc/sudoers.d/node

# Copy the entire project into the container's workspace directory
COPY ../../ /workspace

# Install nx and pnpm globally
RUN npm install -g nx pnpm

