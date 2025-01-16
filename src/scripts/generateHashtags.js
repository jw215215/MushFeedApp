import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const PHOTOS_DIR = path.join(process.cwd(), 'public', 'generated-photos');
const API_KEY = process.env.GOOGLE_AI_STUDIO_API_KEY;
const MODEL_NAME = "gemini-2.0-flash-exp";
const RPM_LIMIT = 9;
const DELAY_BETWEEN_REQUESTS = Math.ceil(60000 / RPM_LIMIT); // Ensures 9 requests per minute

async function imageToBase64(imagePath) {
  const imageBuffer = await fs.readFile(imagePath);
  return imageBuffer.toString('base64');
}

async function analyzeImage(base64Image, filename) {
  // Extract influencer name from filename (e.g., "sofia_chen_1.jpg" -> "sofia_chen")
  const influencerName = filename.split('_').slice(0, 2).join('_');
  
  // Define personality traits for each influencer
  const personalities = {
    sofia_chen: {
      voice: "tech-savvy and minimalist",
      style: "modern Asian fusion meets Silicon Valley chic"
    },
    marcus_johnson: {
      voice: "confident and sophisticated",
      style: "luxury streetwear with an urban edge"
    },
    priya_patel: {
      voice: "artistic and spiritual",
      style: "bohemian fusion with traditional Indian elements"
    },
    isabella_garcia: {
      voice: "vibrant and passionate",
      style: "bold Mexican-inspired contemporary fashion"
    },
    james_wilson: {
      voice: "laid-back and authentic",
      style: "elevated casual with vintage touches"
    },
    olivia_thompson: {
      voice: "polished and professional",
      style: "modern corporate with a creative twist"
    },
    david_kim: {
      voice: "trendy and playful",
      style: "K-pop inspired street fashion"
    },
    zara_ahmed: {
      voice: "elegant and cultured",
      style: "modest fashion with a modern twist"
    },
    lucas_santos: {
      voice: "energetic and adventurous",
      style: "athleisure meets high fashion"
    },
    maya_patel: {
      voice: "eco-conscious and innovative",
      style: "sustainable luxury with global influences"
    }
  };

  const personality = personalities[influencerName] || {
    voice: "stylish and trendsetting",
    style: "contemporary fashion"
  };

  const prompt = `
    You are analyzing a photo for ${influencerName.replace('_', ' ')}, a fashion influencer with a ${personality.voice} voice who specializes in ${personality.style}.
    
    Provide TWO things:
    1. A short, impactful image caption that:
       - MAXIMUM 10 WORDS
       - Matches the influencer's ${personality.voice} voice
       - Reflects their ${personality.style} aesthetic
       - Be concise but captivating
       - No hashtags in caption
    
    2. Hashtags in these specific categories:
       STYLE (exactly 2):
       - One for overall style aesthetic (e.g. #MinimalistFashion, #StreetStyle)
       - One for style mood or trend (e.g. #AvantGarde, #ClassicElegance)
       
       COLORS (up to 3):
       - List only colors you actually see in the outfit
       - Format as #ColorName (e.g. #WhiteOutfit, #RedAccents, #BlackEnsemble)
       
       ITEMS (up to 5):
       - List specific garments/accessories visible in the photo
       - Format as #ItemName (e.g. #OversizedBlazer, #LeatherBoots, #SilkScarf)
       
    Note: For colors and items, only include what you actually see. It's okay to list fewer than the maximum.
    
    Format your response exactly like this example:
    CAPTION: Sleek blazer and silk pants create modern power look.
    STYLE: #MinimalistFashion, #ModernElegance
    COLORS: #WhiteOutfit, #CreamTones, #IvoryDetails
    ITEMS: #OversizedBlazer, #WideLegPants, #LeatherClutch, #GoldNecklace, #PointedHeels
  `;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: "image/jpeg",
              data: base64Image
            }
          }
        ]
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;
  
  // Parse the response with new categories
  const captionMatch = text.match(/CAPTION: (.*?)(?=\n[A-Z]+:)/s);
  const styleMatch = text.match(/STYLE: (.*?)(?=\n[A-Z]+:)/);
  const colorMatch = text.match(/COLORS: (.*?)(?=\n[A-Z]+:)/);
  const itemsMatch = text.match(/ITEMS: (.*?)$/);
  
  // Ensure caption is no more than 10 words
  const caption = captionMatch 
    ? captionMatch[1].trim().split(' ').slice(0, 10).join(' ')
    : "Chic style statement in modern setting.";
  
  // Combine all hashtags while preserving categories
  const styleHashtags = styleMatch ? styleMatch[1].split(', ').map(tag => tag.trim()) : [];
  const colorHashtags = colorMatch ? colorMatch[1].split(', ').map(tag => tag.trim()) : [];
  const itemHashtags = itemsMatch ? itemsMatch[1].split(', ').map(tag => tag.trim()) : [];
  
  return {
    caption,
    hashtags: [...styleHashtags, ...colorHashtags, ...itemHashtags],
    categories: {
      style: styleHashtags,
      colors: colorHashtags,
      items: itemHashtags
    }
  };
}

async function processImages() {
  const outputPath = path.join(process.cwd(), 'src', 'data', 'generatedContent.json');
  try {
    // Load existing results if any
    let results = {};
    try {
      const existingContent = await fs.readFile(outputPath, 'utf8');
      results = JSON.parse(existingContent);
    } catch (error) {
      console.log('No existing content found, starting fresh');
    }

    const files = await fs.readdir(PHOTOS_DIR);
    const imageFiles = files.filter(file => file.endsWith('.jpg'));

    // Process in batches of 9
    for (let i = 0; i < imageFiles.length; i += RPM_LIMIT) {
      const batchStartTime = Date.now();
      console.log(`\nProcessing batch ${Math.floor(i/RPM_LIMIT) + 1}...`);
      const batch = imageFiles.slice(i, i + RPM_LIMIT);
      
      // Process all 9 images in the batch concurrently
      const batchPromises = batch.map(async (file) => {
        try {
          console.log(`Starting ${file}...`);
          const imagePath = path.join(PHOTOS_DIR, file);
          const base64Image = await imageToBase64(imagePath);
          const analysis = await analyzeImage(base64Image, file);
          
          results[file] = analysis;
          console.log(`✓ Completed ${file}`);

          // Save after each successful analysis
          await fs.writeFile(outputPath, JSON.stringify(results, null, 2));
          
          return analysis;
        } catch (error) {
          console.error(`✗ Error processing ${file}:`, error);
          results[file] = {
            caption: "Exploring fashion's finest moments.",
            hashtags: ['#StyleInspo', '#FashionMoment', '#OOTD', '#TrendAlert']
          };
          // Save even after errors
          await fs.writeFile(outputPath, JSON.stringify(results, null, 2));
        }
      });

      // Wait for all 9 requests in batch to complete
      await Promise.all(batchPromises);
      
      // If there are more images to process, ensure 60 seconds have passed since batch start
      if (i + RPM_LIMIT < imageFiles.length) {
        const elapsedTime = Date.now() - batchStartTime;
        const remainingTime = Math.max(60000 - elapsedTime, 0);
        
        if (remainingTime > 0) {
          console.log(`\nWaiting ${Math.ceil(remainingTime/1000)} seconds before next batch...`);
          await new Promise(resolve => setTimeout(resolve, remainingTime));
        } else {
          console.log('\nProceeding immediately to next batch (60 seconds already elapsed)');
        }
      }
    }

    console.log(`\nResults saved to ${outputPath}`);

  } catch (error) {
    console.error('Fatal error:', error);
  }
}

// Run the script
processImages().then(() => {
  console.log('Content generation completed');
}).catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
}); 