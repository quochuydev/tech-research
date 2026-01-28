# Claude Opus 4.5 - Model Report

## Overview

| Attribute | Details |
|-----------|---------|
| **Developer** | Anthropic |
| **Release Date** | November 24, 2025 |
| **Model Type** | Large Language Model |
| **License** | Proprietary (Closed Source) |

## Architecture

| Specification | Value |
|---------------|-------|
| **Total Parameters** | Not disclosed |
| **Active Parameters** | Not disclosed |
| **Architecture** | Transformer (details undisclosed) |
| **Context Window** | 200K tokens |
| **Max Output** | 64K tokens |
| **Knowledge Cutoff** | March 2025 |

## Training

| Aspect | Details |
|--------|---------|
| **Training Data** | Not disclosed |
| **Training Method** | Not disclosed |
| **Safety Approach** | Constitutional AI (RLHF) |

## Key Features

- **Effort Parameter (Beta)**: Control computational effort allocation across thinking, tool calls, and responses
- **Extended Thinking**: Preserves all reasoning blocks across multi-turn conversations
- **Computer Use**: Enhanced with zoom action for detailed screen region inspection
- **Agentic Capabilities**: Long-running processes, maintains context over hours/days
- **Tool Use**: Reliable interaction with external tools and APIs
- **Enterprise Automation**: Designed for complex, multi-step workflows

## Benchmarks

| Benchmark | Score |
|-----------|-------|
| SWE-bench Verified | 80.9% |
| OSWorld (Computer Use) | 66.3% |
| MMMU (Visual) | 80.7% |
| MMLU | 90.8% |

## Pricing

| Metric | Cost |
|--------|------|
| **Input Tokens** | $5 / million |
| **Output Tokens** | $25 / million |
| **Prompt Caching** | Up to 90% savings |
| **Batch Processing** | 50% savings |

**Note**: This is 1/3 the price of previous Opus-class models.

## Open Source Availability

| Platform | Status |
|----------|--------|
| **Hugging Face** | Not Available |
| **Weights Download** | Not Available |
| **Self-Hosting** | **Not Possible** |

## Minimum Hardware for Self-Hosting

| Requirement | Details |
|-------------|---------|
| **Self-Hosting** | **Not Possible** |

Claude Opus 4.5 is a **closed-source, proprietary model**. Model weights are not publicly released and cannot be downloaded or self-hosted.

### Access Methods

| Platform | Availability |
|----------|--------------|
| [Claude API](https://www.anthropic.com/claude/opus) | Direct API access |
| [Claude Web/Mobile](https://claude.ai) | Consumer interface |
| [Amazon Bedrock](https://aws.amazon.com/bedrock/) | AWS integration |
| [Google Cloud Vertex AI](https://cloud.google.com/vertex-ai) | GCP integration |
| [Microsoft Azure Foundry](https://azure.microsoft.com/en-us/blog/introducing-claude-opus-4-5-in-microsoft-foundry/) | Azure integration |

### Minimum Apple Product for Self-Hosting

| Requirement | Details |
|-------------|---------|
| **Apple Product** | **N/A** |
| **Reason** | Closed-source model, weights not available |
| **Alternative** | Use via API ($5/$25 per million tokens) |

## Sources

- [Introducing Claude Opus 4.5 - Anthropic](https://www.anthropic.com/news/claude-opus-4-5)
- [What's New in Claude 4.5 - API Docs](https://platform.claude.com/docs/en/about-claude/models/whats-new-claude-4-5)
- [Claude Opus 4.5 - Azure](https://azure.microsoft.com/en-us/blog/introducing-claude-opus-4-5-in-microsoft-foundry/)
- [Claude Opus 4.5 Review - Simon Willison](https://simonwillison.net/2025/Nov/24/claude-opus/)
- [Claude Opus 4.5 Guide - Skywork AI](https://skywork.ai/blog/ai-agent/claude-opus-4-5-comprehensive-guide-2025-everything-you-need-to-know/)
