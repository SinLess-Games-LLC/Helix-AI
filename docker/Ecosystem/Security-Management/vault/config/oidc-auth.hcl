# Configure OIDC Authentication with environment variables
path "auth/oidc/config" {
  capabilities = ["create", "update"]
}

auth "oidc" {
  config = {
    oidc_discovery_url = "${env("AUTH0_ISSUER")}"
    oidc_client_id     = "${env("AUTH0_CLIENT_ID")}"
    oidc_client_secret = "${env("AUTH0_CLIENT_SECRET")}"
    default_role       = "reader"
  }
}

# Define the 'reader' role for OIDC
path "auth/oidc/role/reader" {
  capabilities = ["create", "update"]
}

auth "oidc/role/reader" {
  role_type       = "jwt"
  bound_audiences = "${env("AUTH0_CLIENT_ID")}"
  user_claim      = "sub"
  policies        = "default"
}

