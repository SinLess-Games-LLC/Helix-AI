service_registration "consul" {
  address = "consul-server-1:8500"
  service = "vault"
  service_address = "vault-server"
  token = "root"


    ca_file = "/vault/config/certs/data/certificate_authority/certificate_authorities.crt"
    cert_file = "/vault/config/certs/data/certificates/consul/consul.crt"
    key_file = "/vault/config/certs/data/certificates/consul/consul.key"
}

consul = {
  service_tags = "security, encryption"
}

storage "mysql" {
  address = "vault-mysql:3311"
  database = "vault"
  username = "vault"
  password = "vault"
  table = "helix_vault"
}

listener "tcp" {
  address       = "0.0.0.0:8200"
  tls_disable   = 0
  tls_cert_file = "/vault/config/certs/data/certificates/vault/vault.pem"
  tls_key_file  = "/vault/config/certs/data/certificates/vault/vault.key"
}

# Set log driver to fluentd
log_drivers = ["fluentd", "syslog"]

# Use syslog for Fluentd
log_level = "info"
log_format = "json"

# audit configuration
audit_device {
  type = "file"
  path = "/var/log/vault/server.log"
}

# Server log configuration
log_file = "/var/log/vault/server.log"

telemetry {
  prometheus_retention_time = "24h" # Duration to retain metrics
  disable_hostname = true
}

# Auth0 (OIDC) Configuration (additional configuration file required)
include_config_file = "/vault/config/oidc-auth.hcl"
