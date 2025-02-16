import cv2
import numpy as np
import mediapipe as mp
from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
import base64
import threading
import time

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

game_running = False
game_thread = None

def cv_alpha():
    global game_running
    print("Running hand tracking...")
    mp_hands = mp.solutions.hands
    hands = mp_hands.Hands()
    draw_color = (255, 255, 255)
    
    # Try different camera indices
    for camera_index in range(2):  # Try indices 0 and 1
        cap = cv2.VideoCapture(camera_index)
        if cap.isOpened():
            print(f"Camera initialized successfully with index {camera_index}")
            break
    else:
        print("Error: Could not open video stream on any camera index.")
        return

    canvas = np.zeros((800, 800, 3), dtype=np.uint8)
    prev_x, prev_y = 0, 0

    def draw_line(canvas, start, end, color, thickness=2):
        cv2.line(frame, start, end, color, 4)
    def erase_area(canvas, center, radius, color):
        cv2.circle(canvas, center, radius, color, -1)

    frame_count = 0
    start_time = time.time()

    static_letters = []
    static_pos = set()
    letters = [["A", "C", "D", "E", "G"], ["J", "K", "L", "O", "P"]]
    pos = [(200, 200), (600, 200), (400, 400), (200, 600), (600, 600)]
    letter = letters[0]

    for i in range(len(letter)):
        position = pos[i]
        static_pos.add(position)
        static_letters.append((letter[i], position))
    def draw_static_letters(frame):
        font = cv2.FONT_HERSHEY_TRIPLEX
        font_scale = 3
        color = (0, 0, 0)
        thickness = 5
        for letter, position in static_letters:
            cv2.putText(frame, letter, position, font, font_scale, color, thickness)

    while cap.isOpened() and game_running:
        ret, frame = cap.read()

        if not ret:
            print(f"Failed to grab frame. Frame count: {frame_count}")
            time.sleep(0.1)  # Add a small delay before retrying
            continue

        frame_count += 1
        if frame_count % 30 == 0:  # Print FPS every 30 frames
            elapsed_time = time.time() - start_time
            fps = frame_count / elapsed_time
            print(f"FPS: {fps:.2f}")

        frame = cv2.flip(frame, 1)
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        draw_static_letters(frame)
        if frame_count > 105:
                cv2.putText(frame, "Correct", (frame.shape[1] - 200, 50), cv2.FONT_HERSHEY_SIMPLEX,
                        1, (50, 205, 50), 3, cv2.LINE_AA)


        results = hands.process(frame_rgb)
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                landmarks = hand_landmarks.landmark
                index_tip_x, index_tip_y = int(landmarks[mp_hands.HandLandmark.INDEX_FINGER_TIP].x * frame.shape[1]), int(landmarks[mp_hands.HandLandmark.INDEX_FINGER_TIP].y * frame.shape[0])
                
                if prev_x != 0 and prev_y != 0:
                    cv2.line(frame, (prev_x, prev_y), (index_tip_x, index_tip_y), draw_color, 4)
                prev_x, prev_y = index_tip_x, index_tip_y

        # Resize canvas to match frame height for proper stacking
        #canvas_resized = cv2.resize(canvas, (frame.shape[1], frame.shape[0]))
        #combined_view = np.hstack((frame, canvas_resized))

        # Encode the frame as base64
        _, buffer = cv2.imencode('.jpg', frame)
        jpg_as_text = base64.b64encode(buffer).decode('utf-8')

        # Emit the frame to the frontend
        socketio.emit('frame', jpg_as_text)
        print(f"Emitted frame {frame_count}")

        time.sleep(0.03)  # Adjust this value to control frame rate

    cap.release()
    print(f"Camera feed ended. Total frames processed: {frame_count}")

@socketio.on('asjdkh')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

# ... (previous code remains the same)

@socketio.on('connect')
def on_connect():
    print('Client connected')
    global game_running, game_thread
    if not game_running:
        game_running = True
        game_thread = threading.Thread(target=cv_alpha)
        game_thread.start()
        return {"status": "Game started"}
    return {"status": "Game already running"}


@socketio.on('stop_game')
def stop_game():
    global game_running, game_thread
    if game_running:
        game_running = False
        if game_thread:
            game_thread.join()
        return {"status": "Game stopped"}
    return {"status": "Game not running"}

if __name__ == '__main__':
    socketio.run(app, port=7070, debug=False)