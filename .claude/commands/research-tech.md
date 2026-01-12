---
description: Research a technical topic and create comprehensive documentation with diagrams
---

# Technical Research Command

Research and document: **$ARGUMENTS**

## Instructions

1. **Research Phase**
   - Use WebSearch to gather comprehensive information about the topic
   - Search for: architecture, how it works, key concepts, ecosystem, use cases
   - Look for recent information (2024-2025) when relevant

2. **Document Structure**
   Create a markdown file in `researching/<topic>-overview.md` with:

   ### Required Sections

   - **Title**: `# <Topic> - Technical Overview`

   - **High-Level Architecture**: Mermaid diagram showing main components and their relationships

   - **How It Works**: Mermaid flowchart or sequence diagram showing the main process/flow

   - **Key Concepts**: Explanation of core concepts, terminology, and mechanics

   - **Technical Details**: Deeper dive into important technical aspects

   - **Ecosystem/Participants**: Mermaid diagram showing different actors/components in the ecosystem

   - **Key Facts (Current Year)**: Bullet list of important statistics and facts

   - **Use Cases**: Common applications and use cases

   - **Security/Considerations** (if applicable): Important security or risk considerations

3. **Diagram Requirements**
   - Use Mermaid syntax for all diagrams
   - Include at least 3-4 diagrams:
     - Architecture overview (graph TB/LR)
     - Process flow (flowchart or sequenceDiagram)
     - Component relationships (classDiagram or graph)
     - Ecosystem view (graph)
   - Style diagrams with colors when helpful using `style` directives

4. **Quality Standards**
   - Be technically accurate and up-to-date
   - Use clear, concise explanations
   - Include concrete numbers/stats where available
   - Make diagrams self-explanatory with good labels

5. **Output**
   - Save the document to `researching/<topic-slug>-overview.md`
   - Use kebab-case for the filename (e.g., `binance-smart-chain-overview.md`)

## Example Reference

See existing files in `researching/` directory for format examples:
- `researching/bitcoin-overview.md` - Cryptocurrency technical overview
- `researching/loveable-overview.md` - Platform architecture and how to build similar

Now research **$ARGUMENTS** and create the documentation.
