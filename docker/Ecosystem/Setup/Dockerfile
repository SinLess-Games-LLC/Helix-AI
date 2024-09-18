############################################################################################################
# Base stage (common dependencies)
############################################################################################################

# Use a lightweight Python image
FROM python:3.13.0rc1-bullseye AS base

# Install build dependencies and upgrade pip
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget consul curl git make sudo openssl zip m4 autoconf automake jq bash dnsutils dos2unix && \
    rm -rf /var/lib/apt/lists/* && \
    pip install --upgrade pip yq shyaml && \
    apt-get update && apt-get install -y --no-install-recommends openjdk-11-jre-headless && \
    apt-get clean

############################################################################################################
# Build stage
############################################################################################################

FROM base AS builder

# Set the working directory
WORKDIR /app

# Copy source code and scripts
COPY ./scripts/kafka /app/kafka
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

FROM base AS runtime

# Copy the built files from the builder stage
COPY --from=builder /app /app

# Create a non-root user with sudo privileges
RUN adduser --uid 1000 --disabled-password --gecos "" docker && \
    adduser docker sudo && \
    echo '%sudo ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers && \
    touch /app/.sudo_as_admin_successful && \
    chown -R docker:docker /app

# Set environment variables
ENV LC_ALL=C.UTF-8 LANG=C.UTF-8 HOME=/app USER=docker PATH=/app/.local/bin:$PATH

USER docker

# Set the default command
CMD ["/bin/bash"]
