############################################################################################################
# Build stage
############################################################################################################

# Use a lightweight Python image
FROM python:3.13.0rc1-bullseye AS builder

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget consul curl git make sudo openssl zip m4 autoconf automake jq bash dnsutils dos2unix && \
    rm -rf /var/lib/apt/lists/*

# Upgrade pip and install Python packages
RUN pip install --upgrade pip yq shyaml

# Set the working directory
WORKDIR /app

# Copy source code and scripts
COPY ./scripts/consul /app/consul
COPY ./scripts/security /app/security
COPY ./scripts/vault /app/vault
COPY ./config.yaml /app/config.yaml

# Ensure scripts are executable and use Unix line endings
RUN chmod 755 /app/consul/*.sh /app/security/*.sh /app/vault/*.sh && \
    dos2unix /app/consul/*.sh /app/security/*.sh /app/vault/*.sh

############################################################################################################
# Runtime stage
############################################################################################################

FROM python:3.13.0rc1-bullseye

# Copy the built files from the builder stage
COPY --from=builder /app /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget consul curl git make sudo openssl zip m4 autoconf automake jq bash dnsutils dos2unix && \
    rm -rf /var/lib/apt/lists/*

# Create a non-root user with sudo privileges
RUN adduser --uid 1000 --disabled-password --gecos "" docker && \
    adduser docker sudo && \
    echo '%sudo ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers

# Set up the working directory and adjust permissions
WORKDIR /app/data
RUN chown -R docker:docker /app

# Set environment variables
ENV LC_ALL=C.UTF-8 LANG=C.UTF-8 HOME=/app USER=docker PATH=/app/.local/bin:$PATH

# Avoid first use of sudo warning
RUN touch $HOME/.sudo_as_admin_successful

USER docker

# Set the default command
CMD ["/bin/bash"]
