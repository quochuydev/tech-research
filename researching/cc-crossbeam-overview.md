# CrossBeam (cc-crossbeam) - Technical Overview

CrossBeam is an AI-powered ADU (Accessory Dwelling Unit) permit assistant for California, built by Mike Brown. It won first place at Anthropic's "Built with Opus 4.6" Global Claude Code Hackathon (Feb 10–16, 2026). The tool reads architectural plans, interprets city corrections letters, cross-references California state law, and produces a professional response package ready for resubmission.

Notably, the entire project was built with Claude Code by a personal injury lawyer with no traditional software engineering background — a canonical example of "skills-first" AI-assisted development.

## High-Level Architecture

```mermaid
graph TB
    User[Contractor / City Staff]
    FE[Next.js 16 Frontend<br/>React 19 · shadcn/ui · Tailwind 4]
    API[Express 5 Orchestrator<br/>Cloud Run — persistent process]
    Sandbox[Vercel Sandbox<br/>Isolated ephemeral env]
    Agent[Claude Opus 4.6<br/>Agent SDK + claude_code preset]
    Skills[(Skills Library<br/>13+ skill packs, 28+ reference files)]
    Supa[(Supabase<br/>Postgres + Realtime + Storage)]
    Web[Live Web Search<br/>City municipal code lookup]

    User -->|Upload plans + corrections PDF| FE
    FE <-->|REST API| API
    FE <-->|Realtime status + messages| Supa
    API -->|Launch isolated job| Sandbox
    Sandbox --> Agent
    Agent --> Skills
    Agent -->|WebSearch / WebFetch| Web
    Agent -->|Write artifacts| Supa
    Supa -.->|Push updates| FE

    style Agent fill:#d8a657,color:#000
    style Skills fill:#a9b665,color:#000
    style Sandbox fill:#7daea3,color:#000
    style Supa fill:#ea6962,color:#fff
```

## How It Works — Corrections Flow

The primary flow is a two-phase process with a human-in-the-loop pause.

```mermaid
sequenceDiagram
    participant C as Contractor
    participant FE as Next.js UI
    participant CR as Cloud Run Orchestrator
    participant SB as Vercel Sandbox (Agent)
    participant Sk as Skills + State Law
    participant W as City Website

    C->>FE: Upload plans PDF + corrections letter
    FE->>CR: POST /job (plans, letter, address)
    CR->>SB: Launch sandbox with Agent SDK
    Note over SB: PHASE 1 (~4-5 min)
    SB->>SB: Vision: read each plan sheet
    SB->>SB: Build sheet manifest
    SB->>SB: Parse each correction item
    SB->>Sk: Cross-reference Gov Code 66310-66342
    SB->>W: WebSearch city municipal code
    SB->>SB: Dispatch 3 parallel sub-agents per correction
    SB-->>FE: Realtime messages via Supabase
    SB->>C: PAUSE — present clarifying questions

    C->>SB: Answer questions (or "use mock answers")

    Note over SB: PHASE 2 (~2 min)
    SB->>SB: Merge answers + Phase 1 research
    SB->>SB: Generate 4 deliverables
    SB-->>FE: response_letter.md
    SB-->>FE: professional_scope.md
    SB-->>FE: corrections_report.md
    SB-->>FE: sheet_annotations.json
    FE->>C: Download response package
```

## Key Concepts

**ADU (Accessory Dwelling Unit)**
A secondary housing unit on a single-family or multifamily residential lot. California's 2017+ laws (Gov Code 66310–66342) aggressively mandate ministerial approval to boost housing supply — but cities still reject 90%+ of first submissions on bureaucratic technicalities.

**Skills-First Design**
Instead of hardcoding domain knowledge into prompts or fine-tuning, CrossBeam uses **Claude Code skills** — structured directories of reference markdown files, decision trees, and quick-reference tables that teach Claude about a specific domain. The agent loads the relevant skill, and its behavior becomes domain-expert-grade without model changes.

**Parallel Sub-Agents**
Each distinct correction item is handled by a dedicated sub-agent. Three run in parallel (for sheet review, code research, and verification). This collapses what would be a 2-hour sequential task into ~20 minutes.

**Spatial Index of Plan Sheets**
Before answering any question, the agent first reads every plan page using Claude Opus 4.6 vision and builds a **sheet manifest** — a map of which sheet contains which information (site plan, floor plan, electrical, Title 24, etc.). All downstream reasoning references this index.

**Decision Tree Router**
The California ADU skill includes a router: `lot type → construction type → modifiers → process`. This narrows the applicable subset of state law before any LLM reasoning happens, keeping context windows focused.

**Long-Running Agent Problem**
Agent runs take 10–30 minutes. Vercel serverless functions time out at 60–300 seconds, so CrossBeam needed Cloud Run for a persistent orchestrator process plus Vercel Sandbox for the isolated filesystem the Agent SDK requires.

## Technical Details

### The Skills Library

```mermaid
graph LR
    A[Agent SDK<br/>claude_code preset]

    subgraph Domain[Domain Skills]
        CA[california-adu<br/>28 files · 54-page handbook<br/>Gov Code 66310-66342]
        CI[adu-corrections-interpreter<br/>Multi-step workflow]
        CR[adu-city-research<br/>3-mode research]
    end

    subgraph Ops[Ops & Platform Skills]
        OPS[crossbeam-ops<br/>Operate deployed system]
        LRA[long-running-agent<br/>Long-job patterns]
        DOC[document-skills<br/>PDF extraction]
    end

    subgraph UI[UI/UX Skills]
        FD[frontend-design]
        SH[shadcn]
        RBP[react-best-practices]
    end

    subgraph Media[Media Skills]
        FAL[fal-ai]
        NB[nano-banana]
        PDV[product-demo-video]
    end

    A --> Domain
    A --> Ops
    A --> UI
    A --> Media

    style Domain fill:#a9b665,color:#000
    style Ops fill:#7daea3,color:#000
    style UI fill:#d3869b,color:#000
    style Media fill:#e78a4e,color:#000
```

### Three Research Modes for City Rules

The `adu-city-research` skill tries three modes in order:

1. **WebSearch discovery** — find the city's ADU ordinance page
2. **WebFetch extraction** — pull text directly from the page
3. **Browser fallback** — for cities with JavaScript-heavy or PDF-only sites

### Deliverables Produced (Phase 2)

| File | Purpose |
|------|---------|
| `response_letter.md` | Professional letter to the city building department |
| `professional_scope.md` | Work breakdown for the design team / engineer |
| `corrections_report.md` | Status dashboard with per-item checklists |
| `sheet_annotations.json` | Per-sheet markup instructions (where to redline) |

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, shadcn/ui, Tailwind CSS 4 |
| Orchestrator | Express 5 on Google Cloud Run |
| Agent Runtime | Vercel Sandbox (ephemeral, filesystem-enabled) |
| Model + Framework | Claude Opus 4.6 via Agent SDK, `claude_code` preset |
| Data | Supabase (Postgres, Realtime, Storage) |
| Dev Tooling | Claude Code (entire project authored via Claude Code) |

## Ecosystem / Participants

```mermaid
graph TB
    subgraph Users[End Users]
        Contractor[Contractors / Designers<br/>Submit & respond to corrections]
        City[City Plan Checkers<br/>Buena Park pilot]
        Homeowner[Homeowners<br/>Indirect beneficiaries]
    end

    subgraph Authority[Authority & Data Sources]
        HCD[CA HCD<br/>ADU Handbook 2026 · 54 pages]
        GC[California Gov Code<br/>66310-66342]
        Muni[City Municipal Codes<br/>per-city ordinances]
    end

    subgraph Platform[CrossBeam Platform]
        App[CrossBeam App]
        Skills[Skills Library]
    end

    subgraph Infra[Infrastructure Providers]
        Anthropic[Anthropic<br/>Claude Opus 4.6 + Agent SDK]
        Vercel[Vercel<br/>Frontend + Sandbox]
        GCP[Google Cloud Run<br/>Orchestrator]
        Supabase[Supabase<br/>DB + Realtime + Storage]
    end

    Contractor --> App
    City --> App
    App --> Skills
    Skills -.loaded from.-> HCD
    Skills -.loaded from.-> GC
    App -.live lookup.-> Muni

    App --> Anthropic
    App --> Vercel
    App --> GCP
    App --> Supabase

    Homeowner -.benefits.-> Contractor
    Homeowner -.benefits.-> City

    style Platform fill:#d8a657,color:#000
    style Authority fill:#a9b665,color:#000
    style Infra fill:#7daea3,color:#000
```

## Key Facts (2026)

- **Winner** of Anthropic's *Built with Opus 4.6* Claude Code Hackathon — Feb 10–16, 2026
- **~13,000 applicants** to the hackathon; **500 selected** builders; Mike Brown finished first
- Built in **6 days** by a solo non-developer (lawyer) using Claude Code — *"didn't write a single line of code"*
- Targets California's **90%+ ADU permit rejection rate** on first submission
- **$30,000** — average cost of a typical 6-month permit delay for a homeowner
- **429,000+** ADU permits issued in California since 2018
- **Buena Park, CA** (pilot interest) — must permit **8,900+ housing units by 2029**, only issued ~120 in 2024
- **End-to-end run time**: ~20 minutes (Phase 1 ≈ 4–5 min, Phase 2 ≈ 2 min, plus human pause)
- **28+ reference files** in the California ADU skill alone covering HCD Handbook + Gov Code 66310–66342
- **13 custom skills** across domain, ops, UI, and media
- **Repo**: 212 stars, 76 forks (as of 2026-04-23), Python-majority, MIT licensed
- Ships with two additional flow modes: a local-only Claude Code demo (no server, no Supabase) and a **city-side** flow that generates draft corrections letters

## Use Cases

- **Contractor corrections response** — the primary flow; upload plans + corrections letter, get a submission-ready response package
- **Pre-submission permit checklist** — enter address + ADU parameters, get a city-specific checklist before drafting
- **City plan review (pilot)** — cities upload incoming submissions; CrossBeam flags missing signatures, forms, and citations before a human checker touches them, and drafts the corrections letter
- **Local Claude Code demo mode** — `DEMO.md` shows how to run the full pipeline locally with only Claude Code + skills (no Cloud Run, no Supabase, no sandbox) — useful as a reference for skills-first agent design
- **Template for long-running agent apps** — the Cloud Run + Vercel Sandbox + Supabase Realtime pattern generalizes to any job that exceeds serverless timeout limits

## Security & Considerations

- **Document sensitivity**: architectural plans may contain homeowner addresses, structural details, and owner names. Supabase Storage RLS policies and signed URLs are the security boundary for uploaded PDFs.
- **Sandbox isolation**: each agent job runs in an ephemeral Vercel Sandbox, preventing cross-job data leakage through the Agent SDK's filesystem.
- **Authority vs. assistance**: CrossBeam generates drafts — it does **not** replace a licensed engineer's stamp. Output is explicitly designed to be reviewed and signed before resubmission.
- **City-side bias risk**: if municipalities adopt the city-pre-screening flow, automated rejections could amplify existing permit bias. The README positions this flow as open-source and intentionally unbuilt, inviting scrutiny before adoption.
- **Web research freshness**: municipal codes change; the `adu-city-research` skill relies on live WebSearch/WebFetch, so output quality depends on whether city pages are current. No caching layer is documented.
- **Model cost**: 20-minute Opus 4.6 runs with vision over 15+ plan sheets are token-heavy. Production deployment should budget for per-job costs in the several-dollar range.
- **Jurisdictional scope**: explicitly California-only. Other states' ADU laws differ substantially; the decision tree router would need re-authoring for reuse.

## Sources

- [GitHub: mikeOnBreeze/cc-crossbeam](https://github.com/mikeOnBreeze/cc-crossbeam)
- [Meet the winners of our Built with Opus 4.6 Claude Code hackathon — Anthropic](https://claude.com/blog/meet-the-winners-of-our-built-with-opus-4-6-claude-code-hackathon)
- [A lawyer, a road inspector and a cardiologist walk into a coding competition — Digital Digging](https://www.digitaldigging.org/p/a-lawyer-a-road-inspector-and-a-cardiologist)
- [The Lawyer Who Won — HadleyLab](https://hadleylab.org/blogs/2026-03-22-the-lawyer-who-won)
- [Claude Hackathon Winners: 5 Non-Coder Apps in One Week — Medium](https://medium.com/coding-nexus/claude-hackathon-winners-5-non-coder-apps-in-one-week-736425986774)
