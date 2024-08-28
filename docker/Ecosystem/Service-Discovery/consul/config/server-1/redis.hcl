service =  {
  name = "redis"
  id = "redis"
  address = "redis"
  port = 6379
  tags = ["primary", "cache", "data"]
  check = {
    id = "redis-check"
    name = "check Redis port"
    tcp = "redis:6379"
    interval = "10s"
    service_id = "redis"
  }
  token = "root"
}
