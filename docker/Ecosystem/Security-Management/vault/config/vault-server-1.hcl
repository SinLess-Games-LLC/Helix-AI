service_registration "consul" {
  address = "consul-server-1:8500"
  service = "vault"
  service_address = "vault-server"
  token = "root"


  tls_ca_file = "/vault/certs/consul-agent-ca.pem"
  tls_cert_file = "/vault/certs/helix-dc-1-server-consul-0.pem"
  tls_key_file = "/vault/certs/helix-dc-1-server-consul-0-key.pem"
}

consul = {
  service_tags = "security, encryption"
}
