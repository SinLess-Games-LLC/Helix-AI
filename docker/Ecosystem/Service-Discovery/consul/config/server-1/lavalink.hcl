service =  {
  name = "lavalink"
  id = "lavalink"
  address = "lavalink"
  port = 2333
  tags = ["Audio", "Music"]
  check = {
    id = "lavalink-check"
    name = "check Lavalink port"
    tcp = "lavalink:2333"
    interval = "10s"
    service_id = "lavalink"
  }
  token = "root"
}
