import sys, time, random, pygame
import cv2 as cv
import mediapipe as mp

mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
mp_hands = mp.solutions.hands
drawing_spec = mp_drawing.DrawingSpec(thickness=1, circle_radius=1)
pygame.init()

# Initialize required elements/environment
VID_CAP = cv.VideoCapture(0)
window_size = (VID_CAP.get(cv.CAP_PROP_FRAME_WIDTH), VID_CAP.get(cv.CAP_PROP_FRAME_HEIGHT))  # width by height
screen = pygame.display.set_mode(window_size)

# Draw the clock face
center = (300, 300)
radius = 250
cv2.circle(canvas, center, radius, (0, 0, 0), 2)


# Ninja and balloon init
ninja_img = pygame.image.load("ninja.png")

original_width, original_height = ninja_img.get_size()
scaling_factor = 3
new_width = int(original_width * scaling_factor)
new_height = int(original_height * scaling_factor)
ninja_img = pygame.transform.scale(ninja_img, (new_width, new_height))

ninja_img = pygame.transform.scale(ninja_img, (ninja_img.get_width() // 6, ninja_img.get_height() // 6))
ninja_frame = ninja_img.get_rect()
ninja_frame.center = (window_size[0] // 6, window_size[1] // 2)

# Load and scale the smaller balloon image
balloon_img = pygame.image.load("balloon.png")
balloon_width, balloon_height = 100, 160  # Adjust the size as needed
balloon_img = pygame.transform.scale(balloon_img, (balloon_width, balloon_height))
balloon_frames = []

# Balloon spawning parameters
balloon_spawn_delay = 30  # Delay between balloon spawns
balloon_spawn_timer = balloon_spawn_delay

# Game variables
score = 0
game_is_running = True

# Initialize variables to track speed
prev_time = time.time()
prev_position = ninja_frame.center
speed = 0
last_speed_update = time.time()

with mp_hands.Hands(  # Initialize Hand Landmarks model
        max_num_hands=1,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5) as hands:
    while True:
        # Check if game is running
        if not game_is_running:
            text = pygame.font.SysFont("Helvetica Bold.ttf", 64).render('Game over!', True, (161, 17, 166))
            tr = text.get_rect()
            tr.center = (window_size[0] / 2, window_size[1] / 2)
            screen.blit(text, tr)
            pygame.display.update()
            pygame.time.wait(2000)
            VID_CAP.release()
            cv.destroyAllWindows()
            pygame.quit()
            sys.exit()

        # Check if user quit window
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                VID_CAP.release()
                cv.destroyAllWindows()
                pygame.quit()
                sys.exit()

        # Get frame
        ret, frame = VID_CAP.read()
        if not ret:
            print("Empty frame, continuing...")
            continue

        # Clear screen
        screen.fill((125, 220, 232))

        # Hand landmarks
        frame.flags.writeable = False
        frame = cv.cvtColor(frame, cv.COLOR_BGR2RGB)
        results = hands.process(frame)
        frame.flags.writeable = True

        # Draw hand landmarks
        if results.multi_hand_landmarks and len(results.multi_hand_landmarks) > 0:
            hand_landmarks = results.multi_hand_landmarks[0]
            landmark = hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP]
            ninja_frame.centery = (landmark.y * window_size[1])
            if ninja_frame.top < 0:
                ninja_frame.y = 0
            if ninja_frame.bottom > window_size[1]:
                ninja_frame.y = window_size[1] - ninja_frame.height

            # Calculate speed based on ninja's new position every second
            current_time = time.time()
            if current_time - last_speed_update >= 0.5:  # Only update speed every second
                time_diff = current_time - prev_time
                prev_time = current_time
                
                # Calculate distance between current and previous position
                current_position = ninja_frame.center
                distance = ((current_position[0] - prev_position[0]) ** 2 + 
                            (current_position[1] - prev_position[1]) ** 2) ** 0.5
                prev_position = current_position

                # Calculate speed (pixels per second)
                if time_diff > 0:
                    speed = distance / time_diff
                
                # Update the last_speed_update to the current time
                last_speed_update = current_time

        # Mirror frame, swap axes because opencv != pygame
        frame = cv.flip(frame, 1).swapaxes(0, 1)

        # Update balloon positions
        for balloon_rect in balloon_frames:
            balloon_rect.x -= 16  # Adjust balloon speed as needed

        # Remove off-screen balloons
        balloon_frames = [balloon for balloon in balloon_frames if balloon.right > 0]

        # Update screen
        pygame.surfarray.blit_array(screen, frame)
        screen.blit(ninja_img, ninja_frame)

        for balloon_rect in balloon_frames:
            screen.blit(balloon_img, balloon_rect)

        # Check if ninja pops a balloon
        popped_balloons = [balloon for balloon in balloon_frames if ninja_frame.colliderect(balloon)]
        for popped_balloon in popped_balloons:
            balloon_frames.remove(popped_balloon)
            score += 1

        # Display score
        text = pygame.font.SysFont("Helvetica Bold.ttf", 50).render(f'Score: {score}', True, (183, 66, 66))
        tr = text.get_rect()
        tr.center = (100, 100)
        screen.blit(text, tr)

        # Balloon spawning
        if balloon_spawn_timer <= 0:
            balloon_rect = balloon_img.get_rect()
            balloon_rect.x = window_size[0]
            balloon_rect.y = random.randint(120, int(window_size[1]) - 120 - balloon_rect.height)
            balloon_frames.append(balloon_rect)
            balloon_spawn_timer = balloon_spawn_delay
        else:
            balloon_spawn_timer -= 1

         
        if speed >= 700:
            speed_text = pygame.font.SysFont("Helvetica Bold.ttf", 32).render(f'Too Fast!: {speed:.2f}', True, (0, 255, 0))
        elif speed >= 100:
            speed_text = pygame.font.SysFont("Helvetica Bold.ttf", 32).render(f'Good!: {speed:.2f}', True, (255, 255, 100))
        else:
            speed_text = pygame.font.SysFont("Helvetica Bold.ttf", 32).render(f'Too Slow!: {speed:.2f}', True, (255, 0, 0))



        speed_rect = speed_text.get_rect()
        speed_rect.center = (window_size[0] - 100, 50)  # Position at the top-right corner
        screen.blit(speed_text, speed_rect)

        # Update screen
        pygame.display.flip()
