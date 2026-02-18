# Fashion Fiesta - Advanced CV Fashion Platform

## Overview
Fashion Fiesta is a modern e-commerce application that leverages deep learning to provide a premium shopping experience. This demo focuses on the **Computer Vision (CV)** core, specifically the Visual Search and intelligent Recommendation systems.

## 🧬 Core CV Features

### 1. Visual Search (Search by Image)
Visual Search allows users to upload a photo of a clothing item and find similar products in the store instantly.
- **Endpoint**: `POST /search/image`
- **Key Function**: `search_by_image` in `backend/api/search.py`
- **Workflow**:
    1. **Upload**: User sends an image file via the frontend.
    2. **Streaming**: The backend reads the byte stream.
    3. **Feature Extraction**: The image is passed through a ResNet50 model to generate a high-dimensional feature vector (embedding).
    4. **Similarity Filtering**: Using a K-Nearest Neighbors (KNN) algorithm with Cosine Similarity, the system identifies the top 24 matches from the product database.
    5. **Scoring**: A "Match Percentage" is calculated and returned to help users understand the retrieval accuracy.

### 2. Intelligent Recommendations
When viewing a product, the platform automatically suggests visually similar items.
- **Endpoint**: `GET /products/{product_id}/recommendations`
- **Key Function**: `get_product_recommendations` in `backend/api/products.py`
- **Workflow**:
    1. **Context Retrieval**: The embedding of the current product is fetched.
    2. **Vector Space Search**: The system searches for the closest neighbors in the embedding space using the pre-calculated product database.
    3. **Dynamic Feedback**: Recommendations are populated based on visual style, texture, and silhouette rather than just metadata tags.

---

## 🛠️ Technical Implementation

### The Model: ResNet50
We utilize **ResNet50** (Residual Network), a deep convolutional neural network architecture.
- **Why ResNet50?**: It is exceptionally good at identifying complex patterns, textures, and shapes in images. By removing the final classification layer, we transform the model into a powerful **Feature Extractor**.
- **Output**: It generates a 2048-dimensional vector representing the visual "fingerprint" of the product.

### 🧠 Deep Dive: How Embeddings Work
An **Embedding** is a numerical translation of an image's visual properties into a high-dimensional vector space.
- **Feature Layer**: We extract the output from the *Global Average Pooling* layer.
- **Visual Mapping**: In this 2048-dimensional space, similar-looking items (e.g., two denim jackets) are placed geographically close to each other, while different items (e.g., a dress vs. a shoe) are far apart.
- **Normalization**: Each vector is L2-normalized so that its magnitude is 1, ensuring that the "direction" of the vector (the visual style) is the primary factor in comparison.

### 🔍 Finding Similarity: The Math Behind the Match
To find the "best match," we don't just compare colors; we compute the distance between these 2048-dimensional vectors.

1. **Model Selection**: We use **Sklearn's NearestNeighbors** with the `brute` algorithm, which is ideal for our dataset size.
2. **Metric: Cosine Similarity**: 
   - Instead of Euclidean distance (straight line), we use **Cosine Similarity**. 
   - It measures the **cosine of the angle** between two vectors. 
   - **Why?** It is robust to variations in lighting and image intensity, focusing purely on the *visual pattern and structure*.
3. **Similarity Score**: 
   The raw distance is converted into a user-friendly match percentage:
   $$ \text{Match \%} = (1 - \text{Cosine Distance}) \times 100 $$

### Used CV Functions & Libraries
Here is a breakdown of the specific functions that drive the visual intelligence of the platform:

#### **OpenCV (cv2) - Image Preprocessing**
- `cv2.resize(image, (224, 224))`: Standardizes all incoming images to the exact input size required by the ResNet50 model.
- `cv2.cvtColor(image, cv2.COLOR_BGR2RGB)`: Converts the default BGR (Blue-Green-Red) format from OpenCV to RGB for compatibility with PyTorch/PIL.
- `cv2.threshold(gray, 240, 255, cv2.THRESH_BINARY_INV)`: Used in background removal to isolate the product silhouette from plain backgrounds.
- `cv2.Canny(gray, 100, 200)`: Implemented for edge detection to analyze the structural silhouette of garments.

#### **Sklearn - Vector Math & Clustering**
- `NearestNeighbors(n_neighbors=k, algorithm='brute', metric='cosine')`: The core search engine. It fits the 2048-d vectors and executes a "brute-force" comparison to find the mathematical nearest neighbors.
- `KMeans(n_clusters=k)`: Powering color analysis by clustering pixel colors to find the most dominant "Thematic Colors" of a fashion item.

#### **PyTorch (torchvision.transforms) - Neural Preprocessing**
- `transforms.ToTensor()`: Converts images into multi-dimensional tensors for GPU/CPU computation.
- `transforms.Normalize(mean, std)`: Crucial for "Zero-Centering" the data, ensuring the model's feature extraction is accurate and unbiased.

### Code Organization
- `backend/ml_service.py`: The heart of the CV system. Contains the `MLService` class which initializes the model and performs feature extraction and similarity logic.
- `backend/cv_utils.py`: Contains auxiliary CV utilities like background removal and dominant color extraction.
- `backend/recalculate_embeddings.py`: A utility script to pre-compute embeddings for the entire product catalog, ensuring sub-second response times during live searches.

---

## 🚀 The Flow (Step-by-Step)
1. **Raw Input**: Image received as bytes.
2. **Preprocessing**: Image is resized to 224x224 and normalized using ImageNet statistics (Mean/Std).
3. **Inference**: The processed image is fed into the ResNet50 model.
4. **Embedding**: The 2048-d vector is extracted from the Global Average Pooling layer.
5. **Distance Calculation**: 
   $$ \text{similarity} = 1 - \text{cosine\_distance} $$
6. **Result**: Product IDs sorted by similarity score are returned to the frontend.
