# Qwen3 - Model Report

## Overview

| Attribute | Details |
|-----------|---------|
| **Developer** | Alibaba Cloud (Qwen Team) |
| **Release Date** | May 2025 (original), July 2025 (Thinking update) |
| **Model Type** | Large Language Model (Dense & MoE variants) |
| **License** | Apache 2.0 (Open Source, Commercial Use Allowed) |

## Architecture

### Model Family

| Model | Total Params | Active Params | Architecture | Context Window |
|-------|--------------|---------------|--------------|----------------|
| **Qwen3-235B-A22B** | 235B | 22B | MoE (128 experts, 8 active) | 32K / 131K (YaRN) |
| **Qwen3-30B-A3B** | 30B | 3B | MoE (128 experts, 8 active) | 32K / 131K (YaRN) |
| **Qwen3-32B** | 32B | 32B | Dense Transformer | 32K / 131K (YaRN) |
| **Qwen3-14B** | 14B | 14B | Dense Transformer | 32K / 131K (YaRN) |
| **Qwen3-8B** | 8B | 8B | Dense Transformer | 32K / 131K (YaRN) |
| **Qwen3-4B** | 4B | 4B | Dense Transformer | 32K / 131K (YaRN) |
| **Qwen3-1.7B** | 1.7B | 1.7B | Dense Transformer | 32K / 131K (YaRN) |
| **Qwen3-0.6B** | 0.6B | 0.6B | Dense Transformer | 32K / 131K (YaRN) |

### Technical Specifications

| Specification | Value |
|---------------|-------|
| **Tokenizer** | Byte-level BPE (BBPE) |
| **Vocabulary Size** | 151,669 tokens |
| **Languages Supported** | 119 languages and dialects |
| **MoE Routing** | 128 experts, 8 selected per token |

## Training

| Aspect | Details |
|--------|---------|
| **Training Data** | ~36 Trillion tokens |
| **Languages** | 119 languages (up from 29 in Qwen2.5) |
| **Pre-training Scale** | 2x more tokens than Qwen2.5, 3x more languages |
| **Post-training** | RLHF with thinking/non-thinking mode integration |

## Key Features

- **Unified Thinking Modes**: Thinking mode (complex reasoning) and non-thinking mode (fast responses) in one model
- **Thinking Budget**: Allocate computational resources adaptively based on task complexity
- **Dynamic Mode Switching**: Automatic mode selection based on query type
- **Efficient MoE**: 128 experts with only 8 active per token for efficiency
- **Extended Context**: 32K native, 131K with YaRN extension
- **Multilingual**: 119 languages and dialects support

## Benchmarks

### Flagship Model (Qwen3-235B-A22B)

| Benchmark | Score |
|-----------|-------|
| MMLU-Pro | 80.6% |
| LiveCodeBench | 69.5% |
| CodeForces ELO | Top performer |
| BFCL | Top performer |

### Smaller Models

| Model | MMLU | Notes |
|-------|------|-------|
| Qwen3-30B-A3B | 83% | Outperforms QwQ-32B (10x more active params) |
| Qwen3-32B | 65.5% (Pro) | Matches Qwen2.5-72B performance |
| Qwen3-4B | - | Rivals Qwen2.5-72B-Instruct |

### Efficiency Comparison

| Qwen3 Model | Equivalent Qwen2.5 Performance |
|-------------|-------------------------------|
| Qwen3-1.7B | Qwen2.5-3B |
| Qwen3-4B | Qwen2.5-7B |
| Qwen3-8B | Qwen2.5-14B |
| Qwen3-14B | Qwen2.5-32B |
| Qwen3-32B | Qwen2.5-72B |

## Pricing

| Platform | Details |
|----------|---------|
| **Self-Hosted** | Free (Apache 2.0) |
| **Alibaba Cloud** | Pay-per-token API |
| **Third-party APIs** | Various providers (Together AI, Fireworks, etc.) |

## Open Source Availability

| Platform | Status |
|----------|--------|
| **Hugging Face** | [Qwen/Qwen3-235B-A22B](https://huggingface.co/Qwen/Qwen3-235B-A22B) |
| **Hugging Face (32B)** | [Qwen/Qwen3-32B](https://huggingface.co/Qwen/Qwen3-32B) |
| **Hugging Face (8B)** | [Qwen/Qwen3-8B](https://huggingface.co/Qwen/Qwen3-8B) |
| **GGUF Quants** | Available via community (llama.cpp compatible) |
| **MLX Format** | Available for Apple Silicon optimization |
| **Weights Download** | Available |
| **Self-Hosting** | **Fully Supported** |

## Minimum Hardware for Self-Hosting

### By Model Size

| Model | GGUF Q4_K_M Size | Min Memory | Recommended |
|-------|------------------|------------|-------------|
| Qwen3-0.6B | ~0.4GB | 4GB | 8GB |
| Qwen3-1.7B | ~1GB | 8GB | 8GB |
| Qwen3-4B | ~2.5GB | 8GB | 16GB |
| Qwen3-8B | ~5GB | 16GB | 16GB+ |
| Qwen3-14B | ~8.5GB | 16GB | 24GB |
| Qwen3-32B | ~19.8GB | 32GB | 36-64GB |
| Qwen3-30B-A3B | ~18GB | 24GB | 32GB |
| Qwen3-235B-A22B | ~140GB | 192GB+ | 256GB+ |

### Apple Hardware Options

| Model | Minimum Apple Product | Memory | Approx. Cost | Speed |
|-------|----------------------|--------|--------------|-------|
| **Qwen3-0.6B** | MacBook Air M1 | 8GB | ~$999 | 100+ tok/s |
| **Qwen3-4B** | MacBook Air M2/M3/M4 | 16GB | ~$1,199 | 50+ tok/s |
| **Qwen3-8B** | **MacBook Air M2/M3/M4** | 16GB | ~$1,199 | 30-40 tok/s |
| **Qwen3-14B** | MacBook Pro M3/M4 | 24GB | ~$2,499 | 20-30 tok/s |
| **Qwen3-32B** | MacBook Pro M3/M4 Max | 36GB | ~$3,499 | 15-25 tok/s |
| **Qwen3-30B-A3B** | MacBook Pro M4 Max | 32GB | ~$3,199 | 40-68 tok/s |
| **Qwen3-235B-A22B** | Mac Studio M3 Ultra | 256GB+ | ~$8,000+ | 5-10 tok/s |

### Recommended: Best Value for Capability

| Use Case | Model | Apple Product | Cost |
|----------|-------|---------------|------|
| **Budget/Mobile** | Qwen3-8B | MacBook Air M4 16GB | ~$1,199 |
| **Best Balance** | Qwen3-32B | MacBook Pro M4 Max 48GB | ~$3,999 |
| **MoE Efficiency** | Qwen3-30B-A3B | MacBook Pro M4 Max 48GB | ~$3,999 |
| **Maximum Power** | Qwen3-235B-A22B | Mac Studio M3 Ultra 512GB | ~$12,000 |

### Performance on Apple Silicon

| Chip | Model | Quantization | Speed |
|------|-------|--------------|-------|
| M4 Max | Qwen3-30B-A3B | 4-bit MLX | ~68 tok/s |
| M4 Max | Qwen3-30B-A3B | Q4_K_M GGUF | ~40 tok/s |
| M4 Max | Qwen3-32B | Q4_K_M GGUF | ~25 tok/s |
| M2 Max | Qwen3-30B-A3B | 4-bit MLX | ~68 tok/s |
| M3 36GB | Qwen3-32B | Q4_K_M | ~15-20 tok/s |

### Software Requirements

| Component | Options |
|-----------|---------|
| **Inference Engine** | Ollama, llama.cpp, MLX-LM, vLLM, LMStudio |
| **Python** | transformers >= 4.51.0 |
| **Recommended for Mac** | MLX-LM (optimized for Apple Silicon) |

## Summary

**Minimum Apple Product to Run Qwen3:**
- **Qwen3-8B (great general use)**: **MacBook Air M4 16GB** (~$1,199)
- **Qwen3-32B (flagship dense)**: MacBook Pro M4 Max 48GB (~$3,999)
- **Qwen3-235B (flagship MoE)**: Mac Studio M3 Ultra 256GB+ (~$8,000+)

Qwen3 offers exceptional flexibility—from tiny 0.6B models running on any Mac to the 235B flagship requiring enterprise hardware. The MoE models (30B-A3B, 235B-A22B) provide excellent performance-per-memory efficiency.

## Sources

- [Qwen3 Technical Report - arXiv](https://arxiv.org/abs/2505.09388)
- [Qwen3: Think Deeper, Act Faster - Official Blog](https://qwenlm.github.io/blog/qwen3/)
- [Qwen3-235B-A22B - Hugging Face](https://huggingface.co/Qwen/Qwen3-235B-A22B)
- [Qwen3-32B - Hugging Face](https://huggingface.co/Qwen/Qwen3-32B)
- [Qwen3-8B - Hugging Face](https://huggingface.co/Qwen/Qwen3-8B)
- [Qwen3 Hardware Requirements - Hardware Corner](https://www.hardware-corner.net/guides/qwen3-hardware-requirements/)
- [Run Qwen 3 8B on Mac - CoderSera](https://codersera.com/blog/run-qwen-3-8b-on-mac-an-installation-guide/)
- [Qwen3 Benchmarks - DEV Community](https://dev.to/best_codes/qwen-3-benchmarks-comparisons-model-specifications-and-more-4hoa)
- [Understanding Qwen3 - Sebastian Raschka](https://magazine.sebastianraschka.com/p/qwen3-from-scratch)
