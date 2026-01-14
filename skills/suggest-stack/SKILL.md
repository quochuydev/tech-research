---
name: suggest-stack
description: Use when user wants tech stack recommendations for building profitable products, starting a side project, or exploring monetization opportunities with open-source tools
---

# Suggest Stack - Business Development Playbook Generator

## Overview

Generate a comprehensive business development analysis for ONE curated open-source tech stack combination. Each invocation suggests a different stack with detailed monetization strategies, go-to-market plans, and actionable 90-day roadmaps.

## When to Use

- User asks for tech stack recommendations to make money
- User wants to start a profitable side project
- User is exploring open-source tools for business opportunities
- User says "suggest a stack" or runs `/suggest-stack`

## Stack Selection

**Pick ONE stack combination from this curated list. Rotate through different options on each invocation. Do not repeat the same stack in the same conversation.**

### Curated Stack Combinations

1. **n8n + Supabase** - Workflow automation + Backend-as-a-Service
2. **Coolify + PocketBase** - Self-hosted deployment + Lightweight backend
3. **Medusa + Next.js** - E-commerce + Frontend framework
4. **Cal.com + Stripe + Next.js** - Scheduling + Payments + Frontend
5. **Directus + Astro** - Headless CMS + Static site generator
6. **Appwrite + Flutter** - Backend-as-a-Service + Cross-platform mobile
7. **Docuseal + Next.js** - Document signing + Frontend
8. **Lago + Supabase** - Billing/metering + Backend
9. **Formbricks + Supabase** - Survey/feedback + Backend
10. **Infisical + Any Stack** - Secrets management + Security layer
11. **Plane + Supabase** - Project management + Custom backend
12. **Twenty + Next.js** - Open-source CRM + Custom frontend
13. **Dify + FastAPI** - LLM app builder + Python backend
14. **Langflow + Supabase** - Visual LLM workflows + Backend
15. **OpenStatus + Next.js** - Status page + Monitoring

## Required Output Structure

Generate a comprehensive business development playbook with ALL of these sections:

```markdown
# [Stack Name]: Business Development Playbook

## The Stack
| Component | Role | Cost |
Table showing each tool, what it does, and pricing tiers

## Market Opportunity

### The Problem You're Solving
- Specific pain points businesses face
- Cost of the problem (time/money wasted)

### Target Market Size
| Segment | Size | Willingness to Pay |
Table with concrete numbers and market segments

### Why Now?
- Market timing factors (trends, regulations, technology shifts)
- Why this stack is positioned well RIGHT NOW

## Competitive Positioning

### Direct Competitors
| Competitor | Weakness You Exploit |
Table showing how you beat existing solutions

### Your Unique Value Proposition
> One-sentence positioning statement

## Revenue Models (Pick 1-2 to Start)

### Model 1: [Name] (Fastest Cash)
| Service | Price Range | Delivery Time | Margin |
Concrete pricing and margins

### Model 2: [Name] (Scalable)
| Package | Price | What's Included |
Productized service offerings

### Model 3: [Name] (Long-term)
SaaS or recurring revenue opportunities

### Model 4: [Name] (Passive Income)
Templates, courses, digital products

## Go-To-Market Strategy

### Phase 1: Validation (Week 1-2)
- Goal and specific actions
- Outreach scripts (copy-paste ready)

### Phase 2: Systematize (Month 1-2)
- Goal and specific actions
- Process documentation

### Phase 3: Scale (Month 3-6)
| Channel | Action | Expected Result |
Marketing and growth channels

### Phase 4: Productize (Month 6-12)
- Goal and transition to recurring revenue

## Pricing Psychology

### Value-Based Pricing Framework
| Client saves | You charge | Their ROI |
Concrete examples showing value

### Anchor Pricing
| Tier | Price | Psychology |
Three-tier pricing strategy

## Customer Acquisition Channels

### Highest ROI Channels (Ranked)
| Channel | Cost | Time to First Client | Quality |
Ranked list with concrete expectations

### Ideal Customer Profile (ICP)
- Best client characteristics
- Top industries with highest demand

## Risk Mitigation
| Risk | Mitigation |
Common risks and how to handle them

## 90-Day Action Plan

### Week 1-2: Foundation
- [ ] Specific setup tasks

### Week 3-4: First Clients
- [ ] Outreach and closing tasks

### Month 2: Systematize
- [ ] Process and package tasks

### Month 3: Scale
- [ ] Growth and hiring tasks
- [ ] Revenue target

## Resources

### Learning
- Links to documentation

### Tools for Your Business
- Recommended tools for landing pages, payments, scheduling, etc.

### Communities
- Relevant forums, subreddits, Discord servers
```

## Quality Standards

1. **Concrete numbers** - Include specific pricing, market sizes, timelines
2. **Copy-paste ready** - Outreach scripts, pricing tables should be usable immediately
3. **Actionable** - Every section has specific next steps
4. **Realistic** - Revenue targets and timelines based on typical outcomes
5. **Complete** - All sections must be filled out, no placeholders

## Example Opener

Start with a brief introduction like:

> I'll give you a comprehensive business development analysis for a profitable tech stack.

Then dive directly into the playbook.

## After Generating

End with:

> **Want me to create detailed technical overviews with `/research-tech [tool1]` and `/research-tech [tool2]`?**

This offers the user a path to deeper technical understanding.
