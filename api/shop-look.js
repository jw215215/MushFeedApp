import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
    
    // Configure minimal Chrome
    const executablePath = await chromium.executablePath();
    console.log('Executable path:', executablePath);
    
    if (!executablePath) {
      throw new Error('Chromium executable path is not defined');
    }
    
    const minimalArgs = chromium.args;
    console.log('Chromium args:', minimalArgs);

    browser = await puppeteer.launch({
      args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true
    });
    
    console.log('Browser launched successfully');
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    console.log('Navigating to mush.style...');
    await page.goto('https://www.mush.style/en/ai', {
      waitUntil: 'networkidle0',
      timeout: 60000
    });
    
    console.log('Looking for upload button...');
    const uploadButton = await page.waitForSelector('button:has-text("Upload your style inspiration")', {
      timeout: 30000
    });
    await uploadButton.click();
    
    console.log('Handling file upload...');
    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      page.click('text=upload file')
    ]);
    await fileChooser.accept([tempFilePath]);
    
    await page.waitForTimeout(2000);
    console.log('Upload successful');
    res.status(200).json({ success: true });
    
  } catch (error) {
    console.error('Handler error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      chromiumPath: await chromium.executablePath(),
      chromiumArgs: chromium.args
    });
    res.status(500).json({ 
      success: false, 
      error: error.message || 'An unknown error occurred'
    });
  } finally {
    if (browser) {
      console.log('Closing browser...');
      try {
        await browser.close();
      } catch (error) {
        console.error('Error closing browser:', error);
      }
    }
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
      } catch (error) {
        console.error('Error deleting temp file:', error);
      }
    }
  }
}
