# Dokploy - Technical Overview

## Overview

Dokploy is a free, open-source, self-hostable Platform as a Service (PaaS) that simplifies the deployment and management of applications and databases. Created by developer Mauricio Suárez and launched in April 2024, it serves as an alternative to platforms like Heroku, Vercel, and Netlify, leveraging Docker and Traefik for container orchestration and traffic management.

**Key Value Propositions:**
- **Self-hosted** - Full control over your infrastructure with no vendor lock-in
- **Docker-native** - Built around Docker, Docker Compose, and Docker Swarm
- **Zero-config SSL** - Automatic Let's Encrypt certificate management
- **Multi-server** - Scale across multiple nodes with Docker Swarm support
- **Open Source** - Apache 2.0 license, free to use

## High-Level Architecture

```mermaid
flowchart TB
    subgraph Client["Client Layer"]
        Browser[Web Browser]
        CLI[Dokploy CLI]
        API[API Clients]
    end

    subgraph Dokploy["Dokploy Platform"]
        subgraph Core["Core Services"]
            NextJS[Next.js Application<br/>UI + API Server]
            PostgreSQL[(PostgreSQL<br/>Configuration Store)]
            Redis[(Redis<br/>Job Queue)]
        end

        subgraph Networking["Network Layer"]
            Traefik[Traefik<br/>Reverse Proxy + Load Balancer]
            Network[dokploy-network<br/>Docker Network]
        end

        subgraph Monitoring["Observability"]
            Monitor[dokploy-monitoring<br/>Metrics Collector]
            Logs[Log Aggregator<br/>Request & Container Logs]
        end
    end

    subgraph Workloads["Deployed Workloads"]
        Apps[Applications<br/>Docker Containers]
        Compose[Docker Compose<br/>Multi-Container Apps]
        DBs[Databases<br/>PostgreSQL, MySQL, MongoDB, Redis, MariaDB]
    end

    subgraph External["External Services"]
        GitHub[GitHub/GitLab/Bitbucket]
        Registry[Docker Registry<br/>DockerHub, GHCR]
        LetsEncrypt[Let's Encrypt<br/>SSL Certificates]
        Storage[Backup Storage<br/>S3, etc.]
    end

    Browser --> Traefik
    CLI --> NextJS
    API --> NextJS
    Traefik --> NextJS
    Traefik --> Apps
    Traefik --> Compose

    NextJS --> PostgreSQL
    NextJS --> Redis
    NextJS --> Apps
    NextJS --> Compose
    NextJS --> DBs

    Apps --> Network
    Compose --> Network
    DBs --> Network

    NextJS --> GitHub
    NextJS --> Registry
    Traefik --> LetsEncrypt
    DBs --> Storage

    style Core fill:#e3f2fd
    style Networking fill:#fff3e0
    style Monitoring fill:#f3e5f5
    style Workloads fill:#e8f5e9
    style External fill:#fce4ec
```

## Core Components

### 1. Next.js Application
The main Dokploy application built with Next.js, providing:
- Server-side rendered UI dashboard
- tRPC API for type-safe communication
- Backend logic for deployments and management

### 2. PostgreSQL Database
Primary data store for:
- User accounts and permissions
- Project and application configurations
- Deployment history and logs
- Domain and certificate settings

### 3. Redis Queue
Manages deployment job queue to:
- Prevent simultaneous deployments
- Handle async build processes
- Manage server load during deployments

### 4. Traefik Reverse Proxy
Handles all incoming traffic:
- Dynamic routing to containers
- Automatic SSL termination
- Load balancing across replicas
- HTTP/3 support for improved performance

## Deployment Workflow

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Git as GitHub/GitLab
    participant Webhook as Webhook Handler
    participant Dokploy as Dokploy Server
    participant Queue as Redis Queue
    participant Build as Build Process
    participant Registry as Docker Registry
    participant Traefik as Traefik
    participant Container as Container

    Dev->>Git: Push code
    Git->>Webhook: Trigger webhook
    Webhook->>Dokploy: Notify deployment
    Dokploy->>Queue: Add to queue

    Queue->>Build: Start build job

    alt Nixpacks Build
        Build->>Build: Detect language & build
    else Dockerfile Build
        Build->>Build: Build from Dockerfile
    else Buildpack Build
        Build->>Build: Use Heroku Buildpack
    end

    Build->>Registry: Push image
    Registry-->>Dokploy: Image ready

    Dokploy->>Container: Deploy new container
    Dokploy->>Traefik: Update routing config
    Traefik->>Container: Route traffic

    Dokploy-->>Dev: Deployment complete notification
```

## Build Options

```mermaid
flowchart LR
    subgraph Source["Source Code"]
        Git[Git Repository]
    end

    subgraph BuildTypes["Build Types"]
        Nixpacks[Nixpacks<br/>Auto-detect & build]
        Dockerfile[Dockerfile<br/>Custom build]
        Buildpack[Heroku Buildpacks<br/>Standard builds]
        Compose[Docker Compose<br/>Multi-service]
    end

    subgraph Output["Output"]
        Image[Docker Image]
    end

    Git --> Nixpacks
    Git --> Dockerfile
    Git --> Buildpack
    Git --> Compose

    Nixpacks --> Image
    Dockerfile --> Image
    Buildpack --> Image
    Compose --> Image

    style Nixpacks fill:#4CAF50,color:#fff
    style Dockerfile fill:#2196F3,color:#fff
    style Buildpack fill:#9C27B0,color:#fff
    style Compose fill:#FF9800,color:#fff
```

| Build Type | Best For | Features |
|------------|----------|----------|
| **Nixpacks** | Most apps | Auto-detects language, zero config |
| **Dockerfile** | Custom builds | Full control over build process |
| **Buildpack** | Heroku migrations | Compatible with Heroku apps |
| **Docker Compose** | Multi-service apps | Complex architectures, microservices |

## Multi-Server Architecture (Docker Swarm)

```mermaid
flowchart TB
    subgraph Manager["Manager Node (Dokploy Server)"]
        DokployUI[Dokploy UI]
        SwarmMgr[Swarm Manager]
        RegistryConfig[Registry Config]
    end

    subgraph Registry["Docker Registry"]
        Images[(Container Images)]
    end

    subgraph Workers["Worker Nodes"]
        Worker1[Worker Node 1<br/>Containers]
        Worker2[Worker Node 2<br/>Containers]
        Worker3[Worker Node 3<br/>Containers]
    end

    subgraph LoadBalancing["Traffic Distribution"]
        Traefik1[Traefik<br/>Load Balancer]
    end

    DokployUI --> SwarmMgr
    SwarmMgr --> RegistryConfig
    RegistryConfig --> Images

    SwarmMgr -->|Orchestrate| Worker1
    SwarmMgr -->|Orchestrate| Worker2
    SwarmMgr -->|Orchestrate| Worker3

    Worker1 -->|Pull| Images
    Worker2 -->|Pull| Images
    Worker3 -->|Pull| Images

    Traefik1 --> Worker1
    Traefik1 --> Worker2
    Traefik1 --> Worker3

    style Manager fill:#e3f2fd
    style Registry fill:#fff3e0
    style Workers fill:#e8f5e9
    style LoadBalancing fill:#f3e5f5
```

### Cluster Configuration Steps
1. Configure a Docker registry (DockerHub, GHCR, etc.)
2. Initialize Docker Swarm on the manager node
3. Add worker nodes using the join command
4. Deploy applications with replica settings
5. Traefik handles load balancing across nodes

## Database Support

```mermaid
flowchart TB
    subgraph Dokploy["Dokploy Database Management"]
        UI[Database UI]
        Backup[Backup System]
        Connect[Connection Manager]
    end

    subgraph Databases["Supported Databases"]
        PG[(PostgreSQL)]
        MySQL[(MySQL)]
        MariaDB[(MariaDB)]
        MongoDB[(MongoDB)]
        Redis[(Redis)]
    end

    subgraph Features["Management Features"]
        Create[Create/Delete]
        Deploy[Deploy/Stop]
        External[External Access URL]
        AutoBackup[Automated Backups]
    end

    subgraph Tools["External Tools"]
        PgAdmin[pgAdmin]
        Workbench[MySQL Workbench]
        Compass[MongoDB Compass]
        RedisInsight[Redis Insight]
    end

    UI --> Databases
    Backup --> Databases
    Connect --> External

    Databases --> Features
    External --> Tools

    style Databases fill:#e8f5e9
    style Features fill:#fff3e0
    style Tools fill:#f3e5f5
```

### Database Features
- **One-click deployment** for all supported databases
- **Automated backups** to external storage (S3, etc.)
- **External connection URLs** for database management tools
- **Resource monitoring** per database container

## SSL/TLS Certificate Management

```mermaid
sequenceDiagram
    participant User as User
    participant Dokploy as Dokploy
    participant Traefik as Traefik
    participant LE as Let's Encrypt
    participant App as Application

    User->>Dokploy: Add domain
    Dokploy->>Dokploy: Select certificate type

    alt Let's Encrypt
        Dokploy->>Traefik: Configure ACME
        Traefik->>LE: Request certificate
        LE->>LE: Verify domain (HTTP-01)
        LE-->>Traefik: Issue certificate
        Traefik->>Traefik: Store & auto-renew
    else Custom Certificate
        User->>Dokploy: Upload cert + key
        Dokploy->>Traefik: Configure custom cert
    else Cloudflare Origin
        Dokploy->>Traefik: Configure Cloudflare cert
    end

    User->>Traefik: HTTPS request
    Traefik->>App: Proxy to container
    App-->>User: Response

    Note over Traefik: Auto-renewal before expiry
```

### Certificate Options
| Type | Use Case | Configuration |
|------|----------|---------------|
| **Let's Encrypt** | Public domains | Automatic, free |
| **Custom** | Enterprise/specific needs | Upload cert + key |
| **Cloudflare Origin** | Cloudflare-proxied domains | Full (Strict) mode |

## Monitoring & Observability

```mermaid
flowchart TB
    subgraph Collection["Metrics Collection"]
        MonitorContainer[dokploy-monitoring<br/>Container]
        TraefikLogs[Traefik Access Logs]
        ContainerLogs[Container Logs]
    end

    subgraph Metrics["System Metrics"]
        CPU[CPU Usage]
        Memory[Memory Usage]
        Disk[Disk Usage]
        Network[Network I/O]
    end

    subgraph Visualization["Dashboard"]
        RealTime[Real-time Charts]
        Requests[Request Analytics]
        History[Historical Data]
    end

    subgraph Alerts["Notifications"]
        Thresholds[Threshold Alerts]
        Providers[Notification Providers<br/>Email, Slack, Discord, etc.]
    end

    MonitorContainer --> CPU & Memory & Disk & Network
    TraefikLogs --> Requests
    ContainerLogs --> History

    CPU & Memory & Disk & Network --> RealTime
    Requests --> RealTime

    RealTime --> Thresholds
    Thresholds --> Providers

    style Collection fill:#e3f2fd
    style Metrics fill:#e8f5e9
    style Visualization fill:#fff3e0
    style Alerts fill:#ffebee
```

### Monitoring Configuration
| Setting | Default | Description |
|---------|---------|-------------|
| Server Refresh Rate | 20 seconds | Metric collection frequency |
| Container Refresh Rate | 20 seconds | Per-container metrics |
| Retention Days | 2 days | How long metrics are kept |
| Metrics Port | 4500 | Port for metrics server |

## Template System

```mermaid
flowchart LR
    subgraph Templates["Template Repository"]
        Remote[templates.dokploy.com<br/>GitHub Repository]
    end

    subgraph Browser["Template Browser"]
        List[Browse Templates]
        Search[Search & Filter]
        Preview[Preview Config]
    end

    subgraph Deploy["One-Click Deploy"]
        Configure[Configure Variables]
        Create[Create Services]
        Start[Start Containers]
    end

    subgraph Apps["Pre-built Templates"]
        Supabase[Supabase]
        Appwrite[Appwrite]
        Pocketbase[Pocketbase]
        Grafana[Grafana]
        Plausible[Plausible]
        Calcom[Cal.com]
        WordPress[WordPress]
        More[100+ more...]
    end

    Remote --> Browser
    Browser --> Deploy
    Deploy --> Apps

    style Templates fill:#e3f2fd
    style Browser fill:#fff3e0
    style Deploy fill:#e8f5e9
    style Apps fill:#f3e5f5
```

### Popular Templates
- **Supabase** - Open-source Firebase alternative
- **Appwrite** - Backend server for web/mobile apps
- **Pocketbase** - Backend in a single file
- **Plausible** - Privacy-focused analytics
- **Cal.com** - Scheduling & booking
- **Grafana** - Monitoring & visualization
- **Directus** - Headless CMS
- **WordPress** - Content management
- **Nextcloud** - File hosting & collaboration

## CI/CD Integration

```mermaid
flowchart TB
    subgraph Triggers["Deployment Triggers"]
        Webhook[Git Webhooks<br/>GitHub, GitLab, Bitbucket]
        DockerHub[DockerHub Webhook]
        API[Dokploy API]
        Manual[Manual Deploy]
    end

    subgraph GitHubActions["GitHub Actions"]
        Action1[dokploy-webhook-deploy<br/>Webhook trigger with metadata]
        Action2[dokploy-deployment<br/>API-based deployment]
    end

    subgraph Dokploy["Dokploy"]
        AutoDeploy[Auto Deploy Handler]
        BuildQueue[Build Queue]
        Deployment[Deployment Engine]
    end

    Webhook --> AutoDeploy
    DockerHub --> AutoDeploy
    API --> AutoDeploy
    Manual --> AutoDeploy

    GitHubActions --> Webhook
    GitHubActions --> API

    AutoDeploy --> BuildQueue
    BuildQueue --> Deployment

    style Triggers fill:#e3f2fd
    style GitHubActions fill:#fff3e0
    style Dokploy fill:#e8f5e9
```

### Auto-Deploy Setup
1. Enable Auto Deploy in application settings
2. Copy webhook URL from deployment logs
3. Add webhook to repository settings
4. Push code to trigger automatic deployment

## Ecosystem & Integrations

```mermaid
graph TB
    subgraph Core["Dokploy Core"]
        Server[Dokploy Server]
        CLI[Dokploy CLI]
        API[REST API]
    end

    subgraph GitProviders["Git Providers"]
        GitHub[GitHub]
        GitLab[GitLab]
        Bitbucket[Bitbucket]
        Gitea[Gitea]
    end

    subgraph Registries["Container Registries"]
        DockerHub[DockerHub]
        GHCR[GitHub Container Registry]
        Custom[Custom Registry]
    end

    subgraph CloudProviders["Cloud Providers"]
        DO[DigitalOcean]
        Hetzner[Hetzner]
        Linode[Linode]
        AWS[AWS EC2]
        OCI[Oracle Cloud]
        Any[Any Linux VPS]
    end

    subgraph Notifications["Notification Channels"]
        Email[Email]
        Slack[Slack]
        Discord[Discord]
        Telegram[Telegram]
        Webhook[Custom Webhook]
    end

    subgraph Tools["Ecosystem Tools"]
        MCP[MCP Server<br/>AI Integration]
        NixOS[NixOS Module]
        Terraform[Terraform Provider]
    end

    Core --> GitProviders
    Core --> Registries
    Core --> Notifications
    CloudProviders --> Core
    Tools --> Core

    style Core fill:#4CAF50,color:#fff
    style GitProviders fill:#e3f2fd
    style Registries fill:#fff3e0
    style CloudProviders fill:#e8f5e9
    style Notifications fill:#f3e5f5
    style Tools fill:#ffebee
```

## Key Facts (2025)

### Project Statistics
- **GitHub Stars**: ~24,000 (growing rapidly)
- **First Release**: April 2024
- **License**: Apache 2.0
- **Created by**: Mauricio Suárez

### Technical Specs
- **Stack**: Next.js + tRPC + PostgreSQL + Redis
- **Proxy**: Traefik (with HTTP/3 support)
- **Container Runtime**: Docker + Docker Swarm
- **Required Ports**: 80, 443, 3000 (UI), 4500 (metrics)

### Supported Languages & Frameworks
- Node.js, Python, Go, Ruby, PHP, Rust, Java
- React, Vue, Angular, Svelte, Next.js, Nuxt
- Django, Flask, Rails, Laravel, Spring

### Deployment Options
| Feature | Dokploy | Vercel | Heroku |
|---------|---------|--------|--------|
| Self-hosted | Yes | No | No |
| Price | Free | $20+/mo | $25+/mo |
| Multi-server | Yes | N/A | N/A |
| Docker Compose | Yes | No | Limited |
| Database Management | Yes | Limited | Yes |
| SSL Certificates | Auto | Auto | Auto |

## Use Cases

```mermaid
mindmap
    root((Dokploy))
        Startup MVP
            Quick deployment
            Cost savings
            Full control
        Agency/Freelancer
            Client projects
            Multi-tenant
            Easy handoff
        Enterprise
            Self-hosted
            Compliance
            Multi-server
        Side Projects
            Free hosting
            Learning
            Experimentation
        Migration
            From Heroku
            From Vercel
            From Netlify
```

### Ideal For
1. **Startups** - Deploy MVPs without PaaS costs
2. **Agencies** - Manage multiple client projects
3. **Enterprises** - Self-hosted with compliance requirements
4. **Developers** - Side projects with full control
5. **Heroku Refugees** - Smooth migration path

## Security Considerations

### Strengths
- **Container Isolation** - Each app runs in isolated Docker container
- **Automatic SSL** - Let's Encrypt integration
- **Network Isolation** - Internal Docker network (dokploy-network)
- **No Exposed Ports** - Traefik handles all traffic routing
- **Scoped Permissions** - Role-based access control

### Best Practices
1. **Keep Dokploy Updated** - Regular security patches
2. **Firewall Configuration** - Only expose required ports
3. **Strong Passwords** - Use strong credentials for admin
4. **Backup Strategy** - Configure automated database backups
5. **Monitoring Alerts** - Set up threshold notifications

### Considerations
- Self-hosted means **you manage security**
- Database external URLs need proper access control
- Docker Swarm doesn't migrate volumes automatically
- Traefik CE doesn't share ACME certificates across nodes

## Comparison with Alternatives

| Feature | Dokploy | Coolify | CapRover |
|---------|---------|---------|----------|
| **GitHub Stars** | ~24K | ~45K | ~13K |
| **First Release** | 2024 | 2020 | 2018 |
| **UI** | Modern, Docker-focused | Beginner-friendly | Basic |
| **Docker Compose** | Native support | Supported | Limited |
| **Multi-server** | Docker Swarm | Yes | Yes |
| **Resource Usage** | Lower | Higher | Medium |
| **Templates** | 100+ | 150+ | 50+ |
| **Build Options** | Nixpacks, Buildpacks, Dockerfile | Nixpacks, Buildpacks | Dockerfile |

## Installation

```bash
# One-line installation (as root on Linux)
curl -sSL https://dokploy.com/install.sh | sh
```

### Requirements
- Linux server (Ubuntu 20.04+ recommended)
- Root access
- Ports 80, 443, 3000 available
- 2GB+ RAM recommended
- Docker (installed automatically if missing)

## Sources

- [Dokploy Official Website](https://dokploy.com/)
- [Dokploy Documentation](https://docs.dokploy.com/)
- [Dokploy GitHub Repository](https://github.com/Dokploy/dokploy)
- [Dokploy Architecture Docs](https://docs.dokploy.com/docs/core/architecture)
- [Dokploy Templates](https://github.com/Dokploy/templates)
- [Coolify vs Dokploy Comparison](https://fwfw.app/blog/coolify-vs-dokploy-comparison)
- [Dreams of Code - Coolify vs Dokploy](https://blog.dreamsofcode.io/coolify-vs-dokploy-why-i-decided-to-use-one-over-the-other)
- [Dokploy DeepWiki](https://deepwiki.com/dokploy/dokploy)
