import face_recognition
import cv2
import numpy as np

def load_image(file_path):
    """Loads an image from a file path."""
    return face_recognition.load_image_file(file_path)

def get_face_encodings(image):
    """Returns the face encodings for all faces found in the image."""
    return face_recognition.face_encodings(image)

def get_face_locations(image):
    """Returns the face locations for all faces found in the image."""
    return face_recognition.face_locations(image)

def compare_faces(known_encodings, face_encoding_to_check, tolerance=0.6):
    """Compares a list of known encodings against a target encoding."""
    if not known_encodings:
        return []
    return face_recognition.compare_faces(known_encodings, face_encoding_to_check, tolerance=tolerance)

def get_face_distance(known_encodings, face_encoding_to_check):
    """Returns the face distance (similarity score) between known encodings and a target."""
    if not known_encodings:
        return []
    return face_recognition.face_distance(known_encodings, face_encoding_to_check)
