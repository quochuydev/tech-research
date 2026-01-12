# Claude Code Web - Technical Architecture Overview

## Overview

Claude Code Web is Anthropic's browser-based agentic coding assistant that allows developers to delegate coding tasks directly from their browser. Launched in November 2025 as a research preview, it represents a fundamental shift from traditional desktop IDE tools by executing all operations within secure, isolated cloud sandboxes on Anthropic's infrastructure.

Unlike the CLI version that runs locally, Claude Code Web provides:
- **Browser-based access** - No terminal or local installation required
- **Parallel task execution** - Run multiple coding jobs simultaneously
- **Secure sandbox isolation** - gVisor-based kernel-level isolation
- **GitHub integration** - Direct repository access via OAuth

## High-Level Architecture

```mermaid
flowchart TB
    subgraph Client["Browser Client"]
        UI[Web Interface<br/>claude.ai/code]
        Mobile[iOS Mobile App]
    end

    subgraph Anthropic["Anthropic Infrastructure"]
        subgraph Gateway["API Gateway Layer"]
            Auth[Authentication<br/>OAuth 2.0]
            Router[Request Router]
            WS[WebSocket Server<br/>Real-time streaming]
        end

        subgraph Orchestration["Orchestration Layer"]
            TaskMgr[Task Manager<br/>Parallel execution]
            SessionMgr[Session Manager<br/>State tracking]
            QueueMgr[Job Queue<br/>Async processing]
        end

        subgraph Execution["Execution Layer - gVisor Sandboxes"]
            VM1[Sandbox VM 1<br/>Ubuntu 22.04]
            VM2[Sandbox VM 2<br/>Ubuntu 22.04]
            VMn[Sandbox VM n<br/>Ubuntu 22.04]
        end

        subgraph Security["Security Layer"]
            GitProxy[Git Proxy Service<br/>Scoped credentials]
            EgressProxy[Egress Proxy<br/>Network filtering]
            CredMgr[Credential Manager]
        end

        subgraph AI["AI Layer"]
            Claude[Claude Models<br/>Opus 4.5 / Sonnet]
            Context[Context Manager<br/>Codebase understanding]
        end
    end

    subgraph External["External Services"]
        GitHub[GitHub API<br/>Repository access]
        NPM[npm Registry]
        PyPI[PyPI Registry]
    end

    Client -->|HTTPS| Gateway
    Gateway --> Orchestration
    Orchestration --> Execution
    Execution <-->|Scoped auth| Security
    Execution <-->|Code generation| AI
    Security -->|OAuth token| GitHub
    Security -->|Allowlist| NPM
    Security -->|Allowlist| PyPI

    style Client fill:#e3f2fd
    style Gateway fill:#fff3e0
    style Orchestration fill:#f3e5f5
    style Execution fill:#e8f5e9
    style Security fill:#ffebee
    style AI fill:#fff9c4
    style External fill:#f5f5f5
```

## Core Architecture Components

### 1. Sandbox Execution Environment

Each Claude Code Web session creates an isolated container with:

```mermaid
flowchart TB
    subgraph Container["gVisor Sandbox Container"]
        subgraph UserSpace["User Space Kernel (Go)"]
            Sentry[Sentry<br/>Syscall interception]
            Gofer[Gofer<br/>File operations]
        end

        subgraph Runtime["Runtime Environment"]
            Init["process_api<br/>PID 1 Init Process"]
            Shell[Shell Sessions<br/>Command execution]
            Git[Git Client<br/>Scoped credential]
        end

        subgraph Toolchains["Pre-installed Toolchains"]
            Node[Node.js 20]
            Python[Python 3.11]
            Ruby[Ruby 3.3.6]
            Tools[ffmpeg, ImageMagick<br/>LaTeX, Playwright<br/>LibreOffice ~7GB]
        end

        subgraph Resources["Resource Limits"]
            Mem[4GB Memory]
            Port[Port 2024]
        end
    end

    subgraph Host["Host Kernel"]
        Seccomp[Seccomp-BPF<br/>Syscall filtering]
        Network[Network Namespace]
    end

    Sentry -->|Intercept| Host
    Runtime --> UserSpace
    Toolchains --> Runtime

    style Container fill:#e8f5e9
    style UserSpace fill:#c8e6c9
    style Runtime fill:#a5d6a7
    style Toolchains fill:#81c784
    style Resources fill:#66bb6a
    style Host fill:#ffebee
```

### 2. Security Architecture - gVisor Isolation

```mermaid
flowchart LR
    subgraph Application["Application Layer"]
        App[Code Execution<br/>User's code]
    end

    subgraph gVisor["gVisor Layer"]
        direction TB
        Sentry[Sentry Process<br/>Syscall Handler]
        Platform[Platform Abstraction<br/>KVM/ptrace]

        Sentry --> Platform
    end

    subgraph Host["Host Kernel"]
        direction TB
        Seccomp[Seccomp-BPF<br/>70-80 syscalls allowed]
        Kernel[Linux Kernel<br/>Isolated]
    end

    App -->|All syscalls| Sentry
    Platform -->|Filtered syscalls| Seccomp
    Seccomp -->|Safe operations| Kernel

    style Application fill:#ffebee
    style gVisor fill:#e3f2fd
    style Host fill:#e8f5e9
```

**Key Security Features:**

| Feature | Implementation | Purpose |
|---------|---------------|---------|
| Kernel Isolation | gVisor user-space kernel | Prevent direct hardware access |
| Syscall Filtering | Seccomp-BPF (70-80 of 300+ allowed) | Block dangerous operations |
| Network Control | Egress proxy with JWT validation | Restrict outbound connections |
| Filesystem Isolation | Read/write only to working directory | Prevent file system escape |
| Credential Protection | Scoped credentials via proxy | Never expose real tokens |

### 3. GitHub Integration Flow

```mermaid
sequenceDiagram
    participant User as Browser
    participant Auth as OAuth Service
    participant Proxy as Git Proxy
    participant Sandbox as gVisor Sandbox
    participant GH as GitHub API

    User->>Auth: Connect GitHub (OAuth)
    Auth->>GH: Request authorization
    GH->>Auth: Authorization code
    Auth->>GH: Exchange for token
    Auth->>Auth: Store encrypted token

    Note over Sandbox: Task execution starts

    Sandbox->>Proxy: git clone (scoped credential)
    Proxy->>Proxy: Validate scoped credential
    Proxy->>Proxy: Verify operation allowed
    Proxy->>GH: Clone with real OAuth token
    GH->>Proxy: Repository data
    Proxy->>Sandbox: Cloned repo

    Note over Sandbox: Code changes made

    Sandbox->>Proxy: git push (branch: claude/feature)
    Proxy->>Proxy: Verify branch policy
    Proxy->>GH: Push with real token
    GH->>Proxy: Success
    Proxy->>Sandbox: Push confirmed
```

**Git Proxy Security Model:**
- Real OAuth tokens **never** enter the sandbox
- Scoped credentials are validated per-operation
- Branch restrictions enforced at proxy level
- All git interactions logged and auditable

### 4. Network Egress Architecture

```mermaid
flowchart TB
    subgraph Sandbox["gVisor Sandbox"]
        App[Application Code]
        Socket[Unix Domain Socket]
    end

    subgraph Proxy["Egress Proxy (Outside Sandbox)"]
        Validator[JWT Validator<br/>4-hour expiry]
        Allowlist[Domain Allowlist]
        Logger[Request Logger]
    end

    subgraph Allowed["Allowed Destinations"]
        GH[github.com]
        NPM[registry.npmjs.org]
        PyPI[pypi.org]
        Anthropic[api.anthropic.com]
    end

    subgraph Blocked["Blocked"]
        Internal[Internal networks]
        Unknown[Unknown domains]
    end

    App -->|HTTP request| Socket
    Socket -->|Forward| Validator
    Validator -->|Check JWT| Allowlist
    Allowlist -->|Allowed| Allowed
    Allowlist -->|Denied| Blocked

    style Sandbox fill:#e8f5e9
    style Proxy fill:#fff3e0
    style Allowed fill:#c8e6c9
    style Blocked fill:#ffcdd2
```

## Task Execution Flow

```mermaid
sequenceDiagram
    participant User as Browser
    participant WS as WebSocket Server
    participant Queue as Task Queue
    participant Sandbox as gVisor Sandbox
    participant Claude as Claude AI
    participant GitHub as GitHub

    User->>WS: Submit coding task
    WS->>Queue: Enqueue task
    Queue->>Sandbox: Spawn fresh container

    Note over Sandbox: Environment preparation

    Sandbox->>GitHub: Clone repository (via proxy)
    Sandbox->>Sandbox: Run initialization hooks

    loop Agentic Loop
        Sandbox->>Claude: Context + task
        Claude->>Claude: Plan actions
        Claude->>Sandbox: Tool calls (edit, bash, etc.)
        Sandbox->>Sandbox: Execute commands
        Sandbox->>WS: Stream progress
        WS->>User: Real-time updates

        alt User interrupts
            User->>WS: Steering comment
            WS->>Sandbox: Interrupt signal (2-5s)
            Sandbox->>Claude: Evaluate interrupt
        end
    end

    Sandbox->>GitHub: Push changes (via proxy)
    Sandbox->>WS: Task complete
    WS->>User: Results + PR link

    Note over Sandbox: Container terminated & wiped
```

## Parallel Task Execution

```mermaid
flowchart TB
    subgraph User["User Session"]
        Browser[Browser Interface]
    end

    subgraph TaskMgr["Task Manager"]
        Q1[Task Queue 1]
        Q2[Task Queue 2]
        Q3[Task Queue 3]
    end

    subgraph Sandboxes["Parallel Sandboxes"]
        S1[Sandbox 1<br/>TypeScript check]
        S2[Sandbox 2<br/>Update dependencies]
        S3[Sandbox 3<br/>Generate tests]
    end

    subgraph Repos["GitHub Repositories"]
        R1[Repo A<br/>Frontend]
        R2[Repo B<br/>Backend]
        R3[Repo A<br/>Tests branch]
    end

    Browser -->|Task 1| Q1
    Browser -->|Task 2| Q2
    Browser -->|Task 3| Q3

    Q1 --> S1
    Q2 --> S2
    Q3 --> S3

    S1 <-->|Branch A| R1
    S2 <-->|Branch B| R2
    S3 <-->|Branch C| R3

    style User fill:#e3f2fd
    style TaskMgr fill:#fff3e0
    style Sandboxes fill:#e8f5e9
    style Repos fill:#f3e5f5
```

**Parallel Execution Benefits:**
- Run multiple tasks across different repositories
- No additional cost - pay for compute time, not concurrent sessions
- Each sandbox is fully isolated
- Rate limits consumed proportionally

## Real-Time Communication

```mermaid
flowchart LR
    subgraph Browser["Browser"]
        UI[Web UI]
        WSClient[WebSocket Client]
    end

    subgraph Server["Anthropic Server"]
        WSServer[WebSocket Server]
        Broker[Message Broker]
    end

    subgraph Sandbox["Sandbox"]
        Agent[Claude Agent]
        Executor[Command Executor]
    end

    UI <-->|User input| WSClient
    WSClient <-->|Bidirectional| WSServer
    WSServer <-->|Pub/Sub| Broker
    Broker <-->|Commands/Output| Agent
    Agent <-->|Tool calls| Executor

    style Browser fill:#e3f2fd
    style Server fill:#fff3e0
    style Sandbox fill:#e8f5e9
```

**Communication Features:**
- Bidirectional WebSocket for real-time updates
- Follow-up comments evaluated every 2-5 seconds
- High-priority abort commands preempt within milliseconds
- Streaming output for long-running tasks

## Container Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Spawning: Task submitted
    Spawning --> Initializing: Container created
    Initializing --> Cloning: Run hooks
    Cloning --> Ready: Repository cloned
    Ready --> Executing: Agent starts
    Executing --> Executing: Agentic loop
    Executing --> Pushing: Task complete
    Pushing --> Terminating: Changes pushed
    Terminating --> [*]: Container wiped

    note right of Spawning: Fresh Ubuntu 22.04<br/>gVisor isolation
    note right of Cloning: Default branch or<br/>specified branch
    note right of Executing: Real-time streaming<br/>User steering
    note right of Terminating: Ephemeral storage<br/>completely wiped
```

## Key Facts (2025)

### Usage Statistics
- **115,000+ developers** actively using Claude Code
- **195 million lines** of code processed weekly
- **10x user growth** since May 2025 launch
- **90%** of Claude Code itself written by AI

### Revenue & Market
- **$500M+** annualized revenue from Claude Code
- **$130M** estimated from Claude Code Web specifically
- Part of Anthropic's **$5B annualized revenue**
- **5.5x revenue jump** with **300% user growth**

### Technical Specs
- **~7GB** universal container image
- **4GB** memory limit per sandbox
- **4-hour** JWT token expiry
- **84%** reduction in permission prompts with sandboxing

### Availability
- **Pro plan** ($20/month)
- **Max plans** ($100-200/month)
- **Team & Enterprise** users with premium seats

## Use Cases

```mermaid
mindmap
    root((Claude Code Web))
        Development Tasks
            Feature implementation
            Bug fixes
            Code refactoring
            Test generation
            Documentation
        Multi-Repo Work
            Cross-repo changes
            Microservices updates
            Monorepo management
        CI-CD Integration
            PR creation
            Branch management
            Automated commits
        Remote Coding
            Mobile development
            Browser-only environments
            Chromebook coding
        Async Workflows
            Long-running tasks
            Batch processing
            Overnight jobs
```

## Security Considerations

### Strengths
1. **Defense in Depth**: Multiple isolation layers (gVisor + Seccomp + Network)
2. **Credential Protection**: Real tokens never enter sandbox
3. **Auditable Operations**: All git operations logged at proxy
4. **Ephemeral Storage**: No data persistence after task completion
5. **Restricted Network**: Allowlist-based egress filtering

### Considerations
1. **Trust Model**: Code executes on Anthropic infrastructure
2. **Network Access**: Some external access required for packages
3. **Repository Access**: OAuth grants broad repository permissions
4. **Rate Limits**: Parallel tasks consume proportionally more

## Comparison: Web vs CLI

| Feature | Claude Code Web | Claude Code CLI |
|---------|----------------|-----------------|
| Execution | Anthropic cloud sandbox | Local machine |
| Security | gVisor + proxy isolation | OS-level sandboxing |
| GitHub Auth | OAuth (scoped proxy) | Personal tokens/SSH |
| Parallel Tasks | Native support | Manual (multiple terminals) |
| Network | Allowlist egress proxy | Full network access |
| Persistence | Ephemeral per-task | Persistent local |
| Mobile Access | Yes (iOS app) | No |
| Offline | No | Yes |

## Architecture Principles

```mermaid
flowchart TB
    subgraph Principles["Design Principles"]
        P1[Security First<br/>Never trust sandbox code]
        P2[Ephemeral Execution<br/>No persistent state]
        P3[Credential Isolation<br/>Proxy all sensitive ops]
        P4[Defense in Depth<br/>Multiple security layers]
        P5[User Control<br/>Real-time steering]
    end

    subgraph Implementation["Implementation"]
        I1[gVisor isolation]
        I2[Container lifecycle]
        I3[Git proxy service]
        I4[Seccomp + egress proxy]
        I5[WebSocket streaming]
    end

    P1 --> I1
    P2 --> I2
    P3 --> I3
    P4 --> I4
    P5 --> I5

    style Principles fill:#e3f2fd
    style Implementation fill:#e8f5e9
```

## Sources

- [Claude Code on the web | Anthropic](https://www.anthropic.com/news/claude-code-on-the-web)
- [Claude Code Docs - On the Web](https://code.claude.com/docs/en/claude-code-on-the-web)
- [Making Claude Code More Secure | Anthropic Engineering](https://www.anthropic.com/engineering/claude-code-sandboxing)
- [Claude Code Sandboxing Docs](https://code.claude.com/docs/en/sandboxing)
- [How Claude Code is Built | Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/how-claude-code-is-built)
- [Claude Code Architecture | ZenML](https://www.zenml.io/llmops-database/claude-code-agent-architecture-single-threaded-master-loop-for-autonomous-coding)
- [Claude Code Best Practices | Anthropic](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Claude Code reaches 115,000 developers | PPC Land](https://ppc.land/claude-code-reaches-115-000-developers-processes-195-million-lines-weekly/)
- [Reverse Engineering Claude's Sandbox](https://michaellivs.com/blog/sandboxed-execution-environment)
