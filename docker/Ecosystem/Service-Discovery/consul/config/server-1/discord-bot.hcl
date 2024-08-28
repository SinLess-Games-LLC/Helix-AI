service =  {
  name = "discord-bot"
  id = "discord-bot"
  address = "127.0.0.1"
  port = 8001
  tags = ["discord-bot", "service"]
  checks = [
    {
      id         = "chk1"
      name       = "check discord-bot health"
      http      = "http://localhost:8001/health"
      interval   = "10s"
      tls_skip_verify = true
      service_id = "discord-bot"
    }
  ]
  token = "root"
}
