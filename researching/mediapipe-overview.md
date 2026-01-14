# MediaPipe - Technical Overview

MediaPipe is an open-source framework developed by Google for building cross-platform, customizable machine learning solutions for live and streaming media. It provides pre-built pipelines for computer vision tasks like face detection, hand tracking, pose estimation, and now includes support for on-device LLM inference. Part of Google AI Edge, MediaPipe is designed for real-time performance on mobile, edge, web, and desktop platforms.

## High-Level Architecture

```mermaid
graph TB
    subgraph "MediaPipe Framework"
        subgraph "Core Components"
            Graph[Graph Engine<br/>DAG Processing]
            Calculator[Calculators<br/>Processing Nodes]
            Packets[Packets<br/>Timestamped Data Units]
            Streams[Streams<br/>Data Flow Channels]
        end

        subgraph "Acceleration Layer"
            CPU[CPU Backend<br/>XNNPACK]
            GPU[GPU Backend<br/>OpenGL ES / Metal]
            NNAPI[Android NNAPI<br/>Hardware Accelerators]
            WebGPU[WebGPU<br/>Browser GPU]
        end

        subgraph "MediaPipe Solutions"
            Vision[Vision Solutions<br/>Face, Hand, Pose]
            Text[Text Solutions<br/>Classification, Embedding]
            Audio[Audio Solutions<br/>Classification]
            GenAI[GenAI Solutions<br/>LLM Inference]
        end
    end

    subgraph "External Dependencies"
        TFLite[TensorFlow Lite<br/>Model Runtime]
        OpenCV[OpenCV<br/>Image Processing]
        FFMPEG[FFMPEG<br/>Audio/Video I/O]
    end

    subgraph "Target Platforms"
        Android[Android]
        iOS[iOS]
        Web[Web/JavaScript]
        Python[Python]
        Desktop[Desktop C++]
    end

    Graph --> Calculator
    Calculator --> Packets
    Packets --> Streams
    Calculator --> CPU & GPU & NNAPI & WebGPU
    Vision & Text & Audio & GenAI --> Graph
    TFLite --> GPU & CPU
    OpenCV --> Vision
    Solutions --> Target Platforms

    style Graph fill:#4CAF50,color:#fff
    style Calculator fill:#2196F3,color:#fff
    style Vision fill:#9C27B0,color:#fff
    style GenAI fill:#FF5722,color:#fff
```

## How It Works - Graph-Based Processing

```mermaid
flowchart TB
    subgraph Input["Input Layer"]
        Camera[Camera Feed]
        Video[Video File]
        Image[Static Image]
    end

    subgraph Graph["MediaPipe Graph (DAG)"]
        subgraph Nodes["Calculator Nodes"]
            Preprocess[Preprocessor<br/>Resize, Normalize]
            Detector[Detector Model<br/>Locate ROI]
            Landmark[Landmark Model<br/>Extract Keypoints]
            Tracker[Tracker<br/>Temporal Smoothing]
            Postprocess[Postprocessor<br/>NMS, Filtering]
        end

        subgraph Synchronization["Timestamp Sync"]
            Timestamp[Packet Timestamps<br/>Frame Alignment]
            Queue[Input Queues<br/>Buffer Management]
        end
    end

    subgraph Output["Output Layer"]
        Landmarks[Landmark Coordinates]
        Segments[Segmentation Masks]
        Classifications[Classifications]
        Embeddings[Feature Embeddings]
    end

    Camera & Video & Image --> Timestamp
    Timestamp --> Queue
    Queue --> Preprocess
    Preprocess --> Detector
    Detector -->|ROI| Landmark
    Landmark --> Tracker
    Tracker --> Postprocess
    Postprocess --> Landmarks & Segments & Classifications & Embeddings

    style Graph fill:#E8F5E9
    style Detector fill:#4CAF50,color:#fff
    style Landmark fill:#2196F3,color:#fff
```

## Detection and Tracking Pipeline

```mermaid
sequenceDiagram
    participant Input as Input Frame
    participant Selector as Frame Selector
    participant Detector as Detection Model
    participant Tracker as Tracking Model
    participant Landmark as Landmark Model
    participant Output as Output

    Note over Input,Output: Two-Branch Architecture

    rect rgb(230, 245, 255)
        Note over Selector,Detector: Slow Branch (Detection)
        Input->>Selector: Video Frame
        Selector->>Selector: Check tracking confidence
        alt Low confidence or first frame
            Selector->>Detector: Selected frame
            Detector->>Detector: Run inference (slower)
            Detector-->>Tracker: Detected ROI
        end
    end

    rect rgb(255, 245, 230)
        Note over Tracker,Landmark: Fast Branch (Tracking)
        Input->>Tracker: Video Frame
        Tracker->>Tracker: Predict ROI from previous
        Tracker->>Landmark: Cropped ROI (256x256)
        Landmark->>Landmark: Extract landmarks
        Landmark-->>Output: Landmarks + Confidence
    end

    Note over Input,Output: Re-detect when confidence drops
    Output->>Selector: Confidence score
```

## BlazePose/BlazeFace/BlazePalm Model Architecture

```mermaid
flowchart TB
    subgraph Detector["Detector Stage (SSD-Based)"]
        DetInput[Full Image<br/>e.g., 256x256]
        Backbone1[MobileNet Backbone<br/>Feature Extraction]
        SSD[SSD Detection Head<br/>Bounding Box + Keypoints]
        DetOutput[Region of Interest<br/>+ Orientation]
    end

    subgraph Estimator["Estimator Stage (Regression)"]
        EstInput[Cropped ROI<br/>256x256]
        Backbone2[Encoder Network<br/>Feature Pyramid]
        HeatmapHead[Heatmap Head<br/>Spatial Probability]
        RegressionHead[Regression Head<br/>Direct Coordinates]
        Fusion[Heatmap + Regression<br/>Fusion Layer]
        EstOutput[33 Pose / 21 Hand / 468 Face<br/>Landmarks]
    end

    DetInput --> Backbone1 --> SSD --> DetOutput
    DetOutput -->|Crop & Align| EstInput
    EstInput --> Backbone2
    Backbone2 --> HeatmapHead & RegressionHead
    HeatmapHead & RegressionHead --> Fusion
    Fusion --> EstOutput

    style Detector fill:#E3F2FD
    style Estimator fill:#F3E5F5
    style SSD fill:#2196F3,color:#fff
    style Fusion fill:#9C27B0,color:#fff
```

## MediaPipe Solutions Suite

```mermaid
graph TB
    subgraph Vision["Vision Solutions"]
        FaceDetect[Face Detection<br/>BlazeFace Model]
        FaceLandmark[Face Landmarker<br/>478 3D Landmarks]
        FaceStylizer[Face Stylizer<br/>Style Transfer]
        Gesture[Gesture Recognition<br/>Hand Gestures]
        HandLandmark[Hand Landmarker<br/>21 Keypoints per Hand]
        Pose[Pose Landmarker<br/>33 Body Keypoints]
        Holistic[Holistic<br/>543 Combined Landmarks]
        ObjectDetect[Object Detection<br/>Custom Objects]
        ImageClassify[Image Classification<br/>Custom Categories]
        ImageEmbed[Image Embedding<br/>Feature Vectors]
        ImageSegment[Image Segmentation<br/>Person/Hair/Selfie]
        InteractiveSeg[Interactive Segmenter<br/>Point-Based Selection]
    end

    subgraph Text["Text Solutions"]
        TextClassify[Text Classification<br/>Sentiment, Spam]
        TextEmbed[Text Embedding<br/>Semantic Vectors]
        LanguageDetect[Language Detection<br/>Multi-Language]
    end

    subgraph Audio["Audio Solutions"]
        AudioClassify[Audio Classification<br/>Sound Recognition]
    end

    subgraph GenAI["Generative AI Solutions"]
        LLMInference[LLM Inference<br/>Gemma, Phi-2, Falcon]
        ImageGen[Image Generation<br/>On-Device Diffusion]
    end

    style Vision fill:#E8F5E9
    style Text fill:#E3F2FD
    style Audio fill:#FFF3E0
    style GenAI fill:#FCE4EC
    style LLMInference fill:#E91E63,color:#fff
```

## Landmark Topologies

```mermaid
graph LR
    subgraph Face["Face Mesh - 478 Landmarks"]
        FaceOval[Face Oval<br/>36 Points]
        Lips[Lips<br/>40 Points]
        LeftEye[Left Eye<br/>16 Points]
        RightEye[Right Eye<br/>16 Points]
        LeftBrow[Left Eyebrow<br/>8 Points]
        RightBrow[Right Eyebrow<br/>8 Points]
        Nose[Nose<br/>9 Points]
        Iris[Iris<br/>10 Points]
        Connectors[Connectors<br/>335+ Points]
    end

    subgraph Hand["Hand - 21 Landmarks"]
        Wrist[Wrist<br/>1 Point]
        Thumb[Thumb<br/>4 Points]
        Index[Index Finger<br/>4 Points]
        Middle[Middle Finger<br/>4 Points]
        Ring[Ring Finger<br/>4 Points]
        Pinky[Pinky<br/>4 Points]
    end

    subgraph Body["Pose - 33 Landmarks"]
        Head[Head<br/>Nose, Eyes, Ears]
        Shoulders[Shoulders<br/>Left, Right]
        Elbows[Elbows<br/>Left, Right]
        Wrists[Wrists<br/>Left, Right]
        Hips[Hips<br/>Left, Right]
        Knees[Knees<br/>Left, Right]
        Ankles[Ankles<br/>Left, Right]
        Feet[Feet<br/>Heel, Toe Index]
    end

    style Face fill:#E3F2FD
    style Hand fill:#E8F5E9
    style Body fill:#FFF3E0
```

## Model Maker - Transfer Learning Flow

```mermaid
flowchart TB
    subgraph Preparation["Data Preparation"]
        Dataset[Custom Dataset<br/>~100 samples/class]
        Split[Train/Test/Val Split<br/>80%/10%/10%]
    end

    subgraph TransferLearning["Transfer Learning Process"]
        BaseModel[Pre-trained Base Model<br/>Frozen Layers]
        TopLayers[Replace Top Layers<br/>New Classification Head]
        FineTune[Fine-Tuning<br/>Train on Custom Data]
    end

    subgraph Export["Model Export"]
        TFLite[TFLite Model<br/>.tflite Format]
        Quantized[Quantized Model<br/>INT8/FP16]
        Bundle[Task Bundle<br/>Model + Metadata]
    end

    subgraph Deploy["Deployment"]
        AndroidApp[Android App]
        iOSApp[iOS App]
        WebApp[Web Browser]
        PythonApp[Python Script]
    end

    Dataset --> Split
    Split --> BaseModel
    BaseModel --> TopLayers
    TopLayers --> FineTune
    FineTune -->|Minutes| TFLite
    TFLite --> Quantized
    Quantized --> Bundle
    Bundle --> AndroidApp & iOSApp & WebApp & PythonApp

    style TransferLearning fill:#E8F5E9
    style FineTune fill:#4CAF50,color:#fff
```

## LLM Inference Pipeline

```mermaid
flowchart LR
    subgraph Input["User Input"]
        Prompt[Text Prompt]
        Context[System Context]
    end

    subgraph Preprocessing["Preprocessing"]
        Tokenizer[Tokenizer<br/>SentencePiece]
        TokenEmbed[Token Embedding<br/>Vector Lookup]
    end

    subgraph Model["On-Device LLM"]
        Attention[Multi-Head Attention<br/>Self-Attention Layers]
        FFN[Feed-Forward Network<br/>MLP Layers]
        KVCache[KV Cache<br/>Incremental Decoding]
    end

    subgraph Optimization["Optimizations"]
        Quantization[INT8 Quantization<br/>KleidiAI / XNNPACK]
        GPUAccel[GPU Acceleration<br/>WebGPU / Metal]
        Slicing[Token Slicing<br/>Incremental Output]
    end

    subgraph Output["Output"]
        Generated[Generated Text<br/>Streaming Tokens]
    end

    Prompt & Context --> Tokenizer
    Tokenizer --> TokenEmbed
    TokenEmbed --> Attention
    Attention --> FFN
    FFN --> KVCache
    KVCache --> Attention
    Quantization & GPUAccel --> Model
    Model --> Slicing
    Slicing --> Generated

    style Model fill:#FCE4EC
    style Attention fill:#E91E63,color:#fff
    style Quantization fill:#FF9800,color:#fff
```

## Ecosystem - Platforms and Integrations

```mermaid
graph TB
    subgraph Core["MediaPipe Core (Google AI Edge)"]
        Framework[MediaPipe Framework<br/>Open Source - Apache 2.0]
        Solutions[MediaPipe Solutions<br/>Pre-built Pipelines]
        ModelMaker[Model Maker<br/>Customization Tool]
    end

    subgraph Languages["Implementation Languages"]
        CPP[C++<br/>Core Framework]
        Python[Python<br/>SDK + Model Maker]
        Java[Java/Kotlin<br/>Android]
        Swift[Swift/ObjC<br/>iOS]
        JS[JavaScript<br/>Web]
    end

    subgraph Dependencies["Key Dependencies"]
        TFLite[TensorFlow Lite<br/>Model Runtime]
        OpenCV[OpenCV<br/>Image Processing]
        FFMPEG[FFMPEG<br/>Media I/O]
        OpenGL[OpenGL ES / Metal<br/>GPU Compute]
        Eigen[Eigen<br/>Linear Algebra]
    end

    subgraph Models["Supported Models"]
        BlazeFace[BlazeFace<br/>Sub-ms Face Detection]
        BlazePose[BlazePose<br/>Real-time Pose]
        BlazePalm[BlazePalm<br/>Hand Detection]
        Gemma[Gemma 2B/7B<br/>LLM]
        Phi2[Phi-2<br/>Microsoft LLM]
        Falcon[Falcon<br/>TII LLM]
    end

    subgraph UseCases["Use Cases"]
        AR[AR Effects & Filters]
        Fitness[Fitness & Sports]
        Healthcare[Healthcare Monitoring]
        Gaming[Gaming & NPCs]
        Accessibility[Sign Language<br/>Accessibility]
        Security[Face Authentication]
        Robotics[Robotics & Drones]
        Creative[Creative Tools]
    end

    Core --> Languages
    Dependencies --> Core
    Models --> Solutions
    Solutions --> UseCases

    style Framework fill:#4CAF50,color:#fff
    style Solutions fill:#2196F3,color:#fff
    style ModelMaker fill:#9C27B0,color:#fff
```

## Key Concepts

### Graph-Based Architecture

MediaPipe uses a Directed Acyclic Graph (DAG) for processing:

| Component | Description |
|-----------|-------------|
| **Packet** | Basic data unit with timestamp and immutable payload |
| **Stream** | Sequence of packets between nodes |
| **Calculator** | Processing node that transforms packets |
| **Graph** | DAG defining data flow between calculators |

### Two-Stage Detection Pattern

Most MediaPipe vision solutions use a detector-tracker pattern:

1. **Detector (Slow)**: Runs on selected frames to find regions of interest
2. **Tracker (Fast)**: Tracks ROI across frames, re-detecting when confidence drops

This enables real-time performance by running heavy detection only when needed.

### Blaze Model Family

| Model | Task | Landmarks | Performance |
|-------|------|-----------|-------------|
| **BlazeFace** | Face Detection | 6 keypoints | Sub-millisecond on mobile GPU |
| **BlazePalm** | Palm Detection | 7 keypoints | Real-time palm localization |
| **BlazePose Lite** | Pose Estimation | 33 keypoints | 2.7 MFlop, 1.3M params |
| **BlazePose Full** | Pose Estimation | 33 keypoints | 6.9 MFlop, 3.5M params |

### Model Maker Customization

- Uses transfer learning to retrain models with custom data
- Requires ~100 samples per class
- Training typically completes in minutes
- Supports: Object Detection, Image Classification, Gesture Recognition, Text Classification

## Key Facts (2025)

- **Framework Version**: 0.10.31 (December 2025)
- **Repository**: github.com/google-ai-edge/mediapipe
- **License**: Apache 2.0 (Open Source)
- **Primary Languages**: C++, Python, JavaScript, Java, Swift
- **Face Landmarks**: 478 3D points with 52 blendshape expressions
- **Hand Landmarks**: 21 keypoints per hand
- **Pose Landmarks**: 33 full-body keypoints
- **Holistic Total**: 543 combined landmarks (pose + face + hands)
- **LLM Support**: Gemma 2B/7B, Phi-2, Falcon, StableLM
- **LoRA Support**: Fine-tuning for Gemma and Phi-2 models
- **WebGPU**: Recently open-sourced WebGPU helpers

## Performance Benchmarks

| Solution | Platform | Backend | Latency |
|----------|----------|---------|---------|
| **Face Detection** | Mobile | GPU | Sub-millisecond |
| **Pose Estimation** | Mobile CPU | CPU | ~7 FPS (Jetson Nano) |
| **Pose Estimation** | Mobile GPU | GPU | ~20+ FPS |
| **Selfie Segmentation** | Web | GPU | <3ms inference |
| **Selfie Segmentation** | Web | CPU | 120+ ms |
| **LLM (Gemma 2B)** | Mobile | GPU | 50-200ms response |

### GPU Support

- **Android/Linux**: OpenGL ES up to 3.2
- **iOS**: OpenGL ES 3.0, Metal
- **Web**: WebGL, WebGPU (experimental)
- **Requirement**: OpenGL ES 3.1+ for ML inference calculators

## Common Use Cases

1. **Augmented Reality**: Face filters, virtual try-on, makeup effects
2. **Fitness & Sports**: Form analysis, rep counting, motion tracking
3. **Healthcare**: Fall prevention, physical therapy monitoring
4. **Sign Language Recognition**: Accessibility applications
5. **Gaming**: Gesture controls, full-body game input
6. **Video Conferencing**: Background blur, face effects
7. **Robotics & Drones**: Object tracking, navigation
8. **Creative Tools**: Animation, motion capture

## Technical Specifications

| Component | Technology |
|-----------|------------|
| **Core Language** | C++ |
| **Build System** | Bazel |
| **Model Format** | TensorFlow Lite (.tflite) |
| **Video Processing** | OpenCV |
| **Audio Processing** | FFMPEG |
| **GPU Compute** | OpenGL ES, Metal, WebGPU |
| **CPU Inference** | XNNPACK |
| **Quantization** | INT8, FP16 (QAT and PTQ) |

## Security Considerations

- **On-Device Processing**: Data never leaves the device for inference
- **Privacy by Design**: No cloud dependency for core ML tasks
- **Model Protection**: TFLite models can be encrypted
- **Input Validation**: Sanitize input dimensions to prevent buffer overflows

## Sources

- [MediaPipe Official Documentation](https://developers.google.com/mediapipe)
- [MediaPipe GitHub Repository](https://github.com/google-ai-edge/mediapipe)
- [Google AI Edge - MediaPipe Solutions](https://ai.google.dev/edge/mediapipe/solutions/guide)
- [MediaPipe Model Maker Guide](https://ai.google.dev/edge/mediapipe/solutions/model_maker)
- [BlazePose Research Paper](https://arxiv.org/abs/2006.10204)
- [MediaPipe LLM Inference Guide](https://ai.google.dev/edge/mediapipe/solutions/genai/llm_inference)
- [MediaPipe Wikipedia](https://en.wikipedia.org/wiki/MediaPipe)
- [Google Research - MediaPipe Framework](https://research.google/pubs/mediapipe-a-framework-for-perceiving-and-processing-reality/)
- [LearnOpenCV - MediaPipe Guide](https://learnopencv.com/introduction-to-mediapipe/)
- [Roboflow - MediaPipe Beginner Guide](https://blog.roboflow.com/what-is-mediapipe/)
