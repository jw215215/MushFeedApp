const BASE_URL = "https://image.pollinations.ai/prompt/";
const LOCAL_STORAGE_KEY = "mush_demo_images";

// Creator profile template
const creatorProfile = {
  name: "Sophie Chen",
  personality: "Minimalist fashion blogger, sustainable style advocate",
  physicalDescription: `
    - Asian woman in her late 20s
    - Shoulder-length straight black hair with subtle highlights
    - Height: 5'7" (170cm)
    - Slim build
    - Often wears neutral colors and clean-cut silhouettes
    - Natural makeup with focus on glowing skin
    - Usually photographed in urban settings or minimal backgrounds
  `,
  style: "Modern minimalist with Japanese and Scandinavian influences",
  colorPalette: "Neutral tones - beige, white, black, sage green, warm grey"
};

// Base prompt template for consistent character generation
const basePrompt = `
A stylish ${creatorProfile.physicalDescription}, wearing minimalist fashion. 
High-end fashion photography style, natural lighting, urban setting.
Professional photography, high resolution, detailed facial features, fashion blog style.
`;

// Generate 10 different outfit prompts for the creator
const outfitPrompts = [
  `${basePrompt} She wears a crisp white oversized button-down shirt, high-waisted beige linen pants, and minimal gold jewelry. Standing in front of a concrete wall with soft natural lighting.`,
  
  `${basePrompt} Dressed in a sage green silk midi dress with subtle draping, paired with minimal leather sandals. Photographed in a modern gallery space with large windows.`,
  
  `${basePrompt} Wearing a black cashmere turtleneck, cream high-waisted wide-leg trousers, and simple leather mules. Standing in a minimalist apartment with wooden floors.`,
  
  `${basePrompt} Styled in a beige wool coat, white t-shirt, black straight-leg jeans, and leather boots. Walking on a quiet city street with modern architecture.`,
  
  `${basePrompt} In a neutral toned ensemble: taupe blazer, white silk camisole, and cream tailored pants. Photographed in a cafe with marble tables and natural light.`,
  
  `${basePrompt} Wearing a minimalist black midi dress with architectural details, paired with simple leather sandals. Standing in a modern courtyard with concrete planters.`,
  
  `${basePrompt} Styled in wide-leg cream linen pants, a fitted grey knit top, and minimal jewelry. Photographed against a white wall with subtle shadows.`,
  
  `${basePrompt} In a monochrome outfit: oversized white shirt dress, leather belt, and minimal sandals. Standing in front of large windows with city views.`,
  
  `${basePrompt} Wearing a camel colored wool sweater, white straight-leg pants, and leather loafers. Photographed in a minimal home office setting.`,
  
  `${basePrompt} Styled in a black silk jumpsuit with clean lines, minimal gold accessories. Standing in an art gallery with white walls and concrete floors.`
];

// Function to generate and store image URLs
async function generateAndStoreImages() {
  // Check if we already have stored images
  const storedImages = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedImages) {
    return JSON.parse(storedImages);
  }

  // Generate new images
  const generatedImages = await Promise.all(
    outfitPrompts.map(async (prompt) => {
      const encodedPrompt = encodeURIComponent(prompt);
      const url = `${BASE_URL}${encodedPrompt}`;
      
      try {
        // Fetch the image and convert to base64
        const response = await fetch(url);
        const blob = await response.blob();
        const base64 = await convertBlobToBase64(blob);
        
        return {
          url: base64,
          prompt: prompt
        };
      } catch (error) {
        console.error('Failed to generate image:', error);
        return null;
      }
    })
  );

  // Store in localStorage
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(generatedImages));
  
  return generatedImages;
}

// Helper function to convert blob to base64
function convertBlobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Update the existing generateImageUrls function
async function generateImageUrls() {
  const images = await generateAndStoreImages();
  return images.map(img => img.url);
} 