service = {
  name = "discord-bot"
  id = "discord-bot"
  address = "127.0.0.1"
  port = 8001
  tags = ["discord-bot", "service"]

  checks = [
    # Basic TCP Check to ensure the Discord bot is listening on port 8001
    {
      id         = "discord-bot-tcp-check"
      name       = "Check Discord bot TCP port"
      tcp        = "127.0.0.1:8001"
      interval   = "10s"
      timeout    = "5s"
      service_id = "discord-bot"
    },

    # HTTP health check for Discord bot health endpoint
    {
      id         = "discord-bot-http-health-check"
      name       = "Check Discord bot health"
      http       = "http://localhost:8001/health"
      interval   = "10s"
      timeout    = "5s"
      tls_skip_verify = true
      service_id = "discord-bot"
    },

    # HTTP API check to ensure Discord bot API is working
    {
      id         = "discord-bot-api-check"
      name       = "Check Discord bot API status"
      http       = "http://localhost:8001/api/status"
      interval   = "30s"
      timeout    = "5s"
      tls_skip_verify = true
      service_id = "discord-bot"
    }
  ]

  token = "root"
}
