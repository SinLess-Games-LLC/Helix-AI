service_registration "consul" {
  address = "consul-server-1:8500"
  service = "vault"
  service_address = "vault-server"
  token = "root"

  ca_file = "${VAULT_CONSUL_CA_FILE}"
  cert_file = "${VAULT_CONSUL_CERT_FILE}"
  key_file = "${VAULT_CONSUL_KEY_FILE}"
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
  plaintext_connection_allowed = true
}


listener "tcp" {
  address       = "0.0.0.0:8200"
  tls_disable   = 0
  tls_cert_file = "${VAULT_TLS_CERT_FILE}"
  tls_key_file  = "${VAULT_TLS_KEY_FILE}"
}

# Log configuration
log_level = "info"
log_format = "json"

# Send logs to syslog, which Fluentd will capture
syslog_facility = "local0"
syslog_address = "fluentd:514"

# Audit configuration
audit_device {
  type = "file"
  path = "/var/log/vault/server.log"
}

telemetry {
  prometheus_retention_time = "24h"
  disable_hostname = true
}

# Auth0 (OIDC) Configuration (additional configuration file required)
include_config_file = "./oidc-auth.hcl"
