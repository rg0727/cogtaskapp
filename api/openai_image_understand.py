import os

import requests
import json

from dotenv import load_dotenv
load_dotenv()

from openai import OpenAI


client = OpenAI(api_key=os.getenv("OPENAI_KEY"))

def ask_openai(img_url):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Understand what's in the image passed in. Pay attention to the objects you see. Use these to design a task or question that tests the users executive and visuospatial reasoning abilities"},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": img_url,
                        },
                    },
                ],
            }
        ],
        max_tokens=300,
    )

    print(response.choices[0])

# ask_openai()