# LiveKit - Technical Overview

LiveKit is an open-source, real-time communication platform built on WebRTC that enables developers to build voice, video, and AI agent applications. It provides a Selective Forwarding Unit (SFU) architecture with comprehensive SDKs for multiple platforms.

## High-Level Architecture

```mermaid
graph TB
    subgraph "LiveKit Platform"
        subgraph "Core Infrastructure"
            SFU[LiveKit SFU Server<br/>Go + Pion WebRTC]
            Redis[(Redis<br/>Peer-to-Peer Routing)]
            Egress[Egress Service<br/>Recording & Streaming]
            Ingress[Ingress Service<br/>RTMP/WHIP Import]
        end

        subgraph "AI Layer"
            Agents[Agents Framework<br/>Python/Node.js]
            Inference[LiveKit Inference<br/>STT/LLM/TTS]
        end

        subgraph "Client SDKs"
            WebSDK[JavaScript SDK]
            MobileSDK[iOS/Android SDK]
            FlutterSDK[Flutter SDK]
            UnitySDK[Unity SDK]
            RustSDK[Rust/Go SDK]
        end
    end

    subgraph "External Services"
        STT[Speech-to-Text<br/>Deepgram, AssemblyAI]
        LLM[LLM Providers<br/>OpenAI, Anthropic]
        TTS[Text-to-Speech<br/>ElevenLabs, Cartesia]
        Storage[Cloud Storage<br/>S3, Azure, GCP]
        Streaming[Streaming Services<br/>YouTube, Twitch]
    end

    WebSDK & MobileSDK & FlutterSDK --> SFU
    SFU --> Redis
    SFU --> Egress
    SFU --> Ingress
    Agents --> SFU
    Agents --> Inference
    Inference --> STT & LLM & TTS
    Egress --> Storage & Streaming

    style SFU fill:#4CAF50,color:#fff
    style Agents fill:#2196F3,color:#fff
    style Inference fill:#9C27B0,color:#fff
```

## How It Works - SFU Architecture

```mermaid
flowchart TB
    subgraph Publishers["Publishers"]
        P1[Publisher 1<br/>Camera + Mic]
        P2[Publisher 2<br/>Screen Share]
    end

    subgraph SFU["LiveKit SFU (Selective Forwarding Unit)"]
        Receiver[WebRTC Receivers<br/>Receive RTP Streams]
        Buffer[Media Buffers<br/>Manage Jitter]
        Forwarder[Forwarder<br/>Layer Selection]
        DownTrack[DownTracks<br/>Per-Subscriber Adaptation]
        Simulcast[Simulcast Manager<br/>Multiple Quality Layers]
    end

    subgraph Subscribers["Subscribers"]
        S1[Subscriber 1<br/>High Bandwidth]
        S2[Subscriber 2<br/>Low Bandwidth]
        S3[Subscriber 3<br/>Mobile Device]
    end

    P1 -->|Video: 1080p, 720p, 360p<br/>Audio: Opus| Receiver
    P2 -->|Screen Share| Receiver
    Receiver --> Buffer
    Buffer --> Simulcast
    Simulcast --> Forwarder
    Forwarder --> DownTrack
    DownTrack -->|1080p| S1
    DownTrack -->|720p| S2
    DownTrack -->|360p| S3

    style SFU fill:#E8F5E9
    style Forwarder fill:#4CAF50,color:#fff
```

## WebRTC Connection Flow

```mermaid
sequenceDiagram
    participant Client as Client App
    participant Backend as Your Backend
    participant Server as LiveKit Server
    participant Room as Room

    Note over Client,Room: Authentication & Connection
    Client->>Backend: Request access token
    Backend->>Backend: Generate JWT<br/>(identity, room, permissions)
    Backend-->>Client: Return access token

    Client->>Server: Connect with token
    Server->>Server: Verify JWT signature
    Server->>Server: Check permissions & TTL
    Server->>Room: Join/Create room
    Room-->>Client: Room state & participants

    Note over Client,Room: Publishing Media
    Client->>Client: Capture media (camera/mic)
    Client->>Server: Publish tracks via WebRTC
    Server->>Server: ICE negotiation & NAT traversal
    Server->>Room: Track available notification
    Room-->>Client: Other participants notified

    Note over Client,Room: Subscribing to Media
    Client->>Server: Subscribe to tracks
    Server->>Server: Adaptive bitrate selection
    Server-->>Client: Forward RTP packets
    Client->>Client: Render media
```

## Voice AI Agent Pipeline

```mermaid
flowchart LR
    subgraph Input["User Input"]
        User[User Speaks]
        Audio[Audio Stream]
    end

    subgraph Agent["LiveKit Voice Agent"]
        subgraph Pipeline["STT → LLM → TTS Pipeline"]
            VAD[Voice Activity<br/>Detection]
            STT[Speech-to-Text<br/>Transcription]
            Turn[Turn Detection<br/>Transformer Model]
            LLM[LLM Processing<br/>Generate Response]
            TTS[Text-to-Speech<br/>Voice Synthesis]
        end

        subgraph Multimodal["Multimodal Agent"]
            Realtime[OpenAI Realtime API<br/>Direct Speech-to-Speech]
        end
    end

    subgraph Output["Agent Output"]
        Response[Audio Response]
        Speaker[Play to User]
    end

    User --> Audio
    Audio --> VAD
    VAD --> STT
    STT --> Turn
    Turn --> LLM
    LLM --> TTS
    TTS --> Response
    Response --> Speaker

    Audio -.->|Alternative| Realtime
    Realtime -.-> Response

    style Pipeline fill:#E3F2FD
    style Multimodal fill:#F3E5F5
    style VAD fill:#FF9800,color:#fff
    style Turn fill:#FF9800,color:#fff
```

## Room, Participants, and Tracks Model

```mermaid
classDiagram
    class Room {
        +String name
        +String sid
        +Participant[] participants
        +Track[] tracks
        +EmptyTimeout duration
        +MaxParticipants int
        +E2EE enabled
        +join()
        +disconnect()
    }

    class Participant {
        +String identity
        +String sid
        +String name
        +ParticipantInfo metadata
        +Track[] audioTracks
        +Track[] videoTracks
        +ConnectionQuality quality
        +boolean isSpeaking
        +publishTrack()
        +unpublishTrack()
    }

    class Track {
        +String sid
        +String name
        +TrackType kind
        +TrackSource source
        +Boolean muted
        +Boolean subscribed
        +SimulcastLayer[] layers
        +subscribe()
        +unsubscribe()
        +setEnabled()
    }

    class LocalParticipant {
        +publishCamera()
        +publishMicrophone()
        +publishScreen()
        +setMicrophoneEnabled()
        +setCameraEnabled()
    }

    class RemoteParticipant {
        +subscribeTracks()
        +unsubscribeTracks()
    }

    Room "1" --> "*" Participant
    Participant "1" --> "*" Track
    Participant <|-- LocalParticipant
    Participant <|-- RemoteParticipant
```

## Distributed Architecture - Multi-Region

```mermaid
graph TB
    subgraph Region1["US-East Region"]
        SFU1[SFU Node 1]
        SFU2[SFU Node 2]
        Redis1[(Redis)]
        SFU1 & SFU2 --> Redis1
    end

    subgraph Region2["EU-West Region"]
        SFU3[SFU Node 3]
        SFU4[SFU Node 4]
        Redis2[(Redis)]
        SFU3 & SFU4 --> Redis2
    end

    subgraph Region3["Asia-Pacific Region"]
        SFU5[SFU Node 5]
        Redis3[(Redis)]
        SFU5 --> Redis3
    end

    subgraph Mesh["Distributed Mesh Network"]
        Relay[Inter-Region Relay<br/>FlatBuffers Protocol]
    end

    Region1 <--> Relay
    Region2 <--> Relay
    Region3 <--> Relay

    User1[US User] --> SFU1
    User2[EU User] --> SFU3
    User3[Asia User] --> SFU5

    style Mesh fill:#FFF3E0
    style Relay fill:#FF9800,color:#fff
```

## Egress & Ingress Flow

```mermaid
flowchart TB
    subgraph Ingress["Ingress - Bring External Streams In"]
        OBS[OBS Studio]
        Hardware[Hardware Encoder]
        RTMP[RTMP Endpoint]
        WHIP[WHIP Endpoint]
        IngressService[Ingress Service<br/>Transcode + Simulcast]
    end

    subgraph LiveKit["LiveKit Room"]
        Room[Room with Participants]
    end

    subgraph Egress["Egress - Export Streams Out"]
        EgressService[Egress Service<br/>GStreamer Transcode]
        Recording[MP4 Recording]
        HLS[HLS Segments]
        RTMPOut[RTMP Stream]
    end

    subgraph Destinations["Destinations"]
        S3[S3 / Azure / GCP]
        YouTube[YouTube Live]
        Twitch[Twitch]
        Facebook[Facebook Live]
    end

    OBS -->|RTMP| RTMP
    Hardware -->|WHIP| WHIP
    RTMP & WHIP --> IngressService
    IngressService --> Room

    Room --> EgressService
    EgressService --> Recording & HLS & RTMPOut
    Recording & HLS --> S3
    RTMPOut --> YouTube & Twitch & Facebook

    style IngressService fill:#4CAF50,color:#fff
    style EgressService fill:#2196F3,color:#fff
```

## Security Architecture

```mermaid
flowchart TB
    subgraph Auth["Authentication Layer"]
        JWT[JWT Access Token<br/>API Key + Secret]
        Permissions[Room Permissions<br/>Publish/Subscribe/Admin]
        TTL[Token Expiration<br/>Auto-Refresh via SDK]
    end

    subgraph Transport["Transport Security"]
        TLS[TLS 1.3<br/>256-bit Encryption]
        DTLS[DTLS-SRTP<br/>Media Encryption]
        AES128[AES-128<br/>RTP Encryption]
    end

    subgraph E2EE["End-to-End Encryption"]
        KeyProvider[Key Provider<br/>Shared or Per-Participant]
        Encryption[Client-Side Encryption<br/>Before Transmission]
        Decryption[Client-Side Decryption<br/>After Receipt]
    end

    subgraph AtRest["Data at Rest"]
        AES256[AES-256<br/>Storage Encryption]
    end

    Client[Client] --> JWT
    JWT --> TLS
    TLS --> LiveKit[LiveKit Server]

    Client -->|With E2EE| Encryption
    Encryption --> DTLS
    DTLS --> LiveKit
    LiveKit --> DTLS
    DTLS --> Decryption
    Decryption --> OtherClient[Other Client]

    KeyProvider --> Encryption & Decryption

    style E2EE fill:#FFEBEE
    style KeyProvider fill:#F44336,color:#fff
```

## Ecosystem - Participants & Use Cases

```mermaid
graph TB
    subgraph Core["LiveKit Core"]
        Server[LiveKit Server<br/>Open Source - Apache 2.0]
        Cloud[LiveKit Cloud<br/>Managed Service]
    end

    subgraph SDKs["Client SDKs"]
        JS[JavaScript/TypeScript]
        React[React Components]
        Swift[iOS/Swift]
        Kotlin[Android/Kotlin]
        Flutter[Flutter]
        Unity[Unity/C#]
        Rust[Rust]
        Go[Go]
        Python[Python]
    end

    subgraph AgentEcosystem["Agent Ecosystem"]
        AgentSDK[Agents SDK<br/>Python & Node.js]
        Plugins[Provider Plugins<br/>OpenAI, Deepgram, etc.]
        AgentBuilder[Agent Builder<br/>No-Code Interface]
    end

    subgraph UseCases["Use Cases"]
        VideoConf[Video Conferencing]
        VoiceAI[Voice AI Assistants]
        Telehealth[Telehealth]
        CallCenter[Call Centers]
        Gaming[Gaming/NPCs]
        Robotics[Robotics]
        LiveStream[Live Streaming]
        Translation[Real-time Translation]
    end

    Core --> SDKs
    Core --> AgentEcosystem
    SDKs --> UseCases
    AgentEcosystem --> UseCases

    style Server fill:#4CAF50,color:#fff
    style Cloud fill:#2196F3,color:#fff
    style AgentSDK fill:#9C27B0,color:#fff
```

## Key Concepts

### Selective Forwarding Unit (SFU)

Unlike MCU (Multipoint Control Unit) that decodes and re-encodes all streams, an SFU routes media packets directly without transcoding:

| Aspect | SFU (LiveKit) | MCU |
|--------|---------------|-----|
| **Latency** | Ultra-low (~100-300ms) | Higher (decoding delay) |
| **Server CPU** | Low (just routing) | High (transcoding) |
| **Flexibility** | Full control per track | Single composite |
| **Bandwidth** | More downstream | Less downstream |
| **Scalability** | Horizontal | Vertical |

### Simulcast

Publishers send multiple quality layers (e.g., 1080p, 720p, 360p). The SFU selects the appropriate layer for each subscriber based on:
- Available bandwidth
- Device capabilities
- Network conditions

### Rooms and Tracks

- **Room**: Virtual space where participants connect
- **Participant**: User or agent in a room
- **Track**: Individual audio or video stream
  - **Source Types**: Camera, Microphone, Screen Share
  - **Track Types**: Audio, Video

### Voice Pipeline Components

1. **VAD (Voice Activity Detection)**: Detects when user is speaking
2. **STT (Speech-to-Text)**: Converts speech to text
3. **Turn Detection**: Determines when user finished speaking
4. **LLM**: Generates response
5. **TTS (Text-to-Speech)**: Converts text to audio

## Key Facts (2025)

- **Scale**: Single session supports up to 100,000 simultaneous users
- **Latency**: Sub-300ms latency for global participants
- **Developers**: 100,000+ developers on LiveKit Cloud
- **Usage**: 3+ billion calls per year on LiveKit Cloud
- **License**: Apache 2.0 (fully open source)
- **Languages**: Server written in Go with Pion WebRTC
- **SDKs**: 10+ client SDKs (JS, React, iOS, Android, Flutter, Unity, Rust, Go, Python, Node.js)
- **Free Tier**: 10,000 participant minutes/month
- **AI Inference**: Free until January 1, 2026
- **Noise Cancellation**: Partnered with Krisp for AI-powered noise suppression

## Technical Specifications

| Component | Technology |
|-----------|------------|
| **Server Language** | Go |
| **WebRTC Implementation** | Pion |
| **Transport Encryption** | TLS 1.3 (256-bit) |
| **Media Encryption** | AES-128 (SRTP) |
| **Storage Encryption** | AES-256 |
| **Clustering** | Redis |
| **Inter-Region Protocol** | FlatBuffers |
| **Transcoding** | GStreamer |
| **E2EE** | SFrame (optional) |

## Common Use Cases

1. **Video Conferencing**: Build Zoom/Meet-like applications
2. **Voice AI Assistants**: Create conversational AI agents
3. **Telehealth**: HIPAA-compliant medical consultations
4. **Call Centers**: AI-powered inbound/outbound support
5. **Live Streaming**: Broadcast to YouTube, Twitch with recording
6. **Gaming NPCs**: Voice-enabled AI characters
7. **Robotics**: Cloud-based robot brains
8. **Real-time Translation**: Multi-language conversations

## Integration Providers

### Speech-to-Text
- Deepgram, AssemblyAI, OpenAI Whisper, Google Speech, Azure Speech, Speechmatics

### Large Language Models
- OpenAI GPT-4, Anthropic Claude, Google Gemini, Open-source models

### Text-to-Speech
- ElevenLabs, Cartesia, OpenAI TTS, Azure Neural Voice, Google TTS, Rime

## Sources

- [LiveKit Official Website](https://livekit.io/)
- [LiveKit Documentation](https://docs.livekit.io/)
- [LiveKit GitHub Repository](https://github.com/livekit/livekit)
- [LiveKit Agents Framework](https://github.com/livekit/agents)
- [LiveKit SFU Architecture](https://docs.livekit.io/reference/internals/livekit-sfu/)
- [LiveKit Security](https://livekit.io/security)
- [LiveKit Cloud Pricing](https://livekit.io/pricing)
- [Scaling WebRTC with Distributed Mesh](https://blog.livekit.io/scaling-webrtc-with-distributed-mesh/)
