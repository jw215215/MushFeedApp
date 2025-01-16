import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function processImageWithMushStyle(imagePath) {
  const browser = await chromium.launch({
    headless: false // Set to true in production
  });
  
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Navigate to mush.style
    await page.goto('https://www.mush.style/en/ai');
    
    // Wait for the file input to be available
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.waitFor();
    
    // Upload the image
    await fileInput.setInputFiles(imagePath);
    
    // Wait for processing to complete (adjust selectors based on actual page structure)
    await page.waitForSelector('.results', { timeout: 120000 }); // 2 minute timeout
    
    // Extract results
    const results = await page.evaluate(() => {
      const resultElement = document.querySelector('.results');
      return resultElement ? resultElement.innerHTML : null;
    });
    
    return results;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Example usage
const imagePath = path.resolve(process.cwd(), 'public/generated-photos/marcus_johnson_1.jpg');

processImageWithMushStyle(imagePath)
  .then(results => {
    console.log('Processing results:', results);
    // Save results to a file
    fs.writeFileSync('src/data/mush_style_results.json', JSON.stringify(results, null, 2));
  })
  .catch(console.error); 