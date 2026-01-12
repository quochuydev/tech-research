# Agent Skills (agentskills.io) - Technical Overview

## Overview

Agent Skills is an open standard developed by Anthropic for packaging reusable, modular capabilities that AI agents can discover and load dynamically. Skills are folders containing instructions, scripts, and resources that transform general-purpose AI agents into specialized agents capable of performing specific tasks consistently and efficiently.

Released as an open standard on December 18, 2025, Agent Skills has been rapidly adopted across major AI development platforms including GitHub Copilot, VS Code, Cursor, OpenAI Codex, and many others.

## High-Level Architecture

```mermaid
flowchart TB
    subgraph SkillPackage["Skill Package (Filesystem)"]
        direction TB
        SM[SKILL.md<br/>Metadata + Instructions]
        SC[scripts/<br/>Executable Code]
        RF[references/<br/>Documentation]
        AS[assets/<br/>Templates & Files]
    end

    subgraph AgentRuntime["Agent Runtime"]
        direction TB
        SD[Skill Discovery<br/>Metadata Scanning]
        SA[Skill Activation<br/>Pattern Matching]
        SL[Skill Loading<br/>Progressive Disclosure]
        SE[Skill Execution<br/>Tool Integration]
    end

    subgraph AIAgent["AI Agent"]
        direction TB
        SP[System Prompt<br/>~100 tokens/skill]
        CW[Context Window]
        TE[Tool Execution]
    end

    SkillPackage --> AgentRuntime
    AgentRuntime --> AIAgent

    style SkillPackage fill:#e3f2fd
    style AgentRuntime fill:#fff8e1
    style AIAgent fill:#f3e5f5
```

## Progressive Disclosure Architecture

```mermaid
sequenceDiagram
    participant User
    participant Agent
    participant SkillSystem
    participant Filesystem

    Note over Agent,SkillSystem: Startup Phase
    Agent->>SkillSystem: Load installed skills
    SkillSystem->>Filesystem: Read SKILL.md frontmatter
    Filesystem-->>SkillSystem: name, description (~100 tokens each)
    SkillSystem-->>Agent: Skill metadata in system prompt

    Note over User,Agent: Runtime Phase
    User->>Agent: Task request
    Agent->>Agent: Match request to skill descriptions

    alt Skill Match Found
        Agent->>SkillSystem: Activate skill
        SkillSystem->>Filesystem: Load SKILL.md body (<5000 tokens)
        Filesystem-->>Agent: Full instructions

        opt Resources Needed
            Agent->>Filesystem: Load references/scripts as needed
            Filesystem-->>Agent: Additional context
        end

        Agent->>Agent: Execute with skill context
    else No Match
        Agent->>Agent: Process with base capabilities
    end

    Agent-->>User: Response
```

## SKILL.md File Structure

```mermaid
flowchart LR
    subgraph Frontmatter["YAML Frontmatter"]
        direction TB
        REQ[Required Fields]
        OPT[Optional Fields]

        REQ --> N[name: skill-identifier]
        REQ --> D[description: when to use]

        OPT --> L[license: MIT]
        OPT --> C[compatibility: requirements]
        OPT --> M[metadata: key-value pairs]
        OPT --> AT[allowed-tools: tool list]
    end

    subgraph Body["Markdown Body"]
        direction TB
        INST[Instructions<br/>What to do & how]
        EX[Examples<br/>Usage patterns]
        GL[Guidelines<br/>Best practices]
        REF[References<br/>Links to resources]
    end

    Frontmatter --> Body

    style Frontmatter fill:#e8f5e9
    style Body fill:#fce4ec
```

### SKILL.md Example

```yaml
---
name: code-review
description: Reviews code for quality, security, and best practices.
  Use when asked to review pull requests, code changes, or assess code quality.
license: MIT
compatibility: Requires access to file system tools
---

# Code Review Skill

Review code changes systematically for quality, security, and adherence to best practices.

## Process

1. Understand the context and purpose of the changes
2. Review for logical correctness
3. Check for security vulnerabilities
4. Assess code style and maintainability
5. Provide actionable feedback

## Guidelines

- Be constructive and specific
- Prioritize critical issues over style preferences
- Include examples when suggesting improvements
```

## Skill Directory Structure

```mermaid
graph TB
    subgraph SkillRoot["my-skill/"]
        SM["SKILL.md<br/>(Required)"]

        subgraph Scripts["scripts/"]
            S1[extract.py]
            S2[transform.sh]
            S3[validate.py]
        end

        subgraph References["references/"]
            R1[api-docs.md]
            R2[examples.md]
            R3[glossary.md]
        end

        subgraph Assets["assets/"]
            A1[templates/]
            A2[schemas/]
            A3[images/]
        end
    end

    SM --> Scripts
    SM --> References
    SM --> Assets

    style SM fill:#ffcdd2
    style Scripts fill:#c8e6c9
    style References fill:#bbdefb
    style Assets fill:#fff9c4
```

## Progressive Disclosure Levels

```mermaid
flowchart TB
    subgraph L1["Level 1: Metadata (~100 tokens)"]
        direction LR
        M1[name]
        M2[description]
        M3[Always loaded at startup]
    end

    subgraph L2["Level 2: Instructions (<5,000 tokens)"]
        direction LR
        I1[SKILL.md body]
        I2[Core instructions]
        I3[Loaded when activated]
    end

    subgraph L3["Level 3: Resources (Variable)"]
        direction LR
        R1[scripts/]
        R2[references/]
        R3[assets/]
        R4[Loaded on-demand]
    end

    L1 --> |Skill triggered| L2
    L2 --> |Resources needed| L3

    style L1 fill:#c8e6c9
    style L2 fill:#fff9c4
    style L3 fill:#ffcdd2
```

## Ecosystem & Adoption

```mermaid
flowchart TB
    subgraph Standard["Open Standard"]
        SPEC[Agent Skills Specification<br/>agentskills.io]
        SDK[Reference SDK<br/>skills-ref Python library]
        REPO[GitHub Repository<br/>agentskills/agentskills]
    end

    subgraph Adopters["Platform Adopters"]
        direction TB
        subgraph Anthropic["Anthropic"]
            CC[Claude Code]
            CA[Claude.ai]
            CS[Claude SDK]
        end

        subgraph Microsoft["Microsoft"]
            VSC[VS Code]
            GHC[GitHub Copilot]
        end

        subgraph Other["Other Platforms"]
            CUR[Cursor]
            COD[OpenAI Codex]
            AMP[Amp]
            GOS[Goose]
            LET[Letta]
            OC[OpenCode]
        end
    end

    subgraph Partners["Partner Skills"]
        ATL[Atlassian]
        FIG[Figma]
        CAN[Canva]
        STR[Stripe]
        NOT[Notion]
        ZAP[Zapier]
        SEN[Sentry]
        CFL[Cloudflare]
    end

    Standard --> Adopters
    Partners --> Standard

    style Standard fill:#e3f2fd
    style Adopters fill:#f3e5f5
    style Partners fill:#e8f5e9
```

## Skills vs MCP Comparison

```mermaid
flowchart LR
    subgraph Skills["Agent Skills"]
        direction TB
        SK1[Teaches HOW<br/>to perform tasks]
        SK2[Markdown files<br/>Simple format]
        SK3[Progressive loading<br/>Token efficient]
        SK4[Portable across<br/>platforms]
    end

    subgraph MCP["Model Context Protocol"]
        direction TB
        MC1[Provides WHAT<br/>data/tools needed]
        MC2[Server implementation<br/>Complex setup]
        MC3[Real-time connections<br/>External systems]
        MC4[Centralized<br/>governance]
    end

    subgraph UseCase["When to Use"]
        direction TB
        U1[Skills: Repeatable<br/>workflows & behaviors]
        U2[MCP: External APIs<br/>& data sources]
    end

    Skills --> UseCase
    MCP --> UseCase

    style Skills fill:#c8e6c9
    style MCP fill:#bbdefb
    style UseCase fill:#fff9c4
```

## Meta-Tool Architecture

```mermaid
flowchart TB
    subgraph SkillTool["Skill Meta-Tool"]
        direction TB
        ST[skill tool<br/>Container/Dispatcher]
        ST --> |invokes| S1[skill-a]
        ST --> |invokes| S2[skill-b]
        ST --> |invokes| S3[skill-c]
    end

    subgraph Capabilities["Skill Capabilities"]
        direction TB
        C1[Inject Instructions<br/>into context]
        C2[Execute Scripts<br/>deterministically]
        C3[Load References<br/>as needed]
        C4[Modify Environment<br/>dynamically]
    end

    subgraph Tools["Available Tools"]
        direction TB
        T1[File System<br/>Read/Write]
        T2[Bash<br/>Execution]
        T3[Code Interpreter<br/>Python/JS]
    end

    SkillTool --> Capabilities
    Capabilities --> Tools

    style SkillTool fill:#e3f2fd
    style Capabilities fill:#fff8e1
    style Tools fill:#f3e5f5
```

## Key Concepts

### What Are Skills?

Skills are **reusable, filesystem-based resources** that provide AI agents with domain-specific expertise:
- **Workflows**: Step-by-step procedures for complex tasks
- **Context**: Domain knowledge and best practices
- **Scripts**: Executable code for deterministic operations
- **Templates**: Reusable patterns and forms

### Progressive Disclosure

Skills use a **token-efficient loading strategy**:

| Level | Content | Tokens | When Loaded |
|-------|---------|--------|-------------|
| 1 | Metadata (name, description) | ~100 | Always (startup) |
| 2 | SKILL.md body | <5,000 | When skill activated |
| 3+ | Scripts, references, assets | Variable | On-demand |

### Skill vs Prompt

| Aspect | Skills | Prompts |
|--------|--------|---------|
| Persistence | Reusable across conversations | One-time, conversation-level |
| Structure | Organized folders with metadata | Freeform text |
| Discovery | Automatic pattern matching | Manual invocation |
| Resources | Scripts, references, assets | Text only |

## Technical Details

### Required Fields

```yaml
name: my-skill-name          # 1-64 chars, lowercase, hyphens only
description: What it does    # 1-1024 chars, when to use it
```

### Optional Fields

```yaml
license: MIT                           # License identifier
compatibility: Python 3.9+, bash       # Environment requirements (max 500 chars)
metadata:                              # Key-value pairs
  version: "1.0.0"
  author: "Your Name"
allowed-tools: Read Edit Bash          # Pre-approved tools (experimental)
```

### Validation

The `skills-ref` reference library provides validation:

```bash
# Install
pip install skills-ref

# Validate a skill
skills-ref validate ./my-skill

# Read properties (JSON output)
skills-ref read-properties ./my-skill

# Generate system prompt XML
skills-ref to-prompt ./skills-directory
```

## Key Facts (2025)

- **Release Date**: December 18, 2025 (open standard)
- **Repository Stars**: 26k+ on GitHub (anthropics/skills)
- **Platform Adoption**: 10+ major AI platforms
- **Partner Skills**: 8+ enterprise partners at launch
- **Specification Size**: "Deliciously tiny" - readable in minutes
- **Document Skills**: PDF, DOCX, PPTX, XLSX manipulation available

## Available Skill Categories

| Category | Examples |
|----------|----------|
| **Document Manipulation** | PDF forms, Word docs, PowerPoint, Excel |
| **Development** | Code review, testing, MCP server generation |
| **Creative** | Art generation, music, design |
| **Enterprise** | Communications, branding, workflows |
| **Integrations** | Notion, Stripe, Zapier, Atlassian |

## Use Cases

### Individual Developers
- Create personal coding assistants with project-specific knowledge
- Automate repetitive documentation tasks
- Build custom review and testing workflows

### Teams & Organizations
- Share standardized workflows across team members
- Enforce coding standards and best practices
- Create domain-specific AI assistants

### Enterprise
- Deploy skills centrally via admin hub
- Maintain consistent AI behavior across organization
- Integrate with existing tools (Notion, Jira, Stripe, etc.)

### Skill Marketplace
- Discover community-created skills
- Share specialized capabilities
- Build on existing skill templates

## Best Practices

### Skill Design

1. **Keep it focused**: One skill = one capability
2. **Write clear descriptions**: Enable accurate pattern matching
3. **Use progressive disclosure**: Don't front-load all content
4. **Include examples**: Show expected inputs/outputs
5. **Handle errors gracefully**: Provide helpful error messages

### Performance Optimization

1. **Keep SKILL.md under 500 lines** for optimal loading
2. **Split large skills** into multiple focused skills
3. **Use scripts for deterministic operations** (cheaper than token generation)
4. **Reference external files** rather than embedding large content

### Naming Conventions

- Use **gerund form** (verb + -ing) for skill names: `code-reviewing`, `document-creating`
- Use **lowercase with hyphens** for identifiers
- Write **descriptions in third person**: "Reviews code for..." not "Review code for..."

## Security Considerations

- **No credential storage**: Skills should not contain secrets or API keys
- **Script sandboxing**: Executable scripts run in controlled environments
- **User approval**: Skills require user consent before installation
- **Audit trail**: Skill usage can be tracked and monitored
- **Enterprise controls**: Administrators can manage skill deployment

## Resources

- **Official Specification**: [agentskills.io/specification](https://agentskills.io/specification)
- **GitHub Repository**: [github.com/agentskills/agentskills](https://github.com/agentskills/agentskills)
- **Anthropic Skills**: [github.com/anthropics/skills](https://github.com/anthropics/skills)
- **VS Code Integration**: [code.visualstudio.com/docs/copilot/customization/agent-skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
- **Cursor Documentation**: [cursor.com/docs/context/skills](https://cursor.com/docs/context/skills)
- **OpenAI Codex Skills**: [developers.openai.com/codex/skills](https://developers.openai.com/codex/skills)

## Sources

- [Agent Skills Official Site](https://agentskills.io/home)
- [Anthropic Engineering Blog](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [GitHub Copilot Agent Skills Announcement](https://github.blog/changelog/2025-12-18-github-copilot-now-supports-agent-skills/)
- [VentureBeat - Anthropic Launches Enterprise Agent Skills](https://venturebeat.com/ai/anthropic-launches-enterprise-agent-skills-and-opens-the-standard)
- [The New Stack - Agent Skills: Anthropic's Next Bid](https://thenewstack.io/agent-skills-anthropics-next-bid-to-define-ai-standards/)
- [Simon Willison's Blog](https://simonwillison.net/2025/Dec/19/agent-skills/)
- [Claude Skills vs MCP Comparison](https://subramanya.ai/2025/10/30/claude-skills-vs-mcp-a-tale-of-two-ai-customization-philosophies/)
