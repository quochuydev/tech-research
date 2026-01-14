# Universal Commerce Protocol (UCP) - Technical Overview

## High-Level Architecture

The Universal Commerce Protocol (UCP) is an open standard that enables seamless commerce interactions between AI agents, applications, businesses, and payment providers. It establishes a "common language and functional primitives" for the agentic commerce ecosystem.

```mermaid
graph TB
    subgraph "Consumer Surfaces"
        Platform1[AI Shopping Assistant]
        Platform2[Search AI Mode]
        Platform3[Super Apps]
        Platform4[Voice Commerce]
    end

    subgraph "UCP Protocol Layer"
        Discovery[Discovery<br/>/.well-known/ucp]
        Capabilities[Capabilities<br/>Checkout, Identity, Order]
        Extensions[Extensions<br/>Discounts, Fulfillment]
        Transport[Transport Layer<br/>REST, MCP, A2A]
    end

    subgraph "Business Layer"
        Merchant1[Retailers]
        Merchant2[Service Providers]
        Merchant3[Marketplaces]
    end

    subgraph "Payment Infrastructure"
        PSP[Payment Service Providers<br/>Stripe, Adyen, PayPal]
        CP[Credential Providers<br/>Google Pay, Shop Pay]
    end

    Platform1 & Platform2 & Platform3 & Platform4 --> Discovery
    Discovery --> Capabilities
    Capabilities --> Extensions
    Extensions --> Transport
    Transport --> Merchant1 & Merchant2 & Merchant3
    Transport --> PSP & CP
    PSP & CP --> Merchant1 & Merchant2 & Merchant3

    style Discovery fill:#4285f4,color:#fff
    style Capabilities fill:#34a853,color:#fff
    style Extensions fill:#fbbc04,color:#000
    style Transport fill:#ea4335,color:#fff
```

## How It Works - Agentic Commerce Flow

```mermaid
sequenceDiagram
    participant User
    participant Agent as AI Agent/Platform
    participant Discovery as Discovery Endpoint
    participant Business as Business Server
    participant PSP as Payment Provider

    User->>Agent: "Find me a birthday gift under $50"

    Note over Agent,Discovery: 1. Capability Discovery
    Agent->>Discovery: GET /.well-known/ucp
    Discovery-->>Agent: Profile (capabilities, handlers, keys)

    Note over Agent,Business: 2. Capability Negotiation
    Agent->>Business: UCP-Agent header with platform profile
    Business-->>Agent: Negotiated intersection of capabilities

    Note over Agent,Business: 3. Checkout Session
    Agent->>Business: POST /checkout (create session)
    Business-->>Agent: Session ID, line items, totals

    Agent->>Business: PUT /checkout/{id} (update cart)
    Business-->>Agent: Updated totals, tax calculation

    Note over Agent,PSP: 4. Payment Acquisition
    Agent->>PSP: Acquire payment credential
    PSP-->>Agent: Opaque payment token

    Note over Agent,Business: 5. Transaction Completion
    Agent->>Business: POST /checkout/{id}/complete
    Business->>PSP: Process payment with token
    PSP-->>Business: Authorization confirmed
    Business-->>Agent: Order confirmation

    Agent-->>User: "Order placed! Confirmation #12345"
```

## Key Concepts

### Four Primary Actors

The UCP ecosystem defines four key roles that interact through the protocol:

| Actor | Description | Examples |
|-------|-------------|----------|
| **Platform** | Consumer-facing surface orchestrating user journeys | Gemini, ChatGPT, Search AI Mode |
| **Business** | Merchant or service provider (Merchant of Record) | Shopify stores, Etsy sellers, Target |
| **Credential Provider** | Manages payment instruments and personal data | Google Pay, Shop Pay, Apple Pay |
| **Payment Service Provider** | Processes authorizations and settlements | Stripe, Adyen, PayPal |

### Layered Protocol Architecture

UCP follows a TCP/IP-inspired layered approach:

```mermaid
graph TB
    subgraph Layer3["Extensions Layer"]
        Discounts[dev.ucp.shopping.discount]
        Fulfillment[dev.ucp.shopping.fulfillment]
        Mandates[AP2 Mandates]
        Custom[com.vendor.custom.*]
    end

    subgraph Layer2["Capabilities Layer"]
        Checkout[dev.ucp.shopping.checkout]
        Order[dev.ucp.shopping.order]
        Identity[dev.ucp.common.identity_linking]
    end

    subgraph Layer1["Transport Layer"]
        REST[REST API<br/>OpenAPI 3.x]
        MCP[Model Context Protocol<br/>LLM Tool Mapping]
        A2A[Agent2Agent Protocol<br/>Agent Card Discovery]
        EP[Embedded Protocol<br/>JSON-RPC]
    end

    Layer3 --> Layer2
    Layer2 --> Layer1

    style Checkout fill:#34a853,color:#fff
    style Order fill:#4285f4,color:#fff
    style Identity fill:#ea4335,color:#fff
```

### Namespace Governance

UCP uses reverse-domain naming to enable decentralized capability ownership:

```
{reverse-domain}.{service}.{capability}

Examples:
- dev.ucp.shopping.checkout      → Authority: ucp.dev
- com.shopify.payments.shopPay   → Authority: shopify.com
- com.loyaltyprovider.rewards    → Authority: loyaltyprovider.com
```

This eliminates the need for a central registry and enables an "open bazaar of capabilities."

## Core Capabilities

### 1. Checkout Capability (`dev.ucp.shopping.checkout`)

The foundation of UCP commerce transactions:

```mermaid
stateDiagram-v2
    [*] --> incomplete: Create Session

    incomplete --> incomplete: Update cart
    incomplete --> requires_escalation: Human intervention needed
    incomplete --> ready_for_complete: All data provided

    requires_escalation --> incomplete: Human completed action
    requires_escalation --> ready_for_complete: Issue resolved

    ready_for_complete --> completed: Process payment
    ready_for_complete --> incomplete: Cart modified

    completed --> [*]: Order created

    note right of incomplete
        Missing buyer info,
        shipping address,
        or payment method
    end note

    note right of requires_escalation
        continue_url provided
        for embedded checkout
    end note
```

**Features:**
- Multi-item cart management with line items
- Dynamic pricing and tax calculation
- Payment handler negotiation
- Checkout session state machine
- Support for human-in-the-loop escalation

### 2. Identity Linking Capability (`dev.ucp.common.identity_linking`)

OAuth 2.0-based authorization for acting on behalf of users:

```mermaid
sequenceDiagram
    participant User
    participant Platform as AI Platform
    participant AuthServer as Business Auth Server
    participant Resource as Business Resources

    User->>Platform: Request to access business account
    Platform->>User: Redirect to authorization
    User->>AuthServer: Authorize access
    AuthServer->>User: Authorization code
    User->>Platform: Code callback
    Platform->>AuthServer: Exchange code for tokens
    AuthServer-->>Platform: Access + Refresh tokens

    Note over Platform,Resource: Platform can now act on behalf of user
    Platform->>Resource: API call with Bearer token
    Resource-->>Platform: Protected resources

    Note over Platform: Scope: ucp:scopes:checkout_session
    Note over Platform: Grants: Get, Create, Update, Delete, Cancel, Complete
```

**Use Cases:**
- Accessing loyalty benefits and rewards
- Personalized offers and pricing
- Wishlist and saved cart management
- Authenticated checkouts

### 3. Order Capability (`dev.ucp.shopping.order`)

Webhook-based lifecycle management for post-purchase tracking:

```mermaid
flowchart LR
    subgraph "Order Lifecycle Events"
        Created[Order Created] --> Processing[Processing]
        Processing --> Shipped[Shipped]
        Shipped --> Delivered[Delivered]
        Processing --> Cancelled[Cancelled]
        Delivered --> Returned[Return Initiated]
        Returned --> Refunded[Refunded]
    end

    subgraph "Webhook Notifications"
        W1[order.created]
        W2[order.shipped]
        W3[order.delivered]
        W4[order.cancelled]
        W5[order.return.initiated]
        W6[order.refund.completed]
    end

    Created -.-> W1
    Shipped -.-> W2
    Delivered -.-> W3
    Cancelled -.-> W4
    Returned -.-> W5
    Refunded -.-> W6

    style Created fill:#4285f4,color:#fff
    style Delivered fill:#34a853,color:#fff
    style Cancelled fill:#ea4335,color:#fff
    style Refunded fill:#fbbc04,color:#000
```

## Technical Details

### Discovery & Profile Structure

Businesses expose their UCP profile at `/.well-known/ucp`:

```json
{
  "ucp": {
    "version": "2026-01-11",
    "services": [
      {
        "name": "dev.ucp.shopping.checkout",
        "version": "2026-01-11",
        "spec": "https://ucp.dev/specs/checkout.yaml",
        "endpoint": "https://api.example.com/ucp"
      }
    ],
    "capabilities": ["checkout", "identity_linking", "order"]
  },
  "payment": {
    "handlers": [
      {
        "id": "stripe-card",
        "name": "com.stripe.card",
        "version": "1.0.0",
        "config": { "publishable_key": "pk_live_..." }
      }
    ]
  },
  "signing_keys": [
    { "kty": "RSA", "kid": "key-1", "n": "...", "e": "AQAB" }
  ]
}
```

### Payment Architecture - The Trust Triangle

```mermaid
graph TB
    subgraph "Trust Triangle"
        Platform[Platform/Agent]
        Business[Business/Merchant]
        PSP[Payment Provider]
    end

    Platform -->|"1. Requests checkout"| Business
    Platform -->|"2. Acquires opaque token<br/>(no raw credentials)"| PSP
    Platform -->|"3. Submits token"| Business
    Business -->|"4. Processes payment<br/>(legal relationship)"| PSP
    PSP -->|"5. Authorization result"| Business
    Business -->|"6. Order confirmation"| Platform

    style Platform fill:#4285f4,color:#fff
    style Business fill:#34a853,color:#fff
    style PSP fill:#fbbc04,color:#000
```

**Key Principles:**
- Platforms never touch raw financial credentials
- Payment instruments are separated from payment handlers
- Tokenized payments minimize PCI-DSS scope
- Merchants retain full control of settlement and compliance

### Security Mechanisms

| Mechanism | Purpose |
|-----------|---------|
| **HTTPS (mandatory)** | Transport layer security |
| **OAuth 2.0** | Identity linking and authorization |
| **Bearer Tokens** | Platform-to-business authentication |
| **JWT Signatures** | Webhook verification |
| **Request Signing** | Non-repudiation via `request-signature` headers |
| **Idempotency Keys** | Prevent duplicate transaction processing |
| **AP2 Mandates** | Cryptographic proof of user consent for autonomous agents |

### Negotiation Protocol

When platforms and businesses connect, they compute the intersection of their capabilities:

```mermaid
flowchart TD
    A[Platform sends profile URL<br/>via UCP-Agent header] --> B[Business retrieves platform profile]
    B --> C[Compute capability intersection]
    C --> D{Extensions<br/>have parent?}
    D -->|No| E[Remove orphan extension]
    E --> C
    D -->|Yes| F[Include in negotiated set]
    F --> G{Stable?}
    G -->|No| C
    G -->|Yes| H[Return negotiated capabilities]
    H --> I[Proceed with common features]

    style C fill:#4285f4,color:#fff
    style H fill:#34a853,color:#fff
```

## Ecosystem Participants

```mermaid
graph TB
    subgraph "Co-Developers"
        Google[Google]
        Shopify[Shopify]
        Etsy[Etsy]
        Wayfair[Wayfair]
        Target[Target]
        Walmart[Walmart]
    end

    subgraph "Payment Partners"
        Stripe[Stripe]
        Adyen[Adyen]
        Visa[Visa]
        Mastercard[Mastercard]
        Amex[American Express]
        PayPal[PayPal]
    end

    subgraph "Retail Partners"
        BestBuy[Best Buy]
        HomeDepot[The Home Depot]
        Macys[Macy's Inc]
        Flipkart[Flipkart]
        Zalando[Zalando]
    end

    subgraph "AI Platforms"
        Gemini[Google Gemini]
        SearchAI[Search AI Mode]
        Shopping[Google Shopping]
    end

    Google --> UCP((UCP Standard))
    Shopify --> UCP
    UCP --> Payment
    UCP --> Retail
    UCP --> AI

    subgraph Payment[Payment Partners]
        Stripe & Adyen & Visa & Mastercard & Amex & PayPal
    end

    subgraph Retail[Retail Partners]
        BestBuy & HomeDepot & Macys & Flipkart & Zalando
    end

    subgraph AI[AI Platforms]
        Gemini & SearchAI & Shopping
    end

    style UCP fill:#4285f4,color:#fff
```

## Key Facts (2026)

- **Version:** 2026-01-11 (date-based versioning: YYYY-MM-DD)
- **License:** Apache 2.0 (open source)
- **Co-Developers:** Google, Shopify, Etsy, Wayfair, Target, Walmart
- **Endorsers:** 60+ organizations including Visa, Mastercard, Stripe, PayPal
- **Transport Protocols:** REST API, MCP, A2A, Embedded Protocol (JSON-RPC)
- **Core Capabilities:** Checkout, Identity Linking, Order Management
- **Extensions:** Discounts, Fulfillment, AP2 Mandates, Subscription Mandates
- **Discovery Endpoint:** `/.well-known/ucp`
- **OAuth Discovery:** `/.well-known/oauth-authorization-server` (RFC 8414)
- **GitHub:** [Universal-Commerce-Protocol/ucp](https://github.com/Universal-Commerce-Protocol/ucp)
- **Documentation:** [ucp.dev](https://ucp.dev)

## Use Cases

### 1. AI-Powered Shopping Assistants

Agents can discover products, manage carts, and complete purchases autonomously:

```
User: "Find me running shoes under $150"
Agent: [Discovers capabilities via /.well-known/ucp]
Agent: [Searches product catalog, filters by price]
Agent: [Creates checkout session, adds items]
Agent: [Acquires payment token from user's wallet]
Agent: [Completes purchase, returns order confirmation]
```

### 2. Voice Commerce

Surface-agnostic design enables voice-first shopping experiences:

- "Hey Google, reorder my coffee pods"
- Platform retrieves identity-linked account
- Accesses saved preferences and payment methods
- Completes transaction with voice confirmation

### 3. Embedded Checkout

When agents encounter capability gaps, graceful degradation to human-in-the-loop:

```mermaid
flowchart LR
    Agent[AI Agent] --> Check{Full autonomous<br/>capability?}
    Check -->|Yes| Complete[Complete via API]
    Check -->|No| Escalate[requires_escalation]
    Escalate --> URL[continue_url]
    URL --> Embedded[Embedded Checkout]
    Embedded --> Human[Human completes action]
    Human --> Resume[Agent resumes session]
```

### 4. Multi-Merchant Carts

Platforms can orchestrate purchases across multiple businesses in a single user journey, with each merchant maintaining Merchant of Record status.

## UCP vs. ACP Comparison

| Aspect | UCP (Google) | ACP (OpenAI) |
|--------|--------------|--------------|
| **Primary Surfaces** | Gemini, Search AI Mode, Google Shopping | ChatGPT, OpenAI ecosystem |
| **Payment Focus** | Google Pay (PayPal planned) | Delegated tokens (single-use, time-bound) |
| **Merchant Control** | Merchant of Record retained | Merchant controls settlement/refunds |
| **Architecture** | Transport-agnostic, capability-based | Product feed + agent checkout |
| **Interoperability** | Designed to coexist with ACP | Designed to coexist with UCP |

Both protocols are complementary and merchants should prepare to support both as agentic commerce evolves.

## Future Roadmap

- **New Verticals:** Travel, Services, Food Delivery
- **Loyalty Programs:** Standardized rewards and points management
- **Personalization:** Enhanced signals for product discovery
- **Subscription Mandates:** Recurring payment authorization

## Resources

- **Official Documentation:** [ucp.dev](https://ucp.dev)
- **GitHub Repository:** [Universal-Commerce-Protocol/ucp](https://github.com/Universal-Commerce-Protocol/ucp)
- **Specification Overview:** [ucp.dev/specification/overview](https://ucp.dev/specification/overview/)
- **Google Developers Guide:** [developers.google.com/merchant/ucp](https://developers.google.com/merchant/ucp)
- **Shopify Engineering:** [shopify.engineering/UCP](https://shopify.engineering/UCP)

---

*Last updated: January 2026*
