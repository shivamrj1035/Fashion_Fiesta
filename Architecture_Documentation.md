# Fashion Fiesta: Technical Architecture

This document provides a deep-dive into the core mechanisms that power the Fashion Fiesta platform.

## 1. Visual Search & Feature Extraction
The Visual Search system is built on a custom embedding-based retrieval model.

- **Neural Backbone**: ResNet50 (Pre-trained on ImageNet)
- **Mechanism**:
    1. **Pre-computation**: All 5,000 products in the dataset have been passed through the ResNet50 model to extract 2048-dimensional feature vectors (embeddings).
    2. **Storage**: Embeddings are stored in the SQLite database alongside product metadata.
    3. **Querying**: When a user uploads an image, the backend extracts its embedding in real-time.
    4. **Similarity Engine**: We use Cosine Similarity to find the top $k$ products with the closest embeddings.
- **Performance**: Average inference time is ~10-15ms for retrieval.

---

## 2. Virtual Try-On (VTO)
Our VTO studio uses a hybrid approach for real-time garment projection.

- **Neural Engine**: TensorFlow.js / PoseNet (integrated for future expansion)
- **Studio Modes**:
    - **Live Mode**: Uses MediaDevices API for low-latency mirror streaming.
    - **Photo Mode**: Uses Canvas API for static garment projection.
- **Workflow**: 
    - Human detection status is monitored via the "Neural Link".
    - Garments are dynamically projected onto the coordinate system of the viewport using SVG/Canvas layering.

---

## 3. Dynamic Filtering & Catalog Engine
The catalog is powered by FastAPI and SQLModel with robust JSON attribute support.

- **JSON Attributes**: Product metadata (gender, color, article type) is stored in a flexible JSON field.
- **Robust Querying**: We implemented custom SQL functions (`json_extract`, `lower`) to ensure case-insensitive, high-performance filtering across 44k+ records.
- **Pagination**: Infinite scroll is powered by indexed offset-limit queries, fetching batches of 24 products to maintain sub-100ms response times.

---

## 4. Design System
- **Core**: Next.js 14 + Tailwind CSS.
- **Theme**: Unified Global Dark Theme with Glassmorphism (Backdrop-blur-md).
- **Animations**: Framer Motion for physically-based UI transitions.
- **State**: Custom Context Providers for Cart and Wishlist management.
