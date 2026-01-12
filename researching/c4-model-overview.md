# C4 Model - Technical Overview

The C4 model is an "abstraction-first" approach to diagramming software architecture, created by Simon Brown between 2006-2011. It provides a hierarchical set of abstractions (software systems, containers, components, and code) that reflect how architects and developers think about and build software. The name "C4" comes from the four core diagram types: Context, Containers, Components, and Code.

## High-Level Architecture

```mermaid
graph TB
    subgraph "C4 Model Hierarchy"
        L0[Level 0: System Landscape<br/>Enterprise-wide view]
        L1[Level 1: System Context<br/>Single system + external actors]
        L2[Level 2: Container<br/>Applications & data stores]
        L3[Level 3: Component<br/>Logical groupings within containers]
        L4[Level 4: Code<br/>Classes, interfaces, functions]
    end

    L0 --> L1
    L1 --> L2
    L2 --> L3
    L3 --> L4

    style L0 fill:#1168bd,color:#fff
    style L1 fill:#438dd5,color:#fff
    style L2 fill:#85bbf0,color:#000
    style L3 fill:#b8d4f0,color:#000
    style L4 fill:#e0ecf8,color:#000
```

## The Four Core Levels (Zoom Levels)

```mermaid
graph TB
    subgraph "Level 1: System Context"
        User1[Person]
        System1[Software System]
        External1[External System]
        User1 --> System1
        System1 --> External1
    end

    subgraph "Level 2: Container"
        WebApp[Web Application]
        API[API Application]
        DB[(Database)]
        WebApp --> API
        API --> DB
    end

    subgraph "Level 3: Component"
        Controller[Controller]
        Service[Service]
        Repository[Repository]
        Controller --> Service
        Service --> Repository
    end

    subgraph "Level 4: Code"
        Class1[Class]
        Interface1[Interface]
        Class2[Implementation]
        Class1 --> Interface1
        Class2 -.-> Interface1
    end

    System1 -.->|zoom in| WebApp
    API -.->|zoom in| Controller
    Service -.->|zoom in| Class1

    style User1 fill:#08427b,color:#fff
    style System1 fill:#1168bd,color:#fff
    style External1 fill:#999999,color:#fff
    style WebApp fill:#438dd5,color:#fff
    style API fill:#438dd5,color:#fff
    style DB fill:#438dd5,color:#fff
```

## Core Abstractions

```mermaid
classDiagram
    class Person {
        +name: string
        +description: string
        Uses software systems
    }

    class SoftwareSystem {
        +name: string
        +description: string
        +technology: string
        Highest level abstraction
        Delivers value to users
        Contains 1+ Containers
    }

    class Container {
        +name: string
        +description: string
        +technology: string
        Separately deployable unit
        Runs in own process space
        Contains 1+ Components
    }

    class Component {
        +name: string
        +description: string
        +technology: string
        Logical grouping of code
        NOT separately deployable
        Implemented by Code elements
    }

    class CodeElement {
        +name: string
        +type: class|interface|function
        Actual implementation
        Classes, interfaces, etc.
    }

    Person --> SoftwareSystem : uses
    SoftwareSystem --> Container : contains
    Container --> Component : contains
    Component --> CodeElement : implemented by
    SoftwareSystem --> SoftwareSystem : depends on
    Container --> Container : communicates with
    Component --> Component : uses
```

### Abstraction Definitions

| Abstraction | Definition | Example |
|-------------|------------|---------|
| **Person** | Human users, actors, roles, or personas that interact with the system | Customer, Admin, Developer |
| **Software System** | Highest level; delivers value to users (human or not) | E-commerce Platform, Banking System |
| **Container** | Separately deployable/runnable unit; runs in its own process space | Web App, API, Database, Message Queue |
| **Component** | Logical grouping of related functionality; NOT separately deployable | UserController, PaymentService, OrderRepository |
| **Code** | Implementation details: classes, interfaces, functions | UserService.java, IPaymentGateway |

## Diagram Types Overview

```mermaid
graph TB
    subgraph "Core Diagrams (Static Structure)"
        Context[System Context<br/>Level 1]
        Container[Container Diagram<br/>Level 2]
        Component[Component Diagram<br/>Level 3]
        Code[Code Diagram<br/>Level 4]
    end

    subgraph "Supplementary Diagrams"
        Landscape[System Landscape<br/>Level 0]
        Dynamic[Dynamic Diagram<br/>Runtime behavior]
        Deployment[Deployment Diagram<br/>Infrastructure]
    end

    Landscape --> Context
    Context --> Container
    Container --> Component
    Component --> Code

    Dynamic -.->|overlays| Context
    Dynamic -.->|overlays| Container
    Dynamic -.->|overlays| Component
    Deployment -.->|maps| Container

    style Context fill:#1168bd,color:#fff
    style Container fill:#438dd5,color:#fff
    style Component fill:#85bbf0,color:#000
    style Code fill:#b8d4f0,color:#000
    style Landscape fill:#08427b,color:#fff
    style Dynamic fill:#999999,color:#fff
    style Deployment fill:#999999,color:#fff
```

## Level 1: System Context Diagram

```mermaid
graph TB
    subgraph "System Context Example"
        Customer[Customer<br/>Person]
        Admin[Admin User<br/>Person]

        System[Internet Banking System<br/>Software System]

        Email[Email System<br/>External System]
        Mainframe[Mainframe Banking<br/>External System]
    end

    Customer -->|Views account balances,<br/>makes payments| System
    Admin -->|Manages users,<br/>configures system| System
    System -->|Sends notifications| Email
    System -->|Gets account info,<br/>makes transactions| Mainframe

    style Customer fill:#08427b,color:#fff
    style Admin fill:#08427b,color:#fff
    style System fill:#1168bd,color:#fff
    style Email fill:#999999,color:#fff
    style Mainframe fill:#999999,color:#fff
```

**Purpose**: Show system in the big picture context
**Scope**: Single software system
**Audience**: Everyone (technical and non-technical)
**Shows**: People, the system, and external dependencies
**Recommendation**: Essential for all teams

## Level 2: Container Diagram

```mermaid
graph TB
    subgraph "Container Diagram Example"
        Customer[Customer<br/>Person]

        subgraph "Internet Banking System"
            WebApp[Web Application<br/>Container: JavaScript/React]
            MobileApp[Mobile App<br/>Container: React Native]
            API[API Application<br/>Container: Java/Spring Boot]
            DB[(Database<br/>Container: PostgreSQL)]
        end

        Mainframe[Mainframe Banking<br/>External System]
    end

    Customer --> WebApp
    Customer --> MobileApp
    WebApp -->|Makes API calls<br/>JSON/HTTPS| API
    MobileApp -->|Makes API calls<br/>JSON/HTTPS| API
    API -->|Reads/writes| DB
    API -->|Gets account info| Mainframe

    style Customer fill:#08427b,color:#fff
    style WebApp fill:#438dd5,color:#fff
    style MobileApp fill:#438dd5,color:#fff
    style API fill:#438dd5,color:#fff
    style DB fill:#438dd5,color:#fff
    style Mainframe fill:#999999,color:#fff
```

**Purpose**: Show high-level technology choices and responsibilities
**Scope**: Single software system
**Audience**: Technical people (architects, developers, ops)
**Shows**: Containers (apps, data stores), their technologies, and communication
**Recommendation**: Essential for all teams

### What is a Container?

A container is something that needs to be running for the system to work:
- Server-side web application (Java, .NET, Node.js)
- Client-side SPA (React, Angular, Vue)
- Mobile application (iOS, Android, React Native)
- Desktop application (Electron, WPF)
- Database (PostgreSQL, MongoDB, Redis)
- File system / blob storage (S3, Azure Blob)
- Message broker (RabbitMQ, Kafka)
- Serverless function (AWS Lambda, Azure Functions)

## Level 3: Component Diagram

```mermaid
graph TB
    subgraph "Component Diagram Example"
        MobileApp[Mobile App<br/>Container]

        subgraph "API Application"
            SignIn[Sign In Controller<br/>Component: Spring MVC]
            Security[Security Component<br/>Component: Spring Security]
            Accounts[Accounts Controller<br/>Component: Spring MVC]
            AccountService[Account Service<br/>Component: Spring Bean]
            EmailService[Email Service<br/>Component: Spring Bean]
            MainframeIntegration[Mainframe Integration<br/>Component: Spring Bean]
        end

        DB[(Database)]
        Email[Email System]
        Mainframe[Mainframe]
    end

    MobileApp --> SignIn
    MobileApp --> Accounts
    SignIn --> Security
    Accounts --> AccountService
    AccountService --> MainframeIntegration
    AccountService --> EmailService
    Security --> DB
    EmailService --> Email
    MainframeIntegration --> Mainframe

    style MobileApp fill:#438dd5,color:#fff
    style SignIn fill:#85bbf0,color:#000
    style Security fill:#85bbf0,color:#000
    style Accounts fill:#85bbf0,color:#000
    style AccountService fill:#85bbf0,color:#000
    style EmailService fill:#85bbf0,color:#000
    style MainframeIntegration fill:#85bbf0,color:#000
    style DB fill:#438dd5,color:#fff
    style Email fill:#999999,color:#fff
    style Mainframe fill:#999999,color:#fff
```

**Purpose**: Decompose a container into its logical components
**Scope**: Single container
**Audience**: Software architects and developers
**Shows**: Components, their responsibilities, technology/implementation
**Recommendation**: Create only if they add value; consider automation

## Supplementary Diagrams

### System Landscape Diagram (Level 0)

```mermaid
graph TB
    subgraph "Enterprise"
        Customer[Customer]

        subgraph "Core Banking"
            IBS[Internet Banking<br/>System]
            MBS[Mobile Banking<br/>System]
            ATM[ATM System]
        end

        subgraph "Back Office"
            CRM[CRM System]
            Reporting[Reporting<br/>System]
        end

        subgraph "External"
            Mainframe[Mainframe<br/>Core Banking]
            Email[Email<br/>System]
        end
    end

    Customer --> IBS
    Customer --> MBS
    Customer --> ATM
    IBS --> Mainframe
    MBS --> Mainframe
    ATM --> Mainframe
    IBS --> Email
    CRM --> Mainframe
    Reporting --> Mainframe

    style Customer fill:#08427b,color:#fff
    style IBS fill:#1168bd,color:#fff
    style MBS fill:#1168bd,color:#fff
    style ATM fill:#1168bd,color:#fff
    style CRM fill:#1168bd,color:#fff
    style Reporting fill:#1168bd,color:#fff
    style Mainframe fill:#999999,color:#fff
    style Email fill:#999999,color:#fff
```

**Purpose**: Enterprise-wide view of all software systems
**Scope**: Organization/enterprise
**Use**: Understanding relationships between multiple systems

### Deployment Diagram

```mermaid
graph TB
    subgraph "Production Environment"
        subgraph "AWS Region: us-east-1"
            subgraph "VPC"
                subgraph "Public Subnet"
                    ALB[Application<br/>Load Balancer]
                end

                subgraph "Private Subnet - App Tier"
                    ECS1[ECS Task 1<br/>API Application]
                    ECS2[ECS Task 2<br/>API Application]
                end

                subgraph "Private Subnet - Data Tier"
                    RDS[(RDS PostgreSQL<br/>Primary)]
                    RDS2[(RDS PostgreSQL<br/>Replica)]
                end
            end

            S3[S3 Bucket<br/>Static Assets]
        end

        CloudFront[CloudFront<br/>CDN]
    end

    CloudFront --> ALB
    CloudFront --> S3
    ALB --> ECS1
    ALB --> ECS2
    ECS1 --> RDS
    ECS2 --> RDS
    RDS --> RDS2

    style ALB fill:#438dd5,color:#fff
    style ECS1 fill:#438dd5,color:#fff
    style ECS2 fill:#438dd5,color:#fff
    style RDS fill:#438dd5,color:#fff
    style RDS2 fill:#438dd5,color:#fff
    style S3 fill:#438dd5,color:#fff
    style CloudFront fill:#438dd5,color:#fff
```

**Purpose**: Map containers to infrastructure
**Scope**: Deployment environment (prod, staging, dev)
**Shows**: Deployment nodes, container instances, infrastructure

### Dynamic Diagram

```mermaid
sequenceDiagram
    participant User
    participant WebApp as Web Application
    participant API as API Application
    participant DB as Database
    participant Mainframe

    Note over User,Mainframe: Sign In Feature

    User->>WebApp: 1. Enter credentials
    WebApp->>API: 2. POST /auth/login
    API->>DB: 3. Validate credentials
    DB-->>API: 4. User record
    API->>Mainframe: 5. Get account summary
    Mainframe-->>API: 6. Account data
    API-->>WebApp: 7. JWT token + user info
    WebApp-->>User: 8. Redirect to dashboard
```

**Purpose**: Show runtime behavior for specific scenarios
**Scope**: Feature or use case
**Shows**: Sequence of interactions between elements

## C4 Model Notation

```mermaid
graph TB
    subgraph "Standard Notation"
        Person[Person<br/>━━━━━━━━━━━━<br/>Description of role]
        System[Software System<br/>━━━━━━━━━━━━<br/>Description]
        Container[Container: Technology<br/>━━━━━━━━━━━━<br/>Description]
        Component[Component: Technology<br/>━━━━━━━━━━━━<br/>Description]
        External[External System<br/>━━━━━━━━━━━━<br/>Description]
    end

    Person --> System
    System --> External

    style Person fill:#08427b,color:#fff
    style System fill:#1168bd,color:#fff
    style Container fill:#438dd5,color:#fff
    style Component fill:#85bbf0,color:#000
    style External fill:#999999,color:#fff
```

### Notation Principles

1. **Every element has**: Name, Type, Description, Technology (where applicable)
2. **Every relationship has**: Description of the interaction
3. **Every diagram has**: Title, Legend/Key
4. **Colors are optional**: Blue shades for internal, gray for external is common

## Tooling Ecosystem

```mermaid
graph TB
    subgraph "Diagrams as Code"
        Structurizr[Structurizr DSL<br/>Purpose-built for C4]
        PlantUML[C4-PlantUML<br/>PlantUML extension]
        Mermaid[Mermaid C4<br/>GitHub-native]
        C4Sharp[C4Sharp<br/>.NET library]
    end

    subgraph "Visual Tools"
        IcePanel[IcePanel<br/>Collaborative SaaS]
        Lucidchart[Lucidchart<br/>C4 templates]
        DrawIO[Draw.io<br/>C4 shapes]
        Miro[Miro<br/>Templates]
    end

    subgraph "Output Formats"
        PNG[PNG/SVG Images]
        HTML[Interactive HTML]
        PDF[PDF Documents]
        Embed[Embeddable Diagrams]
    end

    Structurizr --> PNG
    Structurizr --> HTML
    PlantUML --> PNG
    PlantUML --> PDF
    Mermaid --> HTML
    Mermaid --> Embed
    IcePanel --> HTML

    style Structurizr fill:#1168bd,color:#fff
    style PlantUML fill:#438dd5,color:#fff
    style Mermaid fill:#438dd5,color:#fff
```

### Tool Comparison

| Tool | Type | Best For | Model Reuse |
|------|------|----------|-------------|
| **Structurizr** | DSL + SaaS | Full C4 workflow, single model → many diagrams | Yes |
| **C4-PlantUML** | Text-based | CI/CD integration, version control | Limited |
| **Mermaid** | Text-based | GitHub/GitLab native rendering | No |
| **IcePanel** | Visual SaaS | Collaborative modeling, interactive | Yes |
| **Draw.io** | Visual tool | Quick diagrams, offline use | No |

## Creating C4 Diagrams: Workflow

```mermaid
flowchart TD
    Start[Start Documenting] --> Scope[Define Scope]
    Scope --> Context[Create System Context<br/>Level 1]
    Context --> Review1{Sufficient<br/>for audience?}

    Review1 -->|Yes| Done1[Done]
    Review1 -->|No| Container[Create Container Diagram<br/>Level 2]

    Container --> Review2{Need more<br/>detail?}
    Review2 -->|No| Done2[Done]
    Review2 -->|Yes| Component[Create Component Diagrams<br/>Level 3]

    Component --> Review3{Need code<br/>level?}
    Review3 -->|No| Done3[Done]
    Review3 -->|Rarely| Code[Auto-generate Code Diagrams<br/>Level 4]

    Code --> Done4[Done]

    subgraph "Supplementary"
        Landscape[System Landscape]
        Dynamic[Dynamic Diagrams]
        Deployment[Deployment Diagrams]
    end

    Context -.-> Landscape
    Container -.-> Dynamic
    Container -.-> Deployment

    style Context fill:#1168bd,color:#fff
    style Container fill:#438dd5,color:#fff
    style Component fill:#85bbf0,color:#000
    style Code fill:#b8d4f0,color:#000
```

## Key Facts (2025)

- **Created by**: Simon Brown (2006-2011)
- **Based on**: UML and 4+1 Architectural View Model
- **License**: Creative Commons Attribution 4.0
- **Adoption**: Taught to 10,000+ people in ~40 countries
- **Official Book**: "The C4 Model" (O'Reilly, 2024)
- **Primary Tool**: Structurizr (by Simon Brown)
- **Key Principle**: "Diagrams as maps of your code at various zoom levels"

## Best Practices

### Do

1. **Start with Context** - Always create a System Context diagram first
2. **Add legend/key** - Every diagram needs one
3. **Use clear labels** - Describe relationships, not just "uses"
4. **Keep it simple** - Avoid unnecessary detail at each level
5. **Focus on audience** - Context for everyone, Components for devs
6. **Automate when possible** - Generate Code diagrams from source

### Don't

1. **Don't show everything** - Only include what adds value
2. **Don't mix levels** - Keep each diagram at one abstraction level
3. **Don't include deployment at Container level** - Use Deployment diagrams
4. **Don't create Component diagrams for every container** - Only if valuable
5. **Don't manually maintain Code diagrams** - They become stale quickly

## Use Cases

### 1. Onboarding New Team Members
System Context and Container diagrams provide quick understanding of the system

### 2. Architecture Decision Records (ADRs)
Container diagrams show technology choices and their rationale

### 3. Technical Documentation
Progressive zoom from Context → Container → Component for different readers

### 4. Design Reviews
Dynamic diagrams show specific feature implementations

### 5. Infrastructure Planning
Deployment diagrams map containers to infrastructure

### 6. Stakeholder Communication
Context diagrams communicate with non-technical stakeholders

## Structurizr DSL Example

```text
workspace {
    model {
        user = person "Customer" "A user of the banking system"

        bankingSystem = softwareSystem "Internet Banking" {
            webapp = container "Web Application" "React SPA" "JavaScript"
            api = container "API" "Spring Boot" "Java" {
                authController = component "Auth Controller" "Handles authentication"
                accountService = component "Account Service" "Business logic"
            }
            db = container "Database" "PostgreSQL"
        }

        mainframe = softwareSystem "Mainframe Banking" "Core banking system" "Existing System"

        user -> webapp "Uses"
        webapp -> api "Makes API calls" "JSON/HTTPS"
        api -> db "Reads from and writes to"
        api -> mainframe "Gets account information"
    }

    views {
        systemContext bankingSystem "Context" {
            include *
            autolayout lr
        }

        container bankingSystem "Containers" {
            include *
            autolayout lr
        }

        component api "Components" {
            include *
            autolayout lr
        }
    }
}
```

## Sources

- [C4 Model Official Website](https://c4model.com/)
- [C4 Model Diagrams](https://c4model.com/diagrams)
- [System Context Diagram](https://c4model.com/diagrams/system-context)
- [Container Diagram](https://c4model.com/diagrams/container)
- [Component Diagram](https://c4model.com/diagrams/component)
- [C4 Model Abstractions](https://c4model.com/abstractions)
- [C4 Model - Wikipedia](https://en.wikipedia.org/wiki/C4_model)
- [Structurizr](https://structurizr.com/)
- [C4-PlantUML](https://github.com/plantuml-stdlib/C4-PlantUML)
- [Mermaid C4 Diagrams](https://mermaid.js.org/syntax/c4.html)
- [IcePanel - C4 Model Tools](https://icepanel.io/blog/2025-08-28-top-9-tools-for-c4-model-diagrams)
- [Simon Brown's Website](https://simonbrown.je)
