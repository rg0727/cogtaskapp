from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO

import pyaudio
import wave
import speech_recognition as sr
import threading
import time

from openai_image_understand import ask_openai

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Audio Parameters
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 44100
CHUNK = 2048
OUTPUT_FILENAME = "output.wav"

audio = pyaudio.PyAudio()
stream = None
frames = []
recording_thread = None
recording = False  # Flag to control recording state

recognizer = sr.Recognizer()

# Function to record audio in a background thread
def record_audio_chunks():
    global stream, frames, recording
    recording = True
    print("Recording started...")
    
    try:
        while recording:
            try:
                data = stream.read(CHUNK, exception_on_overflow=False)
                frames.append(data)
            except Exception as e:
                print(f"Error while reading audio chunk: {e}")
                break
    except Exception as e:
        print(f"Recording thread error: {e}")

# Start Recording
def start_recording():
    global stream, frames, recording_thread

    frames = []
    stream = audio.open(format=FORMAT, channels=CHANNELS,
                        rate=RATE, input=True,
                        frames_per_buffer=CHUNK)

    recording_thread = threading.Thread(target=record_audio_chunks)
    recording_thread.daemon = True
    recording_thread.start()

# Stop Recording
def stop_recording():
    global stream, frames, recording, recording_thread

    if stream is None:
        return "No active recording to stop.", 400

    recording = False  # Stop recording loop

    time.sleep(0.1)  # Ensure buffer flush before closing

    stream.stop_stream()
    stream.close()

    if recording_thread:
        recording_thread.join()

    # Save the recorded audio to a WAV file
    with wave.open(OUTPUT_FILENAME, 'wb') as wavefile:
        wavefile.setnchannels(CHANNELS)
        wavefile.setsampwidth(audio.get_sample_size(FORMAT))
        wavefile.setframerate(RATE)
        wavefile.writeframes(b''.join(frames))

    print(f"Recording stopped and saved to {OUTPUT_FILENAME}")

    return OUTPUT_FILENAME

# Transcribe Audio
def transcribe_audio():
    with sr.AudioFile(OUTPUT_FILENAME) as source:
        print("Transcribing audio...")
        audio_data = recognizer.record(source)

        try:
            text = recognizer.recognize_google(audio_data)
            print("Transcription:", text)
            return text
        except sr.UnknownValueError:
            print("Could not understand the audio")
            return "Could not understand the audio"
        except sr.RequestError:
            print("Error with the speech recognition service")
            return "Error with the speech recognition service"

# WebSocket Handlers
@socketio.on('start_recording')
def handle_start_recording():
    start_recording()
    socketio.emit('recording_status', {"status": "Recording started"})

@socketio.on('stop_recording')
def handle_stop_recording():
    result = stop_recording()
    socketio.emit('recording_status', {"status": "Recording stopped", "filename": result})

@socketio.on('transcribe_audio')
def handle_transcribe_audio():
    transcription = transcribe_audio()
    socketio.emit('transcription', {"transcription": transcription})

# Ensure cleanup on exit
def cleanup():
    global stream, audio
    if stream:
        stream.stop_stream()
        stream.close()
    audio.terminate()
    print("Cleaned up resources.")

def process_frame(msg):
    ask_openai(img_url=msg)
    
@socketio.on('message')
def handle_message(msg):
    if msg['id'] == 1:
        print("game1")
        image = msg['image']
        # add processing here
    elif msg['id'] == 2:
        print("game2")
        process_frame(msg['image'])

import atexit
atexit.register(cleanup)

if __name__ == '__main__':
    socketio.run(app, port=8080, debug=True)
