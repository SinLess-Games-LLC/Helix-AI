path "auth/oidc/config" {
  capabilities = ["create", "update"]
}

auth "oidc" {
  config = {
    oidc_discovery_url = $AUTH0_ISSUER
    oidc_client_id     = $AUTH0_CLIENT_ID
    oidc_client_secret = $AUTH0_CLIENT_SECRET
    default_role       = "reader"
  }
}

path "auth/oidc/role/reader" {
  capabilities = ["create", "update"]
}

auth "oidc/role/reader" {
  role_type       = "jwt"
  bound_audiences = $AUTH0_CLIENT_ID
  user_claim      = "sub"
  policies        = "default"
}
