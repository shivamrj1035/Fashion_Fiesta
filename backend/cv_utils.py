import cv2
import numpy as np
from sklearn.cluster import KMeans
from typing import List, Tuple

class CVUtils:
    @staticmethod
    def preprocess_image(image: np.ndarray, target_size: Tuple[int, int] = (224, 224)) -> np.ndarray:
        """
        Standardizes image for model consumption: Resizing + Normalization.
        """
        # Resize
        resized = cv2.resize(image, target_size)
        # Convert to float and normalize to [0, 1]
        normalized = resized.astype(np.float32) / 255.0
        return normalized

    @staticmethod
    def remove_background(image: np.ndarray) -> np.ndarray:
        """
        Basic background removal using GrabCut or simple thresholding.
        In production, a deeper model like MODNet or SAM would be used.
        """
        # Placeholder for background removal logic
        # For fashion items usually on white/plain backgrounds, thresholding works well.
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        _, mask = cv2.threshold(gray, 240, 255, cv2.THRESH_BINARY_INV)
        result = cv2.bitwise_and(image, image, mask=mask)
        return result

    @staticmethod
    def get_dominant_colors(image: np.ndarray, k: int = 5) -> List[str]:
        """
        Uses K-Means clustering to find dominant colors in an image.
        Returns a list of Hex color strings.
        """
        # Convert BGR to RGB
        img_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Resize to speed up calculation
        small_img = cv2.resize(img_rgb, (50, 50), interpolation=cv2.INTER_AREA)
        pixels = small_img.reshape(-1, 3)
        
        # Filter out very bright (white) and very dark (black) pixels if needed
        # (optional based on dataset style)
        
        kmeans = KMeans(n_clusters=k, n_init=10)
        kmeans.fit(pixels)
        
        colors = kmeans.cluster_centers_.astype(int)
        
        hex_colors = []
        for color in colors:
            hex_colors.append('#{:02x}{:02x}{:02x}'.format(color[0], color[1], color[2]))
            
        return hex_colors

    @staticmethod
    def detect_edges(image: np.ndarray) -> np.ndarray:
        """
        Standard Canny Edge detection for structural analysis.
        """
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 100, 200)
        return edges

cv_utils = CVUtils()
