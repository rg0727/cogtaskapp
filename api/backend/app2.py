import cv2
import numpy as np
import mediapipe as mp
import random, string
import time
text_timer = 0 

mp_hands = mp.solutions.hands
hands = mp_hands.Hands()
draw_color = (255, 255, 255)
move_color = (200, 200, 200)
erase_color = (0, 0, 0) 


cap = cv2.VideoCapture(0)

canvas = np.zeros((480, 640, 3), dtype=np.uint8)



prev_x, prev_y = 0, 0

def draw_line(canvas, start, end, color, thickness=2):
    cv2.line(frame, start, end, color, 4)

def erase_area(canvas, center, radius, color):
    cv2.circle(canvas, center, radius, color, -1)



canvas_height, canvas_width = 800, 800
canvas = np.zeros((canvas_height, canvas_width, 3), dtype=np.uint8)

static_letters = []
static_pos = set()
letters = [["A", "C", "D", "E", "G"], ["J", "K", "L", "O", "P"]]
pos = [(200, 200), (600, 200), (400, 400), (200, 600), (600, 600)]
letter = random.choice(letters) 
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

# main loop
placed = False
show_text = False
frames = 0
while True:

    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    draw_static_letters(frame)
    if frames > 105:
            cv2.putText(frame, "Correct", (frame.shape[1] - 200, 50), cv2.FONT_HERSHEY_SIMPLEX, 
                    1, (50, 205, 50), 3, cv2.LINE_AA)

    results = hands.process(frame_rgb)

    order = []

    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            landmarks = hand_landmarks.landmark
            index_tip_x, index_tip_y = int(landmarks[mp_hands.HandLandmark.INDEX_FINGER_TIP].x * frame.shape[1]), int(landmarks[mp_hands.HandLandmark.INDEX_FINGER_TIP].y * frame.shape[0])
            
            palm_x, palm_y = int(landmarks[mp_hands.HandLandmark.WRIST].x * frame.shape[1]), int(landmarks[mp_hands.HandLandmark.WRIST].y * frame.shape[0])
            
            ##if results.multi_handedness[0].classification[0].label == 'Left' and landmarks[mp_hands.HandLandmark.WRIST].x < 0.5:
                ##erase_area(canvas, (palm_x, palm_y), 140, erase_color)
            ##else:
            if prev_x != 0 and prev_y != 0:
                draw_line(frame, (prev_x, prev_y), (index_tip_x, index_tip_y), draw_color)
    

            prev_x, prev_y = index_tip_x, index_tip_y

    cv2.imshow('Frame', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
    frames += 1

cap.release()
cv2.destroyAllWindows()