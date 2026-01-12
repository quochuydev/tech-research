# Vibe Kanban - Technical Overview

## What is Vibe Kanban?

Vibe Kanban is an open-source orchestration platform for AI coding agents, developed by BloopAI. It provides a web-based Kanban board interface that enables developers to manage, monitor, and execute multiple AI coding agents in parallel. The tool addresses the paradigm shift where AI agents increasingly write code while human engineers focus on planning, reviewing, and orchestrating tasks.

**Key Value Proposition**: Get 10X more out of Claude Code, Gemini CLI, Codex, and other coding agents by running them in parallel, isolated environments with centralized management.

## High-Level Architecture

```mermaid
graph TB
    subgraph User["Developer Interface"]
        WebUI[Web Dashboard<br/>React + TypeScript]
        CLI[NPX CLI<br/>vibe-kanban]
        VSCode[VS Code Extension]
    end

    subgraph Core["Vibe Kanban Core"]
        Backend[Rust Backend<br/>Axum + Tokio]
        TaskManager[Task Manager]
        AgentOrchestrator[Agent Orchestrator]
        MCPServer[MCP Server]
        GitManager[Git Manager<br/>Worktree Controller]
        DB[(SQLite<br/>Local Storage)]
    end

    subgraph Agents["AI Coding Agents"]
        Claude[Claude Code]
        Gemini[Gemini CLI]
        Codex[OpenAI Codex]
        Copilot[GitHub Copilot CLI]
        Amp[Amp]
        Others[Other Agents...]
    end

    subgraph Isolation["Isolated Workspaces"]
        WT1[Git Worktree 1<br/>Agent Task A]
        WT2[Git Worktree 2<br/>Agent Task B]
        WT3[Git Worktree 3<br/>Agent Task C]
    end

    subgraph External["External Integrations"]
        GitHub[GitHub API<br/>PR Management]
        MCPClients[MCP Clients<br/>Claude Desktop/Raycast]
    end

    WebUI --> Backend
    CLI --> Backend
    VSCode --> Backend
    Backend --> TaskManager
    Backend --> AgentOrchestrator
    Backend --> MCPServer
    Backend --> GitManager
    Backend --> DB

    AgentOrchestrator --> Claude
    AgentOrchestrator --> Gemini
    AgentOrchestrator --> Codex
    AgentOrchestrator --> Copilot
    AgentOrchestrator --> Amp
    AgentOrchestrator --> Others

    GitManager --> WT1
    GitManager --> WT2
    GitManager --> WT3

    Backend --> GitHub
    MCPServer --> MCPClients

    style User fill:#e3f2fd
    style Core fill:#fff3e0
    style Agents fill:#e8f5e9
    style Isolation fill:#f3e5f5
    style External fill:#fce4ec
```

## How It Works

### Task Execution Flow

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant UI as Web Dashboard
    participant TM as Task Manager
    participant Git as Git Manager
    participant Agent as AI Agent
    participant WT as Git Worktree

    Dev->>UI: Create Task
    UI->>TM: Add to Kanban (Todo)
    Dev->>UI: Start Task Attempt
    UI->>TM: Move to In Progress

    TM->>Git: Create Feature Branch
    Git->>WT: Create Isolated Worktree
    TM->>Agent: Start Agent in Worktree

    loop Coding Loop
        Agent->>WT: Make Changes
        Agent->>UI: Stream Progress/Logs
        Dev->>UI: Review Changes (Diff)

        alt Needs Feedback
            Dev->>Agent: Send Comment/Instruction
            Agent->>WT: Apply Feedback
        end
    end

    Agent->>TM: Mark Complete
    Dev->>UI: Review Final Changes
    Dev->>Git: Merge to Main
    Git->>WT: Cleanup Worktree
    TM->>UI: Move to Done
```

### Git Worktree Isolation Model

```mermaid
flowchart TB
    subgraph MainRepo["Main Repository"]
        Main[main branch<br/>Clean & Stable]
    end

    subgraph Worktrees["Isolated Git Worktrees"]
        WT1["Worktree A<br/>/tmp/vk-task-123/<br/>feature/fix-auth-bug"]
        WT2["Worktree B<br/>/tmp/vk-task-456/<br/>feature/add-dark-mode"]
        WT3["Worktree C<br/>/tmp/vk-task-789/<br/>feature/optimize-queries"]
    end

    subgraph Agents["Parallel Agents"]
        A1[Claude Code<br/>Working on Auth]
        A2[Gemini CLI<br/>Working on UI]
        A3[Codex<br/>Working on DB]
    end

    Main -->|Branch| WT1
    Main -->|Branch| WT2
    Main -->|Branch| WT3

    A1 -->|Isolated| WT1
    A2 -->|Isolated| WT2
    A3 -->|Isolated| WT3

    WT1 -.->|Merge when complete| Main
    WT2 -.->|Merge when complete| Main
    WT3 -.->|Merge when complete| Main

    style MainRepo fill:#c8e6c9
    style Worktrees fill:#e1f5fe
    style Agents fill:#fff3e0
```

## Key Concepts

### Task States

Tasks flow through the Kanban board with three primary states:

| State | Description |
|-------|-------------|
| **Todo** | Queued tasks waiting for execution |
| **In Progress** | Active tasks being worked on by agents |
| **Done** | Completed tasks ready for merge/review |

### Task Attempts

Each task can have multiple "attempts" - separate executions with different:
- AI agents (Claude, Gemini, Codex, etc.)
- Agent variants/profiles (different prompts, models)
- Base branches

### Agent Profiles

Configurable agent variants allow customization of:
- Planning behavior
- Model selection
- Sandbox permissions
- Custom instructions

## Technology Stack

```mermaid
graph TB
    subgraph Backend["Backend (Rust)"]
        Axum[Axum Web Framework]
        Tokio[Tokio Async Runtime]
        SQLx[SQLx Database Client]
        LibGit[Git Operations]
    end

    subgraph Frontend["Frontend (TypeScript)"]
        React[React 18+]
        TS[TypeScript]
        Tailwind[Tailwind CSS]
        Vite[Vite Build Tool]
    end

    subgraph Database["Data Storage"]
        SQLite[(SQLite<br/>Local DB)]
        Postgres[(PostgreSQL<br/>Self-hosted)]
    end

    subgraph Protocol["Integration Protocol"]
        MCP[Model Context Protocol<br/>Standard Interface]
    end

    Backend --> Database
    Frontend --> Backend
    MCP --> Backend

    style Backend fill:#dce775
    style Frontend fill:#81d4fa
    style Database fill:#ffcc80
    style Protocol fill:#ce93d8
```

### Repository Structure

```
vibe-kanban/
├── crates/           # Rust backend modules
├── frontend/         # React web application
├── remote-frontend/  # Remote access interface
├── npx-cli/          # NPM distribution CLI
├── shared/           # Common code
└── Cargo.toml        # Rust workspace config
```

## Supported AI Coding Agents

```mermaid
graph LR
    subgraph VK["Vibe Kanban"]
        Orchestrator[Agent<br/>Orchestrator]
    end

    subgraph Agents["Supported Agents"]
        CC[Claude Code<br/>Anthropic]
        GC[Gemini CLI<br/>Google]
        CX[Codex<br/>OpenAI]
        CP[Copilot CLI<br/>GitHub]
        AMP[Amp]
        CS[Cursor Agent]
        OC[OpenCode<br/>SST]
        QC[Qwen Code]
        FD[Factory Droid]
        CCR[Claude Code Router]
    end

    Orchestrator --> CC
    Orchestrator --> GC
    Orchestrator --> CX
    Orchestrator --> CP
    Orchestrator --> AMP
    Orchestrator --> CS
    Orchestrator --> OC
    Orchestrator --> QC
    Orchestrator --> FD
    Orchestrator --> CCR

    style VK fill:#e8f5e9
    style Agents fill:#e3f2fd
```

## MCP (Model Context Protocol) Integration

Vibe Kanban exposes a local MCP server, enabling bidirectional integration:

```mermaid
flowchart TB
    subgraph External["External MCP Clients"]
        Claude[Claude Desktop]
        Raycast[Raycast]
        Other[Other MCP Clients]
    end

    subgraph VK["Vibe Kanban"]
        MCPServer[MCP Server<br/>Local Only]
        Board[Kanban Board]
        Tasks[Task Manager]
    end

    subgraph Tools["MCP Tools Available"]
        LP[list_projects]
        LT[list_tasks]
        CT[create_task]
        GT[get_task]
        UT[update_task]
        DT[delete_task]
        STA[start_task_attempt]
    end

    External --> MCPServer
    MCPServer --> Board
    MCPServer --> Tasks
    MCPServer --> Tools

    style External fill:#e1f5fe
    style VK fill:#fff3e0
    style Tools fill:#e8f5e9
```

### MCP Configuration

```json
{
  "mcpServers": {
    "vibe_kanban": {
      "command": "npx",
      "args": ["-y", "vibe-kanban@latest", "--mcp"]
    }
  }
}
```

### MCP Tools Reference

| Tool | Description | Required Parameters |
|------|-------------|---------------------|
| `list_projects` | Fetch all projects | None |
| `list_tasks` | List tasks in project | `project_id` |
| `create_task` | Create new task | `project_id`, `title` |
| `get_task` | Get task details | `task_id` |
| `update_task` | Modify task | `task_id` |
| `delete_task` | Remove task | `task_id` |
| `start_task_attempt` | Start agent on task | `task_id`, `executor`, `base_branch` |

## Installation & Usage

### Quick Start

```bash
# Prerequisites: Node.js 18+
npx vibe-kanban
```

### Development Setup

```bash
# Clone repository
git clone https://github.com/BloopAI/vibe-kanban

# Prerequisites
# - Rust (latest stable)
# - Node.js 18+
# - pnpm 8+

# Start development server
pnpm run dev
```

### Docker Deployment

```bash
docker run -p 8080:8080 bloopai/vibe-kanban
```

## Key Features

### 1. Parallel Agent Execution

Run multiple AI agents simultaneously without conflicts:

```mermaid
flowchart LR
    subgraph Tasks["Parallel Tasks"]
        T1[Task: Fix Auth Bug]
        T2[Task: Add Dark Mode]
        T3[Task: Optimize DB]
    end

    subgraph Agents["Different Agents"]
        A1[Claude Code]
        A2[Gemini CLI]
        A3[Codex]
    end

    subgraph Worktrees["Isolated Execution"]
        W1[Worktree 1]
        W2[Worktree 2]
        W3[Worktree 3]
    end

    T1 --> A1 --> W1
    T2 --> A2 --> W2
    T3 --> A3 --> W3

    style Tasks fill:#ffecb3
    style Agents fill:#c8e6c9
    style Worktrees fill:#b3e5fc
```

### 2. Code Review Interface

- Line-by-line diff visualization
- Comment and feedback system
- Direct feedback to agents
- Approve/reject changes

### 3. Real-time Monitoring

- Live execution logs
- Progress streaming
- Pause/resume/stop controls
- Step-by-step visibility

### 4. GitHub Integration

- Automated PR creation
- Branch management
- Rebase conflict resolution
- Direct merge support

## Ecosystem Integration

```mermaid
graph TB
    subgraph IDE["IDE Extensions"]
        VSC[VS Code]
        Cursor[Cursor]
        Windsurf[Windsurf]
    end

    subgraph VK["Vibe Kanban"]
        Core[Core Platform]
    end

    subgraph VCS["Version Control"]
        GitHub[GitHub]
        GitLab[GitLab]
    end

    subgraph Analytics["Analytics"]
        PostHog[PostHog]
    end

    subgraph MCP["MCP Ecosystem"]
        Desktop[Claude Desktop]
        Ray[Raycast]
    end

    IDE --> Core
    Core --> VCS
    Core --> Analytics
    Core --> MCP

    style IDE fill:#e3f2fd
    style VK fill:#fff3e0
    style VCS fill:#e8f5e9
    style Analytics fill:#f3e5f5
    style MCP fill:#fce4ec
```

## Key Facts (2025-2026)

- **GitHub Stars**: 14.3k+ stars
- **Contributors**: 40+ contributors
- **Releases**: 150+ releases (v0.0.146 as of Jan 2026)
- **License**: Apache 2.0 (open source)
- **Languages**: ~51% Rust, ~46% TypeScript
- **Architecture**: Local-first, privacy-focused
- **Cost**: Free and open source (you only pay for AI agent APIs)

## Use Cases

### 1. Feature Development at Scale

Run multiple agents in parallel working on different features:
- Agent 1: Implements backend API
- Agent 2: Creates frontend components
- Agent 3: Writes tests

### 2. Bug Fixing Sprints

Assign multiple bugs to different agents simultaneously:
- Each bug gets isolated worktree
- No conflicts between fixes
- Merge when each is verified

### 3. Code Refactoring

Distribute refactoring tasks across agents:
- One agent per module/component
- Isolated changes prevent cascading conflicts
- Review and merge incrementally

### 4. Research & Exploration

Use agents to explore solutions in parallel:
- Different approaches to same problem
- Compare results before choosing
- Delete unused worktrees

## Security Considerations

| Aspect | Implementation |
|--------|----------------|
| **Local-First** | Runs entirely on your machine |
| **No Code Upload** | Code never sent to external servers |
| **Git Isolation** | Each agent in separate worktree |
| **MCP Local Only** | MCP server accessible only locally |
| **Permission Control** | Agent sandbox permissions configurable |

## Comparison with Direct Agent Usage

| Feature | Direct Agent | With Vibe Kanban |
|---------|--------------|------------------|
| Parallel execution | Manual worktree setup | Automatic isolation |
| Task tracking | Memory/notes | Visual Kanban board |
| Code review | Terminal diff | Visual diff interface |
| Agent switching | Restart session | One-click switch |
| MCP configuration | Per-agent setup | Centralized config |
| Progress monitoring | Terminal watching | Real-time dashboard |

## Resources

- **GitHub**: [BloopAI/vibe-kanban](https://github.com/BloopAI/vibe-kanban)
- **Website**: [vibekanban.com](https://www.vibekanban.com/)
- **Documentation**: [vibekanban.com/docs](https://www.vibekanban.com/docs)
- **NPM Package**: [vibe-kanban](https://www.npmjs.com/package/vibe-kanban)
- **VS Code Extension**: Available in VS Code Marketplace
