
import os
import tensorflow as tf
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from tensorflow.keras.layers import GlobalMaxPooling2D
from tensorflow.keras.preprocessing import image
import numpy as np
from numpy.linalg import norm
from sklearn.neighbors import NearestNeighbors
from io import BytesIO
from PIL import Image
import requests
import cv2
from typing import List, Tuple

class MLService:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MLService, cls).__new__(cls)
            cls._instance.model = cls._build_model()
        return cls._instance

    @staticmethod
    def _build_model():
        print("Loading ResNet50 model...")
        # Load ResNet50 without the top layer
        base_model = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
        base_model.trainable = False
        
        # Add GlobalMaxPooling2D
        model = tf.keras.Sequential([
            base_model,
            GlobalMaxPooling2D()
        ])
        print("Model loaded successfully.")
        return model

    def preprocess_image(self, img: Image.Image) -> np.ndarray:
        if img.mode != 'RGB':
            img = img.convert('RGB')
        img = img.resize((224, 224))
        img_array = image.img_to_array(img)
        expanded_img_array = np.expand_dims(img_array, axis=0)
        preprocessed_img = preprocess_input(expanded_img_array)
        return preprocessed_img

    def extract_features(self, img: Image.Image) -> List[float]:
        preprocessed_img = self.preprocess_image(img)
        result = self.model.predict(preprocessed_img).flatten()
        normalized_result = result / norm(result)
        return normalized_result.tolist()

    def extract_features_from_url(self, url: str) -> List[float]:
        try:
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                return self.extract_features_from_bytes(response.content)
            return []
        except Exception as e:
            print(f"Error extracting features from URL {url}: {e}")
            return []

    def extract_features_from_bytes(self, image_bytes: bytes) -> List[float]:
        try:
            # Decode image from bytes using OpenCV
            nparr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                print("Error: Could not decode image")
                return []

            # OpenCV loads as BGR, convert to RGB
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            
            # Resize to model input size (224, 224)
            img = cv2.resize(img, (224, 224))
            
            # Convert to array and expand dims
            img_array = image.img_to_array(img)
            expanded_img_array = np.expand_dims(img_array, axis=0)
            
            # Preprocess
            preprocessed_img = preprocess_input(expanded_img_array)
            
            # Predict
            result = self.model.predict(preprocessed_img).flatten()
            normalized_result = result / norm(result)
            
            return normalized_result.tolist()
            
        except Exception as e:
            print(f"Error extracting features from bytes using CV2: {e}")
            return []

    def find_similar_products(self, query_embedding: List[float], all_products: List[dict], k: int = 6) -> List[Tuple[int, float]]:
        """
        Finds k nearest neighbors for the query embedding among all_products.
        all_products should be a list of dicts/objects with 'id' and 'embedding'.
        Returns a list of tuples (product_id, match_percentage).
        """
        if not all_products:
            return []

        # Filter out products without embeddings
        valid_products = [p for p in all_products if p.embedding]
        
        if not valid_products:
            return []

        feature_list = [p.embedding for p in valid_products]
        product_ids = [p.id for p in valid_products]
        
        if len(feature_list) < k:
            k = len(feature_list)

        neighbors = NearestNeighbors(n_neighbors=k, algorithm='brute', metric='euclidean')
        neighbors.fit(feature_list)
        
        distances, indices = neighbors.kneighbors([query_embedding])
        
        results = []
        for i, idx in enumerate(indices[0]):
            dist = distances[0][i]
            # Convert Euclidean distance to Cosine Similarity for normalized vectors
            # dist^2 = 2(1 - similarity) => similarity = 1 - dist^2 / 2
            similarity = 1 - (dist ** 2) / 2
            # Convert to percentage
            score = max(0, similarity * 100)
            results.append((product_ids[idx], round(score, 1)))
            
        return results

ml_service = MLService()
