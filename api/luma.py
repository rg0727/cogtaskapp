from lumaai import LumaAI

from dotenv import load_dotenv
load_dotenv()

import os
import requests
import time

client = LumaAI(
    auth_token=os.getenv("LUMAAI_API_KEY")
)

generation = client.generations.create(
  prompt="A teddy bear in sunglasses playing electric guitar and dancing",
)
completed = False
while not completed:
  generation = client.generations.get(id=generation.id)
  if generation.state == "completed":
    completed = True
  elif generation.state == "failed":
    raise RuntimeError(f"Generation failed: {generation.failure_reason}")
  print("Dreaming")
  time.sleep(3)

video_url = generation.assets.video

# download the video
response = requests.get(video_url, stream=True)
with open(f'{generation.id}.mp4', 'wb') as file:
    file.write(response.content)
print(f"File downloaded as {generation.id}.mp4")