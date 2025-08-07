import asyncio
from playwright.async_api import async_playwright, expect
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Get the absolute path to the index.html file
        file_path = os.path.abspath('index.html')

        # Go to the local HTML file
        await page.goto(f'file://{file_path}')

        # Wait for the table to be visible, which indicates the data has loaded
        await expect(page.locator("#data-table")).to_be_visible(timeout=10000)

        # Take a screenshot of the initial view
        await page.screenshot(path="jules-scratch/verification/initial_view.png")

        # Find the search input and type a search term
        search_input = page.get_by_placeholder("Search...")
        await search_input.fill("John Doe")

        # Wait for the table to update with the filtered results
        # A simple delay to allow the table to re-render
        await page.wait_for_timeout(1000)

        # Take a screenshot of the filtered view
        await page.screenshot(path="jules-scratch/verification/filtered_view.png")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
