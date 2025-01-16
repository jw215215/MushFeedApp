import { chromium } from 'playwright-core';
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

    browser = await chromium.launch({ 
      headless: false,
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto('https://www.mush.style/en/ai');
    await page.getByRole('button', { name: 'Upload your style inspiration' }).click();
    
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByText('upload file').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(tempFilePath);
    
    await page.waitForSelector('.results', { timeout: 30000 });
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message
    });
  } finally {
    if (browser) {
      await browser.close();
    }
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
      } catch (error) {
        console.error('Error cleaning up temp file:', error);
      }
    }
  }
} 