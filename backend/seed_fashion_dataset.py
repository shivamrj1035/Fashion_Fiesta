import pandas as pd
import sqlite3
import os
import json
from cv_utils import cv_utils
import cv2

# Path where kagglehub downloads the dataset
DATASET_PATH = r"C:\Users\Lenovo\.cache\kagglehub\datasets\paramaggarwal\fashion-product-images-dataset\versions\1\fashion-dataset"
DB_PATH = "fashion_fiesta.db"

def seed_database():
    styles_csv = os.path.join(DATASET_PATH, "styles.csv")
    images_dir = os.path.join(DATASET_PATH, "images")
    
    if not os.path.exists(styles_csv):
        print(f"Styles CSV not found at {styles_csv}")
        return

    print("Reading styles.csv...")
    # Use error_bad_lines=False if there are parsing errors in the CSV
    df = pd.read_csv(styles_csv, on_bad_lines='skip')
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    print(f"Found {len(df)} products. Starting seeding...")

    # Clear existing data for a fresh seed
    print("Clearing existing data...")
    cursor.execute("DELETE FROM product")
    cursor.execute("DELETE FROM category")
    conn.commit()

    # Ensure categories exist
    categories = df['masterCategory'].unique()
    category_map = {}
    for cat_name in categories:
        cursor.execute("INSERT OR IGNORE INTO category (name, image_url) VALUES (?, ?)", (cat_name, ""))
        cursor.execute("SELECT id FROM category WHERE name = ?", (cat_name,))
        category_map[cat_name] = cursor.fetchone()[0]

    count = 0
    df = df.where(pd.notnull(df), None) # Convert NaN to None for easier handling

    for _, row in df.iterrows():
        product_id = row['id']
        image_name = f"{product_id}.jpg"
        image_path = os.path.join(images_dir, image_name)
        
        if not os.path.exists(image_path):
            continue

        name = row['productDisplayName']
        if not name or pd.isna(name):
            # Try to build a name from other attributes if missing
            if row['articleType'] and row['baseColour']:
                name = f"{row['baseColour']} {row['articleType']}"
            else:
                continue # Skip if we still can't make a name
        
        article_type = row['articleType'] if row['articleType'] else "Apparel"
        usage = row['usage'] if row['usage'] else "Casual"
        gender = row['gender'] if row['gender'] else "Unisex"
        
        description = f"{article_type} for {gender}, {usage} use."
        price = 999.0 # Placeholder
        category_id = category_map.get(row['masterCategory'])
        
        if category_id is None:
            continue

        # Attributes JSON
        attributes = {
            "gender": gender,
            "subCategory": row['subCategory'],
            "articleType": article_type,
            "baseColour": row['baseColour'],
            "season": row['season'],
            "year": row['year'],
            "usage": usage
        }

        image_urls = json.dumps([f"/dataset/images/{image_name}"])
        
        cursor.execute("""
            INSERT INTO product (name, description, price, rating, stock, category_id, image_urls, attributes, is_featured, is_popular, is_new, created_at, embedding)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), ?)
        """, (name, description, price, 4.5, 100, category_id, image_urls, json.dumps(attributes), 0, 0, 1, json.dumps([])))

        count += 1
        if count % 1000 == 0:
            print(f"Seeded {count} products...")
            conn.commit()

    conn.commit()
    conn.close()
    print(f"Successfully seeded {count} products.")

if __name__ == "__main__":
    seed_database()
