import face_engine
import database
import search_engine
import sys
import os
import cv2

def process_image(image_path):
    print(f"[*] Processing image: {image_path}")

    if not os.path.exists(image_path):
        print(f"[!] Error: File {image_path} not found.")
        return

    # Load image
    try:
        image = face_engine.load_image(image_path)
    except Exception as e:
        print(f"[!] Error loading image: {e}")
        return

    # Get encodings
    face_encodings = face_engine.get_face_encodings(image)

    if not face_encodings:
        print("[!] No faces found in the image.")
        return

    print(f"[*] Found {len(face_encodings)} face(s).")

    db = database.load_db()

    for i, encoding in enumerate(face_encodings):
        print(f"--- Face {i+1} ---")
        person = database.find_person_by_encoding(db, encoding)

        if person:
            print(f"[+] Match found: {person['name']}")
            print(f"[+] Social Media: {person.get('social_media')}")
            print(f"[+] Last Seen: {person.get('last_seen')}")

            # Generate fresh search links
            print("[*] Generating updated search links...")
            print(search_engine.simulate_web_search(person['name']))
        else:
            print("[?] Person not found in local database.")
            print("[*] You can use search engines to identify this person manually.")

def webcam_mode():
    print("[*] Opening Webcam... Press 'q' to quit, 's' to capture and identify.")

    # Initialize webcam
    video_capture = cv2.VideoCapture(0)

    if not video_capture.isOpened():
        print("[!] Error: Could not open webcam.")
        print("[!] Note: This mode requires local hardware access and a GUI environment.")
        return

    while True:
        # Capture frame-by-frame
        ret, frame = video_capture.read()
        if not ret:
            print("[!] Error: Failed to grab frame.")
            break

        # Display the resulting frame
        cv2.imshow('Face Recognition Project - Webcam (Press S to Capture, Q to Quit)', frame)

        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break
        elif key == ord('s'):
            print("[*] Capturing image...")
            # Convert BGR (OpenCV) to RGB (face_recognition)
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            # Detect and encode faces
            face_encodings = face_engine.get_face_encodings(rgb_frame)

            if not face_encodings:
                print("[!] No faces detected in capture.")
            else:
                db = database.load_db()
                for encoding in face_encodings:
                    person = database.find_person_by_encoding(db, encoding)
                    if person:
                        print(f"[+] Identified: {person['name']}")
                        print(search_engine.simulate_web_search(person['name']))
                    else:
                        print("[?] Face detected but not recognized in database.")

    # Release the capture
    video_capture.release()
    cv2.destroyAllWindows()

def main():
    if len(sys.argv) < 2:
        print("Usage: python app.py <image_path> OR python app.py --webcam")
        return

    mode = sys.argv[1]

    if mode == "--webcam":
        webcam_mode()
    else:
        process_image(mode)

if __name__ == "__main__":
    main()
