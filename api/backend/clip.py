from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import torch
import base64
import numpy as np
import cv2

model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

def get_image_embedding(image_path):
    image = Image.open(image_path)
    inputs = processor(images=image, return_tensors="pt")
    with torch.no_grad():
        embedding = model.get_image_features(**inputs)
    return [round(value, 5) for value in embedding.squeeze().numpy().tolist()]

def get_search_embedding(image_bytes):
    image_data = image_bytes.split(',')[1]  # Remove the data URL prefix
    image_bytes = base64.b64decode(image_data)
    image_array = np.frombuffer(image_bytes, dtype=np.uint8)
    frame = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    inputs = processor(images=frame, return_tensors="pt")
    with torch.no_grad():
        embedding = model.get_image_features(**inputs)
    return [round(value, 5) for value in embedding.squeeze().numpy().tolist()]

if __name__ == "__main__":
    print(get_image_embedding("data/chair.jpg"))
    print(get_image_embedding("data/flower.jpg"))
    print(get_image_embedding("data/water-bottle.jpg"))