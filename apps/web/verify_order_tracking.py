import os
from playwright.sync_api import sync_playwright

def run_cuj(page):
    # Navigate to the order tracking page with valid mock order
    page.goto("http://localhost:3001/order-tracking?orderId=TS-24081254&mobile=09123456789")
    page.wait_for_timeout(2000) # wait for animations to complete

    # Ensure output directories exist
    os.makedirs("/home/jules/verification/screenshots", exist_ok=True)
    os.makedirs("/home/jules/verification/videos", exist_ok=True)

    # Take screenshot at the key moment
    page.screenshot(path="/home/jules/verification/screenshots/order_tracking.png", full_page=True)
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
