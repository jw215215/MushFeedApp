import { webkit } from 'playwright';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

async function downloadImage(imageUrl) {
  try {
    console.log('Downloading image from:', imageUrl);
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `temp-${Date.now()}.jpg`);

    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.error('Download failed:', response.status, response.statusText);
      throw new Error('Failed to download image');
    }
    
    const buffer = await response.arrayBuffer();
    await fs.writeFile(tempFilePath, Buffer.from(buffer));
    console.log('Image downloaded to:', tempFilePath);

    return tempFilePath;
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
}

export default async function shopLookHandler(req, res) {
  console.log('Received request body:', req.body);
  const { image_path } = req.body;
  
  if (!image_path) {
    console.error('No image_path provided');
    return res.status(400).json({ 
      success: false, 
      error: 'No image path provided' 
    });
  }

  let browser;
  let tempFilePath;
  
  try {
    console.log('Starting image download...');
    tempFilePath = await downloadImage(image_path);
    console.log('Image downloaded successfully');

    console.log('Launching browser...');
    browser = await webkit.launch({ 
      headless: true,
      args: ['--no-sandbox']
    });
    
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 }
    });
    const page = await context.newPage();
    
    // Set longer timeouts for serverless environment
    page.setDefaultTimeout(60000);
    page.setDefaultNavigationTimeout(60000);
    
    console.log('Navigating to mush.style...');
    await page.goto('https://www.mush.style/en/ai');
    
    console.log('Looking for upload button...');
    const uploadButton = await page.waitForSelector('button:has-text("Upload your style inspiration")');
    await uploadButton.click();
    
    console.log('Handling file upload...');
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('text=upload file');
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(tempFilePath);
    
    // Wait for upload to complete
    await page.waitForTimeout(2000);
    
    console.log('Upload successful');
    res.status(200).json({ success: true });
    
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error'
    });
  } finally {
    if (browser) {
      console.log('Closing browser...');
      await browser.close();
    }
    if (tempFilePath) {
      try {
        console.log('Cleaning up temp file...');
        await fs.unlink(tempFilePath);
      } catch (error) {
        console.error('Error cleaning up temp file:', error);
      }
    }
  }
} 