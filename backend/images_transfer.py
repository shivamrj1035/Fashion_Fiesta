import os
import random
import shutil

SOURCE_DIR = r"C:\Users\Lenovo\.cache\kagglehub\datasets\paramaggarwal\fashion-product-images-dataset\versions\1\fashion-dataset\images"
DEST_DIR = r"D:\Shivam\Fashion Fiesta New\Fashion_Fiesta\backend\dataset\images"

TXT_FILE = "temp.txt"

# Create destination folder if not exists
os.makedirs(DEST_DIR, exist_ok=True)

# Read image names from file
with open(TXT_FILE, "r") as f:
    image_names = [line.strip() for line in f if line.strip()]

copied = 0
missing = 0

for img_name in image_names:
    src_path = os.path.join(SOURCE_DIR, img_name)
    dest_path = os.path.join(DEST_DIR, img_name)

    if os.path.exists(src_path):
        shutil.copy2(src_path, dest_path)
        copied += 1
    else:
        print(f"Not found: {img_name}")
        missing += 1

print(f"\nDone. Copied: {copied}, Missing: {missing}")