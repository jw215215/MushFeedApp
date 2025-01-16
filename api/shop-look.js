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
    
    const executablePath = await chromium.executablePath();
    console.log('Executable path:', executablePath);

    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: {
        width: 1280,
        height: 800
      },
      executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true
    });

    console.log('Browser launched successfully');
    const page = await browser.newPage();
    
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
    const fileInput = await page.$('input[type="file"]');
    await fileInput.uploadFile(tempFilePath);
    
    console.log('Waiting for results...');
    await page.waitForSelector('.results', { timeout: 60000 });
    
    const results = await page.evaluate(() => {
      const resultElement = document.querySelector('.results');
      return resultElement ? resultElement.textContent : null;
    });

    if (!results) {
      throw new Error('No results found');
    }

    await browser.close();
    await fs.unlink(tempFilePath);

    return res.status(200).json({
      success: true,
      results
    });

  } catch (error) {
    console.error('Handler error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      chromiumPath: executablePath,
      chromiumArgs: chromium.args
    });

    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }

    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
      } catch (unlinkError) {
        console.error('Error deleting temp file:', unlinkError);
      }
    }

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
