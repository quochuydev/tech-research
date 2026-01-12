# Research: Socratic Method & Superpowers Plugin

## Part 1: Socratic Method

### 1.1 Origins and Definition

**Socratic Method** (also known as Socratic questioning, Socratic dialogue, or method of Elenchus) is a dialectical dialogue method developed by ancient Greek philosopher **Socrates** (470-399 BCE).

**Core definition:** This method uses purposeful questioning sequences to probe the beliefs and assumptions of dialogue participants, guiding them to discover inconsistencies in their reasoning and achieve deeper understanding.

Socrates compared himself to a **"midwife"** - he didn't "give birth to" knowledge but helped others "birth" understanding from their own minds.

### 1.2 Core Principles

| Principle | Description |
|-----------|-------------|
| **Elenchus** | Central technique - examining, refuting, cross-examining beliefs |
| **Aporia** | State of "puzzlement" when recognizing contradictions - starting point of true learning |
| **Profession of ignorance** | "I know that I know nothing" - intellectual humility |
| **Collaborative dialogue** | Not one-way teaching but joint pursuit of truth |

### 1.3 Implementation Process

```
1. INITIATION
   └── Ask foundational question (e.g., "What is virtue?")

2. EXPLORATION
   └── Request definition/clarification from interlocutor

3. COUNTER-EXAMINATION
   └── Question consistency
   └── Present counterexamples

4. APORIA
   └── Interlocutor recognizes contradictions in reasoning

5. REDEFINITION
   └── Adjust, expand, or abandon initial beliefs

6. ITERATION
   └── Return to steps 2-5 until deeper understanding is achieved
```

### 1.4 Modern Applications

- **Legal education:** Dominant method in law schools (especially in the US)
- **Psychotherapy:** Cognitive Therapy, Rational Emotive Behavior Therapy (REBT)
- **Critical thinking development:** Helps students evaluate their own assumptions
- **AI/Chatbots:** Applied to improve conversational guidance capabilities

### 1.5 Types of Socratic Questions

1. **Clarification:** "Can you explain further?"
2. **Probing assumptions:** "What are you assuming here?"
3. **Probing evidence:** "What evidence supports that claim?"
4. **Questioning viewpoints:** "Are there alternative perspectives?"
5. **Probing implications:** "If that's true, then what?"
6. **Questions about questions:** "Why is this question important?"

---

## Part 2: Superpowers - Claude Code Skills Library

### 2.1 Overview

**Superpowers** is a comprehensive skills library for Claude Code, created by **Jesse Vincent (obra)**. It's a complete software development workflow system with over **20+ battle-tested skills**.

**Repository:** https://github.com/obra/superpowers
**Stars:** ~8.5k ⭐
**Forks:** ~700+

### 2.2 Core Philosophy

| Principle | Meaning |
|-----------|---------|
| **Test-Driven Development** | Write tests first, always |
| **Systematic over ad-hoc** | Process over guesswork |
| **Complexity reduction** | Simplicity is the primary goal |
| **Evidence over claims** | Verify before declaring completion |
| **Domain over implementation** | Work at problem level, not solution level |

### 2.3 Main Workflow

```
┌─────────────────┐
│  /brainstorm    │  ← Socratic design refinement
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  /write-plan    │  ← Detailed implementation plan
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ /execute-plan   │  ← Batch execution with checkpoints
└─────────────────┘
```

### 2.4 Skills Structure

#### Testing Skills (`skills/testing/`)
- `test-driven-development` - RED-GREEN-REFACTOR cycle
- `condition-based-waiting` - Async test patterns
- `testing-anti-patterns` - Common pitfalls to avoid

#### Debugging Skills (`skills/debugging/`)
- `systematic-debugging` - 4-phase root cause process
- `root-cause-tracing` - Find the real problem
- `verification-before-completion` - Ensure it's actually fixed
- `defense-in-depth` - Multiple validation layers

#### Collaboration Skills (`skills/collaboration/`)
- `brainstorming` - **Socratic design refinement** ⭐
- `writing-plans` - Detailed implementation plans
- `executing-plans` - Batch execution with checkpoints
- `dispatching-parallel-agents` - Concurrent subagent workflows
- `requesting-code-review` - Pre-review checklist
- `receiving-code-review` - Responding to feedback

#### Development Skills
- `using-git-worktrees` - Parallel development branches
- `finishing-a-development-branch` - Merge/PR decision workflow
- `subagent-driven-development` - Fast iteration with quality gates

#### Meta Skills (`skills/meta/`)
- `writing-skills` - Create new skills following best practices
- `testing-skills-with-subagents` - Validate skill quality
- `using-superpowers` - Introduction to the skills system

### 2.5 Brainstorming Skill - Applying Socratic Method

**Purpose:** Transform rough ideas into complete designs through collaborative dialogue.

**How it works:**

1. **Context Understanding**
   - Understand current project context
   - Gather necessary information (autonomous recon)

2. **Collaborative Questioning** (Socratic)
   - Ask **one question at a time** - don't overwhelm
   - Prioritize **multiple choice** when possible
   - Explore **2-3 alternatives** before deciding

3. **Incremental Validation**
   - Present design in small sections (200-300 words)
   - Validate each part before continuing

4. **Design Document**
   - Save result as design document
   - Commit to git

**Important principles:**
- **YAGNI ruthlessly** - Eliminate unnecessary features
- **One question at a time** - Don't overwhelm the user
- **Recommendations-driven** - Agent makes recommendations, doesn't push decisions to user

### 2.6 Installation

```bash
# In Claude Code
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace

# Restart Claude Code
# Verify with /help
```

### 2.7 Key Highlights

1. **Auto-activating skills** based on context
2. **Mandatory workflows** - not suggestions, but requirements
3. **TDD (RED-GREEN-REFACTOR)** deeply integrated
4. **Git worktrees** for parallel development
5. **Subagent-driven development** for fast iteration
6. **Self-improving** - Claude can create new skills

---

## Part 3: Connecting Socratic Method ↔ Superpowers

### 3.1 Applying Socratic Method in AI Coding

Superpowers applies Socratic Method in the `brainstorming` skill:

| Socratic Method | Superpowers Brainstorming |
|-----------------|---------------------------|
| Clarifying questions | "What are you trying to build?" |
| Probing assumptions | "What cases need to be handled?" |
| Explore alternatives | "Here are 2-3 approaches..." |
| Incremental validation | Present design section by section |
| Aporia → Understanding | User realizes actual requirements |

### 3.2 Why Is It Effective?

1. **Combats "jump to code"** - Forces thinking before coding
2. **Knowledge elicitation** - Extracts tacit knowledge from user
3. **Requirement refinement** - Clarifies vague requirements
4. **Buy-in** - User "owns" the solution because they contributed
5. **Error prevention** - Catches issues early in design

### 3.3 Example Workflow

```
User: "I need an email validator"

Claude (Socratic brainstorming):
├── "What types of emails do you need to validate?"
│   └── Standard, subdomains, internationalized?
├── "Do you need to support '+' addressing?"
│   └── e.g., user+tag@example.com
├── "How strict should validation be?"
│   └── RFC 5321 compliance vs practical?
└── "Output format: boolean, error message, or parsed parts?"

→ Result: Detailed design document with identified edge cases
```

---

## References

- [Socratic Method - Wikipedia](https://en.wikipedia.org/wiki/Socratic_method)
- [Superpowers GitHub Repository](https://github.com/obra/superpowers)
- [Blog: Superpowers Introduction](https://blog.fsck.com/2025/10/09/superpowers/)
- [Britannica: Socratic Method](https://www.britannica.com/topic/Socratic-method)
- [PMC: Socratic Method for Critical Thinking](https://pmc.ncbi.nlm.nih.gov/articles/PMC4174386/)
