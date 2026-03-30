# Promotion Analysis: pacaplan/wtf

## Repository: wtf

**Stars:** 26 | **Forks:** 1 | **Created:** 2026-03-12 | **Language:** Shell/Markdown (Claude Code skills)
**Author:** Paul Caplan ([pacaplan](https://github.com/pacaplan)) | **License:** MIT (stated in README, not configured in repo)
**First star:** 2026-03-12 | **Last star (sampled):** 2026-03-20 | **Time to current stars:** ~8 days

---

## What It Is

A Claude Code plugin delivering 10 debugging, explanation, and code-review slash commands — all channeled through a "surly programmer" personality. Commands like `/wtf:went-wrong`, `/wtf:fix-it`, `/wtf:is-this`, and `/wtf:was-i-thinking` provide opinionated but constructive developer assistance. Typing "wtf" in any message auto-triggers the commiseration skill.

---

## Why It Gained Stars

### 1. Rode the Wave of a Viral Feature Announcement

The repo's origin story is directly tied to [@trq212's viral tweet](https://x.com/trq212/status/2031506296697131352) announcing `/btw` in Claude Code (March 10, 2026) — which generated **2.7M views, 25K likes, and 2.6K reposts**. Paul Caplan commented "Good but when do we get /wtf?" on that thread, then built the plugin two days later. This is textbook **reply-guy-to-creator pipeline**: participating in a viral moment, identifying a gap, and shipping immediately.

### 2. Perfect Name and Concept

"WTF" is universally understood by developers. The name is:
- Instantly memorable and shareable
- Emotionally resonant (every developer has said "wtf" while debugging)
- Self-explanatory as a concept — you don't need to read the README to guess what it does

### 3. Personality as Product Differentiation

Rather than another generic debugging tool, the "surly programmer who misuses Gen Z slang" angle gives it character. This makes it screenshot-worthy and share-worthy even for people who won't install it.

### 4. Timing: Early Claude Code Plugin Ecosystem

Created during the early growth phase of the Claude Code plugin marketplace ecosystem. Being an early, visible plugin in a new marketplace gives outsized discovery compared to entering a mature ecosystem.

---

## Promotion Channels Found

| Platform | Evidence | Impact |
| -------- | -------- | ------ |
| Twitter/X | Origin tied to @trq212's viral /btw thread (2.7M views) | **High** — primary discovery vector |
| GitHub | Listed in repo, searchable in plugin marketplace | **Medium** — organic discovery |
| Hacker News | No mentions found | None |
| Reddit | No mentions found | None |
| Dev.to / Medium | No mentions found | None |

### Key Observation

This repo has **no detectable external promotion** beyond its origin in the /btw Twitter thread. There are no blog posts, no Reddit submissions, no Hacker News posts, and no dedicated tweets from the author promoting it. The 26 stars came almost entirely from:

1. The viral tweet connection (people who saw the comment and followed through)
2. Claude Code plugin marketplace discovery
3. Organic GitHub discovery

---

## Viral-Readiness Score: 5/10

| Factor | Score | Notes |
| ------ | ----- | ----- |
| News hook | ✅ Yes | Directly spawned from a 2.7M-view viral tweet |
| Simple pitch | ✅ Yes | "A Claude Code plugin for when things go sideways" — perfect one-liner |
| Memorable name | ✅ Yes | "WTF" is universally known, funny, and developer-native |
| Low friction install | ✅ Yes | Two commands: `claude plugin marketplace add` + `claude plugin install` |
| Demo/GIF in README | ⚠️ Partial | Has origin-story screenshots but no demo of the skills in action |
| License | ⚠️ Partial | MIT stated in README but not configured in GitHub repo settings |
| Active promotion | ❌ No | No dedicated posts on any platform |
| Topics/tags | ❌ No | No GitHub topics configured for discoverability |
| Homepage/docs | ❌ No | No homepage, no docs site |
| Community engagement | ❌ No | 0 open issues, 1 PR (author's own), no discussions |

---

## Growth Trajectory

- **26 stars in 8 days** with zero active promotion is modest but notable for a niche tool
- Stars are spread across the 8-day window (not a single spike), suggesting steady organic trickle rather than a viral moment of its own
- The repo was built and completed in a single day (all commits on 2026-03-12), which is both a strength (shipped fast) and a limitation (no iteration signal)

---

## What's Working

1. **The origin story is compelling** — The README's "I jokingly commented... and then I thought: WTF - why not?" narrative with embedded tweet screenshots is authentic and relatable
2. **The command table is excellent** — Clean, scannable, each command has a witty one-liner description
3. **Personality is consistent** — "salty but never mean, brutally honest but always constructive" is a clear brand
4. **Name is perfect** — Short, memorable, emotionally resonant

---

## What's Missing

1. **No demo content** — No GIF, video, or example output showing the personality in action. This is the single biggest missed opportunity. A screenshot of `/wtf:went-wrong` giving a salty but helpful debugging response would be highly shareable.

2. **No active promotion** — The author has not posted about this on any discoverable platform. For a personality-driven tool, one tweet with an example interaction could go viral in the Claude Code community.

3. **No GitHub topics** — Missing tags like `claude-code`, `claude-code-plugin`, `developer-tools`, `debugging` that would improve marketplace and search discovery.

4. **No contribution path** — No CONTRIBUTING.md, no open issues, no "ideas welcome" signal. Community-driven skill ideas could drive engagement.

5. **No example outputs** — The README describes what each command does but never shows what the output looks like. The personality IS the product — show it.

---

## Recommendations for Your Repo

### Immediate (High Impact, Low Effort)

1. **Add a demo GIF or screenshot** showing an actual `/wtf:went-wrong` or `/wtf:is-this` interaction with the surly personality. This single addition would make the README dramatically more shareable.

2. **Add GitHub topics**: `claude-code`, `claude-code-plugin`, `developer-tools`, `debugging`, `code-review`, `ai-tools`

3. **Configure the MIT license** in GitHub repo settings (not just README text) so it shows in the repo sidebar.

### Short-Term (Promotion)

4. **Post a standalone tweet/thread** showing the funniest `/wtf` interaction you've had. Personality-driven tools thrive on example output. Tag @AnthropicAI and @trq212 for reach.

5. **Submit to community directories** like [claudemarketplaces.com](https://claudemarketplaces.com/), [awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills), and [SkillsMP](https://skillsmp.com/).

6. **Post to r/ClaudeAI** — the subreddit is actively interested in Claude Code plugins and skills. A post titled "I built /wtf for Claude Code — 10 debugging skills from a surly programmer" would perform well.

### Medium-Term (Growth)

7. **Create "example outputs" in the README** — a collapsible section with 2-3 real interactions showing the personality. This is the single biggest lever for conversion from "looked at repo" to "installed it."

8. **Open issues for skill ideas** — invite the community to suggest new `/wtf:` commands. Each issue is a micro-engagement point.

9. **Write a short blog post or dev.to article** about building a Claude Code plugin in a day, using the viral tweet origin story as the hook. The "reply-guy-to-creator" narrative is inherently interesting.

---

## Key Takeaway

This repo has an excellent concept, perfect naming, and a compelling origin story — but it's operating at ~10% of its potential reach because there's been zero active promotion. The personality-driven approach is inherently shareable, but nobody can share what they haven't seen in action. **Adding demo content and doing one round of promotion across Twitter, Reddit, and community directories could realistically 10x the star count.**

---

*Analysis date: 2026-03-26*

Sources:
- [pacaplan/wtf on GitHub](https://github.com/pacaplan/wtf)
- [@trq212's /btw announcement tweet](https://x.com/trq212/status/2031506296697131352)
- [Claude Code Plugin Marketplace Docs](https://code.claude.com/docs/en/discover-plugins)
- [claudemarketplaces.com](https://claudemarketplaces.com/)
- [awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills)
- [SkillsMP](https://skillsmp.com/)
