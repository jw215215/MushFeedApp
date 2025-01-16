import { webkit } from 'playwright-core';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

async function downloadImage(imageUrl) {
  try {
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `temp-${Date.now()}.jpg`);

    if (imageUrl.startsWith('/')) {
      imageUrl = `http://localhost:5173${imageUrl}`;
    }

    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error('Failed to download image');
    
    const buffer = await response.arrayBuffer();
    await fs.writeFile(tempFilePath, Buffer.from(buffer));

    return tempFilePath;
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image_path } = req.body;
  let browser;
  let tempFilePath;
  
  try {
    tempFilePath = await downloadImage(image_path);

    // Launch WebKit (Safari) browser
    browser = await webkit.launch({ 
      headless: false
    });
    
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 }
    });
    const page = await context.newPage();
    
    // Increase navigation timeout to 2 minutes
    page.setDefaultNavigationTimeout(120000);
    page.setDefaultTimeout(120000);
    
    await page.goto('https://www.mush.style/en/ai');
    
    // Wait for and click the upload button
    const uploadButton = await page.waitForSelector('button:has-text("Upload your style inspiration")');
    await uploadButton.click();
    
    // Handle file upload
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('text=upload file');
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(tempFilePath);
    
    // Send success response immediately after upload
    res.status(200).json({ success: true });
    
    // Don't close the browser - let the user see what's happening
    // The browser will close when the user closes the window
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message
    });
    if (browser) {
      await browser.close();
    }
  } finally {
    // Only clean up the temp file
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
      } catch (error) {
        console.error('Error cleaning up temp file:', error);
      }
    }
  }
} 