# CNCF Ecosystem Overview for Helix

The Helix ecosystem leverages a range of Cloud Native Computing Foundation (CNCF) projects and related tools to create a resilient, scalable, and secure platform. This document provides a detailed explanation of each component used in the Helix ecosystem, including its purpose and integration within the system.

## Databases

### MySQL

- **Purpose**: MySQL is a widely-used relational database management system.
- **Usage in Helix**: In Helix, MySQL is used for structured data storage, especially for applications requiring ACID compliance and transactional support.
- **Learn More**: [MySQL](https://www.mysql.com/)

### PostgreSQL

- **Purpose**: PostgreSQL is an advanced, open-source relational database that supports both SQL and JSON querying.
- **Usage in Helix**: Helix uses PostgreSQL for its robust features, including complex queries, indexing, and extensibility.
- **Learn More**: [PostgreSQL](https://www.postgresql.org/)

### Redis

- **Purpose**: Redis is an in-memory data structure store, often used as a database, cache, and message broker.
- **Usage in Helix**: Redis is utilized in Helix for caching data to accelerate application performance and reduce database load.
- **Learn More**: [Redis](https://redis.io/)

### MongoDB

- **Purpose**: MongoDB is a NoSQL database known for its flexible document model.
- **Usage in Helix**: Helix employs MongoDB for storing unstructured data and for applications that require schema-less design.
- **Learn More**: [MongoDB](https://www.mongodb.com/)

## Message Queue

### Kafka

- **Purpose**: Kafka is a distributed event streaming platform capable of handling real-time data feeds.
- **Usage in Helix**: Kafka is the backbone for message queuing and event streaming, ensuring data is transferred reliably between services.
- **Learn More**: [Kafka](https://kafka.apache.org/)

### Zookeeper

- **Purpose**: Zookeeper is a centralized service for maintaining configuration information, naming, providing distributed synchronization, and providing group services.
- **Usage in Helix**: Zookeeper works alongside Kafka to manage and coordinate distributed systems in Helix.
- **Learn More**: [Zookeeper](https://zookeeper.apache.org/)

## Application Definition & Image Build

### Docker

- **Purpose**: Docker is a platform for developing, shipping, and running applications inside containers.
- **Usage in Helix**: Docker is used to package applications and their dependencies into containers, ensuring consistency across different environments.
- **Learn More**: [Docker](https://www.docker.com/)

### Helm

- **Purpose**: Helm is a package manager for Kubernetes, enabling the management of Kubernetes applications.
- **Usage in Helix**: Helm is used to define, install, and upgrade even the most complex Kubernetes applications.
- **Learn More**: [Helm](https://helm.sh/)

## Scheduling & Orchestration

### Kubernetes

- **Purpose**: Kubernetes is an open-source system for automating the deployment, scaling, and management of containerized applications.
- **Usage in Helix**: Kubernetes orchestrates containerized applications in Helix, ensuring they run efficiently and can scale as needed.
- **Learn More**: [Kubernetes](https://kubernetes.io/)

### K3s

- **Purpose**: K3s is a lightweight Kubernetes distribution designed for production workloads in resource-constrained environments.
- **Usage in Helix**: K3s is used in Helix for edge computing and scenarios where a full Kubernetes installation is unnecessary.
- **Learn More**: [K3s](https://k3s.io/)

## Coordination & Service Discovery

### etcd

- **Purpose**: etcd is a distributed key-value store that provides a reliable way to store data across a cluster of machines.
- **Usage in Helix**: etcd is used as a backend for Kubernetes to store all cluster state and configuration data.
- **Learn More**: [etcd](https://etcd.io/)

### CoreDNS

- **Purpose**: CoreDNS is a flexible, extensible DNS server that can serve as the DNS server for Kubernetes clusters.
- **Usage in Helix**: CoreDNS handles service discovery within the Kubernetes cluster, ensuring that services can find each other.
- **Learn More**: [CoreDNS](https://coredns.io/)

### Consul

- **Purpose**: Consul provides service discovery, configuration, and segmentation functionality.
- **Usage in Helix**: Consul is used for service discovery, allowing services to locate each other and communicate securely.
- **Learn More**: [Consul](https://www.consul.io/)

## Remote Procedure Call

### gRPC

- **Purpose**: gRPC is a high-performance, open-source universal RPC framework.
- **Usage in Helix**: gRPC is utilized for efficient communication between microservices in the Helix ecosystem.
- **Learn More**: [gRPC](https://grpc.io/)

### tRPC

- **Purpose**: tRPC allows you to build fully typesafe APIs without schemas or code generation.
- **Usage in Helix**: tRPC is used for type-safe API development, ensuring robust and maintainable service interactions.
- **Learn More**: [tRPC](https://trpc.io/)

## Service Proxy

### MetalLB

- **Purpose**: MetalLB is a load-balancer implementation for bare metal Kubernetes clusters.
- **Usage in Helix**: MetalLB provides load balancing for Kubernetes clusters running on bare metal within the Helix ecosystem.
- **Learn More**: [MetalLB](https://metallb.universe.tf/)

## API Gateway

### NginxIngress

- **Purpose**: NginxIngress is an ingress controller that uses NGINX to manage and route external traffic to Kubernetes services.
- **Usage in Helix**: NginxIngress is used to manage incoming traffic, directing it to the appropriate services within the Kubernetes cluster.
- **Learn More**: [NginxIngress](https://kubernetes.github.io/ingress-nginx/)

### CloudFlared

- **Purpose**: CloudFlared is a secure method to connect your web applications, APIs, and the like to Cloudflare’s network.
- **Usage in Helix**: CloudFlared is used to secure and accelerate traffic between end-users and the Helix ecosystem’s services.
- **Learn More**: [CloudFlared](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/)

### KrakenD

- **Purpose**: KrakenD is a high-performance open-source API Gateway.
- **Usage in Helix**: KrakenD is used to manage and route API requests efficiently across the ecosystem.
- **Learn More**: [KrakenD](https://www.krakend.io/)

## Service Mesh

### Consul

- **Purpose**: Consul’s service mesh feature enables secure service-to-service communication within the Helix ecosystem.
- **Usage in Helix**: Consul is utilized for service segmentation and managing service-to-service communication with strong identity-based security.
- **Learn More**: [Consul Service Mesh](https://www.consul.io/docs/connect)

## CloudNative Network

### Cilium

- **Purpose**: Cilium provides networking, security, and observability for cloud-native environments using BPF and eBPF.
- **Usage in Helix**: Cilium is used for advanced networking and security within the Kubernetes clusters.
- **Learn More**: [Cilium](https://cilium.io/)

## Container Runtime

### containerd

- **Purpose**: containerd is a container runtime with an emphasis on simplicity, robustness, and portability.
- **Usage in Helix**: containerd is the core container runtime used by Kubernetes to run containers.
- **Learn More**: [containerd](https://containerd.io/)

### Docker

- **Purpose**: Docker is a platform that uses OS-level virtualization to deliver software in packages called containers.
- **Usage in Helix**: Docker is used for containerization of applications, ensuring consistency across different environments.
- **Learn More**: [Docker](https://www.docker.com/)

## Cloud Native Storage

### OpenEBS

- **Purpose**: OpenEBS provides cloud-native persistent storage for Kubernetes.
- **Usage in Helix**: OpenEBS is used for managing persistent storage in Kubernetes, ensuring data availability and resilience.
- **Learn More**: [OpenEBS](https://openebs.io/)

## Security & Compliance

### CertManager

- **Purpose**: CertManager automates the management and issuance of TLS certificates.
- **Usage in Helix**: CertManager is used to automatically generate and renew SSL certificates, ensuring secure communication between services.
- **Learn More**: [CertManager](https://cert-manager.io/)

### SOPS

- **Purpose**: SOPS (Secrets OPerationS) is a tool to manage secrets securely.
- **Usage in Helix**: SOPS is used to encrypt secrets, which are then managed by Vault or Kubernetes.
- **Learn More**: [SOPS](https://github.com/mozilla/sops)

## Key Management

### Vault

- **Purpose**: Vault is a tool for securely accessing secrets.
- **Usage in Helix**: Vault is central to managing secrets, encryption keys, and access to sensitive data within the Helix ecosystem.
- **Learn More**: [Vault](https://www.vaultproject.io/)

## Observability and Analysis

### Prometheus

- **Purpose**: Prometheus is a system and service monitoring system.
- **Usage in Helix**: Prometheus is used to collect and store metrics from various services, which are then visualized and analyzed using Grafana.
- **Learn More**: [Prometheus](https://prometheus.io/)

### Grafana

- **Purpose**: Grafana is an open-source platform for monitoring and observability.
- **Usage in Helix**: Grafana visualizes metrics collected by Prometheus, providing dashboards and alerting capabilities.
- **Learn More**: [Grafana](https://grafana.com/)

### InfluxData

- **Purpose**: InfluxData provides a time series platform for managing metrics, events, and logs.
- **Usage in Helix**: InfluxData is used for time-series data storage and real-time analytics.
- **Learn More**: [InfluxData](https://www.influxdata.com/)

### Datadog

- **Purpose**: Datadog is a monitoring and security platform for cloud applications.
- **Usage in Helix**: Datadog is used for end-to-end observability, bringing together data from servers, containers, databases, and third-party services.
- **Learn More**: [Datadog](https://www.datadoghq.com/)

### Sentry

- **Purpose**: Sentry is an error tracking tool that helps developers monitor and fix crashes in real-time.
- **Usage in Helix**: Sentry is used to track and monitor application errors, providing insights into issues affecting the user experience.
- **Learn More**: [Sentry](https://sentry.io/)

## Logging

### Fluentd

- **Purpose**: Fluentd is an open-source data collector for unified logging.
- **Usage in Helix**: Fluentd collects logs from various services and routes them to storage and monitoring systems like Elasticsearch and Prometheus.
- **Learn More**: [Fluentd](https://www.fluentd.org/)

## Tracing

### Jaeger

- **Purpose**: Jaeger is an open-source, end-to-end distributed tracing system.
- **Usage in Helix**: Jaeger is used to monitor and troubleshoot transactions in complex microservices environments.
- **Learn More**: [Jaeger](https://www.jaegertracing.io/)

### Elastic APM

- **Purpose**: Elastic APM provides real-time insights into application performance.
- **Usage in Helix**: Elastic APM is integrated with Elasticsearch to monitor application performance and detect bottlenecks.
- **Learn More**: [Elastic APM](https://www.elastic.co/apm)

## Chaos Engineering

### Chaos Mesh

- **Purpose**: Chaos Mesh is a cloud-native chaos engineering platform that orchestrates chaos experiments in Kubernetes environments.
- **Usage in Helix**: Chaos Mesh is used to inject faults and test the resilience of the system.
- **Learn More**: [Chaos Mesh](https://chaos-mesh.org/)

### Litmus

- **Purpose**: Litmus is a complete chaos engineering platform for cloud-native applications.
- **Usage in Helix**: Litmus is used to create and manage chaos experiments, providing insights into system behavior under stress.
- **Learn More**: [Litmus](https://litmuschaos.io/)

### Chaoskube

- **Purpose**: Chaoskube periodically kills random pods in a Kubernetes cluster.
- **Usage in Helix**: Chaoskube is used to ensure that applications can handle unexpected disruptions by randomly terminating pods.
- **Learn More**: [Chaoskube](https://github.com/linki/chaoskube)

## Pipeline Orchestration

### Flux

- **Purpose**: Flux is a tool for keeping Kubernetes clusters in sync with configuration sources.
- **Usage in Helix**: Flux automates deployments by syncing the state of applications with their configuration stored in Git repositories.
- **Learn More**: [Flux](https://fluxcd.io/)

## Continuous Integration and Continuous Deployment

### GitHub Actions

- **Purpose**: GitHub Actions enables automation of workflows directly in your GitHub repository.
- **Usage in Helix**: GitHub Actions is used for automating CI/CD pipelines, including testing, building, and deploying code changes.
- **Learn More**: [GitHub Actions](https://github.com/features/actions)

### ArgoCD

- **Purpose**: ArgoCD is a declarative, GitOps continuous delivery tool for Kubernetes.
- **Usage in Helix**: ArgoCD is used for managing Kubernetes deployments, ensuring that the state of your applications is continuously synced with their Git repository.
- **Learn More**: [ArgoCD](https://argoproj.github.io/argo-cd/)

### Flux

- **Purpose**: Flux (also mentioned under Pipeline Orchestration) ensures that Kubernetes clusters remain in sync with the declared state in version control.
- **Usage in Helix**: Flux provides continuous deployment capabilities by automatically applying changes in the Git repository to the Kubernetes cluster.
- **Learn More**: [Flux](https://fluxcd.io/)
