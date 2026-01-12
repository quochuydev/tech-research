# Analyze GitHub Repo Promotion

Analyze a GitHub repository to understand why it gained stars and how it was promoted.

## Usage

```
/analyze-repo-promotion <github-url>
```

## What This Command Does

1. Fetches repository metadata (stars, forks, creation date)
2. Analyzes README for viral elements
3. Searches for promotion on:
   - Hacker News
   - Twitter/X
   - Reddit (r/ClaudeAI, r/LocalLLaMA, r/programming)
   - Dev.to / Medium
4. Identifies the "news hook" or trending topic connection
5. Evaluates viral-readiness factors
6. Provides actionable promotion recommendations

## Analysis Framework

### Viral Elements Checklist

- [ ] News hook (connects to trending topic/acquisition/release)
- [ ] Simple one-liner description
- [ ] Low friction installation
- [ ] Clear value proposition
- [ ] Demo video/GIF in README
- [ ] MIT or permissive license

### Promotion Channel Search

Search these patterns:

- `"repo-name" site:news.ycombinator.com`
- `"repo-name" site:reddit.com`
- `"repo-name" site:twitter.com OR site:x.com`
- `"repo-name" site:dev.to OR site:medium.com`

### Timing Analysis

- Check if repo was created near major news events
- Check GitHub trending during creation week
- Identify related repos that were trending simultaneously

## Output Format

```markdown
## Repository: [name]

**Stars:** X | **Created:** date | **Time to viral:** X days

### Why It Went Viral

1. [Primary factor]
2. [Secondary factor]
3. [Tertiary factor]

### Promotion Channels Found

| Platform | Link | Impact |
| -------- | ---- | ------ |
| ...      | ...  | ...    |

### Viral-Readiness Score: X/10

- News hook: Y/N
- Simple pitch: Y/N
- Low friction: Y/N
- Good timing: Y/N

### Recommendations for Your Repo

1. [Actionable item]
2. [Actionable item]
3. [Actionable item]
```

## Example Analysis

See: [manus-promotion-analysis.md](./researching/manus-promotion-analysis.md) for a complete analysis of the planning-with-files repo that gained 4.7k stars in 5 days.

**IMPORTANT**: After generating the analysis, write the output to a markdown file in the `researching/` directory. If the input filename doesn't end with `-analysis.md`, append `-analysis.md` to the base filename.
