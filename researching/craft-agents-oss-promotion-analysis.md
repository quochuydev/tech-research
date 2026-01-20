# Repository: craft-agents-oss

**Stars:** 160 | **Forks:** 16 | **Created:** January 19, 2026 | **Time to viral:** N/A (still early)

**URL:** https://github.com/lukilabs/craft-agents-oss

---

## Executive Summary

Craft Agents OSS is a freshly launched (1 day old as of this analysis) open-source desktop application for working with AI agents, built by Luki Labs—the team behind [Craft.do](https://craft.do), a popular document and note-taking application. The repo gained 160 stars in approximately 24 hours, showing early traction but hasn't yet achieved viral status. This is a "company open-sources internal tool" launch pattern with significant untapped viral potential.

---

## Why It Has Early Traction

### 1. **Established Company Credibility (Primary Factor)**
Craft.do is a well-known, respected document app with a loyal user base. When an established company open-sources tooling, it carries immediate credibility and trust. Users know the code is production-tested because the company uses it internally.

> "A tool we built so that we (at craft.do) can work effectively with agents"

### 2. **Perfect Timing with Claude Agent SDK Ecosystem (Secondary Factor)**
The repo launched just as the Claude Agent SDK ecosystem is exploding with activity:
- Anthropic's [Claude Cowork](https://simonwillison.net/2026/Jan/12/claude-cowork/) launched January 12, 2026
- Multiple open-source Claude Agent SDK desktop apps trending: [claude-agent-desktop](https://github.com/pheuter/claude-agent-desktop), [open-claude-cowork](https://github.com/ComposioHQ/open-claude-cowork)
- High interest in accessible GUI wrappers for Claude Code/Agent SDK

### 3. **Differentiated Feature Set (Tertiary Factor)**
Unlike competitors, Craft Agents integrates 32+ Craft document tools via MCP, providing a unique document-centric workflow that no other Claude Agent desktop app offers.

---

## Promotion Channels Found

| Platform | Link | Impact |
|----------|------|--------|
| GitHub | [lukilabs/craft-agents-oss](https://github.com/lukilabs/craft-agents-oss) | Primary launch point |
| Product Website | [agents.craft.do](https://agents.craft.do/) | Landing page with installers |
| Hacker News | Not found | ❌ Major missed opportunity |
| Reddit (r/ClaudeAI, r/LocalLLaMA) | Not found | ❌ Missed opportunity |
| Twitter/X | Not found | ❌ No detectable launch tweets |
| Dev.to / Medium | Not found | ❌ No blog posts |

**Key Finding:** The repository appears to have been launched with minimal external promotion. The 160 stars likely came from:
1. Existing Craft.do user community
2. GitHub organic discovery
3. Word of mouth / direct sharing

---

## Viral-Readiness Score: 6/10

| Factor | Status | Notes |
|--------|--------|-------|
| News hook | ✅ Partial | Claude Agent SDK wave, but no specific announcement timing |
| Simple pitch | ✅ Yes | "Work effectively with AI agents" - clear value prop |
| Low friction install | ✅ Yes | One-line curl install for macOS/Linux |
| Good timing | ✅ Yes | Claude Agent desktop apps are hot right now |
| Demo video/GIF | ❌ No | README lacks visual demonstration |
| MIT/Permissive License | ✅ Yes | Apache 2.0 |
| Active promotion | ❌ No | No detectable HN, Reddit, or Twitter campaigns |
| Unique differentiator | ✅ Yes | 32+ Craft document tools via MCP |

---

## Viral Elements Analysis

### What's Working

1. **One-Line Installation**
   ```bash
   curl -fsSL https://agents.craft.do/install-app.sh | bash
   ```
   Low friction entry reduces adoption barriers.

2. **Clear Feature List**
   - Multi-session inbox with status workflow
   - 32+ integrated Craft document tools
   - Three-tier permission system (Explore/Ask to Edit/Auto)
   - MCP server support

3. **Professional README Structure**
   - Architecture documentation
   - Contributing guidelines
   - Clear licensing

4. **Credibility Signals**
   - "Built by the Craft.do team"
   - "We use this tool exclusively for development"

### What's Missing

1. **No Visual Demo**
   - No screenshots in README
   - No GIF showing the app in action
   - No video walkthrough

2. **No Launch Campaign**
   - No Hacker News "Show HN" post
   - No Reddit announcements
   - No Twitter/X launch thread
   - No blog post explaining the "why"

3. **Weak Tagline**
   Current: "Work effectively with AI agents"
   Better: "Turn your Craft docs into AI agents" or "The Claude Agent desktop app with your documents built-in"

4. **No Comparison Table**
   Doesn't position itself against competitors (Claude Cowork, claude-agent-desktop, etc.)

---

## Competitor Landscape

| Project | Stars | Key Differentiator |
|---------|-------|-------------------|
| [claudia](https://github.com/anthropics/claudia) | ~19.9k | Official GUI app and toolkit |
| [claude-agent-desktop](https://github.com/pheuter/claude-agent-desktop) | Growing | Zero setup, bundled runtimes |
| [open-claude-cowork](https://github.com/ComposioHQ/open-claude-cowork) | Growing | 500+ tools via Composio |
| **craft-agents-oss** | 160 | 32+ Craft document tools |

---

## Recommendations for Viral Growth

### Immediate Actions (This Week)

1. **Create Show HN Post**
   - Title: "Show HN: Craft Agents – Open-source desktop app for Claude Agent SDK with document integration"
   - Include the "dogfooding" angle: "We built this for ourselves and use it daily"
   - Post on Tuesday-Thursday morning US time

2. **Add GIF/Video to README**
   - Record 30-second demo showing: session creation → document connection → agent task completion
   - Place above the fold in README

3. **Reddit Campaign**
   - Post to r/ClaudeAI with use case demo
   - Post to r/LocalLLaMA about local model potential
   - Cross-post to r/programming

4. **Twitter/X Launch Thread**
   - Thread from official Craft account AND founders' personal accounts
   - Show before/after: "How we worked with agents before vs. with Craft Agents"

### Medium-Term Actions (Next 2 Weeks)

5. **Write "Why We Open-Sourced" Blog Post**
   - Publish on Craft blog + Medium
   - Explain the "agent native" philosophy
   - Share internal productivity gains

6. **Create Comparison Guide**
   - "Craft Agents vs. Claude Cowork vs. Other Desktop Apps"
   - Honest comparison highlighting document integration advantage

7. **Launch Hunt on Product Hunt**
   - Coordinate with community for launch day support
   - Have screenshots and video ready

### Strategic Actions (Ongoing)

8. **Leverage Craft.do User Base**
   - In-app notification to existing Craft users
   - Email newsletter announcement
   - Feature integration demo in Craft.do interface

9. **MCP Server Showcase**
   - Create "Awesome Craft Agents MCP" list
   - Encourage community MCP contributions
   - Host MCP server hackathon

10. **YouTube Content**
    - Partner with AI/productivity YouTubers for reviews
    - Create official tutorial series

---

## Timing Analysis

### Why Now is the Right Time

1. **Claude Cowork Wave (January 12-16, 2026)**
   - Anthropic launched Claude Cowork for Max subscribers
   - Expanded to Pro subscribers January 16
   - Created massive interest in accessible Claude Agent interfaces

2. **Open-Source Claude Desktop Apps Trending**
   - Multiple repos gaining traction: pheuter/claude-agent-desktop, ComposioHQ/open-claude-cowork
   - Community wants alternatives to $100-200/mo Claude Max

3. **Claude Agent SDK Maturation**
   - SDK renamed from Claude Code SDK (January 2026)
   - Growing developer ecosystem
   - Production-ready tooling emerging

### The News Hook (Unused)
The perfect hook exists but hasn't been utilized:
> "Craft.do, the popular document app used by thousands, just open-sourced their internal AI agent tool"

This "established company open-sources" narrative is proven viral (see: Stripe's open-source releases, Linear's open-source components).

---

## Conclusion

Craft Agents OSS has solid fundamentals—clean code, good documentation, unique differentiator (Craft document integration), and company credibility. However, it's severely under-promoted. The 160 stars in 24 hours came with essentially zero marketing effort.

**Viral Potential:** 8/10 if properly promoted
**Current Execution:** 4/10 on promotion

With a coordinated launch campaign hitting HN, Reddit, Twitter, and Product Hunt, this repo could realistically reach 1-2k stars within a week and 5k+ within a month, especially riding the Claude Agent SDK wave.

---

## Sources

- [Craft Agents OSS GitHub Repository](https://github.com/lukilabs/craft-agents-oss)
- [Craft Agents Landing Page](https://agents.craft.do/)
- [First impressions of Claude Cowork - Simon Willison](https://simonwillison.net/2026/Jan/12/claude-cowork/)
- [Claude Agent SDK Python](https://github.com/anthropics/claude-agent-sdk-python)
- [Claude Agent SDK TypeScript](https://github.com/anthropics/claude-agent-sdk-typescript)
- [claude-agent-desktop](https://github.com/pheuter/claude-agent-desktop)
- [open-claude-cowork](https://github.com/ComposioHQ/open-claude-cowork)
- [Building agents with the Claude Agent SDK - Anthropic](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)
- [Craft.do Help - Craft Assistant](https://support.craft.do/hc/en-us/articles/8104602502557-Craft-Assistant)
