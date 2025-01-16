import express from 'express';
import cors from 'cors';
import { chromium, firefox, webkit } from 'playwright';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 8000;

// Enable CORS for React frontend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

async function getDefaultBrowser() {
  try {
    // On macOS, use 'defaults read' to get default browser
    const { stdout } = await execAsync('defaults read com.apple.LaunchServices/com.apple.launchservices.secure LSHandlers | grep "LSHandlerRoleAll = \\"https\\"" -A 3 -B 3');
    
    const browserMapping = {
      'com.google.chrome': chromium,
      'com.apple.safari': webkit,
      'org.mozilla.firefox': firefox
    };

    for (const [bundleId, browser] of Object.entries(browserMapping)) {
      if (stdout.includes(bundleId)) {
        return browser;
      }
    }

    // Default to chromium if we can't determine the default browser
    return chromium;
  } catch (error) {
    console.error('Error detecting default browser:', error);
    return chromium; // Fallback to chromium
  }
}

async function downloadImage(imageUrl) {
  try {
    // Create a temporary directory if it doesn't exist
    const tempDir = path.join(__dirname, '../../temp');
    await fs.mkdir(tempDir, { recursive: true });

    // Generate a temporary file path
    const tempFilePath = path.join(tempDir, `temp-${Date.now()}.jpg`);

    // If the URL is relative, make it absolute
    if (imageUrl.startsWith('/')) {
      imageUrl = `http://localhost:5173${imageUrl}`;
    }

    // Download the image
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error('Failed to download image');
    
    const buffer = await response.buffer();
    await fs.writeFile(tempFilePath, buffer);

    return tempFilePath;
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
}

app.post('/shop-look', async (req, res) => {
  const { image_path } = req.body;
  let browser;
  let tempFilePath;
  
  try {
    console.log('Downloading image from:', image_path);
    tempFilePath = await downloadImage(image_path);
    console.log('Image downloaded to:', tempFilePath);

    // Get the appropriate browser engine
    const browserType = await getDefaultBrowser();
    console.log('Using browser:', browserType.name());

    // Launch browser
    browser = await browserType.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Navigate to mush.style
    await page.goto('https://www.mush.style/en/ai');
    
    // Click upload button
    await page.getByRole('button', { name: 'Upload your style inspiration' }).click();
    
    // Handle file upload
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByText('upload file').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(tempFilePath);
    
    // Wait for results
    await page.waitForSelector('.results', { timeout: 30000 });
    
    res.json({ success: true });
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
    // Clean up temporary file
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
      } catch (error) {
        console.error('Error cleaning up temp file:', error);
      }
    }
  }
});

app.listen(port, () => {
  console.log(`Shop look service running on port ${port}`);
}); 