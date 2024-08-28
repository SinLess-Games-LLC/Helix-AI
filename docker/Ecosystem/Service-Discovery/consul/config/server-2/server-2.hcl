node_name = "consul-server-2"

datacenter = "Helix-DC-1"

ports = {
  grpc = 8502
  grpc_tls = 8503
}

# Networking settings
addresses = {
  http = "0.0.0.0"
}
# client_addr = "0.0.0.0"
bind_addr = "0.0.0.0" # listen on all interfaces IPv4
# bind_addr = "[::]" # listen on all interfaces IPv6
# use this instead of placing the Ip address of the server in the config
advertise_addr = "{{ GetInterfaceIP `eth0` }}" # advertise address for client connections

# This is the consul data directory and is required for consul to run
data_dir = "/consul/data"

# service Mesh
connect = {
  enabled = true
}

acl = {
  enabled = true
  default_policy = "deny"
  enable_token_persistence = true
  tokens = {
    initial_management = "root"
    agent = "root"
  }
}

# This is the setting to enable the UI
# This is disabled by default
ui_config = {
  enabled = true,
}

auto_config ={
  server_addresses = [
    "consul-server-1",
    "consul-server-3"
  ]
  authorization = {
    enabled = false
    static = {
      oidc_discovery_url = "http://vault-server:8200/v1/identity/oidc"
      bound_issuer = "http://vault-server:8200/v1/identity/oidc"
      bound_audiences = ["helix-dc-1"]
      claim_mappings = {
        "/consul/hostname" = "node_name"
      }
      claim_assertions = [
        "value.node_name == \"${node}\""
      ]
    }
  }
}

retry_join = [
  "consul-server-1",
  "consul-server-3"
]

# By default this is set to false and will run as a client
# This is required to run as a server
server = true

# This is the number of servers that need to be available before a leader is elected.
# In this case, we need a majority of the servers to be available.
# If we had 5 servers, we would need 3 to be available.
bootstrap_expect = 3

# so that service files will be registered
enable_script_checks = true

# Encrypt
# This must be 32-bytes that are base64-encoded
encrypt = "2dnBVvoxDe6ZwEo2KtHs3E+aRMaNguoFO31kXvCRxvQ="
