import os
from google import genai
from google.genai import types

import requests

# Retrieve the API key from environment variables
from dotenv import load_dotenv
import os
load_dotenv()

api_key = os.getenv("GEMINI_KEY")

def understand_scene():
    image_path = "https://goo.gle/instrument-img"
    image = requests.get(image_path)
    print(len(image.content))
    

    client = genai.Client(api_key="GEMINI_API_KEY")
    
    # string_utf8 = bytes(image.content).decode('utf-8')
    
    response = client.models.generate_content(
        model="gemini-2.0-flash-exp",
        contents=["What is this image?",
                types.Part.from_bytes()])

    print(response.text)
    
understand_scene()