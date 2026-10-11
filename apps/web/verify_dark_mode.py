import os
from playwright.sync_api import sync_playwright

def run_cuj(page):
    # Navigate to the order tracking page with valid mock order
    page.goto("http://localhost:3001/order-tracking?orderId=TS-24081254&mobile=09123456789")
    page.wait_for_timeout(1000)

    # Click the Theme Toggle button (which is the button containing the title attribute for mode or just we can execute javascript to add 'dark' class)
    page.evaluate("() => document.documentElement.classList.add('dark')")
    page.wait_for_timeout(1500) # wait for transitions

    # Ensure output directories exist
    os.makedirs("/home/jules/verification/screenshots", exist_ok=True)

    # Take screenshot in dark mode
    page.screenshot(path="/home/jules/verification/screenshots/order_tracking_dark.png", full_page=True)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
