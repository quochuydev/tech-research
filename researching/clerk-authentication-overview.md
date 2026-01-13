# Clerk Authentication - Technical Overview

Clerk is a complete authentication and user management platform designed for modern web applications, particularly those built with React, Next.js, and other JavaScript frameworks. It provides pre-built UI components, secure session management with short-lived JWTs, and comprehensive B2B features including multi-tenancy and organizations.

## High-Level Architecture

```mermaid
graph TB
    subgraph "Client Application"
        UI[Pre-built UI Components<br/>SignIn, SignUp, UserButton]
        SDK[Clerk Frontend SDK<br/>@clerk/react, @clerk/nextjs]
        Cookie[Session Cookie<br/>__session JWT]
    end

    subgraph "Clerk Infrastructure"
        FAPI[Frontend API - FAPI<br/>clerk.accounts.dev]
        BAPI[Backend API<br/>api.clerk.com]
        Auth[Authentication Service]
        Sessions[Session Management]
        Users[User Database]
        Orgs[Organizations Service]
    end

    subgraph "Your Backend"
        MW[Middleware<br/>clerkMiddleware]
        API[Protected API Routes]
        JWKS[JWKS Validation]
    end

    UI --> SDK
    SDK <-->|Token Refresh| FAPI
    SDK --> Cookie
    Cookie --> MW
    MW -->|Verify JWT| JWKS
    JWKS <-->|Fetch Public Keys| BAPI
    MW --> API
    FAPI --> Auth
    Auth --> Sessions
    Auth --> Users
    Auth --> Orgs

    style FAPI fill:#4F46E5,color:#fff
    style BAPI fill:#4F46E5,color:#fff
    style SDK fill:#10B981,color:#fff
    style MW fill:#F59E0B,color:#000
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant ClerkSDK as Clerk SDK
    participant FAPI as Frontend API
    participant BAPI as Backend API
    participant YourBackend as Your Backend

    User->>Browser: Visit sign-in page
    Browser->>ClerkSDK: Render <SignIn /> component
    ClerkSDK->>FAPI: Request authentication options
    FAPI-->>ClerkSDK: Available auth methods

    User->>ClerkSDK: Enter credentials/OAuth/Passkey
    ClerkSDK->>FAPI: Submit authentication
    FAPI->>FAPI: Validate credentials
    FAPI-->>ClerkSDK: Issue Client Token + Session Token

    Note over ClerkSDK: Store __client cookie on FAPI domain<br/>Store __session cookie with 60s JWT

    ClerkSDK->>YourBackend: Request with __session JWT
    YourBackend->>YourBackend: Validate JWT signature<br/>Check expiration (60s)
    YourBackend-->>Browser: Protected resource

    loop Every 50 seconds
        ClerkSDK->>FAPI: Refresh token request
        FAPI-->>ClerkSDK: New 60s session token
    end
```

## Token Architecture

```mermaid
flowchart TB
    subgraph "Two-Token Model"
        direction TB

        subgraph ClientToken["Client Token (__client)"]
            CT1[Long-lived token]
            CT2[Stored on FAPI domain<br/>clerk.yourdomain.com]
            CT3[Identifies the user session]
            CT4[Not exposed in app logs]
        end

        subgraph SessionToken["Session Token (__session)"]
            ST1[Short-lived JWT - 60 seconds]
            ST2[Stored on app domain]
            ST3[Contains user claims]
            ST4[Verified by your backend]
        end
    end

    subgraph "Token Refresh Cycle"
        direction LR
        R1[Token issued] --> R2[50 second interval]
        R2 --> R3[SDK requests refresh]
        R3 --> R4[FAPI issues new token]
        R4 --> R1
    end

    subgraph "Security Benefits"
        S1[Tokens expire before exploitation]
        S2[Client token isolated from app]
        S3[Automatic refresh - seamless UX]
        S4[Sub-millisecond JWT validation]
    end

    ClientToken --> SessionToken
    SessionToken --> R1

    style ClientToken fill:#3B82F6,color:#fff
    style SessionToken fill:#10B981,color:#fff
```

## Key Concepts

### Frontend API (FAPI)
The Frontend API is a dedicated instance provisioned for each Clerk application, hosted at `https://<slug>.clerk.accounts.dev` in development. It handles per-user authentication flows like signing up, retrieving sessions, creating organizations, and managing invitations.

### Backend API (BAPI)
The Backend API at `api.clerk.com` handles administrative operations that affect multiple users, such as listing all users, banning users, or impersonation. It also provides JWKS endpoints for token verification.

### Session Tokens (JWTs)
Clerk uses 60-second JWTs for session authentication. This extremely short lifetime means tokens typically expire before an attacker can exploit them, while automatic background refresh every 50 seconds ensures seamless user experience.

### Publishable Key
The Publishable Key encodes your FAPI URL in base64 with an environment prefix, enabling your app to locate and communicate with your dedicated Clerk instance.

## Authentication Methods

```mermaid
graph LR
    subgraph "Password-Based"
        PW[Email + Password]
    end

    subgraph "Passwordless"
        ML[Magic Links]
        OTP[Email/SMS OTP]
        PK[Passkeys/WebAuthn]
    end

    subgraph "Social OAuth"
        direction TB
        G[Google]
        GH[GitHub]
        FB[Facebook]
        More[50+ Providers]
    end

    subgraph "Enterprise SSO"
        SAML[SAML]
        OIDC[OIDC]
        IDP[Custom IdP]
    end

    subgraph "Multi-Factor"
        TOTP[Authenticator Apps]
        SMS[SMS Codes]
        BK[Backup Codes]
    end

    PW --> MFA{MFA Required?}
    ML --> MFA
    OTP --> MFA
    PK --> Auth[Authenticated]

    G --> Auth
    GH --> Auth
    FB --> Auth
    More --> Auth

    SAML --> Auth
    OIDC --> Auth
    IDP --> Auth

    MFA --> TOTP --> Auth
    MFA --> SMS --> Auth
    MFA --> BK --> Auth

    style PK fill:#10B981,color:#fff
    style Auth fill:#4F46E5,color:#fff
```

## JWT Verification Flow

```mermaid
flowchart TD
    Request[Incoming Request] --> Extract[Extract JWT from<br/>__session cookie or<br/>Authorization header]

    Extract --> GetKey{Have cached<br/>public key?}

    GetKey -->|No| FetchJWKS[Fetch JWKS from<br/>api.clerk.com/v1/jwks<br/>or FAPI .well-known/jwks.json]
    GetKey -->|Yes| Verify

    FetchJWKS --> Cache[Cache public key]
    Cache --> Verify[Verify JWT Signature]

    Verify --> CheckExp{Check exp claim<br/>Token expired?}
    CheckExp -->|Yes| Reject[401 Unauthorized]

    CheckExp -->|No| CheckNBF{Check nbf claim<br/>Token valid yet?}
    CheckNBF -->|No| Reject

    CheckNBF -->|Yes| CheckAZP{Validate azp claim<br/>Authorized party?}
    CheckAZP -->|No| Reject

    CheckAZP -->|Yes| Success[Authentication Success<br/>Extract user claims]

    Success --> Proceed[Proceed to<br/>protected resource]

    style Success fill:#10B981,color:#fff
    style Reject fill:#EF4444,color:#fff
    style Verify fill:#3B82F6,color:#fff
```

## Organizations & Multi-Tenancy

```mermaid
graph TB
    subgraph "Multi-Tenant Architecture"
        subgraph User["User Account"]
            U1[Single Sign-On]
            U2[Personal Workspace]
            U3[Multiple Org Memberships]
        end

        subgraph Org1["Organization A"]
            O1M[Members]
            O1R[Roles & Permissions]
            O1S[SSO Configuration]
            O1D[Verified Domain]
        end

        subgraph Org2["Organization B"]
            O2M[Members]
            O2R[Roles & Permissions]
            O2S[SSO Configuration]
            O2D[Verified Domain]
        end

        subgraph OrgFeatures["Organization Features"]
            Inv[Invitations]
            VD[Verified Domains<br/>Auto-join by email]
            EC[Enterprise Connections<br/>SAML/OIDC SSO]
            RBAC[Role-Based Access Control]
            Custom[Custom Branding]
        end
    end

    User --> Org1
    User --> Org2

    Org1 --> OrgFeatures
    Org2 --> OrgFeatures

    style User fill:#3B82F6,color:#fff
    style Org1 fill:#10B981,color:#fff
    style Org2 fill:#F59E0B,color:#000
```

## SDK Ecosystem

```mermaid
graph TB
    subgraph "Frontend SDKs"
        React["@clerk/clerk-react<br/>Core React SDK"]
        Next["@clerk/nextjs<br/>Next.js 13.5+ / App Router"]
        Vue["@clerk/vue<br/>Vue 3 SDK"]
        Nuxt["@clerk/nuxt<br/>Nuxt SDK"]
        Astro["@clerk/astro<br/>Astro SDK"]
        Remix["@clerk/remix<br/>Remix SDK"]
        RR["@clerk/react-router<br/>React Router SDK"]
        Expo["@clerk/clerk-expo<br/>React Native/Expo"]
        TS["@clerk/tanstack-start<br/>TanStack Start"]
    end

    subgraph "Backend SDKs"
        JSBackend["@clerk/backend<br/>JavaScript Backend"]
        CSharp["Clerk C# SDK<br/>.NET Backend"]
        Go["Clerk Go SDK"]
        Python["Clerk Python SDK"]
        Ruby["Clerk Ruby SDK"]
    end

    subgraph "UI Components"
        SignIn["<SignIn />"]
        SignUp["<SignUp />"]
        UserButton["<UserButton />"]
        UserProfile["<UserProfile />"]
        OrgSwitcher["<OrganizationSwitcher />"]
        OrgProfile["<OrganizationProfile />"]
    end

    React --> UI[Pre-built Components]
    Next --> UI
    Vue --> UI

    UI --> SignIn
    UI --> SignUp
    UI --> UserButton
    UI --> UserProfile
    UI --> OrgSwitcher
    UI --> OrgProfile

    Next --> JSBackend
    Remix --> JSBackend
    RR --> JSBackend

    style Next fill:#000,color:#fff
    style React fill:#61DAFB,color:#000
    style Vue fill:#42B883,color:#fff
```

## Technical Details

### Session Token Structure
Session tokens are JWTs containing:
- **Standard Claims**: `exp` (expiration), `nbf` (not before), `iat` (issued at)
- **Clerk Claims**: `sub` (user ID), `sid` (session ID), `org_id`, `org_role`, `org_slug`
- **Custom Claims**: Up to 1.2KB of custom claims (browser cookie limit is 4KB)

### JWKS Endpoints
Public keys for JWT verification are available at:
- Backend API: `https://api.clerk.com/v1/jwks`
- Frontend API: `https://<YOUR_FAPI>/.well-known/jwks.json`

### Networkless Verification
For maximum performance, provide the PEM public key directly to `verifyToken()` to avoid network calls during verification. JWT validation runs at sub-millisecond speeds.

### Cookie Security
- `__client` cookie: Set on FAPI domain (clerk.yourdomain.com) for isolation
- `__session` cookie: Contains the short-lived JWT on your app domain
- Domain isolation prevents credential exposure in app logs

## Key Facts (2025)

- **Free Tier**: 10,000 monthly active users and 100 organizations included free
- **Pro Plan**: $25/month base + $0.02 per additional MAU beyond 10,000
- **B2B Add-on**: $100/month for verified domains and custom roles
- **Enterprise SSO**: $50 per SAML connection
- **Token Lifetime**: 60 seconds with 50-second automatic refresh
- **OAuth Providers**: 50+ social login providers supported
- **Passkeys**: WebAuthn-based authentication (requires paid plan in production)
- **SDKs Released (2024-2025)**: Vue/Nuxt official SDK, C# SDK, Next.js v6 for Next.js 15
- **Setup Time**: Production-ready authentication in ~30 minutes
- **SOC 2 Compliant**: Helps simplify your own audit scope

## Use Cases

### B2C Applications
- Social login with 50+ OAuth providers
- Passwordless authentication (magic links, OTP, passkeys)
- User profiles and account management
- Multi-factor authentication

### B2B SaaS
- Multi-tenant organizations with isolated data
- Role-based access control (RBAC)
- Enterprise SSO via SAML/OIDC
- Verified domains for automatic organization membership
- Custom branding per organization

### Mobile Applications
- React Native/Expo SDK with native experience
- Cross-platform passkey synchronization
- Secure token storage

## Security Considerations

### Strengths
- **Short-lived tokens**: 60-second JWTs minimize exploitation window
- **Automatic refresh**: Seamless UX without session interruption
- **Domain isolation**: Client tokens stored on separate FAPI domain
- **JWKS rotation**: Standard key rotation for public key verification
- **Authorized parties (azp)**: Validate token origin to prevent CSRF

### Best Practices
- Always set `authorizedParties` when verifying requests
- Use networkless verification with cached public keys for performance
- Implement proper CORS configuration for your frontend domains
- Monitor for unusual authentication patterns through Clerk Dashboard
- Keep custom claims under 1.2KB to avoid cookie size issues

### Compliance
- SOC 2 Type II certified
- GDPR compliant with data residency options
- Supports EU eIDAS requirements for digital identity

---

## Sources

- [How Clerk Works - Overview](https://clerk.com/docs/guides/how-clerk-works/overview)
- [Session Tokens Documentation](https://clerk.com/docs/guides/sessions/session-tokens)
- [JWT Templates](https://clerk.com/docs/guides/sessions/jwt-templates)
- [Manual JWT Verification](https://clerk.com/docs/guides/sessions/manual-jwt-verification)
- [Organizations Overview](https://clerk.com/docs/organizations/overview)
- [Multi-tenant Architecture](https://clerk.com/docs/guides/how-clerk-works/multi-tenant-architecture)
- [B2B SaaS with Clerk](https://clerk.com/b2b-saas)
- [Next.js Quickstart](https://clerk.com/docs/nextjs/getting-started/quickstart)
- [Clerk Pricing](https://clerk.com/pricing)
- [Sign-up and Sign-in Options](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options)
- [Social Connection Providers](https://clerk.com/docs/guides/configure/auth-strategies/social-connections/all-providers)
- [JavaScript Backend SDK](https://clerk.com/docs/js-backend/getting-started/quickstart)
- [Complete Authentication Guide for Next.js App Router 2025](https://clerk.com/articles/complete-authentication-guide-for-nextjs-app-router)
- [Combining Session Tokens and JWTs](https://clerk.com/blog/combining-the-benefits-of-session-tokens-and-jwts)
