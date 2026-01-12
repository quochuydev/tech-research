# Zitadel - Technical Overview

Zitadel is an open-source, cloud-native Identity and Access Management (IAM) platform built in Go. It provides authentication, authorization, and user management with a strong focus on multi-tenancy, event sourcing architecture, and developer experience. Zitadel combines the open-source commitment of Keycloak with the modern developer experience of Auth0.

## High-Level Architecture

```mermaid
graph TB
    subgraph "External Clients"
        WebApp[Web Application]
        MobileApp[Mobile Application]
        API[API / Service]
        AdminUI[Admin Console]
    end

    subgraph "ZITADEL Platform"
        subgraph "API Layer"
            GRPC[gRPC API]
            REST[REST API v2]
            OIDC[OIDC/OAuth2 Endpoints]
            SAML[SAML 2.0]
        end

        subgraph "Core Services"
            Command[Command Handler<br/>Write Operations]
            Query[Query Handler<br/>Read Operations]
            Auth[Authentication Engine]
            Actions[Actions V2<br/>Custom Logic]
        end

        subgraph "Event Sourcing"
            EventStore[(Event Store<br/>Source of Truth)]
            PubSub[In-Memory Pub/Sub]
            Spooler[Spooler<br/>Background Processing]
        end

        subgraph "Projections"
            QueryViews[(Query Views<br/>Read Models)]
            Cache[(Cache Layer<br/>Redis Optional)]
        end

        subgraph "Storage"
            PostgreSQL[(PostgreSQL<br/>Primary Database)]
        end
    end

    WebApp --> OIDC
    MobileApp --> OIDC
    API --> GRPC
    AdminUI --> REST

    OIDC --> Auth
    GRPC --> Command
    GRPC --> Query
    REST --> Command
    REST --> Query

    Command --> EventStore
    EventStore --> PubSub
    PubSub --> Spooler
    Spooler --> Projections
    Query --> Projections
    Query --> Cache

    EventStore --> PostgreSQL
    Projections --> PostgreSQL

    style EventStore fill:#4CAF50,color:#fff
    style PostgreSQL fill:#336791,color:#fff
    style Command fill:#FF9800,color:#fff
    style Query fill:#2196F3,color:#fff
```

## Authentication Flow (OIDC Authorization Code with PKCE)

```mermaid
sequenceDiagram
    participant User
    participant App as Client Application
    participant Zitadel as ZITADEL
    participant IdP as External IdP<br/>(Optional)

    User->>App: Access protected resource
    App->>App: Generate code_verifier & code_challenge

    App->>Zitadel: Authorization Request<br/>/oauth/v2/authorize?<br/>code_challenge=xxx&<br/>code_challenge_method=S256

    alt No existing session
        Zitadel->>User: Display Login Page

        alt Password Authentication
            User->>Zitadel: Enter credentials
            Zitadel->>Zitadel: Validate credentials
        else Social/External Login
            Zitadel->>IdP: Redirect to IdP
            User->>IdP: Authenticate
            IdP->>Zitadel: Return with tokens
        else Passkey/FIDO2
            User->>Zitadel: WebAuthn challenge
            Zitadel->>Zitadel: Verify passkey signature
        end

        opt MFA Required
            Zitadel->>User: Request second factor
            User->>Zitadel: Provide OTP/FIDO2/SMS
        end

        Zitadel->>Zitadel: Create session & events
    end

    Zitadel->>App: Redirect with authorization code

    App->>Zitadel: Token Request<br/>/oauth/v2/token<br/>code=xxx&code_verifier=xxx

    Zitadel->>Zitadel: Verify PKCE & issue tokens
    Zitadel->>App: Access Token + ID Token + Refresh Token

    App->>Zitadel: Validate token / UserInfo
    Zitadel->>App: User information

    App->>User: Grant access to resource
```

## Event Sourcing & CQRS Architecture

```mermaid
graph TB
    subgraph "Command Side (Write)"
        API[API Request]
        Validate[Command Validation<br/>Business Logic]
        Events[Create Events]
        Store[Store Events]
    end

    subgraph "Event Store (Source of Truth)"
        ES[(Event Store<br/>Immutable Append-Only)]
        AuditTrail[Complete Audit Trail]
    end

    subgraph "Event Distribution"
        PubSub[In-Memory Pub/Sub<br/>Real-time Events]
        Spooler[Spooler<br/>Background Processing]
    end

    subgraph "Query Side (Read)"
        QueryViews[(Query Views<br/>Projections)]
        QueryAPI[Query API<br/>Read Operations]
    end

    API -->|1. Command| Validate
    Validate -->|2. Business Rules| Events
    Events -->|3. Persist| Store
    Store -->|4. Append| ES

    ES --> AuditTrail
    ES -->|5a. Real-time| PubSub
    ES -->|5b. Background| Spooler

    PubSub -->|6. Update| QueryViews
    Spooler -->|6. Update| QueryViews

    QueryViews -->|7. Read| QueryAPI

    style ES fill:#4CAF50,color:#fff
    style QueryViews fill:#2196F3,color:#fff
    style Validate fill:#FF9800,color:#fff
```

### Event Sourcing Benefits

| Benefit | Description |
|---------|-------------|
| **Complete Audit Trail** | Every change is recorded as an immutable event |
| **Time Travel** | Reconstruct state at any point in time |
| **Debugging** | Full history of what happened and when |
| **Recovery** | Replay events to rebuild state if needed |
| **Compliance** | Built-in audit logging for regulatory requirements |

### CQRS Pattern

- **Command Side**: Handles all write operations (user creation, login, role changes)
- **Query Side**: Optimized read operations from denormalized projections
- **Eventual Consistency**: Query views are updated asynchronously
- **Strong Consistency by ID**: Individual resource lookups can verify against Event Store

## Multi-Tenancy Model

```mermaid
graph TB
    subgraph "ZITADEL Instance"
        subgraph "Organization A (Customer)"
            UsersA[Users]
            PoliciesA[Login and Security<br/>Policies]
            BrandingA[Custom Branding]
            IdPsA[Federated IdPs]
        end

        subgraph "Organization B (Customer)"
            UsersB[Users]
            PoliciesB[Login and Security<br/>Policies]
            BrandingB[Custom Branding]
            IdPsB[Federated IdPs]
        end

        subgraph "Shared Resources"
            Projects[Projects and Apps]
            Grants[Project Grants]
            GlobalPolicies[Instance Policies]
        end
    end

    Projects -->|Grant Access| UsersA
    Projects -->|Grant Access| UsersB
    Grants -->|Delegate Roles| UsersA
    Grants -->|Delegate Roles| UsersB

    style UsersA fill:#E3F2FD
    style UsersB fill:#FFF3E0
```

### Multi-Tenancy Concepts

| Concept | Description |
|---------|-------------|
| **Instance** | Completely isolated ZITADEL deployment |
| **Organization** | Tenant within an instance (users, policies, branding) |
| **Project** | Collection of applications with roles |
| **Project Grant** | Delegated access to projects for other organizations |
| **User** | Belongs to one organization, can have cross-org authorizations |

### B2B Scenario Flow

```mermaid
sequenceDiagram
    participant SaaS as SaaS Provider<br/>(Organization A)
    participant Customer as Customer<br/>(Organization B)
    participant User as End User

    SaaS->>SaaS: Create Project with Roles<br/>(admin, user, viewer)
    SaaS->>Customer: Create Project Grant<br/>(subset of roles)
    Customer->>Customer: Assign roles to users
    User->>SaaS: Login via Organization B
    SaaS->>SaaS: Validate user & roles
    SaaS->>User: Grant access based on delegated roles
```

## Actions V2 - Custom Logic System

```mermaid
graph TB
    subgraph "ZITADEL Actions V2"
        subgraph "Configuration"
            Target[Target<br/>External Endpoint Config]
            Execution[Execution<br/>Trigger Conditions]
        end

        subgraph "Trigger Points"
            Request[Request<br/>Before API Processing]
            Response[Response<br/>After API Processing]
            Event[Event<br/>On System Events]
            Function[Function<br/>Specific Operations]
        end

        subgraph "External Endpoints"
            Webhook[Webhook<br/>Fire and Forget]
            RequestResponse[Request/Response<br/>Modify Data]
            Async[Async Processing<br/>Background Tasks]
        end
    end

    subgraph "Use Cases"
        UserProvision[User Provisioning<br/>to External Systems]
        CustomClaims[Token Claims<br/>Enrichment]
        IPBlock[IP Blocking<br/>Rate Limiting]
        OrgSetup[Auto Organization<br/>Resource Setup]
    end

    Target --> Request
    Target --> Response
    Target --> Event
    Target --> Function

    Execution --> Target

    Request --> Webhook
    Request --> RequestResponse
    Response --> Webhook
    Event --> Async

    Webhook --> UserProvision
    RequestResponse --> CustomClaims
    Request --> IPBlock
    Event --> OrgSetup

    style Target fill:#9C27B0,color:#fff
    style Execution fill:#673AB7,color:#fff
```

### Actions V2 Components

| Component | Description |
|-----------|-------------|
| **Endpoint** | External HTTP endpoint with custom logic |
| **Target** | ZITADEL resource pointing to an endpoint |
| **Execution** | Rules defining when to trigger targets |

### Trigger Types

- **Request**: Intercept and modify incoming API requests
- **Response**: Process and modify API responses
- **Event**: React to system events (user created, role changed)
- **Function**: Hook into specific ZITADEL functions

## Security Features

```mermaid
graph TB
    subgraph "Authentication Methods"
        Password[Password<br/>+ Policy Enforcement]
        Passkeys[Passkeys/FIDO2<br/>Phishing Resistant]
        MFA[Multi-Factor Auth<br/>TOTP, SMS, Email, U2F]
        Social[Social Login<br/>Google, GitHub, etc.]
        SAML[SAML 2.0<br/>Enterprise Federation]
    end

    subgraph "Security Controls"
        PasswordPolicy[Password Policies<br/>Complexity, Age, History]
        Lockout[Account Lockout<br/>Brute Force Protection]
        SessionMgmt[Session Management<br/>Timeout, Revocation]
        AuditLog[Audit Logging<br/>Unlimited History]
        RateLimit[Rate Limiting<br/>API Protection]
    end

    subgraph "Token Security"
        JWTSign[JWT Signing<br/>RS256/ES256]
        WebKeys[Web Keys<br/>Key Rotation]
        TokenExpiry[Token Expiry<br/>Access, Refresh, ID]
        PKCE[PKCE<br/>Code Interception Protection]
    end

    Password --> PasswordPolicy
    Password --> Lockout
    Passkeys --> SessionMgmt
    MFA --> AuditLog

    style Passkeys fill:#4CAF50,color:#fff
    style AuditLog fill:#FF9800,color:#fff
```

### Why Passkeys Over Traditional MFA

| Aspect | Passwords + MFA | Passkeys (FIDO2) |
|--------|-----------------|------------------|
| **Phishing Resistance** | Vulnerable | Resistant (domain-bound) |
| **Credential Theft** | Possible | Not possible |
| **User Experience** | Multiple steps | Single gesture |
| **Device Support** | Varies | Universal (modern devices) |
| **Brute Force** | Rate limiting needed | Not applicable |

## Deployment Architecture

```mermaid
graph TB
    subgraph "Kubernetes Cluster"
        subgraph "Ingress Layer"
            LB[Load Balancer]
            Ingress[Ingress Controller]
        end

        subgraph "ZITADEL Workloads"
            Init[Init Job<br/>zitadel init]
            Setup[Setup Job<br/>zitadel setup]
            Runtime[ZITADEL Pods<br/>zitadel start]
        end

        subgraph "Data Layer"
            PostgreSQL[(PostgreSQL<br/>HA Cluster)]
            Redis[(Redis<br/>Cache - Optional)]
        end
    end

    subgraph "External Services"
        DNS[DNS<br/>Custom Domain]
        SMTP[SMTP<br/>Email Service]
        SMS[SMS Gateway<br/>Optional]
    end

    Internet((Internet)) --> LB
    LB --> Ingress
    Ingress --> Runtime

    Init -->|1. Initialize DB| PostgreSQL
    Setup -->|2. Create Instance| PostgreSQL
    Runtime -->|3. Serve Requests| PostgreSQL
    Runtime --> Redis

    Runtime --> SMTP
    Runtime --> SMS
    DNS --> LB

    style PostgreSQL fill:#336791,color:#fff
    style Runtime fill:#00897B,color:#fff
```

### Deployment Options

| Method | Description | Use Case |
|--------|-------------|----------|
| **Docker Compose** | Single-node deployment | Development, testing |
| **Kubernetes** | Scalable, HA deployment | Production |
| **Linux Binary** | Direct installation | Simple setups |
| **ZITADEL Cloud** | Managed SaaS | No ops overhead |

### Production Requirements

```mermaid
flowchart TD
    Start[Deploy ZITADEL] --> DB[PostgreSQL<br/>Latest Stable]
    DB --> Config[Configure via YAML<br/>Not Environment Variables]
    Config --> TLS[Enable TLS<br/>Custom Domain]
    TLS --> HA{High Availability?}

    HA -->|Yes| K8s[Kubernetes Cluster<br/>Multiple Replicas]
    HA -->|No| Single[Single Instance<br/>Docker/Linux]

    K8s --> Jobs[Separate Init/Setup Jobs<br/>Fast Scaling]
    Single --> Runtime[Run zitadel start]
    Jobs --> Runtime

    Runtime --> Monitor[Monitoring<br/>Metrics and Logs]
    Monitor --> Done[Production Ready]
```

## Protocol Support

```mermaid
graph LR
    subgraph "ZITADEL"
        Core[Core IAM]
    end

    subgraph "Authentication Protocols"
        OIDC[OpenID Connect 1.0]
        OAuth2[OAuth 2.x]
        SAML2[SAML 2.0]
    end

    subgraph "Directory Protocols"
        LDAP[LDAP<br/>User Federation]
        SCIM[SCIM 2.0<br/>User Provisioning]
    end

    subgraph "Modern Auth"
        FIDO2[FIDO2/WebAuthn<br/>Passkeys]
        DeviceAuth[Device Authorization<br/>RFC 8628]
        JWT[JWT Bearer<br/>RFC 7523]
    end

    OIDC --> Core
    OAuth2 --> Core
    SAML2 --> Core
    LDAP --> Core
    SCIM --> Core
    FIDO2 --> Core
    DeviceAuth --> Core
    JWT --> Core

    style OIDC fill:#4CAF50,color:#fff
    style FIDO2 fill:#2196F3,color:#fff
    style SCIM fill:#FF9800,color:#fff
```

## Comparison with Alternatives

```mermaid
graph TB
    subgraph "Identity Solutions Landscape"
        subgraph "Open Source"
            Zitadel[ZITADEL<br/>Go, Event-Sourced<br/>Multi-Tenant Native]
            Keycloak[Keycloak<br/>Java, Battle-Tested<br/>Enterprise Legacy]
            Authentik[Authentik<br/>Python<br/>Self-Hosted Focus]
        end

        subgraph "Proprietary"
            Auth0[Auth0<br/>Cloud-Only<br/>Enterprise Pricing]
            Okta[Okta<br/>Enterprise<br/>Workforce IAM]
        end
    end

    style Zitadel fill:#00897B,color:#fff
    style Keycloak fill:#4D4D4D,color:#fff
    style Auth0 fill:#EB5424,color:#fff
```

| Feature | ZITADEL | Keycloak | Auth0 |
|---------|---------|----------|-------|
| **License** | AGPL v3 | Apache 2.0 | Proprietary |
| **Language** | Go | Java | N/A |
| **Multi-Tenancy** | Native, first-class | Via Realms | Yes |
| **Event Sourcing** | Yes | No | No |
| **Self-Hosted** | Yes | Yes | No |
| **Cloud Offering** | Yes | No | Yes |
| **Passkeys** | Included free | Plugin | Extra cost |
| **API** | gRPC + REST | REST | REST |

## Key Facts (2025)

- **Series A Funding**: $9 million (November 2024), led by Nexus Venture Partners
- **GitHub Stars**: 10,000+
- **License**: AGPL v3 (as of v3)
- **Language**: Go
- **Database**: PostgreSQL (CockroachDB deprecated in v3)
- **Customers**: 150+ across North America and Europe
- **Primary Protocol**: OpenID Connect certified
- **OIDC Library**: Certified by OpenID Foundation

## Use Cases

### 1. B2B SaaS Multi-Tenancy
Manage multiple business customers with isolated configurations, branding, and user management delegation.

### 2. Customer Identity (CIAM)
Consumer-facing applications requiring social login, passwordless authentication, and self-service.

### 3. Workforce Identity
Internal employee authentication with federated login to corporate identity providers.

### 4. API Security
Machine-to-machine authentication using JWT bearer tokens and client credentials.

### 5. Single Sign-On (SSO)
Unified authentication across multiple applications and services.

### 6. Passwordless Migration
Transitioning users from passwords to passkeys for improved security and UX.

## Getting Started

```mermaid
flowchart LR
    Download[Download<br/>Docker Compose] --> Start[docker compose up]
    Start --> Access[Access Console<br/>localhost:8080]
    Access --> Login[Login<br/>zitadel-admin<br/>Password1!]
    Login --> Create[Create Organization<br/>and Application]
    Create --> Integrate[Integrate with<br/>Your App]
```

### Quick Start Commands

```bash
# Download docker-compose.yaml
curl -fsSL https://raw.githubusercontent.com/zitadel/zitadel/main/docker-compose.yaml -o docker-compose.yaml

# Start ZITADEL
docker compose pull
docker compose up --detach --wait

# Access at http://localhost:8080/ui/console
# Login: zitadel-admin@zitadel.localhost / Password1!
```

## Sources

- [ZITADEL Official Website](https://zitadel.com/)
- [ZITADEL GitHub Repository](https://github.com/zitadel/zitadel)
- [ZITADEL Documentation](https://zitadel.com/docs)
- [ZITADEL Software Architecture](https://zitadel.com/docs/concepts/architecture/software)
- [ZITADEL OIDC Recommended Flows](https://zitadel.com/docs/guides/integrate/login/oidc/oauth-recommended-flows)
- [ZITADEL Multi-Tenancy with Organizations](https://zitadel.com/blog/multi-tenancy-with-organizations)
- [ZITADEL B2B Authentication Guide](https://zitadel.com/docs/guides/solution-scenarios/b2b)
- [ZITADEL Actions V2](https://zitadel.com/docs/concepts/features/actions_v2)
- [ZITADEL Passkeys Documentation](https://zitadel.com/docs/concepts/features/passkeys)
- [ZITADEL Deployment Guide](https://zitadel.com/docs/self-hosting/deploy/overview)
- [ZITADEL vs Keycloak Comparison](https://zitadel.com/blog/zitadel-vs-keycloak)
- [Event Sourcing in Identity Management - The New Stack](https://thenewstack.io/transforming-identity-and-access-management-with-event-sourcing/)
- [State of Open-Source Identity in 2025](https://www.houseoffoss.com/post/the-state-of-open-source-identity-in-2025-authentik-vs-authelia-vs-keycloak-vs-zitadel)
- [ZITADEL 2024 Product Wrap Up](https://zitadel.com/blog/end-of-year-product-wrap-up)
- [ZITADEL DeepWiki Architecture Overview](https://deepwiki.com/zitadel/zitadel/1.2-architecture-overview)
