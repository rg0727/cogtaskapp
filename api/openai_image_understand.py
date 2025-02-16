import os
import re
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_KEY"))

def ask_openai(img_url):
    # Make the API call
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

    # Extract and parse the response content
    content = response.choices[0].message.content
    print("Extracted Content:", content)
    return content
# Helper function to parse content (if needed)

