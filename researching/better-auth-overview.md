# Better Auth - Technical Overview

Better Auth is a comprehensive, open-source authentication and authorization framework for TypeScript. Unlike managed auth services that store user data externally, Better Auth lets developers keep all authentication data in their own database while providing a rich plugin ecosystem for advanced features like organizations, two-factor authentication, and passkeys.

## High-Level Architecture

```mermaid
graph TB
    subgraph "Client Application"
        UI[Your UI Components]
        SDK[Better Auth Client SDK<br/>React/Vue/Svelte/Solid]
        Cookie[Session Cookie<br/>httpOnly, Secure]
    end

    subgraph "Your Server"
        Handler[Auth Handler<br/>/api/auth/*]
        Core[Better Auth Core]
        Plugins[Plugin System]

        subgraph "Plugins"
            TwoFA[2FA Plugin]
            Org[Organization Plugin]
            Pass[Passkey Plugin]
            Magic[Magic Link Plugin]
            OAuth[OAuth Plugin]
        end
    end

    subgraph "Your Database"
        DB[(Database)]
        UserTable[user table]
        SessionTable[session table]
        AccountTable[account table]
        PluginTables[Plugin tables<br/>organization, twoFactor, etc.]
    end

    subgraph "External Services"
        Providers[OAuth Providers<br/>Google, GitHub, Discord]
        Email[Email Service<br/>For magic links/OTP]
    end

    UI --> SDK
    SDK <-->|API Calls| Handler
    SDK --> Cookie
    Cookie --> Handler
    Handler --> Core
    Core --> Plugins
    Plugins --> TwoFA
    Plugins --> Org
    Plugins --> Pass
    Plugins --> Magic
    Plugins --> OAuth
    Core --> DB
    DB --> UserTable
    DB --> SessionTable
    DB --> AccountTable
    DB --> PluginTables
    OAuth --> Providers
    Magic --> Email

    style Core fill:#6366F1,color:#fff
    style Plugins fill:#8B5CF6,color:#fff
    style DB fill:#10B981,color:#fff
    style SDK fill:#3B82F6,color:#fff
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Client as Client SDK
    participant Server as Auth Handler
    participant DB as Database
    participant OAuth as OAuth Provider

    rect rgb(230, 240, 255)
        Note over User,DB: Email/Password Sign Up
        User->>Client: Enter email + password
        Client->>Server: POST /api/auth/sign-up
        Server->>Server: Hash password (Argon2/bcrypt)
        Server->>DB: Create user + account records
        Server->>DB: Create session
        DB-->>Server: Session ID
        Server-->>Client: Set session cookie
        Client-->>User: Redirect to app
    end

    rect rgb(255, 240, 230)
        Note over User,OAuth: OAuth Sign In
        User->>Client: Click "Sign in with Google"
        Client->>Server: GET /api/auth/sign-in/social?provider=google
        Server-->>User: Redirect to Google OAuth
        User->>OAuth: Authorize application
        OAuth-->>Server: Callback with auth code
        Server->>OAuth: Exchange code for tokens
        Server->>DB: Create/update user + account
        Server->>DB: Create session
        Server-->>Client: Set cookie + redirect
    end

    rect rgb(240, 255, 240)
        Note over User,DB: Session Validation
        User->>Client: Access protected route
        Client->>Server: Request with session cookie
        Server->>Server: Validate cookie signature
        Server->>DB: Fetch session (or use cache)
        DB-->>Server: Session + user data
        Server-->>Client: Return user context
    end
```

## Database Schema

```mermaid
erDiagram
    user {
        string id PK
        string name
        string email UK
        string emailVerified
        string image
        timestamp createdAt
        timestamp updatedAt
    }

    session {
        string id PK
        string userId FK
        string token UK
        timestamp expiresAt
        string ipAddress
        string userAgent
        timestamp createdAt
        timestamp updatedAt
    }

    account {
        string id PK
        string userId FK
        string accountId
        string providerId
        string accessToken
        string refreshToken
        timestamp expiresAt
        string password
    }

    verification {
        string id PK
        string identifier
        string value
        timestamp expiresAt
        timestamp createdAt
        timestamp updatedAt
    }

    organization {
        string id PK
        string name
        string slug UK
        string logo
        timestamp createdAt
    }

    member {
        string id PK
        string organizationId FK
        string userId FK
        string role
        timestamp createdAt
    }

    user ||--o{ session : has
    user ||--o{ account : has
    user ||--o{ member : has
    organization ||--o{ member : has
```

## Key Concepts

### Framework Agnostic Design
Better Auth works with any TypeScript server framework including Next.js, Nuxt, SvelteKit, Remix, Solid Start, Hono, Express, and Elysia. The auth handler mounts at a single endpoint (typically `/api/auth/*`) and handles all authentication routes.

### Plugin Architecture
One of Better Auth's distinguishing features is its plugin system. Complex authentication features like organizations, 2FA, passkeys, and magic links are implemented as plugins that:
- Add their own database tables automatically
- Extend the user/session types
- Expose new API endpoints
- Provide client-side methods

### Database Adapters
Better Auth uses Kysely as its default database handler but provides first-class adapters for:
- **Prisma**: Generates schema.prisma files
- **Drizzle**: Generates TypeScript schema
- **Kysely**: Generates SQL migration files
- **MongoDB**: NoSQL adapter

### Session Management
Sessions are stored in your database (not as JWTs by default), giving you full control over:
- Session revocation
- Multi-device session listing
- Session metadata (IP, user agent)
- Custom session expiration

### Cookie Security
All cookies are:
- `httpOnly`: Not accessible via JavaScript
- `Secure`: Only sent over HTTPS in production
- `SameSite=Lax`: CSRF protection
- Signed with your secret key

## Authentication Methods

```mermaid
graph TB
    subgraph "Credential-Based"
        EP[Email + Password]
        UN[Username + Password]
    end

    subgraph "Passwordless"
        ML[Magic Links<br/>Email link authentication]
        OTP[Email OTP<br/>One-time passwords]
        PK[Passkeys<br/>WebAuthn/FIDO2]
    end

    subgraph "Social OAuth"
        G[Google]
        GH[GitHub]
        D[Discord]
        A[Apple]
        M[Microsoft]
        More[40+ Providers<br/>via Generic OAuth]
    end

    subgraph "Enterprise"
        GenOAuth[Generic OAuth<br/>Auth0, Keycloak, Okta]
        SAML[SAML<br/>via plugin]
    end

    subgraph "Multi-Factor"
        TOTP[TOTP<br/>Authenticator Apps]
        SMS[SMS OTP]
        Backup[Backup Codes]
    end

    EP --> MFA{MFA Enabled?}
    UN --> MFA
    ML --> Session
    OTP --> Session
    PK --> Session

    G --> Session
    GH --> Session
    D --> Session
    A --> Session
    M --> Session
    More --> Session
    GenOAuth --> Session

    MFA -->|Yes| TOTP --> Session
    MFA -->|Yes| SMS --> Session
    MFA -->|Yes| Backup --> Session
    MFA -->|No| Session[Authenticated<br/>Session Created]

    style Session fill:#10B981,color:#fff
    style PK fill:#6366F1,color:#fff
    style ML fill:#8B5CF6,color:#fff
```

## Plugin Ecosystem

```mermaid
graph TB
    subgraph "Core Plugins"
        TwoFA[twoFactor<br/>TOTP & OTP 2FA]
        Org[organization<br/>Multi-tenant support]
        Pass[passkey<br/>WebAuthn authentication]
        Magic[magicLink<br/>Email link auth]
        EmailOTP[emailOTP<br/>Email code auth]
    end

    subgraph "Access Control"
        RBAC[admin<br/>Role-based access]
        AC[Access Control<br/>Custom permissions]
    end

    subgraph "Advanced Features"
        Anon[anonymous<br/>Guest sessions]
        OB[onboarding<br/>User onboarding flows]
        Polar[polar<br/>Payments integration]
        Multi[multiSession<br/>Multiple active sessions]
    end

    subgraph "Integration"
        Bearer[bearer<br/>API token auth]
        JWT[jwt<br/>JWT session encoding]
        OIDC[openAPI<br/>OpenAPI spec generation]
    end

    subgraph "What Plugins Add"
        Tables[Database Tables]
        Types[TypeScript Types]
        Endpoints[API Endpoints]
        Client[Client Methods]
    end

    TwoFA --> Tables
    Org --> Tables
    Pass --> Tables

    TwoFA --> Types
    Org --> Types

    TwoFA --> Endpoints
    Magic --> Endpoints

    TwoFA --> Client
    Magic --> Client

    style TwoFA fill:#EF4444,color:#fff
    style Org fill:#F59E0B,color:#000
    style Pass fill:#10B981,color:#fff
    style Magic fill:#8B5CF6,color:#fff
```

## Session Encoding Strategies

```mermaid
flowchart TB
    subgraph "Cookie Cache Strategies"
        direction TB

        subgraph Compact["Compact (Default)"]
            C1[Base64url encoded]
            C2[HMAC-SHA256 signed]
            C3[Smallest size]
            C4[Best performance]
        end

        subgraph JWT["JWT Strategy"]
            J1[Standard JWT format]
            J2[HS256 signature]
            J3[Readable payload]
            J4[Interoperable]
        end

        subgraph JWE["JWE Strategy"]
            E1[A256CBC-HS512 encrypted]
            E2[Payload hidden]
            E3[Maximum security]
            E4[Largest size]
        end
    end

    subgraph "When to Use"
        UC[Internal Only] --> Compact
        UI[External Systems] --> JWT
        US[Sensitive Data] --> JWE
    end

    subgraph "Security Features"
        S1[Cookie Signing<br/>All strategies]
        S2[httpOnly Flag<br/>XSS protection]
        S3[Secure Flag<br/>HTTPS only in prod]
        S4[SameSite=Lax<br/>CSRF protection]
    end

    style Compact fill:#10B981,color:#fff
    style JWT fill:#3B82F6,color:#fff
    style JWE fill:#6366F1,color:#fff
```

## Organization & Multi-Tenancy

```mermaid
graph TB
    subgraph "User Membership"
        User[User Account]
        Personal[Personal Workspace]
    end

    subgraph "Organization A"
        OrgA[Organization]
        OrgAOwner[Owner Role<br/>Full control]
        OrgAAdmin[Admin Role<br/>Manage members]
        OrgAMember[Member Role<br/>Read access]
        OrgACustom[Custom Roles<br/>Define permissions]
    end

    subgraph "Organization B"
        OrgB[Organization]
        OrgBRoles[Different role<br/>in this org]
    end

    subgraph "Access Control"
        Permissions[Permissions<br/>create, read, update, delete]
        Resources[Resources<br/>members, invitations, etc.]
        Check[hasPermission check<br/>Middleware/component level]
    end

    User --> Personal
    User --> OrgA
    User --> OrgB

    OrgA --> OrgAOwner
    OrgA --> OrgAAdmin
    OrgA --> OrgAMember
    OrgA --> OrgACustom

    OrgAOwner --> Permissions
    OrgAAdmin --> Permissions
    OrgAMember --> Permissions
    Permissions --> Resources
    Resources --> Check

    style User fill:#3B82F6,color:#fff
    style OrgA fill:#10B981,color:#fff
    style OrgB fill:#F59E0B,color:#000
    style Check fill:#EF4444,color:#fff
```

## Technical Details

### Server Configuration
```typescript
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: {
    provider: "postgresql", // or mysql, sqlite
    url: process.env.DATABASE_URL,
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [
    twoFactor(),
    organization(),
    passkey(),
  ],
});
```

### Client Configuration
```typescript
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
  plugins: [
    twoFactorClient(),
    organizationClient(),
    passkeyClient(),
  ],
});
```

### Type Safety
Better Auth is fully typed with TypeScript. Use `$Infer` to get types for users and sessions, including extensions from plugins:

```typescript
type User = typeof auth.$Infer.Session["user"];
type Session = typeof auth.$Infer.Session["session"];
```

### CLI Commands
- `npx @better-auth/cli generate`: Generate database schema for your ORM
- `npx @better-auth/cli migrate`: Apply migrations (Kysely adapter)

### Experimental Joins
Since v1.4, Better Auth supports database joins for 50+ endpoints, providing 2-3x performance improvements by reducing database roundtrips.

## Framework Integration

```mermaid
graph LR
    subgraph "Server Frameworks"
        Next[Next.js<br/>App & Pages Router]
        Nuxt[Nuxt]
        Svelte[SvelteKit]
        Remix[Remix]
        Solid[Solid Start]
        Hono[Hono]
        Express[Express]
        Elysia[Elysia]
    end

    subgraph "Client Frameworks"
        React[React<br/>@better-auth/react]
        Vue[Vue<br/>@better-auth/vue]
        SvelteC[Svelte<br/>@better-auth/svelte]
        SolidC[Solid<br/>@better-auth/solid]
        Vanilla[Vanilla JS<br/>better-auth/client]
    end

    subgraph "Database Adapters"
        Prisma[Prisma]
        Drizzle[Drizzle]
        Kysely[Kysely<br/>Default]
        Mongo[MongoDB]
    end

    subgraph "Supported DBs"
        PG[PostgreSQL]
        MySQL[MySQL]
        SQLite[SQLite]
        More[+ Kysely Dialects<br/>D1, PlanetScale, etc.]
    end

    Next --> Handler[Auth Handler]
    Nuxt --> Handler
    Svelte --> Handler

    React --> Client[Auth Client]
    Vue --> Client
    SvelteC --> Client

    Handler --> Prisma
    Handler --> Drizzle
    Handler --> Kysely

    Kysely --> PG
    Kysely --> MySQL
    Kysely --> SQLite
    Kysely --> More

    style Next fill:#000,color:#fff
    style React fill:#61DAFB,color:#000
    style Vue fill:#42B883,color:#fff
    style Prisma fill:#2D3748,color:#fff
```

## Key Facts (2025)

- **GitHub Stars**: 15,000+ stars on GitHub
- **Weekly Downloads**: 150,000+ npm weekly downloads
- **Discord Community**: 6,000+ members
- **Initial Release**: September 2024
- **Funding**: $5M seed funding (YC X25)
- **License**: MIT (fully open source)
- **Latest Version**: 1.4.x with experimental joins support
- **OAuth Providers**: 40+ built-in + Generic OAuth for custom providers
- **Framework Support**: 10+ server frameworks, 5+ client frameworks
- **Database Support**: PostgreSQL, MySQL, SQLite + any Kysely dialect
- **Data Ownership**: All user data stays in your database

## Use Cases

### Startup MVPs
- Quick setup with email/password and social OAuth
- No external service costs or vendor lock-in
- Type-safe API with excellent DX

### B2B SaaS Applications
- Multi-tenant organizations out of the box
- Role-based access control (RBAC)
- Custom permissions per organization
- Invitation and member management

### Enterprise Applications
- Generic OAuth plugin for Okta, Auth0, Keycloak, Microsoft Entra
- Two-factor authentication (TOTP, SMS, backup codes)
- Session management and audit capabilities
- On-premise data storage requirement compliance

### API-First Products
- Bearer token authentication for APIs
- JWT session encoding for microservices
- OpenAPI spec generation

### Security-Critical Applications
- Passkey/WebAuthn support for phishing-resistant auth
- JWE encrypted cookies for sensitive data
- Built-in rate limiting
- Cookie signing and validation

## Security Considerations

### Built-in Protections
- **Rate Limiting**: Automatic protection against brute-force attacks
- **Cookie Security**: httpOnly, Secure, SameSite=Lax by default
- **Password Hashing**: Argon2/bcrypt with secure defaults
- **CSRF Protection**: State and nonce validation for OAuth callbacks
- **Input Validation**: Comprehensive validation on all endpoints

### Session Security
- Database-backed sessions allow instant revocation
- Optional cookie cache with configurable TTL
- `disableCookieCache: true` for sensitive operations
- Session metadata tracking (IP, user agent)

### Best Practices
- Use `BETTER_AUTH_SECRET` environment variable (32+ characters)
- Enable `baseURL` configuration for production
- Use JWE encoding for sensitive session data
- Implement proper CORS configuration
- Monitor authentication events

### Comparison to Alternatives
| Feature | Better Auth | NextAuth/Auth.js | Lucia Auth |
|---------|-------------|------------------|------------|
| Data Ownership | Your DB | Your DB | Your DB |
| Plugin System | Extensive | Limited | None |
| TypeScript | Native | Good | Native |
| Organizations | Built-in plugin | External | DIY |
| Passkeys | Built-in plugin | Limited | DIY |
| Maintenance | Active | Active | Deprecated |

---

## Sources

- [Better Auth Official Website](https://www.better-auth.com/)
- [Better Auth Documentation](https://www.better-auth.com/docs/introduction)
- [Better Auth GitHub Repository](https://github.com/better-auth/better-auth)
- [Better Auth npm Package](https://www.npmjs.com/package/better-auth)
- [Database Documentation](https://www.better-auth.com/docs/concepts/database)
- [Session Management](https://www.better-auth.com/docs/concepts/session-management)
- [Two-Factor Authentication Plugin](https://www.better-auth.com/docs/plugins/2fa)
- [Organization Plugin](https://www.better-auth.com/docs/plugins/organization)
- [Passkey Plugin](https://www.better-auth.com/docs/plugins/passkey)
- [Magic Link Plugin](https://www.better-auth.com/docs/plugins/magic-link)
- [OAuth Documentation](https://www.better-auth.com/docs/concepts/oauth)
- [Cookie Security](https://www.better-auth.com/docs/concepts/cookies)
- [Drizzle Adapter](https://www.better-auth.com/docs/adapters/drizzle)
- [Prisma Adapter](https://www.better-auth.com/docs/adapters/prisma)
- [Is Better Auth the key to solving authentication headaches? - LogRocket](https://blog.logrocket.com/better-auth-authentication/)
- [Better Auth vs NextAuth vs Auth0 - Better Stack](https://betterstack.com/community/guides/scaling-nodejs/better-auth-vs-nextauth-authjs-vs-autho/)
- [Auth.js vs BetterAuth Comparison - Wisp CMS](https://www.wisp.blog/blog/authjs-vs-betterauth-for-nextjs-a-comprehensive-comparison)
- [BetterAuth with Encore.ts Guide](https://encore.dev/blog/betterauth-tutorial)
- [Better Auth YC X25 Funding](https://www.startuphub.ai/ai-news/funding-round/2025/better-auth-secures-5-million-seed-funding/)
