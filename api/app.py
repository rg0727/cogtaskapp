from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO

import pyaudio
import wave
import speech_recognition as sr
import threading

from mistral_image_understand import understand_scene
from openai_image_understand import ask_openai

import cv2
import numpy as np
import base64

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