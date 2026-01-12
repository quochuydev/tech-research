# BNB Chain (Binance Smart Chain) - Technical Overview

## High-Level Architecture

```mermaid
graph TB
    subgraph "BNB Chain Ecosystem"
        BSC[BNB Smart Chain<br/>Layer 1 - EVM Compatible]
        opBNB[opBNB<br/>Layer 2 - Optimistic Rollup]
        Greenfield[BNB Greenfield<br/>Decentralized Storage]

        subgraph "Consensus Layer"
            Validators[45 Validators<br/>PoSA Consensus]
            Cabinets[21 Cabinets<br/>Top Staked]
            Candidates[24 Candidates<br/>Remaining]
        end
    end

    Users[Users & dApps] -->|Transactions| BSC
    Users -->|High-frequency Tx| opBNB
    Users -->|Data Storage| Greenfield

    BSC <-->|Cross-chain| opBNB
    BSC <-->|Data Bridge| Greenfield

    Validators --> Cabinets
    Validators --> Candidates
    Cabinets -->|18 selected| BSC
    Candidates -->|3 selected| BSC
```

## Transaction Flow

```mermaid
sequenceDiagram
    participant User
    participant Wallet
    participant BSC as BNB Smart Chain
    participant EVM as EVM Runtime
    participant Validator
    participant Blockchain

    User->>Wallet: Initiate transaction
    Wallet->>Wallet: Sign with private key
    Wallet->>BSC: Broadcast transaction
    BSC->>BSC: Add to mempool

    Validator->>BSC: Select transactions
    Validator->>EVM: Execute smart contract
    EVM->>EVM: Load bytecode + gas

    alt Sufficient Gas
        EVM->>EVM: Execute operations
        EVM->>Validator: Return result
        Validator->>Blockchain: Include in block
        Blockchain->>User: Transaction confirmed (~0.75s)
    else Insufficient Gas
        EVM->>User: Transaction failed<br/>(fees still paid)
    end
```

## Proof of Staked Authority (PoSA) Consensus

```mermaid
flowchart TD
    Start[New Epoch - Every 24 hours] --> Election[Validator Election]
    Election --> Stake{Rank by<br/>Staked BNB}

    Stake -->|Top 21| Cabinet[21 Cabinet Validators]
    Stake -->|Rank 22-45| Candidate[24 Candidate Validators]

    Cabinet -->|18 selected| Active[21 Active Validators<br/>for Epoch]
    Candidate -->|3 selected| Active

    Active --> Block[Produce Block<br/>~0.75 seconds]
    Block --> Verify{Valid Block?}

    Verify -->|Yes| Reward[Distribute Rewards<br/>90% of gas fees]
    Verify -->|No| Slash[Slash Validator<br/>Penalty + Jail]

    Reward --> NextBlock[Next Block]
    Slash --> Jail[30-day Jail<br/>for double-sign]
    NextBlock --> Block

    style Cabinet fill:#F0B90B,color:#14151A
    style Candidate fill:#FF8A38,color:#14151A
    style Active fill:#18DC7E,color:#14151A
    style Slash fill:#F8545F,color:#fff
```

## EVM Architecture & Smart Contract Execution

```mermaid
graph TB
    subgraph "Smart Contract Execution"
        TX[Transaction] --> Load[Load Contract Bytecode]
        Load --> GAS[Allocate Gas<br/>Gas Limit × Gas Price]
        GAS --> EVM[EVM Execution]

        subgraph "EVM Operations"
            EVM --> Stack[Stack Operations]
            EVM --> Memory[Memory Access]
            EVM --> Storage[Storage Read/Write]
            EVM --> Call[External Calls]
        end

        Call -->|Nested Call| EVM2[New EVM Instance]
        EVM2 --> EVM

        EVM --> Check{Gas<br/>Remaining?}
        Check -->|Yes| Continue[Continue Execution]
        Check -->|No| Revert[Revert State<br/>Fees Charged]
        Continue --> Result[Return Result]
    end

    subgraph "Compatibility"
        Solidity[Solidity]
        Tools[Ethereum Tools<br/>Truffle, Hardhat, etc.]
        Standards[Token Standards<br/>BEP-20 ≈ ERC-20]
    end

    Solidity --> Load
    Tools --> TX

    style EVM fill:#F0B90B,color:#14151A
    style Revert fill:#F8545F,color:#fff
```

## BNB Chain Ecosystem Components

```mermaid
graph LR
    subgraph Layer1["Layer 1: BNB Smart Chain"]
        BSC_Core[BSC Core<br/>PoSA Consensus]
        BSC_EVM[EVM Runtime]
        BSC_State[State Storage]
    end

    subgraph Layer2["Layer 2: opBNB"]
        Sequencer[Sequencer]
        Rollup[Optimistic Rollup]
        FraudProof[Fraud Proofs]
    end

    subgraph Storage["BNB Greenfield"]
        SP[Storage Providers]
        DataMarket[Data Marketplace]
        CrossChain[Cross-chain Bridge]
    end

    subgraph DeFi["DeFi Ecosystem"]
        PCS[PancakeSwap<br/>$1.9B TVL]
        Venus[Venus Protocol]
        Ondo[Ondo Markets<br/>Tokenized Securities]
    end

    subgraph Infra["Infrastructure"]
        Wallets[MetaMask, Trust Wallet]
        Explorers[BscScan]
        Oracles[Chainlink, Band]
    end

    Layer1 <--> Layer2
    Layer1 <--> Storage
    Layer1 --> DeFi
    Infra --> Layer1

    style Layer1 fill:#F0B90B,color:#14151A
    style Layer2 fill:#18DC7E,color:#14151A
    style Storage fill:#00FF67,color:#14151A
    style DeFi fill:#FF8A38,color:#14151A
```

## Gas Fee Structure

```mermaid
flowchart LR
    subgraph "Gas Calculation"
        GasUsed[Gas Used<br/>e.g., 21,000 for transfer]
        GasPrice[Gas Price<br/>~3 gwei]
        Fee[Gas Fee = Used × Price<br/>< $0.10 average]
    end

    subgraph "Fee Distribution"
        Total[Total Gas Fee] --> Burn[10% Burned<br/>BEP-95]
        Total --> Validator[15/16 to Block Producer]
        Total --> System[1/16 to System Rewards]
        Validator --> Delegators[Share with Delegators]
    end

    GasUsed --> Fee
    GasPrice --> Fee
    Fee --> Total

    style Burn fill:#F8545F,color:#fff
    style Validator fill:#F0B90B,color:#14151A
```

## Network Participants

```mermaid
graph TB
    subgraph "BNB Chain Participants 2025"
        User[Users<br/>58.9M Monthly Active]
        Developer[Developers<br/>5,600+ dApps]
        Validator[Validators<br/>45 Active Nodes]
        Delegator[Delegators<br/>Stake BNB]
        Builder[Block Builders<br/>36 Builders via PBS]
    end

    User -->|Interact| Developer
    Developer -->|Deploy| Validator
    Delegator -->|Stake 2000+ BNB| Validator
    Builder -->|Build Blocks| Validator

    subgraph "Requirements"
        Val_Req[Validator: 2000 BNB min]
        Block_Time[Block Time: 0.75s]
        Gas_Limit[Block Gas: 140M]
    end
```

## Security Model

```mermaid
flowchart TD
    subgraph "Network Security"
        PoSA[PoSA Consensus<br/>45 Validators]
        Stake[Economic Security<br/>Staked BNB]
        Slash[Slashing Mechanism]
    end

    subgraph "Slashing Conditions"
        DoubleSign[Double Signing] -->|30-day jail| Slash
        MaliciousVote[Malicious Voting] --> Slash
        Offline[Frequent Offline] --> Slash
    end

    subgraph "Community Security"
        Avenger[AvengerDAO<br/>Scam Detection]
        RedAlarm[Red Alarm<br/>Contract Scanning]
        Audit[Security Audits]
    end

    subgraph "opBNB Security"
        Inherit[Inherits BSC Security]
        Fraud[Fraud Proofs]
        Challenge[Challenge Period]
    end

    PoSA --> Stake
    Stake --> Slash

    style Slash fill:#F8545F,color:#fff
    style Avenger fill:#18DC7E,color:#14151A
```

## Key Facts (2025)

### Network Performance
- **Block Time**: ~0.75 seconds (after Maxwell hardfork, June 2025)
- **Finality**: ~6 seconds
- **Block Gas Limit**: 140M (4.6x Ethereum)
- **Average Transaction Fee**: < $0.10
- **Daily Active Users**: 3.6M (highest among L1s)
- **Monthly Active Users**: 58.9M

### Validators & Staking
- **Active Validators**: 45 (21 Cabinets + 24 Candidates)
- **Consensus Validators per Epoch**: 21 (18 Cabinets + 3 Candidates)
- **Minimum Self-Delegation**: 2,000 BNB
- **Fee Burn Rate**: 10% (BEP-95)
- **Validator Reward**: 90% of gas fees

### DeFi Metrics
- **Total Value Locked (TVL)**: $7.1B+
- **30-Day DEX Volume**: $163B+ (June 2025 - #1 chain)
- **PancakeSwap TVL**: $1.9B
- **PancakeSwap DEX Share**: 91.8%

### Ecosystem
- **Total dApps**: 5,600+
- **Block Builders**: 36 (via PBS/BEP-322)
- **Builder API Adoption**: 98% of blocks

### Layer 2 (opBNB)
- **Transaction Cost**: < $0.0001
- **Current TPS**: 5,000-10,000
- **Target TPS**: 20,000 by 2026
- **TVL**: $25.21M

### Market (October 2025)
- **BNB Price**: ~$1,330
- **Market Cap**: ~$170-184B
- **Ranking**: #3-4 by market cap

## Major Upgrades Timeline

| Date | Upgrade | Key Changes |
|------|---------|-------------|
| Apr 2024 | Feynman | Increased validators from 40 to 45 |
| May 2024 | Builder API | PBS implementation (BEP-322) |
| Apr 2025 | Lorentz | Block time reduced to 1.5s |
| Q1 2025 | Pascal | EIP-7702 wallets, BLS12-381 crypto, gas abstraction |
| Jun 2025 | Maxwell | Block time halved to 0.75s |

## Token Standards

| Standard | Chain | Description |
|----------|-------|-------------|
| BEP-2 | BNB Beacon Chain | Native token standard |
| BEP-20 | BNB Smart Chain | ERC-20 equivalent for BSC |

## Use Cases

- **DeFi Trading**: PancakeSwap dominates with 91.8% of DEX volume
- **Tokenized Securities**: Ondo Global Markets for stocks/ETFs
- **Gaming**: opBNB for high-frequency gaming transactions
- **NFTs**: Low-cost minting and trading
- **Cross-chain DeFi**: Bridge assets between chains
- **Decentralized Storage**: BNB Greenfield for data economy

## References

- [BNB Smart Chain Official](https://www.bnbchain.org/en/bnb-smart-chain)
- [Binance Academy - BSC Introduction](https://academy.binance.com/en/articles/an-introduction-to-bnb-smart-chain-bsc)
- [BNB Chain Documentation](https://docs.bnbchain.org/)
- [State of BNB Chain Q1 2025 - Messari](https://messari.io/report/state-of-bnb-chain-q1-2025)
- [BNB Chain Ecosystem 2025 - Dropstab](https://dropstab.com/research/crypto/bnb-ecosystem-in-2025)
- [Cointelegraph - BNB Chain Guide](https://cointelegraph.com/learn/articles/a-beginners-guide-to-the-bnb-chain-the-evolution-of-the-binance-smart-chain)
