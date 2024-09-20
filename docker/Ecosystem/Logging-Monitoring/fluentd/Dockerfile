# Use the official Fluentd base image
FROM fluent/fluentd:v1.15.3-1.2

# Use root account to install necessary packages and Fluentd plugins
USER root

# Install necessary packages and Fluentd plugins
RUN apk add --no-cache --update build-base ruby-dev && \
    gem install fluent-plugin-elasticsearch fluent-plugin-prometheus fluent-plugin-rewrite-tag-filter \
                'faraday-net_http:3.0.2' 'faraday:2.8.1' && \
    apk del build-base ruby-dev && \
    rm -rf /var/cache/apk/* /home/fluent/.gem/ruby/2.6.0/cache/*.gem

# Copy the Fluentd configuration file
COPY fluent.conf /fluentd/etc/fluent.conf

# Set the correct permissions
RUN chmod 644 /fluentd/etc/fluent.conf

# Expose the necessary ports
EXPOSE 24224 24224/udp

# Switch back to the fluent user for security reasons
USER fluent

# Start Fluentd
CMD ["fluentd", "-c", "/fluentd/etc/fluent.conf", "-p", "/fluentd/plugins"]
