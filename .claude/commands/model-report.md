---
description: Research an AI model and create a standardized technical report
---

# AI Model Report Command

Research and document: **$ARGUMENTS**

## Instructions

1. **Research Phase**
   - Use WebSearch to gather comprehensive information about the AI model
   - Search for: architecture, parameters, benchmarks, training data, pricing, availability
   - Look for Hugging Face availability and hardware requirements for self-hosting
   - Find recent information (2025-2026) when relevant

2. **Document Structure**
   Create a markdown file in `researching/<model-name>-model-report.md` with:

   ### Required Sections (Use Tables)

   - **Title**: `# <Model Name> - Model Report`

   - **Overview Table**: Developer, Release Date, Model Type, License

   - **Architecture Table**: Total Parameters, Active Parameters, Architecture Type, Context Window, Special Features

   - **Training Table**: Training Data, Training Method, Notable Techniques

   - **Key Features**: Bullet list of main capabilities and unique features

   - **Benchmarks Table**: Key benchmark scores (SWE-bench, MMLU, etc.)

   - **Pricing Table** (if applicable): Input/Output token costs, discounts

   - **Open Source Availability Table**:
     - Hugging Face status (link if available)
     - Weight download availability
     - Self-hosting possibility

   - **Minimum Hardware for Self-Hosting** (if open source):
     - Minimum viable hardware specs
     - Recommended hardware specs
     - Expected performance at different tiers
     - **Minimum Apple Product**: Identify the cheapest Apple product that can run it
     - Approximate cost

   - **Sources**: List all reference URLs as markdown links

3. **Table Format Standards**
   ```markdown
   | Attribute | Details |
   |-----------|---------|
   | **Key** | Value |
   ```

4. **Self-Hosting Analysis Requirements**
   When model is open source:
   - Research GGUF/quantized versions if available
   - Calculate memory requirements (VRAM + RAM + disk)
   - Map to Apple Silicon unified memory capabilities:
     - M4 Max: up to 128GB
     - M3 Ultra: up to 512GB
   - Provide realistic performance expectations (tokens/sec)

5. **Output**
   - Save to `researching/<model-name>-model-report.md`
   - Use lowercase kebab-case for filename
   - Model name only (e.g., `kimi-k2.5-model-report.md`, `claude-opus-4.5-model-report.md`)

## Example Sections

### Open Source Model
```markdown
## Minimum Apple Hardware for Self-Hosting

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| **Product** | Mac Studio (M3 Ultra) | Mac Studio (M3 Ultra) |
| **Unified Memory** | 256GB | 512GB |
| **Quantization** | 1.8-bit GGUF | 4-bit |
| **Expected Speed** | 1-2 tok/s | 5+ tok/s |
| **Approx. Cost** | ~$8,000 | ~$12,000 |
```

### Closed Source Model
```markdown
## Minimum Apple Hardware for Self-Hosting

| Requirement | Details |
|-------------|---------|
| **Self-Hosting** | **Not Possible** |

This is a closed-source model. Access only via API.
```

Now research **$ARGUMENTS** and create the model report.
