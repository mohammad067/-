import json
import os
import numpy as np

DB_FILE = "data/people.json"

def load_db():
    if not os.path.exists(DB_FILE):
        return []
    with open(DB_FILE, 'r') as f:
        return json.load(f)

def save_db(data):
    with open(DB_FILE, 'w') as f:
        json.dump(data, f, indent=4)

def find_person_by_encoding(db, target_encoding, tolerance=0.6):
    import face_engine

    for person in db:
        known_encodings = [np.array(enc) for enc in person.get('encodings', [])]
        if not known_encodings:
            continue

        matches = face_engine.compare_faces(known_encodings, target_encoding, tolerance=tolerance)
        if any(matches):
            return person
    return None

def add_person_encoding(name, encoding):
    db = load_db()
    person_found = False
    for person in db:
        if person['name'].lower() == name.lower():
            if 'encodings' not in person:
                person['encodings'] = []
            # Convert numpy array to list for JSON serialization
            person['encodings'].append(encoding.tolist())
            person_found = True
            break

    if not person_found:
        new_person = {
            "id": len(db) + 1,
            "name": name,
            "social_media": {},
            "last_seen": {"location": "Unknown", "timestamp": "Unknown"},
            "encodings": [encoding.tolist()]
        }
        db.append(new_person)

    save_db(db)
