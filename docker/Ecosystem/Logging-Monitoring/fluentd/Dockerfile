# Use the official Fluentd base image
FROM fluent/fluentd:v1.15.3-1.2@sha256:3b7d8d4b4064cbed7e7f90e63c1b769fe90a34a975508d79991c54a6b8ea22d4

# Use root account to use apk
USER root

# Install any necessary packages
RUN apk add --no-cache --update \
  sudo build-base ruby-dev && \
  sudo gem install faraday-net_http -v 3.0.2 && \
  sudo gem install faraday -v 2.8.1

# Install any Fluentd plugins you need
RUN gem install \
  fluent-plugin-elasticsearch \
  fluent-plugin-prometheus \
  fluent-plugin-rewrite-tag-filter

# Clear the gem cache
RUN sudo gem sources --clear-all && \
  apk del build-base ruby-dev

# Copy the Fluentd configuration file
COPY fluent.conf /fluentd/etc/fluent.conf

# Set the correct permissions
RUN chmod 644 /fluentd/etc/fluent.conf

# Ensure Fluentd's log file is outputted to Docker logs
ENV FLUENTD_OPT=""

# Set the user to fluent
USER fluent

# Expose the necessary ports
EXPOSE 24224 24224/udp

# Start Fluentd
CMD ["fluentd", "-c", "/fluentd/etc/fluent.conf", "-p", "/fluentd/plugins"]
