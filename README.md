# Fashion Fiesta 🚀

Fashion Fiesta is a premium, AI-powered e-commerce platform that blends high-end fashion with cutting-edge **Computer Vision** and **Augmented Reality**.

![Fashion Fiesta Banner](https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop)

## ✨ Core Features
- **Neural Visual Search**: Find matches from our 44k+ collection using real-time ResNet50 similarity analysis.
- **Virtual AR Try-On Studio**: Real-time garment projection for both live camera and photo uploads.
- **Intelligent Discovery**: Dynamic, deep-linked filtering by gender, category, and article type.
- **Premium HUD Experience**: A high-fidelity dark mode interface with glassmorphism and real-time telemetry.

## 🛠 Tech Stack
- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion, Lucide React.
- **Backend**: FastAPI, SQLModel, Pydantic, SQLAlchemy.
- **AI/ML**: PyTorch, ResNet50, NumPy.
- **Database**: SQLite (SQLModel).

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Unix
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 📦 Data & Asset Management (GitHub Strategy)

The project utilizes a dataset of 44,000+ items (~500MB+ images). For the best GitHub experience, follow these recommendations:

### 1. Hosting Images (Ideal Way)
Do **NOT** push the full `images/` directory to GitHub. Instead:
- **Option A (Professional)**: Use an S3 bucket (AWS) or Cloudinary. Update the `image_urls` in the database to point to these public URLs.
- **Option B (Dev-Friendly)**: Host the images on a separate static server or a service like Imgur/PostImage for demo purposes.
- **Option C (Local-Only)**: Keep the images in `backend/static/images/` and add this path to your `.gitignore`. Provide a script to download the dataset for new collaborators.

### 2. Database & Large Files
- The `fashion_fiesta.db` contains pre-computed ResNet50 embeddings. We recommend committing a **pruned** version (e.g., 5k items) to Git for demos, and keeping the full version local.
- Use **Git LFS** if you must commit the full database or binary models.

## 📄 Documentation
For detailed technical info, see:
- [Architecture Documentation](./Architecture_Documentation.md)
- [CV System Implementation](./CV_Implementation_Guide.md)

## ⚖️ License
MIT License
