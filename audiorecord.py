import time
import pyaudio
import wave
import speech_recognition as sr

# Parameters
FORMAT = pyaudio.paInt16  # 16-bit format
CHANNELS = 1  # Mono audio
RATE = 44100  # Sample rate (Hz)
CHUNK = 2048  # Increased buffer size to reduce overflow errors
OUTPUT_FILENAME = "output.wav"

audio = pyaudio.PyAudio()
stream = None
frames = []

def start_recording():
    global stream, frames
    frames = []  # Reset frames before starting a new recording
    
    # Open a stream
    stream = audio.open(format=FORMAT, channels=CHANNELS,
                        rate=RATE, input=True,
                        frames_per_buffer=CHUNK)
    print("Recording started...")

def stop_recording():
    global stream, frames
    if stream is None:
        print("No active recording to stop.")
        return
    
    print("Recording stopped.")
    
    # Stop and close the stream
    stream.stop_stream()
    stream.close()
    
    # Save the recorded data as a WAV file
    wavefile = wave.open(OUTPUT_FILENAME, 'wb')
    wavefile.setnchannels(CHANNELS)
    wavefile.setsampwidth(audio.get_sample_size(FORMAT))
    wavefile.setframerate(RATE)
    wavefile.writeframes(b''.join(frames))
    wavefile.close()
    
    print(f"Audio recorded and saved as {OUTPUT_FILENAME}")

def record_audio_chunk():
    global stream, frames
    if stream is not None:
        try:
            data = stream.read(CHUNK, exception_on_overflow=False)
            frames.append(data)
        except OSError as e:
            print(f"Warning: {e}")

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

# Start recording
start_recording()

# Record for 5 seconds and then stop
start_time = time.time()
while time.time() - start_time < 5:
    record_audio_chunk()

# Stop recording after 5 seconds
stop_recording()

# Transcribe the audio
transcribe_audio()
