from flask import Flask
from flask_cors import CORS, cross_origin
import cv2
import numpy as np
import base64

app = Flask(__name__)
CORS(app)

@app.route('/process_frame', methods=['POST'])
@cross_origin(origin='*')
def process_frame():
    data = request.get_json()
    print(request.get_json())
    image_data = data['image'].split(',')[1]  # Remove the data URL prefix
    image_bytes = base64.b64decode(image_data)
    image_array = np.frombuffer(image_bytes, dtype=np.uint8)
    frame = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    # Process the frame (e.g., apply OpenCV operations)
    # Example: Convert to grayscale
    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Encode the processed frame back to base64
    _, buffer = cv2.imencode('.jpg', gray_frame)
    processed_image_data = base64.b64encode(buffer).decode('utf-8')

    return jsonify({'processed_image': processed_image_data})

@app.route('/api/hello')
def hello():
    return {"message": "Hello from Flask!"}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
