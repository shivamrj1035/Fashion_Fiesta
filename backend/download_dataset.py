import kagglehub
import os
import shutil

def download_dataset():
    print("Starting dataset download...")
    # Download latest version
    path = kagglehub.dataset_download("paramaggarwal/fashion-product-images-dataset")
    
    print(f"Path to dataset files: {path}")
    
    # We want to make sure it's accessible to our backend
    # Let's create a symlink or just use the path directly in our seed script
    # For now, we will just print it and use it.
    
    # Check contents
    print("Dataset contents:")
    for item in os.listdir(path):
        print(f" - {item}")

if __name__ == "__main__":
    download_dataset()
