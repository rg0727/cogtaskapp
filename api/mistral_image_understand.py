import os
from mistralai import Mistral

# Retrieve the API key from environment variables
from dotenv import load_dotenv
import os
load_dotenv()

api_key = os.getenv("MISTRAL_API_KEY")

# Specify model
model = "pixtral-12b-2409"

# Initialize the Mistral client
client = Mistral(api_key=api_key)

def understand_scene(processed_image_data):
    # Define the messages for the chat
    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "What's in this image?"
                },
                {
                    "type": "image_url",
                    "image_url": f"{processed_image_data}"
                }
            ]
        }
    ]

    # Get the chat response
    chat_response = client.chat.complete(
        model=model,
        messages=messages
    )

    # Print the content of the response
    print(chat_response.choices[0].message.content)
