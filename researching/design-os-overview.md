# Design OS - Technical Overview

## What is Design OS?

Design OS is an open-source product planning and design tool by Builder Methods that bridges the gap between product ideation and AI-powered code implementation. It addresses a fundamental problem in AI development: **coding agents produce suboptimal results when asked to simultaneously determine what to build and construct it**.

The solution: separate design decisions from implementation through a structured, conversational design process that generates complete handoff packages for any AI coding agent.

## High-Level Architecture

```mermaid
graph TB
    subgraph Input["User Input"]
        U1[Product Vision]
        U2[Feature Ideas]
        U3[Design Preferences]
    end

    subgraph DesignOS["Design OS Application"]
        subgraph Planning["Planning Phase"]
            P1[Product Overview]
            P2[Product Roadmap]
            P3[Data Model]
        end

        subgraph Design["Design Phase"]
            D1[Design System<br/>Colors & Typography]
            D2[Application Shell]
            D3[Section Designs]
        end

        subgraph Export["Export Phase"]
            E1[Handoff Package]
            E2[Implementation Prompts]
            E3[Test Specifications]
        end
    end

    subgraph Output["AI Agent Implementation"]
        O1[Claude Code]
        O2[Cursor]
        O3[Copilot]
        O4[Any AI Agent]
    end

    Input --> Planning
    Planning --> Design
    Design --> Export
    Export --> Output

    style Input fill:#e3f2fd
    style DesignOS fill:#fff3e0
    style Planning fill:#e8f5e9
    style Design fill:#f3e5f5
    style Export fill:#fce4ec
    style Output fill:#c8e6c9
```

## The Problem It Solves

```mermaid
flowchart LR
    subgraph Traditional["Traditional AI Development"]
        T1[Describe idea] --> T2[AI builds something]
        T2 --> T3[Misses vision]
        T3 --> T4[Generic UI]
        T4 --> T5[Partial features]
        T5 --> T6[Time spent fixing]
        T6 --> T1
    end

    subgraph DesignOS["Design OS Approach"]
        D1[Define vision] --> D2[Design collaboratively]
        D2 --> D3[Generate spec]
        D3 --> D4[AI implements accurately]
        D4 --> D5[Matches expectations]
    end

    style Traditional fill:#ffebee
    style DesignOS fill:#e8f5e9
```

## Design OS Workflow

```mermaid
flowchart TB
    subgraph Phase1["Phase 1: Product Planning"]
        P1["/product-vision<br/>Define mission & features"]
        P2["/product-roadmap<br/>Break down milestones"]
        P3["/data-model<br/>Design entities & relationships"]

        P1 --> P2 --> P3
    end

    subgraph Phase2["Phase 2: Design System"]
        D1["/design-tokens<br/>Choose colors from Tailwind"]
        D2["/design-tokens<br/>Select typography from Google Fonts"]
        D3["/design-shell<br/>Create app shell & navigation"]

        D1 --> D2 --> D3
    end

    subgraph Phase3["Phase 3: Section Design"]
        S1["/shape-section<br/>Specify requirements"]
        S2["/sample-data<br/>Generate test data & types"]
        S3["/design-screen<br/>Design UI screens"]
        S4["/screenshot-design<br/>Capture visuals"]

        S1 --> S2 --> S3 --> S4
        S4 -->|"Repeat per section"| S1
    end

    subgraph Phase4["Phase 4: Export"]
        E1["/export-product<br/>Generate handoff package"]
        E2["one-shot-prompt.md<br/>Full implementation"]
        E3["section-prompt.md<br/>Incremental implementation"]

        E1 --> E2
        E1 --> E3
    end

    Phase1 --> Phase2
    Phase2 --> Phase3
    Phase3 --> Phase4

    style Phase1 fill:#e3f2fd
    style Phase2 fill:#f3e5f5
    style Phase3 fill:#fff3e0
    style Phase4 fill:#e8f5e9
```

## File Structure

```mermaid
graph TB
    subgraph Root["Design OS Project"]
        subgraph Product["product/<br/>Portable Definitions"]
            PO[product-overview.md]
            PR[product-roadmap.md]
            DM["data-model/<br/>data-model.md"]
            DS["design-system/<br/>colors.json<br/>typography.json"]
            SH["shell/<br/>spec.md"]
            SEC["sections/[name]/<br/>spec.md<br/>data.json<br/>types.ts<br/>*.png"]
        end

        subgraph Src["src/<br/>Design OS React App"]
            Shell["shell/components/<br/>AppShell.tsx<br/>MainNav.tsx<br/>UserMenu.tsx"]
            Sections["sections/[name]/<br/>components/<br/>[ViewName].tsx"]
        end

        subgraph Export["product-plan/<br/>Generated Export"]
            RM[README.md]
            OV[product-overview.md]
            Prompts["prompts/<br/>one-shot-prompt.md<br/>section-prompt.md"]
            Inst["instructions/<br/>one-shot-instructions.md<br/>incremental/"]
            Assets["design-system/<br/>data-model/<br/>shell/<br/>sections/"]
        end
    end

    Product -->|"generates"| Export
    Src -->|"renders"| Product

    style Product fill:#e8f5e9
    style Src fill:#e3f2fd
    style Export fill:#fff3e0
```

## Component Architecture

```mermaid
classDiagram
    class ProductOverview {
        +mission: string
        +problems: string[]
        +features: Feature[]
        +targetUsers: string[]
    }

    class DataModel {
        +entities: Entity[]
        +relationships: Relationship[]
        +generateTypes()
    }

    class Entity {
        +name: string
        +fields: Field[]
        +primaryKey: string
    }

    class DesignSystem {
        +colors: ColorPalette
        +typography: Typography
        +applyTokens()
    }

    class ColorPalette {
        +primary: TailwindColor
        +accent: TailwindColor
        +neutral: TailwindColor
    }

    class Typography {
        +heading: GoogleFont
        +body: GoogleFont
        +code: GoogleFont
    }

    class Section {
        +name: string
        +spec: SectionSpec
        +data: SampleData
        +screens: Screen[]
        +tests: TestSpec
    }

    class ExportPackage {
        +prompts: Prompt[]
        +instructions: Instruction[]
        +components: Component[]
        +generate()
    }

    ProductOverview --> DataModel
    DataModel --> Entity
    DesignSystem --> ColorPalette
    DesignSystem --> Typography
    Section --> DesignSystem
    ExportPackage --> Section
    ExportPackage --> ProductOverview
    ExportPackage --> DataModel
```

## Technology Stack

```mermaid
graph TB
    subgraph Core["Core Technologies"]
        TS[TypeScript 95.3%]
        CSS[CSS 4.0%]
        Vite[Vite Build Tool]
        React[React Framework]
    end

    subgraph Styling["Styling System"]
        TW[Tailwind CSS v4]
        Fonts["Google Fonts<br/>DM Sans<br/>IBM Plex Mono"]
    end

    subgraph Tools["Development Tools"]
        ESLint[ESLint]
        TSConfig[TypeScript Config]
        NPM[npm Package Manager]
    end

    subgraph Integration["AI Agent Integration"]
        Claude[Claude Code]
        Cursor[Cursor]
        Copilot[GitHub Copilot]
        Other[Any AI Agent]
    end

    Core --> Styling
    Core --> Tools
    Styling --> Integration

    style Core fill:#e3f2fd
    style Styling fill:#f3e5f5
    style Tools fill:#fff3e0
    style Integration fill:#e8f5e9
```

## Design Tokens Flow

```mermaid
sequenceDiagram
    participant User
    participant DesignOS as Design OS
    participant Tailwind as Tailwind CSS v4
    participant Fonts as Google Fonts
    participant Export as Export Package

    User->>DesignOS: Select color palette
    DesignOS->>Tailwind: Apply Tailwind colors
    Tailwind-->>DesignOS: Color tokens applied

    User->>DesignOS: Choose typography
    DesignOS->>Fonts: Load Google Fonts
    Fonts-->>DesignOS: Typography configured

    DesignOS->>DesignOS: Generate colors.json
    DesignOS->>DesignOS: Generate typography.json

    User->>DesignOS: Design screens
    DesignOS->>DesignOS: Apply tokens to components

    User->>Export: /export-product
    Export-->>User: Handoff package with tokens
```

## Export Package Structure

```mermaid
flowchart TB
    subgraph ExportCommand["/export-product"]
        CMD[Generate Export]
    end

    subgraph OutputPackage["product-plan/"]
        subgraph Prompts["prompts/"]
            P1["one-shot-prompt.md<br/>Full implementation in one session"]
            P2["section-prompt.md<br/>Template for incremental work"]
        end

        subgraph Instructions["instructions/"]
            I1["one-shot-instructions.md<br/>Combined implementation guide"]
            I2["incremental/<br/>Milestone-specific guides"]
        end

        subgraph Assets["Portable Assets"]
            A1["design-system/<br/>colors.json<br/>typography.json"]
            A2["data-model/<br/>entities & types"]
            A3["shell/<br/>navigation specs"]
            A4["sections/<br/>specs, data, screenshots"]
        end

        subgraph Tests["Test Specifications"]
            T1["tests.md per section<br/>Framework-agnostic TDD requirements"]
        end
    end

    ExportCommand --> OutputPackage
    Prompts --> |"Copy/paste to"| Agent["AI Coding Agent"]
    Instructions --> Agent
    Assets --> Agent
    Tests --> Agent

    style ExportCommand fill:#e8f5e9
    style OutputPackage fill:#fff3e0
    style Agent fill:#c8e6c9
```

## Key Commands Reference

| Command | Phase | Output | Description |
|---------|-------|--------|-------------|
| `/product-vision` | Planning | `product/product-overview.md` | Define mission, problems, features |
| `/product-roadmap` | Planning | `product/product-roadmap.md` | Break down milestones |
| `/data-model` | Planning | `product/data-model/data-model.md` | Design entities & relationships |
| `/design-tokens` | Design | `product/design-system/*.json` | Configure colors & typography |
| `/design-shell` | Design | `product/shell/spec.md` | Create app shell & navigation |
| `/shape-section` | Section | `product/sections/[name]/spec.md` | Specify section requirements |
| `/sample-data` | Section | `product/sections/[name]/data.json, types.ts` | Generate test data |
| `/design-screen` | Section | `src/sections/[name]/*.tsx` | Design UI screens |
| `/screenshot-design` | Section | `product/sections/[name]/*.png` | Capture visual references |
| `/export-product` | Export | `product-plan/*` | Generate complete handoff |

## Design Requirements

```mermaid
mindmap
    root((Design OS<br/>Requirements))
        Responsive Design
            sm: prefix
            md: prefix
            lg: prefix
            xl: prefix
        Dark Mode
            dark: variants
            Test both modes
        Design Tokens
            Product palette when defined
            Default to stone/lime
        Components
            Props-based data
            No hardcoded imports
            React-agnostic designs
        Tailwind v4
            Native utilities only
            No config file
            Built-in colors
```

## Relationship with Agent OS

```mermaid
graph TB
    subgraph BuilderMethods["Builder Methods Ecosystem"]
        subgraph DesignOS["Design OS"]
            DO1["Product Planning"]
            DO2["UI/UX Design"]
            DO3["Handoff Generation"]
        end

        subgraph AgentOS["Agent OS"]
            AO1["Coding Standards"]
            AO2["Spec-Driven Development"]
            AO3["Task Implementation"]
        end
    end

    DO3 -->|"Feeds into"| AO2
    DesignOS -->|"Design what to build"| AgentOS
    AgentOS -->|"Guide how to build"| Implementation[AI Agent Implementation]

    style DesignOS fill:#e3f2fd
    style AgentOS fill:#f3e5f5
    style Implementation fill:#e8f5e9
```

**Design OS** focuses on the "what" - defining product vision, designing UI, and creating specifications.

**Agent OS** focuses on the "how" - providing structured workflows for AI coding agents to implement the designs with your coding standards.

## Key Statistics (December 2025)

- **GitHub Stars**: 994+
- **Forks**: 178+
- **Version**: 0.1 (Initial release: December 18, 2025)
- **Language**: TypeScript (95.3%)
- **License**: MIT
- **Creator**: Brian Casel (Builder Methods)

## Use Cases

```mermaid
graph LR
    subgraph Users["Target Users"]
        U1[Solo Developers]
        U2[Small Teams]
        U3[Indie Hackers]
        U4[Product Managers]
    end

    subgraph UseCases["Use Cases"]
        UC1[New Product Development]
        UC2[Feature Design]
        UC3[Design System Creation]
        UC4[AI Agent Handoffs]
        UC5[Rapid Prototyping]
    end

    subgraph Benefits["Benefits"]
        B1[Reduced AI iterations]
        B2[Consistent UI/UX]
        B3[Clear specifications]
        B4[Portable designs]
        B5[Framework-agnostic]
    end

    Users --> UseCases
    UseCases --> Benefits

    style Users fill:#e3f2fd
    style UseCases fill:#fff3e0
    style Benefits fill:#e8f5e9
```

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/buildermethods/design-os.git
   cd design-os
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start Design OS**
   ```bash
   npm run dev
   ```

4. **Follow the workflow**
   - Begin with `/product-vision` to define your product
   - Progress through planning, design, and section phases
   - Export with `/export-product` for AI implementation

## Best Practices

1. **Complete each phase before moving forward** - The workflow is sequential for a reason
2. **Use conversational commands** - Design OS is designed for AI-guided conversations
3. **Review generated specs** - Validate specifications before exporting
4. **Iterate on sections** - Refine individual sections without affecting others
5. **Test with multiple agents** - Handoff packages work with any AI coding tool

## Sources

- [Design OS GitHub Repository](https://github.com/buildermethods/design-os)
- [Design OS Official Documentation](https://buildermethods.com/design-os)
- [Agent OS GitHub Repository](https://github.com/buildermethods/agent-os)
- [Builder Methods](https://buildermethods.com/)
- [Brian Casel - Creator](https://briancasel.com/builder-methods-story)
