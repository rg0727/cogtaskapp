from flask import Flask, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
import time
import pyaudio
import wave
import speech_recognition as sr

app = Flask(__name__)
CORS(app)

socketio = SocketIO(app)

@socketio.on('message')
def handle_message(data):
    print('received message: ' + data)


# Parameters for audio recording
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 44100
CHUNK = 2048
OUTPUT_FILENAME = "output.wav"

audio = pyaudio.PyAudio()
stream = None
frames = []

def start_recording():
    global stream, frames
    frames = []
    stream = audio.open(format=FORMAT, channels=CHANNELS,
                        rate=RATE, input=True,
                        frames_per_buffer=CHUNK)

def stop_recording():
    global stream, frames
    if stream is None:
        return "No active recording to stop.", 400
    stream.stop_stream()
    stream.close()
    wavefile = wave.open(OUTPUT_FILENAME, 'wb')
    wavefile.setnchannels(CHANNELS)
    wavefile.setsampwidth(audio.get_sample_size(FORMAT))
    wavefile.setframerate(RATE)
    wavefile.writeframes(b''.join(frames))
    wavefile.close()
    return OUTPUT_FILENAME

def record_audio_chunk():
    global stream, frames
    if stream is not None:
        data = stream.read(CHUNK, exception_on_overflow=False)
        frames.append(data)

def transcribe_audio():
    recognizer = sr.Recognizer()
    with sr.AudioFile(OUTPUT_FILENAME) as source:
        audio_data = recognizer.record(source)
        try:
            text = recognizer.recognize_google(audio_data)
            return text
        except sr.UnknownValueError:
            return "Could not understand the audio"
        except sr.RequestError:
            return "Error with the speech recognition service"

@socketio.on('start_recording')
def handle_start_recording(data):
    start_recording()
    print("Recording started...")
    socketio.emit('recording_status', {"status": "Recording started"})

@socketio.on('stop_recording')
def handle_stop_recording(data):
    result = stop_recording()
    socketio.emit('recording_status', {"status": "Recording stopped", "filename": result})

@socketio.on('transcribe_audio')
def handle_transcribe_audio(data):
    transcription = transcribe_audio()
    socketio.emit('transcription', {"transcription": transcription})

@app.route('/api/hello')
def hello():
    return jsonify({"message": "Hello from Flask!"})

if __name__ == '__main__':
    socketio.run(app, port=8080)
