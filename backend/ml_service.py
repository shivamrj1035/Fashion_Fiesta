
import os
import torch
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import numpy as np
from numpy.linalg import norm
from sklearn.neighbors import NearestNeighbors
import cv2
from typing import List, Tuple
import io

class MLService:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MLService, cls).__new__(cls)
            cls._instance.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            cls._instance.model = None
            cls._instance.transform = None
        return cls._instance

    def _ensure_initialized(self):
        if self.model is None:
            self.model = self._build_model(self.device)
            self.transform = transforms.Compose([
                transforms.Resize((224, 224)),
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
            ])

    @staticmethod
    def _build_model(device):
        print(f"Loading ResNet50 model on {device}...")
        # Load prep-trained ResNet50
        model = models.resnet50(pretrained=True)
        # Remove the classification head (fc layer)
        # ResNet50 output before fc is (batch, 2048, 7, 7)
        # We want the Global Average Pool output (batch, 2048)
        model = nn.Sequential(*list(model.children())[:-1])
        model.to(device)
        model.eval()
        print("Model loaded successfully.")
        return model

    def extract_features(self, img: Image.Image) -> List[float]:
        self._ensure_initialized()
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        img_tensor = self.transform(img).unsqueeze(0).to(self.device)
        
        with torch.no_grad():
            features = self.model(img_tensor)
            features = features.view(features.size(0), -1)
            features = features.cpu().numpy().flatten()
            
        normalized_features = features / (norm(features) + 1e-7)
        return normalized_features.tolist()

    def extract_features_batch(self, imgs: List[Image.Image]) -> np.ndarray:
        self._ensure_initialized()
        tensors = []
        for img in imgs:
            if img.mode != 'RGB':
                img = img.convert('RGB')
            tensors.append(self.transform(img))
        
        if not tensors:
            return np.array([])

        batch_tensor = torch.stack(tensors).to(self.device)
        
        with torch.no_grad():
            features = self.model(batch_tensor)
            features = features.view(features.size(0), -1)
            features = features.cpu().numpy()
            
        # Normalize batch
        norms = norm(features, axis=1, keepdims=True)
        normalized_features = features / (norms + 1e-7)
        return normalized_features

    def extract_features_from_bytes(self, image_bytes: bytes) -> List[float]:
        try:
            img = Image.open(io.BytesIO(image_bytes))
            return self.extract_features(img)
        except Exception as e:
            print(f"Error extracting features from bytes: {e}")
            return []

    def find_similar_products(self, query_embedding: List[float], all_products: List[dict], k: int = 24) -> List[Tuple[int, float]]:
        if not all_products:
            return []

        # Filter out products without embeddings or with invalid embeddings
        valid_products = [p for p in all_products if p.get('embedding') and len(p['embedding']) > 0]
        
        if not valid_products:
            return []

        feature_list = np.array([p['embedding'] for p in valid_products], dtype=np.float32)
        product_ids = [p['id'] for p in valid_products]
        
        query_vec = np.array([query_embedding], dtype=np.float32)
        
        if len(feature_list) < k:
            k = len(feature_list)

        print(f"DEBUG: Performing search on {len(feature_list)} products with k={k}")
        
        # NearestNeighbors is robust for 44k
        neighbors = NearestNeighbors(n_neighbors=k, algorithm='brute', metric='cosine')
        neighbors.fit(feature_list)
        
        distances, indices = neighbors.kneighbors(query_vec)
        print(f"DEBUG: Top distance: {distances[0][0]}, Top index: {indices[0][0]}")
        
        results = []
        for i, idx in enumerate(indices[0]):
            # distance is 1 - similarity for 'cosine' metric
            similarity = 1 - distances[0][i]
            score = max(0, similarity * 100)
            results.append((product_ids[idx], round(score, 1)))
            
        return results

ml_service = MLService()
