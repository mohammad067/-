import urllib.parse

def generate_google_search_url(name):
    query = f"{name} news location"
    encoded_query = urllib.parse.quote(query)
    return f"https://www.google.com/search?q={encoded_query}"

def generate_instagram_search_url(name):
    query = f"{name}"
    encoded_query = urllib.parse.quote(query)
    # Instagram doesn't have a simple search URL like Google,
    # but we can direct to a search query on Google limited to Instagram
    return f"https://www.google.com/search?q=site:instagram.com+{encoded_query}"

def generate_social_media_links(name):
    return {
        "google_search": generate_google_search_url(name),
        "instagram_search": generate_instagram_search_url(name)
    }

def simulate_web_search(name):
    """
    In a real scenario, this might use a SERP API or scraping.
    For this project, we provide the URLs for the user to follow.
    """
    links = generate_social_media_links(name)
    return f"Search links for {name}:\n- Google: {links['google_search']}\n- Instagram: {links['instagram_search']}"
