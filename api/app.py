from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO

from mistral_image_understand import understand_scene

import cv2
import numpy as np
import base64

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

def process_frame(msg):
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
    understand_scene(msg)

@socketio.on('message')
def handle_message(msg):
    process_frame(msg)

if __name__ == '__main__':
    socketio.run(app, port=8080, debug=True)
