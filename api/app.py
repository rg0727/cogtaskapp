from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO
from openai import OpenAI
import pyaudio
import wave
import speech_recognition as sr
import threading
import os
from mistral_image_understand import understand_scene
from openai_image_understand import ask_openai


import cv2
import numpy as np
import base64
from numpy.linalg import norm

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Parameters for audio recording
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 44100
CHUNK = 2048
OUTPUT_FILENAME = "output.wav"


audio = pyaudio.PyAudio()
stream = None
frames = []
recording_thread = None
recognizer = sr.Recognizer()
transcription=""

# Function to start recording audio
def start_recording():
    global stream, frames, recording_thread
    frames = []
    print("Recording...")
    stream = audio.open(format=FORMAT, channels=CHANNELS,
                        rate=RATE, input=True,
                        frames_per_buffer=CHUNK)
    
    # Start a background thread to record audio chunks
    recording_thread = threading.Thread(target=record_audio_chunks)
    recording_thread.daemon = True  # Ensure the thread terminates when the main program exits
    recording_thread.start()

# Function to stop the recording and save the audio to a WAV file
def stop_recording():
    global stream, frames, recording_thread
    if stream is None:
        return "No active recording to stop.", 400
    
    # Stop the audio stream and the recording thread
    stream.stop_stream()
    stream.close()
    
    # Wait for the recording thread to finish
    if recording_thread is not None:
        recording_thread.join()

    # Save the recorded frames to a WAV file
    with wave.open(OUTPUT_FILENAME, 'wb') as wavefile:
        wavefile.setnchannels(CHANNELS)
        wavefile.setsampwidth(audio.get_sample_size(FORMAT))
        wavefile.setframerate(RATE)
        wavefile.writeframes(b''.join(frames))

    print(f"Recording stopped and saved to {OUTPUT_FILENAME}")
    return OUTPUT_FILENAME

# Function to continuously record audio chunks
def record_audio_chunks():
    global stream, frames
    with wave.open(OUTPUT_FILENAME, 'wb') as wavefile:
        wavefile.setnchannels(CHANNELS)
        wavefile.setsampwidth(audio.get_sample_size(FORMAT))
        wavefile.setframerate(RATE)

        while True:
            # Check if the stream is still open and active before trying to read
            if stream is None or not stream.is_active():
                print("Stream is not active or has been closed.")
                break
            
            try:
                # Read the audio chunk from the stream
                data = stream.read(CHUNK, exception_on_overflow=False)
                frames.append(data)
                # Write the audio data to the WAV file in real-time
                wavefile.writeframes(data)
            except Exception as e:
                print(f"Error while reading audio chunk: {e}")
                break

# Function to transcribe the entire audio file after recording stops
def transcribe_audio():
    recognizer = sr.Recognizer()
    with sr.AudioFile(OUTPUT_FILENAME) as source:
        print("Transcribing audio...")
        audio_data = recognizer.record(source)
        try:
            text = recognizer.recognize_google(audio_data)
            print("Transcription:", text)
            return text
        except sr.UnknownValueError:
            print("Could not understand the audio")
        except sr.RequestError:
            print("Error with the speech recognition service")

# Initialize OpenAI Client (Replace with a Secure API Key)
client = OpenAI(api_key="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")

def get_embedding(text):
    """Generate an embedding using OpenAI."""
    response = client.embeddings.create(
        model="text-embedding-ada-002",
        input=text
    )
    return np.array(response.data[0].embedding)

# Generate a proper reference embedding instead of a random one
test_embedding = get_embedding("This flower is a rose")

def cosine_similarity(vec1, vec2):
    """Calculate cosine similarity between two embeddings."""
    return np.dot(vec1, vec2) / (norm(vec1) * norm(vec2))

def process_user_input(user_input_image1, user_input_image2, user_description):
    """Compare two images and generate AI response based on the user's description of similarity."""
    
    # Generate embeddings for both images
    image1_name = Image.open(user_input_image1)  # TBD on data input format stored from handler
    image2_name = user_input_image2.split(".")[0]  # e.g chair, flower, chair-2
    
    # Assuming embeddings are generated elsewhere for both images
    image1_embedding = generate_embedding(image1_name)
    image2_embedding = generate_embedding(image2_name)
    
    # Calculate cosine similarity between the two image embeddings
    similarity_score = cosine_similarity(image1_embedding, image2_embedding)
    
    # Now evaluate the user's description
    description_similarity = evaluate_description_similarity(user_description, image1_embedding, image2_embedding)
    
    # Adjust the quality score to reflect how well the user described the similarity
    quality_score = round(description_similarity, 1)  # Scale from 0 to 100
    
    # Create a prompt for feedback based on description similarity
    prompt = f"""
    The user has described the similarity between two images as: "{user_description}"
    The calculated similarity score between the images is {similarity_score:.2f}.
    
    Evaluate how well the user described the similarity:
    - If the description is highly accurate, score it high (≥ 80).
    - If the description is somewhat accurate but could be more detailed, score it medium (50-80).
    - If the description is not accurate or unclear, score it low (<50).
    
    Provide feedback based on how well the description matches the actual similarity.
    """
    
    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}]
    )
    
    ai_response = completion.choices[0].message.content

    return {
        "similarity_score": similarity_score,
        "quality_score": quality_score,
        "description_similarity_score": description_similarity,
        "ai_response": ai_response
    }

def evaluate_description_similarity(user_description, image1_embedding, image2_embedding):
    """Evaluate how well the user's description matches the similarity between the two images."""
    # Placeholder for evaluating description similarity
    # This could use NLP models or other methods to assess if the user's description matches the image similarity
    description_embedding = generate_description_embedding(user_description)
    
    # Calculate similarity between the description and the image embeddings
    description_similarity = cosine_similarity(description_embedding, (image1_embedding + image2_embedding) / 2)  # Average of both image embeddings
    
    return round(description_similarity * 100, 1)



def chat():
    """Interactive chat loop with AI feedback."""
    print("\n🌸 Welcome to the Flower Identification Chat! 🌸")
    print("Type 'exit' to quit.\n")

    user_input = transcription
    result = process_user_input(user_input)

    print(f"\n🔹 Similarity Score: {result['similarity_score']:.2f}")
    print(f"🔸 Quality Score: {result['quality_score']}")
    print("\n💬 AI Response:\n" + result['ai_response'])
    print("\n" + "="*50 + "\n")  # Separator for readability

@socketio.on('start_recording')
def handle_start_recording(data=None):
    start_recording()
    print("Recording started...")
    socketio.emit('recording_status', {"status": "Recording started"})

@socketio.on('stop_recording')
def handle_stop_recording(data=None):
    result = stop_recording()
    print("Recording stopped...")
    socketio.emit('recording_status', {"status": "Recording stopped", "filename": result})

@socketio.on('transcribe_audio')
def handle_transcribe_audio(data=None):
    transcription = transcribe_audio()
    socketio.emit('transcription', {"transcription": transcription})

@socketio.on('chat')
def handle_transcribe_audio(data=None):
    result = chat()
    socketio.emit('similarity_score', {
        'similarity_score': result['similarity_score'],
        'quality_score': result['quality_score'],
        'ai_response': result['ai_response']
    })

def process_frame(msg):
    # print(msg)
    # image_data = msg.split(',')[1]  # Remove the data URL prefix
    # image_bytes = base64.b64decode(image_data)
    # image_array = np.frombuffer(image_bytes, dtype=np.uint8)
    # frame = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    # # # Process the frame (e.g., apply OpenCV operations)
    # # Example: Convert to grayscale
    # gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Encode the processed frame back to base64
    # _, buffer = cv2.imencode('.jpg', gray_frame)
    # processed_image_data = base64.b64encode(buffer).decode('utf-8')
    
    # understand_scene(msg)
    ask_openai(img_url=msg)

@socketio.on('message')
def handle_message(msg):
    process_frame(msg)

if __name__ == '__main__':
    socketio.run(app, port=8080, debug=True)