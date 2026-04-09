import face_engine
import database
import numpy as np
import os

def test_integration():
    print("[*] Starting integration test...")

    # 1. Simulate adding a person to DB
    name = "Test Subject"
    # Create a fake encoding (128 dimensions)
    fake_encoding = np.random.rand(128)
    database.add_person_encoding(name, fake_encoding)
    print(f"[+] Added {name} with random encoding to DB.")

    # 2. Reload DB and check if person exists
    db = database.load_db()
    person = database.find_person_by_encoding(db, fake_encoding, tolerance=0.1) # low tolerance for exact match

    if person and person['name'] == name:
        print(f"[SUCCESS] Found person {person['name']} in database.")
    else:
        print("[FAILURE] Could not find person in database.")
        return

    # 3. Check search engine
    import search_engine
    links = search_engine.generate_social_media_links(name)
    if "google.com" in links['google_search'] and "Test%20Subject" in links['google_search']:
        print(f"[SUCCESS] Search links generated correctly: {links['google_search']}")
    else:
        print("[FAILURE] Search links incorrect.")
        return

    print("[*] Integration test completed successfully!")

if __name__ == "__main__":
    test_integration()
