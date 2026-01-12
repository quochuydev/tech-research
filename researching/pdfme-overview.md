# pdfme - Technical Overview

## Overview

pdfme is an open-source PDF generation library built with TypeScript and React. It provides a template-based approach to PDF creation with a WYSIWYG designer, PDF viewer, and powerful generation capabilities. pdfme works seamlessly in both browser and Node.js environments, making it versatile for various use cases from client-side PDF generation to server-side batch processing.

## High-Level Architecture

```mermaid
flowchart TB
    subgraph Core["Core Packages"]
        Common["@pdfme/common<br/>Types, Utils, Constants"]
        Generator["@pdfme/generator<br/>PDF Generation Engine"]
        UI["@pdfme/ui<br/>Designer, Form, Viewer"]
        Schemas["@pdfme/schemas<br/>Built-in Plugins"]
    end

    subgraph Dependencies["Core Dependencies"]
        PDFLib["pdf-lib<br/>PDF Manipulation"]
        Fontkit["fontkit<br/>Font Processing"]
        PDFJS["PDF.js<br/>PDF Viewing"]
    end

    subgraph Outputs["Output"]
        Browser["Browser<br/>Blob/Download"]
        NodeJS["Node.js<br/>File System"]
    end

    Common --> Generator
    Common --> UI
    Schemas --> Generator
    Schemas --> UI

    PDFLib --> Generator
    Fontkit --> Generator
    PDFJS --> UI

    Generator --> Browser
    Generator --> NodeJS

    style Core fill:#e3f2fd
    style Dependencies fill:#fff3e0
    style Outputs fill:#e8f5e9
```

## Template System

The template is the core concept in pdfme. It consists of two main parts:

```mermaid
flowchart LR
    subgraph Template["Template Structure"]
        basePdf["basePdf<br/>Fixed PDF Background"]
        schemas["schemas<br/>Variable Content Definitions"]
    end

    subgraph basePdf_Options["basePdf Options"]
        B1["Base64 String"]
        B2["ArrayBuffer"]
        B3["Uint8Array"]
        B4["BLANK_PDF Constant"]
        B5["Custom Dimensions<br/>{width, height, padding}"]
    end

    subgraph Schema_Properties["Schema Properties"]
        S1["name: Field identifier"]
        S2["type: text, image, etc."]
        S3["position: {x, y}"]
        S4["width & height"]
        S5["Custom properties"]
    end

    Template --> basePdf_Options
    Template --> Schema_Properties

    style Template fill:#f3e5f5
    style basePdf_Options fill:#e8f5e9
    style Schema_Properties fill:#fff9c4
```

## How It Works - Generation Flow

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Template as Template
    participant Generator as @pdfme/generator
    participant PDFLib as pdf-lib
    participant Output as PDF Output

    Dev->>Template: Create template<br/>(basePdf + schemas)
    Dev->>Generator: generate({template, inputs, plugins})

    Generator->>Generator: Parse template
    Generator->>Generator: Load basePdf

    loop For each input
        Generator->>Generator: Apply schema values
        Generator->>PDFLib: Render text, images, barcodes
        PDFLib->>Generator: Page content
    end

    Generator->>Output: Return Uint8Array

    alt Browser Environment
        Output->>Dev: Create Blob, trigger download
    else Node.js Environment
        Output->>Dev: Write to file system
    end
```

## UI Components Architecture

```mermaid
flowchart TB
    subgraph UI_Package["@pdfme/ui Package"]
        Designer["Designer<br/>WYSIWYG Template Editor"]
        Form["Form<br/>Data Entry Interface"]
        Viewer["Viewer<br/>PDF Preview"]
    end

    subgraph Designer_Features["Designer Features"]
        D1["Drag & Drop Elements"]
        D2["Property Panel Editing"]
        D3["Multi-page Support"]
        D4["Schema Type Selection"]
        D5["Real-time Preview"]
    end

    subgraph Form_Features["Form Features"]
        F1["Template-based Input"]
        F2["Field Validation"]
        F3["Dynamic Data Binding"]
    end

    subgraph Viewer_Features["Viewer Features"]
        V1["PDF Rendering"]
        V2["Mobile Optimized"]
        V3["Template Overlay"]
    end

    Designer --> Designer_Features
    Form --> Form_Features
    Viewer --> Viewer_Features

    style UI_Package fill:#e3f2fd
    style Designer_Features fill:#e8f5e9
    style Form_Features fill:#fff3e0
    style Viewer_Features fill:#f3e5f5
```

## Plugin System Architecture

```mermaid
flowchart TB
    subgraph Plugin["Plugin Structure"]
        pdf["pdf<br/>PDF Rendering Logic<br/>(pdf-lib)"]
        ui["ui<br/>DOM Rendering Logic<br/>(Designer/Form/Viewer)"]
        propPanel["propPanel<br/>Property Editor<br/>(form-render JSON)"]
    end

    subgraph Built_in["Built-in Schemas"]
        Text["text<br/>Text with fonts, colors"]
        Image["image<br/>PNG, JPEG, etc."]
        Barcodes["barcodes<br/>QR, Code128, EAN13..."]
        Table["table<br/>Dynamic tables"]
        Shapes["shapes<br/>Line, Rectangle, Ellipse"]
        SVG["svg<br/>Vector graphics"]
    end

    subgraph Custom["Custom Plugins"]
        Custom1["Custom Schema 1"]
        Custom2["Custom Schema 2"]
        Custom3["Community Plugins"]
    end

    Plugin --> Built_in
    Plugin --> Custom

    style Plugin fill:#f3e5f5
    style Built_in fill:#e8f5e9
    style Custom fill:#fff9c4
```

## Built-in Schema Types

```mermaid
mindmap
    root(("@pdfme/schemas"))
        Text
            Font customization
            Color & size
            Alignment
            Line height
            Dynamic content
        Image
            PNG/JPEG support
            Base64 input
            URL input
            Aspect ratio
        Barcodes
            QR Code
            Code128
            Code39
            EAN13
            EAN8
            UPC-A
            ITF14
            NW7/Codabar
            JAN13
        Table
            Dynamic rows/columns
            Header repeat
            Page breaks
            Cell styling
            Alternating colors
        Shapes
            Line
            Rectangle
            Ellipse/Circle
            Border styling
            Fill colors
        SVG
            Vector graphics
            Scalable output
```

## Data Flow Diagram

```mermaid
flowchart LR
    subgraph Input["Input Data"]
        T["Template JSON"]
        I["Input Array"]
        P["Plugins"]
    end

    subgraph Processing["Processing"]
        Parse["Parse Template"]
        Validate["Validate Schemas"]
        Render["Render Each Page"]
        Combine["Combine Pages"]
    end

    subgraph Output["Output"]
        UA["Uint8Array"]
        Blob["Browser Blob"]
        File["Node.js File"]
    end

    T --> Parse
    I --> Validate
    P --> Render

    Parse --> Validate
    Validate --> Render
    Render --> Combine
    Combine --> UA

    UA --> Blob
    UA --> File

    style Input fill:#e3f2fd
    style Processing fill:#fff3e0
    style Output fill:#e8f5e9
```

## Key Concepts

### Templates
Templates are JSON objects that define the structure of PDFs. They consist of:
- **basePdf**: The static background PDF (can be blank or pre-designed)
- **schemas**: Array of arrays defining variable content per page

### Schemas
Schemas define individual elements in the PDF:
- Position (x, y coordinates in mm)
- Dimensions (width, height)
- Type (text, image, barcode, etc.)
- Type-specific properties (font, color, barcode format, etc.)

### Inputs
Input data is provided as an array where each element generates one PDF document or page:
```javascript
const inputs = [
  { name: 'John Doe', date: '2024-01-15' },
  { name: 'Jane Smith', date: '2024-01-16' }
];
```

### Plugins
Plugins extend schema capabilities with three components:
- **pdf**: Handles rendering to PDF using pdf-lib
- **ui**: Handles rendering to DOM for Designer/Form/Viewer
- **propPanel**: Defines the property editor interface

## Technical Details

### Package Structure

| Package | Purpose | Size |
|---------|---------|------|
| @pdfme/common | Shared types, utilities, constants | Core dependency |
| @pdfme/generator | PDF generation engine | For server & client |
| @pdfme/ui | Designer, Form, Viewer components | React-based UI |
| @pdfme/schemas | Built-in schema plugins | Optional extensions |

### Requirements
- Node.js >= 16
- Modern browsers with ES6+ support
- TypeScript 5.x for type definitions

### Performance
- Most PDF generations complete in tens to hundreds of milliseconds
- Batch generation supported (single call, multiple PDFs)
- Efficient caching recommended for repeated operations

## Integration Examples

### Basic Generation (Node.js)

```javascript
import { generate } from '@pdfme/generator';
import { BLANK_PDF, Template } from '@pdfme/common';
import { text, image } from '@pdfme/schemas';
import fs from 'fs';

const template: Template = {
  basePdf: BLANK_PDF,
  schemas: [[
    {
      name: 'title',
      type: 'text',
      position: { x: 20, y: 20 },
      width: 170,
      height: 10,
    }
  ]]
};

const inputs = [{ title: 'Hello pdfme!' }];
const plugins = { text, image };

generate({ template, inputs, plugins }).then((pdf) => {
  fs.writeFileSync('output.pdf', pdf);
});
```

### Designer Integration (React)

```javascript
import { Designer } from '@pdfme/ui';
import { text, image, barcodes } from '@pdfme/schemas';

const designer = new Designer({
  domContainer: document.getElementById('designer'),
  template: template,
  plugins: { text, image, ...barcodes }
});

// Get updated template
const updatedTemplate = designer.getTemplate();
```

## Ecosystem

```mermaid
flowchart TB
    subgraph Core["pdfme Core"]
        Library["pdfme Library<br/>Open Source MIT"]
    end

    subgraph Services["Services"]
        Cloud["pdfme Cloud<br/>Hosted Solution"]
        Playground["Playground<br/>playground.pdfme.com"]
    end

    subgraph Community["Community"]
        GitHub["GitHub Repository<br/>3.9k+ Stars"]
        Discord["Discord Community"]
        Discussions["GitHub Discussions<br/>Custom Plugin Sharing"]
    end

    subgraph Production["Production Usage"]
        Labelmake["labelmake.jp<br/>100k+ PDFs/month"]
        Enterprise["Enterprise Users"]
    end

    Core --> Services
    Core --> Community
    Core --> Production

    style Core fill:#e3f2fd
    style Services fill:#fff3e0
    style Community fill:#e8f5e9
    style Production fill:#f3e5f5
```

## Key Facts (2024-2025)

- **GitHub Stars**: 3,900+
- **Contributors**: 51+
- **Total Commits**: 1,229+
- **NPM Downloads**: Active with 11+ dependent projects
- **Latest Version**: 5.5.8 (December 2024)
- **License**: MIT (completely free for commercial use)
- **Language**: 98.8% TypeScript
- **Production Scale**: Powers services generating 100,000+ PDFs per month

## Use Cases

### Document Generation
- Invoices and receipts
- Labels and shipping documents
- Certificates and diplomas
- Reports and statements

### Form-Based PDFs
- Application forms
- Contracts with dynamic data
- Personalized documents

### Batch Processing
- Mass mail merge
- Bulk certificate generation
- Automated report generation

### Interactive Design
- Non-technical users designing templates
- In-app PDF template editors
- Custom document builders

## Version History Highlights

| Version | Date | Key Changes |
|---------|------|-------------|
| 5.5.0 | Nov 2024 | Added headerRepeat option for tables |
| 5.4.1 | Jul 2024 | XSS vulnerability prevention, security improvements |
| 5.2.0 | Nov 2023 | Headers/footers in fixed positions, template engine |
| 5.0.0 | Sep 2023 | Breaking: Schema array format, removed deprecated schemas |
| 4.5.0 | 2023 | Table schema introduced |

## Comparison with Alternatives

```mermaid
flowchart LR
    subgraph pdfme["pdfme"]
        P1["Template-based"]
        P2["WYSIWYG Designer"]
        P3["Browser + Node.js"]
        P4["Plugin system"]
    end

    subgraph pdfkit["PDFKit"]
        K1["Programmatic only"]
        K2["No visual editor"]
        K3["Node.js focused"]
        K4["Low-level API"]
    end

    subgraph jspdf["jsPDF"]
        J1["Imperative API"]
        J2["Browser focused"]
        J3["Manual positioning"]
        J4["Limited plugins"]
    end

    style pdfme fill:#e8f5e9
    style pdfkit fill:#fff3e0
    style jspdf fill:#f3e5f5
```

## Security Considerations

- **Input Sanitization**: Version 5.4.1+ includes XSS vulnerability prevention
- **No Server Required**: Client-side generation means no data leaves the browser
- **MIT License**: Full code transparency and auditability
- **Dependency Security**: Regular dependency updates for security patches

## Getting Started Checklist

1. Install packages: `npm i @pdfme/generator @pdfme/common`
2. Import BLANK_PDF or prepare your base PDF
3. Define schemas for variable content
4. Create input data array
5. Call `generate()` with template, inputs, and plugins
6. Handle output (Blob for browser, Buffer for Node.js)

## Resources

- **Official Website**: [pdfme.com](https://pdfme.com)
- **GitHub Repository**: [github.com/pdfme/pdfme](https://github.com/pdfme/pdfme)
- **Playground**: [playground.pdfme.com](https://playground.pdfme.com)
- **NPM Packages**: [@pdfme/generator](https://www.npmjs.com/package/@pdfme/generator), [@pdfme/ui](https://www.npmjs.com/package/@pdfme/ui), [@pdfme/schemas](https://www.npmjs.com/package/@pdfme/schemas)
- **Documentation**: [pdfme.com/docs/getting-started](https://pdfme.com/docs/getting-started)
