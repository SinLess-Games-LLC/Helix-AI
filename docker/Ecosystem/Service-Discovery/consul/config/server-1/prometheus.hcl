service = {
    name = "prometheus"
    id = "prometheus"
    address = "prometheus"
    port = 9090
    tags = ["monitoring", "prometheus"]
    check = {
        id = "prometheus"
        name = "check Prometheus port"
        tcp = "prometheus:9090"
        interval = "10s"
        service_id = "prometheus"
    }
}
