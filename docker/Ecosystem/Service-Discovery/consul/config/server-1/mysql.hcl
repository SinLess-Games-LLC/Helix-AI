service =  {
  name = "mysql"
  id = "mysql"
  address = "mysql"
  port = 3306
  tags = ["primary", "data", "mysql"]
  check = {
    id = "mysql-check"
    name = "check Mysql port"
    tcp = "mysql:3306"
    interval = "10s"
    service_id = "mysql"
  }
  token = "root"
}
