from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import torch

model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

def get_image_embedding(image_path):
    image = Image.open(image_path)
    inputs = processor(images=image, return_tensors="pt")
    with torch.no_grad():
        embedding = model.get_image_features(**inputs)
    return embedding.squeeze().numpy().tolist() 

if __name__ == "__main__":
    print(get_image_embedding("data/chair.jpg"))
    print(get_image_embedding("data/flower.jpg"))
    print(get_image_embedding("data/water-bottle.jpg"))