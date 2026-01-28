# Kimi K2.5 - Model Report

## Overview

| Attribute | Details |
|-----------|---------|
| **Developer** | Moonshot AI (China) |
| **Release Date** | January 27, 2026 |
| **Model Type** | Native Multimodal Agentic Model |
| **License** | Modified MIT License |

## Architecture

| Specification | Value |
|---------------|-------|
| **Total Parameters** | 1.04 Trillion |
| **Active Parameters** | 32 Billion |
| **Architecture** | Mixture of Experts (MoE) |
| **Number of Experts** | 384 (8 selected per token + 1 shared) |
| **Vision Encoder** | 400 Million parameters |
| **Context Window** | 256K tokens |
| **Modalities** | Text, Image, Video |

## Training

| Aspect | Details |
|--------|---------|
| **Training Data** | ~15 Trillion mixed visual and text tokens |
| **Base Model** | Kimi-K2-Base (continual pretraining) |
| **Quantization** | Native INT4 (QAT), Group size 32 |
| **Optimization** | Hopper Architecture optimized |

## Key Features

- **Agent Swarm Orchestration**: Can spawn and manage up to 100 agents per prompt
- **Multi-Agent Task Decomposition**: Decomposes complex tasks into parallel sub-tasks
- **Thinking Mode**: Includes reasoning traces with `reasoning_content` (temp=1.0)
- **Instant Mode**: Direct responses without reasoning traces (temp=0.6)
- **Native Multimodal**: Built-in text, image, and video understanding
- **Native INT4 Inference**: ~2x generation speed improvement via QAT

## Benchmarks

| Benchmark | Score |
|-----------|-------|
| Hallucinations | 100% |
| General Knowledge | 100% |
| Reasoning | 100% |
| Ethics | 100% |
| Mathematics | 96.8% (97th percentile) |
| Coding | 92.0% (76th percentile) |

## Pricing

| Platform | Details |
|----------|---------|
| **Self-Hosted** | Free (open source) |
| **NVIDIA NIM** | Available via NIM catalog |
| **Cloud APIs** | Various providers |

## Open Source Availability

| Platform | Status |
|----------|--------|
| **Hugging Face** | [moonshotai/Kimi-K2.5](https://huggingface.co/moonshotai/Kimi-K2.5) |
| **GGUF Quants** | [unsloth/Kimi-K2-Instruct-GGUF](https://huggingface.co/unsloth/Kimi-K2-Instruct-GGUF) |
| **Weights Download** | Available |
| **Self-Hosting** | Possible (requires significant hardware) |

## Minimum Hardware for Self-Hosting

### Memory Requirements

| Quantization | Model Size | Min Memory (RAM+VRAM+Disk) |
|--------------|------------|---------------------------|
| 1.8-bit GGUF | ~247GB | 250GB |
| 2-bit XL | ~300GB | 300GB+ |
| Q8 (Full) | ~1.09TB | 8x H200 GPUs |
| FP8 | ~1TB | Enterprise GPU cluster |

### Apple Hardware Options

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| **Product** | **Mac Studio (M3 Ultra)** | Mac Studio (M3 Ultra) |
| **Unified Memory** | 256GB | 512GB |
| **Storage** | 500GB+ NVMe | 1TB+ NVMe |
| **Quantization** | 1.8-bit GGUF | 2-bit or higher |
| **Expected Speed** | 1-2 tokens/sec | 5+ tokens/sec |
| **Approx. Cost** | ~$8,000 | ~$12,000 |

### Why Mac Studio M3 Ultra?

| Apple Product | Max Unified Memory | Sufficient? |
|---------------|-------------------|-------------|
| MacBook Pro M4 Max | 128GB | No |
| Mac Studio M4 Max | 128GB | No |
| Mac Studio M3 Ultra | 512GB | **Yes** |
| Mac Pro M2 Ultra | 192GB | Borderline |

**Note**: The Mac Studio with M3 Ultra (512GB unified memory) is currently the **only** consumer Apple product capable of running Kimi K2.5 locally. Lower memory configurations will experience severe performance degradation due to disk swapping.

### Performance Expectations

| Setup | VRAM | RAM | Speed |
|-------|------|-----|-------|
| RTX 4090 + 256GB RAM | 24GB | 256GB | 1-2 tok/s |
| Mac Studio M3 Ultra 512GB | 512GB unified | - | 3-5 tok/s |
| 2x A100 80GB | 160GB | 512GB | 15-20 tok/s |
| 8x H200 | 1.1TB | - | ~45 tok/s |

## Sources

- [Moonshot AI Releases Kimi K2.5 - SiliconANGLE](https://siliconangle.com/2026/01/27/moonshot-ai-releases-open-source-kimi-k2-5-model-1t-parameters/)
- [Kimi K2.5 - Hugging Face](https://huggingface.co/moonshotai/Kimi-K2.5)
- [Kimi K2.5 - NVIDIA NIM](https://build.nvidia.com/moonshotai/kimi-k2.5/modelcard)
- [Kimi K2 Local Guide - Unsloth](https://docs.unsloth.ai/models/kimi-k2-thinking-how-to-run-locally)
- [GPU Requirements Guide - APXML](https://apxml.com/posts/gpu-system-requirements-kimi-llm)
- [Kimi K2.5 Guide - DEV Community](https://dev.to/czmilo/kimi-k25-in-2026-the-ultimate-guide-to-open-source-visual-agentic-intelligence-18od)
