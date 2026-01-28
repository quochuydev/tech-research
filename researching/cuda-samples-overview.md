# NVIDIA CUDA Samples - Technical Overview

## High-Level Architecture

```mermaid
graph TB
    subgraph "CUDA Samples Repository"
        Intro["0_Introduction<br/>Basic CUDA Concepts"]
        Utils["1_Utilities<br/>Device Queries & Bandwidth"]
        Concepts["2_Concepts_and_Techniques<br/>Problem Solving Patterns"]
        Features["3_CUDA_Features<br/>Cooperative Groups, Graphs"]
        Libs["4_CUDA_Libraries<br/>cuBLAS, cuFFT, NPP"]
        Domain["5_Domain_Specific<br/>Graphics, Finance, Images"]
        NVVM["6_libNVVM<br/>NVVM IR Compilation"]
        Platform["7_Platform_Specific<br/>Tegra, cuDLA, NvMedia"]
    end

    subgraph "CUDA Toolkit"
        Runtime[CUDA Runtime API]
        Driver[CUDA Driver API]
        Libraries[GPU Libraries]
        Compiler[NVCC Compiler]
    end

    subgraph "GPU Hardware"
        SM[Streaming Multiprocessors]
        Memory[GPU Memory Hierarchy]
        Cores[CUDA Cores / Tensor Cores]
    end

    Intro --> Runtime
    Utils --> Runtime
    Concepts --> Runtime
    Features --> Runtime
    Libs --> Libraries
    Domain --> Runtime
    Domain --> Libraries
    NVVM --> Compiler
    Platform --> Driver

    Runtime --> SM
    Driver --> SM
    Libraries --> SM
    SM --> Memory
    SM --> Cores

    style Intro fill:#76b900,color:#fff
    style Utils fill:#76b900,color:#fff
    style Concepts fill:#76b900,color:#fff
    style Features fill:#0073c1,color:#fff
    style Libs fill:#0073c1,color:#fff
    style Domain fill:#9c27b0,color:#fff
    style NVVM fill:#ff9800,color:#fff
    style Platform fill:#ff9800,color:#fff
```

## How CUDA Programming Works

```mermaid
sequenceDiagram
    participant Host as Host (CPU)
    participant CUDA as CUDA Runtime
    participant Device as Device (GPU)
    participant SM as Streaming Multiprocessor

    Host->>CUDA: Allocate device memory (cudaMalloc)
    CUDA->>Device: Reserve global memory
    Device-->>CUDA: Memory pointer

    Host->>CUDA: Copy data to device (cudaMemcpy H2D)
    CUDA->>Device: Transfer data to global memory

    Host->>CUDA: Launch kernel <<<grid, block>>>
    CUDA->>Device: Schedule thread blocks

    loop For each thread block
        Device->>SM: Assign block to SM
        SM->>SM: Execute warps (32 threads each)
        SM->>SM: Synchronize threads (__syncthreads)
    end

    Device-->>CUDA: Kernel complete

    Host->>CUDA: Copy results (cudaMemcpy D2H)
    CUDA->>Host: Transfer results

    Host->>CUDA: Free memory (cudaFree)
    CUDA->>Device: Release memory
```

## CUDA Thread Hierarchy

```mermaid
flowchart TB
    subgraph Grid["Grid (Kernel Launch)"]
        subgraph Block0["Block (0,0)"]
            W0["Warp 0<br/>Threads 0-31"]
            W1["Warp 1<br/>Threads 32-63"]
            W2["..."]
            SharedMem0["Shared Memory<br/>~48KB per SM"]
        end

        subgraph Block1["Block (0,1)"]
            W3["Warp 0"]
            W4["Warp 1"]
            W5["..."]
            SharedMem1["Shared Memory"]
        end

        subgraph Block2["Block (1,0)"]
            W6["Warp 0"]
            W7["Warp 1"]
            W8["..."]
            SharedMem2["Shared Memory"]
        end

        subgraph BlockN["Block (N,M)"]
            WN["Warps..."]
            SharedMemN["Shared Memory"]
        end
    end

    subgraph Thread["Single Thread"]
        Registers["Registers<br/>~255 per thread"]
        LocalMem["Local Memory<br/>(Spill to Global)"]
    end

    W0 --> Thread

    style Grid fill:#1a1a2e,color:#fff
    style Block0 fill:#16213e,color:#fff
    style Block1 fill:#16213e,color:#fff
    style Block2 fill:#16213e,color:#fff
    style BlockN fill:#16213e,color:#fff
    style Thread fill:#0f3460,color:#fff
```

## Key Concepts

### CUDA Programming Model

| Concept | Description |
|---------|-------------|
| **Kernel** | Function that runs on the GPU, launched with `<<<grid, block>>>` syntax. Marked with `__global__` qualifier. |
| **Thread** | Smallest execution unit. Each thread has unique IDs (`threadIdx.x/y/z`) and private registers. |
| **Thread Block** | Group of threads that can synchronize and share memory. Max 1024 threads (Compute Capability 2.0+). |
| **Grid** | Collection of thread blocks executing the same kernel. Blocks execute independently. |
| **Warp** | 32 threads executing in SIMT (Single Instruction Multiple Threads) fashion. The GPU's scheduling unit. |
| **Streaming Multiprocessor (SM)** | GPU processor that executes thread blocks. Contains CUDA cores, shared memory, and registers. |

### Memory Hierarchy

```mermaid
graph TB
    subgraph "Off-Chip Memory (High Latency)"
        Global["Global Memory<br/>GBs of storage<br/>~400-900 GB/s bandwidth<br/>Accessible by all threads"]
        Constant["Constant Memory<br/>64KB cached<br/>Read-only, broadcast optimized"]
        Texture["Texture Memory<br/>Cached, read-only<br/>2D/3D spatial locality optimized"]
    end

    subgraph "On-Chip Memory (Low Latency)"
        L2["L2 Cache<br/>Shared across all SMs"]
        Shared["Shared Memory<br/>~48-164KB per SM<br/>User-managed cache"]
        L1["L1 Cache / Shared Memory<br/>Configurable split"]
        Registers["Registers<br/>~64K per SM<br/>Fastest access"]
    end

    Global --> L2
    L2 --> Shared
    L2 --> L1
    Shared --> Registers
    L1 --> Registers
    Constant --> L2
    Texture --> L2

    style Global fill:#c62828,color:#fff
    style Constant fill:#ef6c00,color:#fff
    style Texture fill:#ef6c00,color:#fff
    style L2 fill:#558b2f,color:#fff
    style Shared fill:#1565c0,color:#fff
    style L1 fill:#1565c0,color:#fff
    style Registers fill:#6a1b9a,color:#fff
```

### Memory Access Performance

| Memory Type | Location | Scope | Latency | Bandwidth |
|-------------|----------|-------|---------|-----------|
| **Registers** | On-chip | Thread | 1 cycle | Highest |
| **Shared Memory** | On-chip | Block | ~5 cycles | ~1.5 TB/s |
| **L1 Cache** | On-chip | SM | ~30 cycles | High |
| **L2 Cache** | On-chip | Device | ~200 cycles | ~2-3 TB/s |
| **Global Memory** | Off-chip | Device | ~400-800 cycles | 400-900 GB/s |
| **Constant Memory** | Off-chip (cached) | Device | 1 cycle (cached) | Broadcast |

## CUDA Sample Categories

```mermaid
graph LR
    subgraph "Learning Path"
        direction TB
        L1["0_Introduction"]
        L2["1_Utilities"]
        L3["2_Concepts_and_Techniques"]
        L4["3_CUDA_Features"]
        L5["4_CUDA_Libraries"]
        L6["5_Domain_Specific"]

        L1 --> L2 --> L3 --> L4 --> L5 --> L6
    end

    subgraph "Introduction Samples"
        vectorAdd["vectorAdd<br/>Basic parallel addition"]
        matrixMul["matrixMul<br/>Matrix multiplication"]
        cudaEvents["CUDA Events<br/>Timing & async"]
        openMP["OpenMP+CUDA<br/>Multi-GPU"]
    end

    subgraph "Feature Samples"
        coopGroups["Cooperative Groups<br/>Flexible synchronization"]
        dynamicPar["Dynamic Parallelism<br/>GPU-launched kernels"]
        cudaGraphs["CUDA Graphs<br/>Work batching"]
        unified["Unified Memory<br/>Managed allocation"]
    end

    subgraph "Library Samples"
        cuBLAS["cuBLAS<br/>Linear algebra"]
        cuFFT["cuFFT<br/>FFT transforms"]
        cuRAND["cuRAND<br/>Random numbers"]
        NPP["NPP<br/>Image processing"]
    end

    subgraph "Domain Samples"
        nbody["N-Body Simulation<br/>Physics"]
        fluid["Fluid Simulation<br/>CFD"]
        finance["Monte Carlo<br/>Finance"]
        graphics["OpenGL/Vulkan<br/>Graphics interop"]
    end

    L1 --> vectorAdd & matrixMul & cudaEvents & openMP
    L4 --> coopGroups & dynamicPar & cudaGraphs & unified
    L5 --> cuBLAS & cuFFT & cuRAND & NPP
    L6 --> nbody & fluid & finance & graphics

    style L1 fill:#76b900,color:#fff
    style L2 fill:#76b900,color:#fff
    style L3 fill:#76b900,color:#fff
    style L4 fill:#0073c1,color:#fff
    style L5 fill:#0073c1,color:#fff
    style L6 fill:#9c27b0,color:#fff
```

### Sample Category Details

| Category | Purpose | Key Samples |
|----------|---------|-------------|
| **0_Introduction** | Learn basic CUDA concepts and runtime APIs | vectorAdd, matrixMul, asyncAPI, cudaOpenMP |
| **1_Utilities** | Query device capabilities and benchmark | deviceQuery, bandwidthTest, topologyQuery |
| **2_Concepts_and_Techniques** | Common parallel programming patterns | reduction, scan, histogram, sorting |
| **3_CUDA_Features** | Advanced CUDA capabilities | cooperativeGroups, cudaGraphs, dynamicParallelism |
| **4_CUDA_Libraries** | Using GPU-accelerated libraries | cuBLAS, cuFFT, cuSPARSE, NPP, cuRAND |
| **5_Domain_Specific** | Real-world application examples | nbody, fluidsGL, MonteCarloGPU, imageProcessing |
| **6_libNVVM** | NVVM IR compilation and JIT | simple, ptxgen |
| **7_Platform_Specific** | Platform-specific features | Tegra, cuDLA, NvMedia, NvSci |

## Technical Details

### Building CUDA Samples

```bash
# Clone the repository
git clone https://github.com/NVIDIA/cuda-samples.git
cd cuda-samples

# Linux build
mkdir build && cd build
cmake ..
make -j$(nproc)

# Windows build (Visual Studio 2019+)
cmake .. -G "Visual Studio 16 2019" -A x64
cmake --build . --config Release

# Optional: Enable GPU debugging
cmake .. -DENABLE_CUDA_DEBUG=True

# Optional: Build Tegra samples
cmake .. -DBUILD_TEGRA=True
```

### Requirements

- **CUDA Toolkit**: 11.0+ (latest: 13.1)
- **CMake**: 3.20 or later
- **Compiler**: GCC 7+, Clang 8+, or MSVC 2019+
- **GPU**: NVIDIA GPU with Compute Capability 5.0+
- **Driver**: Compatible with CUDA Toolkit version

### Compute Capability Matrix

| Architecture | Compute Capability | Key Features |
|--------------|-------------------|--------------|
| **Maxwell** | 5.0-5.3 | Dynamic Parallelism (feature-complete in CUDA 13) |
| **Pascal** | 6.0-6.2 | Unified Memory, NVLink (feature-complete in CUDA 13) |
| **Volta** | 7.0 | Tensor Cores, Independent Thread Scheduling (feature-complete in CUDA 13) |
| **Turing** | 7.5 | RT Cores, INT8 Tensor Cores |
| **Ampere** | 8.0-8.6 | 3rd Gen Tensor Cores, Sparsity |
| **Ada Lovelace** | 8.9 | 4th Gen Tensor Cores, FP8 |
| **Hopper** | 9.0 | Transformer Engine, Thread Block Clusters |
| **Blackwell** | 10.0 | 5th Gen Tensor Cores, FP4 |

## CUDA Ecosystem

```mermaid
graph TB
    subgraph "Applications"
        DL["Deep Learning<br/>PyTorch, TensorFlow"]
        HPC["Scientific Computing<br/>Simulations, Physics"]
        CV["Computer Vision<br/>Image/Video Processing"]
        Finance["Computational Finance<br/>Risk Analysis, Monte Carlo"]
        Render["Graphics/Rendering<br/>Ray Tracing, 3D"]
    end

    subgraph "Frameworks & Tools"
        TensorRT["TensorRT<br/>Inference Optimization"]
        RAPIDS["RAPIDS<br/>Data Science"]
        cuDNN["cuDNN<br/>Deep Learning Primitives"]
        Thrust["Thrust<br/>Parallel Algorithms"]
    end

    subgraph "CUDA Libraries"
        cuBLASLib["cuBLAS<br/>Dense Linear Algebra"]
        cuFFTLib["cuFFT<br/>FFT"]
        cuSPARSELib["cuSPARSE<br/>Sparse Linear Algebra"]
        cuSOLVER["cuSOLVER<br/>Direct Solvers"]
        NPPLib["NPP<br/>Image Processing"]
        cuRANDLib["cuRAND<br/>Random Numbers"]
        nvJPEG["nvJPEG<br/>JPEG Codec"]
        cuTENSOR["cuTENSOR<br/>Tensor Operations"]
    end

    subgraph "CUDA Platform"
        Runtime["CUDA Runtime"]
        Driver["CUDA Driver"]
        PTX["PTX/SASS"]
    end

    subgraph "Hardware"
        GPU["NVIDIA GPU<br/>CUDA Cores, Tensor Cores,<br/>RT Cores"]
    end

    DL --> TensorRT & cuDNN
    HPC --> cuBLASLib & cuFFTLib & cuSOLVER
    CV --> NPPLib & nvJPEG & cuDNN
    Finance --> cuRANDLib & cuBLASLib
    Render --> Runtime

    TensorRT --> cuBLASLib & cuDNN
    RAPIDS --> cuBLASLib & cuSPARSELib
    Thrust --> Runtime

    cuBLASLib & cuFFTLib & cuSPARSELib & NPPLib --> Runtime
    cuSOLVER & cuRANDLib & nvJPEG & cuTENSOR --> Runtime
    cuDNN --> Runtime

    Runtime --> Driver
    Driver --> PTX
    PTX --> GPU

    style DL fill:#76b900,color:#fff
    style HPC fill:#0073c1,color:#fff
    style CV fill:#9c27b0,color:#fff
    style Finance fill:#ff9800,color:#fff
    style GPU fill:#1a1a2e,color:#fff
```

## Key Facts (2025)

- **Repository Stats**: 8.7k+ stars, 2.2k+ forks on GitHub
- **Current Version**: CUDA Toolkit 13.1 (samples updated accordingly)
- **Sample Count**: 100+ samples across 8 categories
- **Build System**: CMake 3.20+ (migrated from Makefiles)
- **Platform Support**: Linux, Windows, Tegra, QNX, DriveOS
- **Architecture Deprecation**: Maxwell, Pascal, Volta are feature-complete in CUDA 13 (no new features)
- **Multi-Device Changes**: Multi-device cooperative groups removed in CUDA 13
- **Performance**: GPU-accelerated applications can be 50-400x faster than CPU-only implementations
- **Market Share**: CUDA dominates GPU computing with ~95% market share in AI/ML workloads

## Use Cases

### Learning & Education
- **Beginner tutorials**: vectorAdd, matrixMul introduce parallel thinking
- **Performance optimization**: bandwidthTest, reduction teach optimization strategies
- **Memory management**: Understanding global, shared, and constant memory

### Development & Testing
- **GPU validation**: deviceQuery confirms driver and hardware setup
- **Performance benchmarking**: bandwidthTest measures actual vs theoretical bandwidth
- **Feature exploration**: Test new CUDA features before production use

### Application Development
| Domain | Sample | Description |
|--------|--------|-------------|
| **Deep Learning** | cudaTensorCoreGemm | Matrix multiplication using Tensor Cores |
| **Physics** | nbody | N-body gravitational simulation |
| **Fluid Dynamics** | fluidsGL | Real-time fluid simulation with OpenGL |
| **Finance** | MonteCarloGPU | Option pricing with Monte Carlo methods |
| **Image Processing** | imageProcessingNPP | GPU-accelerated image filters |
| **Signal Processing** | convolutionFFT2D | 2D convolution using cuFFT |
| **Graphics** | simpleVulkan | Vulkan-CUDA interoperability |

### Production Patterns
- **Cooperative Groups**: Flexible thread synchronization patterns
- **CUDA Graphs**: Reduce launch overhead for repetitive workflows
- **Unified Memory**: Simplified memory management across CPU/GPU
- **Dynamic Parallelism**: GPU-side kernel launches for adaptive algorithms

## Security & Considerations

### Hardware Requirements
- NVIDIA GPU required (no AMD/Intel support)
- Driver compatibility with CUDA Toolkit version is critical
- Older architectures may lose support in future toolkit versions

### Development Considerations
- **Memory management**: Manual allocation/deallocation can lead to leaks
- **Race conditions**: Improper synchronization causes data corruption
- **Bank conflicts**: Shared memory access patterns affect performance
- **Occupancy**: Thread block configuration impacts GPU utilization
- **Warp divergence**: Conditional branches within warps reduce efficiency

### Best Practices
- Use `cuda-memcheck` or Compute Sanitizer for debugging
- Profile with NVIDIA Nsight Systems and Nsight Compute
- Test on multiple GPU architectures for compatibility
- Monitor GPU memory usage to prevent out-of-memory errors
- Use CUDA error checking (`cudaGetLastError()`) in production

## Resources

- [CUDA Samples Repository](https://github.com/NVIDIA/cuda-samples)
- [CUDA Programming Guide](https://docs.nvidia.com/cuda/cuda-programming-guide/)
- [CUDA Toolkit Documentation](https://docs.nvidia.com/cuda/)
- [CUDA Libraries Documentation](https://docs.nvidia.com/cuda-libraries/)
- [NVIDIA Developer Blog](https://developer.nvidia.com/blog/)
- [CUDA Library Samples](https://github.com/NVIDIA/CUDALibrarySamples)
