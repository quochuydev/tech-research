# How Bitcoin Works - Technical Overview

## High-Level Architecture

```mermaid
graph TB
    subgraph "Bitcoin Network"
        User[User Wallet]
        Mempool[Transaction Mempool]
        Miners[Miners/Mining Pools]
        Blockchain[Blockchain Ledger]
        Nodes[Full Nodes]
    end

    User -->|1. Create & Sign Transaction| Mempool
    Mempool -->|2. Select Transactions| Miners
    Miners -->|3. Mine Block| Blockchain
    Blockchain -->|4. Verify & Propagate| Nodes
    Nodes -->|5. Update Ledger| Blockchain
    Blockchain -->|6. Confirm Transaction| User
```

## Transaction Flow

```mermaid
sequenceDiagram
    participant Sender
    participant Network
    participant Mempool
    participant Miner
    participant Blockchain
    participant Receiver

    Sender->>Sender: Sign transaction with private key
    Sender->>Network: Broadcast transaction
    Network->>Mempool: Add to mempool (waiting area)
    Miner->>Mempool: Select transactions (highest fees first)
    Miner->>Miner: Build candidate block
    Miner->>Miner: Solve proof-of-work puzzle
    Miner->>Network: Broadcast new block
    Network->>Blockchain: Verify & add block
    Blockchain->>Receiver: Transaction confirmed
```

## Mining Process (Proof-of-Work)

```mermaid
flowchart TD
    Start[Start Mining] --> Select[Select transactions from mempool]
    Select --> Build[Build candidate block with:<br/>- Pending transactions<br/>- Coinbase transaction 3.125 BTC<br/>- Transaction fees<br/>- Previous block hash]
    Build --> Nonce[Set nonce = 0]
    Nonce --> Hash[Calculate SHA-256 hash of block header]
    Hash --> Check{Hash < Target<br/>Difficulty?}
    Check -->|No| Increment[Increment nonce]
    Increment --> Hash
    Check -->|Yes| Broadcast[Broadcast valid block to network]
    Broadcast --> Verify[Other nodes verify:<br/>- Proof-of-work<br/>- Transactions validity<br/>- Block structure]
    Verify --> Add[Add to blockchain]
    Add --> Reward[Miner receives:<br/>- 3.125 BTC block reward<br/>- Transaction fees]
    Reward --> Adjust{2016 blocks<br/>mined?}
    Adjust -->|Yes| Difficulty[Adjust difficulty to maintain<br/>~10 min block time]
    Adjust -->|No| Start
    Difficulty --> Start
```

## Blockchain Structure

```mermaid
graph LR
    subgraph Block1[Block N-2]
        H1[Block Header]
        T1[Transactions]
        P1[Prev Hash: 0x000...]
    end

    subgraph Block2[Block N-1]
        H2[Block Header]
        T2[Transactions]
        P2[Prev Hash: H1]
    end

    subgraph Block3[Block N]
        H3[Block Header]
        T3[Transactions]
        P3[Prev Hash: H2]
    end

    Block1 --> Block2
    Block2 --> Block3
    Block3 --> Next[Next Block...]
```

## Bitcoin Transaction Anatomy

```mermaid
classDiagram
    class Transaction {
        +String txid
        +Input[] inputs
        +Output[] outputs
        +int locktime
        +String signature
    }

    class Input {
        +String previous_txid
        +int output_index
        +String scriptSig (signature)
        +String public_key
    }

    class Output {
        +float amount (BTC)
        +String scriptPubKey
        +String recipient_address
    }

    Transaction "1" --> "*" Input
    Transaction "1" --> "*" Output
```

## Network Participants

```mermaid
graph TB
    subgraph "Bitcoin Ecosystem 2025"
        User[Regular Users<br/>Send/Receive BTC]
        FullNode[Full Nodes<br/>Validate & Store<br/>Complete Blockchain]
        Miner[Miners<br/>ASIC Hardware<br/>~700 EH/s Hashrate]
        Pool[Mining Pools<br/>Share Rewards<br/>Stabilize Income]
        Wallet[Wallet Software<br/>Manage Keys<br/>Sign Transactions]
    end

    User --> Wallet
    Wallet --> FullNode
    FullNode --> Miner
    Miner --> Pool
    Pool --> FullNode
    FullNode --> User
```

## Security Model

```mermaid
flowchart TD
    Attack[Attacker wants to modify Block N]
    Attack --> Redo1[Must redo proof-of-work for Block N]
    Redo1 --> Redo2[Must redo Block N+1]
    Redo2 --> Redo3[Must redo Block N+2]
    Redo3 --> RedoAll[Must redo all subsequent blocks]
    RedoAll --> Race[Must outpace entire network<br/>51% of hashrate needed]
    Race --> Cost[Economically infeasible<br/>Hardware + Energy costs]
    Cost --> Secure[Blockchain remains secure]
```

## Key Facts (2025)

- **Block Time**: ~10 minutes (adjusted every 2,016 blocks)
- **Block Reward**: 3.125 BTC (halved April 2024)
- **Daily Issuance**: ~450 BTC (144 blocks/day)
- **Network Hashrate**: >700 EH/s
- **Difficulty Adjustment**: Every ~2 weeks
- **Mining Hardware**: ASIC machines
- **Mining Strategy**: Mostly pool mining