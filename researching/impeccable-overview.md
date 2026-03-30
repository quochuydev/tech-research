# Impeccable - Technical Overview

> The design language that makes your AI harness better at design.
> — Paul Bakaus ([@pbakaus](https://github.com/pbakaus))

**Repository**: [github.com/pbakaus/impeccable](https://github.com/pbakaus/impeccable) | **Website**: [impeccable.style](https://impeccable.style) | **Stars**: 10.2k | **License**: Apache 2.0

---

## The Problem It Solves

Every LLM was trained on the same generic templates. Without guidance, AI-generated UI defaults to predictable "AI slop": Inter font everywhere, purple-to-blue gradients, cards nested in cards, gray text on colored backgrounds, and dated bounce animations. Impeccable injects design domain expertise into AI coding assistants to break those defaults.

---

## High-Level Architecture

```mermaid
graph TB
    subgraph Source["Source (Single Truth)"]
        SC[source/commands/*.md]
        SS[source/skills/*.md]
    end

    subgraph Build["Build System (Bun)"]
        BS[build.js]
        TX[transformers/index.js]
        TC[transformers/cursor.js]
        TCC[transformers/claude-code.js]
        TG[transformers/gemini.js]
        TCX[transformers/codex.js]
    end

    subgraph Dist["dist/ (Committed Output)"]
        DC[".cursor/"]
        DCC[".claude/"]
        DG[".gemini/"]
        DCX[".codex/"]
    end

    subgraph Providers["AI Harnesses"]
        P1[Cursor]
        P2[Claude Code]
        P3[Gemini CLI]
        P4[Codex CLI]
        P5[VS Code Copilot]
        P6[OpenCode / Kiro / Pi]
    end

    SC --> BS
    SS --> BS
    BS --> TX
    TX --> TC --> DC --> P1
    TX --> TCC --> DCC --> P2
    TX --> TG --> DG --> P3
    TX --> TCX --> DCX --> P4
    DCC --> P5
    DCC --> P6

    style Source fill:#1a1a2e,color:#e0e0ff
    style Build fill:#16213e,color:#e0e0ff
    style Dist fill:#0f3460,color:#e0e0ff
    style Providers fill:#533483,color:#e0e0ff
```

---

## How It Works

```mermaid
sequenceDiagram
    participant User
    participant AIHarness as AI Harness (Cursor/Claude)
    participant Skill as frontend-design skill
    participant Command as Design Command

    User->>AIHarness: /onboard (first time)
    AIHarness->>Skill: Load skill context
    Skill-->>AIHarness: Design principles + anti-patterns
    AIHarness->>User: Ask: audience, use case, brand personality
    User-->>AIHarness: Provide context
    AIHarness->>AIHarness: Write .impeccable.md to project root

    Note over User,AIHarness: Future sessions auto-load .impeccable.md

    User->>AIHarness: /audit header
    AIHarness->>Command: Invoke /audit command
    Command->>Skill: Load frontend-design context
    Skill-->>Command: Typography, color, motion, spacing rules
    AIHarness->>AIHarness: Scan component against rules
    AIHarness-->>User: Report: issues, severity, recommendations

    User->>AIHarness: /polish checkout-form
    AIHarness->>Command: Invoke /polish command
    Command->>Skill: Load all 7 domain reference files
    AIHarness-->>User: Refined component code
```

---

## Skill System: The Core Knowledge Base

The single `frontend-design` skill is split into 7 domain-specific reference files loaded as context:

```mermaid
graph LR
    FD[frontend-design<br/>Master Skill]

    FD --> TY[Typography<br/>Font pairing, modular scales,<br/>OpenType, FOUT prevention,<br/>fluid type with clamp]
    FD --> CC[Color & Contrast<br/>OKLCH color space, tinted<br/>neutrals, dark mode,<br/>accessibility ratios]
    FD --> SP[Spatial Design<br/>Spacing systems, grid<br/>hierarchy, visual rhythm]
    FD --> MO[Motion Design<br/>Easing curves, staggering,<br/>reduced motion,<br/>purposeful animation]
    FD --> IX[Interaction Design<br/>Forms, focus states,<br/>loading patterns,<br/>error feedback]
    FD --> RD[Responsive Design<br/>Mobile-first, fluid<br/>design, container queries]
    FD --> UX[UX Writing<br/>Labels, error messages,<br/>empty states, microcopy]

    style FD fill:#533483,color:#fff
    style TY fill:#1a1a2e,color:#e0e0ff
    style CC fill:#1a1a2e,color:#e0e0ff
    style SP fill:#1a1a2e,color:#e0e0ff
    style MO fill:#1a1a2e,color:#e0e0ff
    style IX fill:#1a1a2e,color:#e0e0ff
    style RD fill:#1a1a2e,color:#e0e0ff
    style UX fill:#1a1a2e,color:#e0e0ff
```

---

## 20 Design Commands

```mermaid
graph TB
    subgraph Audit["Audit & Review"]
        A1["/audit — Comprehensive UI quality check<br/>accessibility, performance, theming, responsive"]
        A2["/critique — Opinionated design feedback"]
        A3["/normalize — Standardize inconsistencies"]
    end

    subgraph Enhance["Enhance & Transform"]
        E1["/polish — Final refinement pass"]
        E2["/animate — Add purposeful motion & micro-interactions"]
        E3["/colorize — Improve color palette and usage"]
        E4["/bolder — Increase visual confidence"]
        E5["/overdrive — Push design to its limits"]
        E6["/delight — Inject surprise & joy details"]
    end

    subgraph Refine["Refine & Simplify"]
        R1["/distill — Strip to essentials"]
        R2["/clarify — Improve readability and clarity"]
        R3["/quieter — Reduce visual noise"]
        R4["/optimize — Performance & efficiency"]
        R5["/harden — Resilience and edge cases"]
    end

    subgraph Specialized["Specialized"]
        S1["/typeset — Typography-focused refinement"]
        S2["/arrange — Layout and spatial improvements"]
        S3["/extract — Pull out reusable components"]
        S4["/adapt — Cross-platform/screen adaptation"]
        S5["/onboard — Initialize .impeccable.md context"]
        S6["/teach-impeccable — Explain the system"]
    end

    style Audit fill:#0f3460,color:#e0e0ff
    style Enhance fill:#533483,color:#e0e0ff
    style Refine fill:#16213e,color:#e0e0ff
    style Specialized fill:#1a1a2e,color:#e0e0ff
```

**Usage examples:**
```bash
/audit header              # Check a specific component
/polish checkout-form      # Final refinement
/animate hero-section      # Add motion to hero
/i-polish checkout-form    # Use /i- prefix to avoid naming conflicts
```

---

## Provider Transformation System

```mermaid
classDiagram
    class SourceFile {
        +YAML frontmatter
        +name: string
        +description: string
        +args: Argument[]
        +body: string
    }

    class CursorOutput {
        +body only (no frontmatter)
        +Agent Skills standard
        +Requires nightly channel
    }

    class ClaudeCodeOutput {
        +Full YAML frontmatter
        +Matches Anthropic Skills spec
        +Auto-loaded via .claude/
    }

    class GeminiOutput {
        +TOML format
        +Modular @file.md imports
        +Root-level GEMINI.md
    }

    class CodexOutput {
        +Custom prompts
        +$ARGNAME variable syntax
        +/prompts:name invocation
    }

    SourceFile --> CursorOutput : cursor.js transformer
    SourceFile --> ClaudeCodeOutput : claude-code.js transformer
    SourceFile --> GeminiOutput : gemini.js transformer
    SourceFile --> CodexOutput : codex.js transformer
```

---

## Anti-Pattern Library (Key Innovation)

Unlike typical design guides that say what *to* do, Impeccable bakes explicit "DO NOT" constraints directly into model context:

```mermaid
graph LR
    subgraph Typography["Typography Anti-Patterns"]
        T1["❌ Arial / Inter / system-ui defaults"]
        T2["❌ Fonts that don't pair intentionally"]
        T3["❌ Fluid type where it's wrong choice"]
    end

    subgraph Color["Color Anti-Patterns"]
        C1["❌ AI palette: cyan-on-dark, purple-blue gradients"]
        C2["❌ Gray text on colored backgrounds"]
        C3["❌ Pure black #000 or pure white #fff"]
        C4["❌ Neon accents on dark backgrounds"]
    end

    subgraph Layout["Layout Anti-Patterns"]
        L1["❌ Cards nested in cards"]
        L2["❌ Excessive shadows on everything"]
        L3["❌ Inconsistent spacing rhythm"]
    end

    subgraph Motion["Motion Anti-Patterns"]
        M1["❌ Bounce / elastic easing (dated)"]
        M2["❌ Animations without reduced-motion support"]
        M3["❌ Motion without purpose"]
    end

    style Typography fill:#3d0c11,color:#ffcdd2
    style Color fill:#1a0533,color:#e1bee7
    style Layout fill:#0d2137,color:#b3e5fc
    style Motion fill:#0d3320,color:#c8e6c9
```

---

## Ecosystem & Supported Platforms

```mermaid
graph TB
    IMP[Impeccable]

    subgraph Editors["Code Editors"]
        CU[Cursor<br/>Nightly channel required]
        VSC[VS Code Copilot]
    end

    subgraph CLIs["CLI Tools"]
        CC[Claude Code<br/>claude.ai/code]
        GC[Gemini CLI]
        CDX[Codex CLI]
        OC[OpenCode]
    end

    subgraph Others["Other Platforms"]
        PI[Pi]
        KI[Kiro]
        AG[Antigravity]
    end

    subgraph Install["Installation"]
        NPX["npx skills add pbakaus/impeccable<br/>(auto-detects harness)"]
        PLUG["/plugin marketplace add<br/>pbakaus/impeccable"]
        ZIP["Universal ZIP download<br/>(manual)"]
    end

    IMP --> Editors
    IMP --> CLIs
    IMP --> Others
    IMP --> Install

    style IMP fill:#533483,color:#fff
    style Editors fill:#1a1a2e,color:#e0e0ff
    style CLIs fill:#0f3460,color:#e0e0ff
    style Others fill:#16213e,color:#e0e0ff
    style Install fill:#0d3320,color:#c8e6c9
```

---

## Build System Architecture

```mermaid
graph LR
    subgraph Scripts["scripts/ directory"]
        BJ[build.js<br/>~50 lines orchestrator]
        UT[utils.js<br/>parseFrontmatter<br/>readSourceFiles<br/>writeFile]
        TR[transformers/index.js<br/>registry]
    end

    subgraph Transformers["transformers/"]
        TC[cursor.js<br/>30-85 lines]
        TCC[claude-code.js<br/>30-85 lines]
        TG[gemini.js<br/>30-85 lines]
        TCX[codex.js<br/>30-85 lines]
    end

    BJ --> UT
    BJ --> TR
    TR --> TC
    TR --> TCC
    TR --> TG
    TR --> TCX

    style Scripts fill:#16213e,color:#e0e0ff
    style Transformers fill:#0f3460,color:#e0e0ff
```

**Run**: `bun run build` — 2-4x faster than Node.js with zero config

---

## Key Facts (March 2026)

- **Released**: February 2026 (v1.0), latest v1.5.1
- **GitHub Stars**: 10.2k (trending rapidly after March 2026 launch)
- **Forks**: 394
- **Commits**: 182
- **Language mix**: JavaScript 53.4%, CSS 27.8%, HTML 18.8%
- **License**: Apache 2.0 (builds on Anthropic's original frontend-design skill)
- **Install command**: `npx skills add pbakaus/impeccable`
- **Context file**: `.impeccable.md` — auto-saved project design context
- **Platforms**: 9 supported AI harnesses
- **Commands**: 20 design-specific slash commands
- **Skill domains**: 7 (typography, color, space, motion, interaction, responsive, UX writing)

---

## Use Cases

| Scenario | Commands Used |
|----------|---------------|
| New project design setup | `/onboard` → saves brand/audience context |
| UI quality review before shipping | `/audit`, `/critique` |
| Adding animations to existing UI | `/animate` |
| Typography deep-dive | `/typeset` |
| Reducing visual clutter | `/distill`, `/quieter` |
| Making design more confident | `/bolder`, `/overdrive` |
| Extracting reusable components | `/extract` |
| Cross-device adaptation | `/adapt` |
| Final production polish | `/polish`, `/harden` |
| Learning the system | `/teach-impeccable` |

---

## Technical Considerations

### Context Management
- `.impeccable.md` is automatically loaded in every session — keep it concise
- The 7 domain reference files load as context; large skill files affect token usage
- Gemini uses native `@file.md` import syntax for modular context loading

### Naming Conflicts
- Use `/i-` prefix variants (e.g., `/i-polish`) to avoid conflicts with other commands in the same project

### Provider Constraints
- Cursor requires the **Nightly channel** with Agent Skills enabled
- The `dist/` folder is committed so users can copy files without needing build tools
- Never edit `dist/` directly — always edit `source/` and rebuild

### Design Philosophy
- **Anti-patterns are first-class citizens** — explicit "don't" constraints are as valuable as "do" guidance
- **One source of truth** — the transformer architecture ensures all providers stay in sync
- **Vanilla JS + Bun** — no framework complexity for the website/build tooling
- **OKLCH colors** — modern color space for better perceptual uniformity in design tokens

---

## Repository Structure

```
impeccable/
├── source/
│   ├── commands/     # 20 .md files with YAML frontmatter
│   └── skills/       # frontend-design + 7 domain reference files
├── dist/
│   ├── .cursor/
│   ├── .claude/      # skills/ and commands/
│   ├── .gemini/
│   └── .codex/
├── scripts/
│   ├── build.js
│   ├── utils.js
│   └── transformers/
├── functions/        # Vercel/Cloudflare edge functions
├── public/           # Website assets
├── server/           # Local dev server (Bun)
├── tests/
├── CLAUDE.md
├── AGENTS.md
└── wrangler.toml     # Cloudflare Workers config
```

---

Sources:
- [GitHub - pbakaus/impeccable](https://github.com/pbakaus/impeccable)
- [impeccable.style](https://impeccable.style/)
- [Skills and Commands Catalog - DeepWiki](https://deepwiki.com/pbakaus/impeccable/2.3-skills-and-commands-catalog)
- [The frontend-design Skill - DeepWiki](https://deepwiki.com/pbakaus/impeccable/2.2-the-frontend-design-skill)
- [Impeccable - Claude Code Plugin Hub](https://www.claudepluginhub.com/plugins/pbakaus-impeccable)
- [AGENTS.md - pbakaus/impeccable](https://github.com/pbakaus/impeccable/blob/main/AGENTS.md)
