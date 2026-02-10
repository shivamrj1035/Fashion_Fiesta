
import os
import sqlite3
import json
import torch
from PIL import Image
from tqdm import tqdm
from ml_service import ml_service
import numpy as np

# Configuration
DB_PATH = "fashion_fiesta.db"
DATASET_PATH = r"C:\Users\Lenovo\.cache\kagglehub\datasets\paramaggarwal\fashion-product-images-dataset\versions\1\fashion-dataset"
IMAGES_DIR = os.path.join(DATASET_PATH, "images")
BATCH_SIZE = 32

def generate_embeddings():
    if not os.path.exists(DB_PATH):
        print(f"Database not found at {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Get all products that don't have embeddings yet
    # Or just get all products if we want to refresh
    cursor.execute("SELECT id, image_urls FROM product WHERE embedding IS NULL OR embedding = '[]'")
    products = cursor.fetchall()

    if not products:
        print("No products found needing embeddings.")
        return

    print(f"Generating embeddings for {len(products)} products...")

    # Use batches for database updates
    batch_updates = []
    
    for i in tqdm(range(0, len(products), BATCH_SIZE)):
        batch = products[i:i+BATCH_SIZE]
        batch_imgs = []
        batch_pids = []
        
        for pid, img_urls_json in batch:
            try:
                img_urls = json.loads(img_urls_json)
                if not img_urls:
                    continue
                
                img_name = img_urls[0].split('/')[-1]
                img_path = os.path.join(IMAGES_DIR, img_name)
                
                if not os.path.exists(img_path):
                    continue

                img = Image.open(img_path)
                batch_imgs.append(img)
                batch_pids.append(pid)
                
            except Exception as e:
                print(f"Error loading image for product {pid}: {e}")

        if batch_imgs:
            try:
                embeddings = ml_service.extract_features_batch(batch_imgs)
                updates = [(json.dumps(emb.tolist()), pid) for emb, pid in zip(embeddings, batch_pids)]
                cursor.executemany("UPDATE product SET embedding = ? WHERE id = ?", updates)
                conn.commit()
            except Exception as e:
                print(f"Error during batch inference/update: {e}")
            finally:
                # Close all images in batch
                for img in batch_imgs:
                    img.close()

    conn.close()
    print("Embedding generation complete.")

if __name__ == "__main__":
    generate_embeddings()
