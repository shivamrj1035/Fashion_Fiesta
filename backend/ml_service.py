
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
            img = Image.open(BytesIO(response.content))
            return self.extract_features(img)
        except Exception as e:
            print(f"Error extracting features from URL {url}: {e}")
            return []

    def extract_features_from_bytes(self, image_bytes: bytes) -> List[float]:
        try:
            img = Image.open(BytesIO(image_bytes))
            return self.extract_features(img)
        except Exception as e:
            print(f"Error extracting features from bytes: {e}")
            return []

    def find_similar_products(self, query_embedding: List[float], all_products: List[dict], k: int = 6) -> List[int]:
        """
        Finds k nearest neighbors for the query embedding among all_products.
        all_products should be a list of dicts/objects with 'id' and 'embedding'.
        Returns a list of product IDs.
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
        
        similar_product_ids = [product_ids[i] for i in indices[0]]
        
        # Filter out the first one if it's the same (distance 0) - logic depends on use case
        # For image search (upload), we want the closest ones.
        return similar_product_ids

ml_service = MLService()
