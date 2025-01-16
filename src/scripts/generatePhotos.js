import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';

const BASE_URL = "https://image.pollinations.ai/prompt/";
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'generated-photos');
const CONCURRENT_REQUESTS = 5;
const DELAY_BETWEEN_BATCHES = 100;

// Complete the settings for each influencer
const influencerStyles = {
  sofia_chen: {
    style: "minimalist fashion, clean lines, architectural designs",
    color: "white and cream outfits with subtle texture",
    appearance: `Asian woman, 26, 5'7". Oval face with high cheekbones, almond-shaped brown eyes with double eyelids, 
    straight nose, naturally pink medium-full lips. Straight black hair falling just past shoulders with subtle side-swept bangs, 
    silky texture. Slim build with subtle curves, long legs, graceful posture. Elegant neck, defined collarbones. 
    Clear porcelain skin with natural glow. Minimal makeup with focus on dewy skin.`,
    settings: [
      "modern art gallery with white walls and natural light",
      "minimalist studio with concrete floors",
      "zen garden with stone pathways",
      "contemporary architecture with glass walls"
    ]
  },
  marcus_johnson: {
    style: "urban streetwear, hip-hop influenced, bold designs",
    color: "red statement pieces with black accents",
    appearance: `Black man, 32, 6'1". Strong jawline, warm brown eyes with long lashes, broad nose bridge, 
    full lips with bright smile showing straight white teeth. Short fade haircut, crisp line-up, subtle waves on top. 
    Athletic muscular build with broad shoulders, defined arms, trim waist. Dark brown skin with smooth texture, 
    well-groomed short beard following jawline. Sharp eyebrows, confident gaze.`,
    settings: [
      "urban basketball court with graffiti wall",
      "downtown street corner with neon signs",
      "industrial warehouse with brick walls",
      "hip-hop studio with modern art",
      "rooftop with city skyline view"
    ]
  },
  priya_patel: {
    style: "luxury fashion, elegant silhouettes, traditional fusion",
    color: "black and gold combinations with rich textures",
    appearance: `Indian woman, 28, 5'6". Heart-shaped face, large expressive dark brown eyes with long curled lashes, 
    sculpted eyebrows, refined nose, full lips with natural mauve tone. Long glossy black hair reaching mid-back with 
    soft layers, center part. Graceful build with hourglass figure, elegant neck, refined bone structure. 
    Warm golden-brown skin with radiant complexion. Small beauty mark above right lip.`,
    settings: [
      "luxury hotel lobby with marble floors",
      "opulent ballroom with crystal chandeliers",
      "high-end boutique with mirrors",
      "grand staircase with gold railings",
      "designer showroom with mood lighting"
    ]
  },
  diego_ramirez: {
    style: "vintage style, retro-inspired, classic cuts",
    color: "blue tones from navy to azure",
    appearance: `Mexican man, 25, 5'11". Square jaw, deep-set dark brown eyes with thick brows, straight nose with 
    subtle width, well-defined lips with natural smile. Wavy dark brown hair styled back, medium length with natural volume. 
    Lean athletic build with broad shoulders tapering to slim waist. Olive skin with warm undertones, light stubble, 
    defined cheekbones. Small scar near left eyebrow.`,
    settings: [
      "classic car showroom with vintage automobiles",
      "old havana street with colonial architecture",
      "retro vinyl record store",
      "vintage barbershop with antique mirrors",
      "art deco hotel lobby"
    ]
  },
  emma_wilson: {
    style: "sustainable fashion, eco-friendly materials, natural flow",
    color: "earth greens and natural tones",
    appearance: `White woman, 31, 5'8". Oval face, bright green eyes with scattered gold flecks, naturally arched brows, 
    straight nose with slight upturn, wide smile with subtle dimples. Wavy honey blonde hair past shoulders, face-framing 
    layers, natural texture. Athletic build with toned arms and legs, defined waist. Fair skin with rosy cheeks, light 
    freckles across nose bridge. Small crescent moon tattoo on right wrist.`,
    settings: [
      "organic garden with blooming flowers",
      "bamboo forest with natural light",
      "greenhouse with tropical plants",
      "sustainable fashion studio",
      "eco-friendly concept store"
    ]
  },
  raj_kumar: {
    style: "tech-wear, futuristic designs, innovative cuts",
    color: "silver and black with metallic accents",
    appearance: `Indian man, 29, 5'10". Angular face with sharp cheekbones, intense dark eyes with thick straight brows, 
    strong nose bridge, defined lips with subtle smile. Modern undercut with longer textured top styled with precision, 
    jet black hair. Slim athletic build with broad shoulders, lean muscle definition. Deep bronze skin tone, clean-shaven, 
    sharp jawline. Geometric tattoo on left forearm.`,
    settings: [
      "futuristic tech hub with LED walls",
      "modern architecture with glass and steel",
      "cyberpunk inspired street",
      "minimalist tech office",
      "contemporary art space with projections"
    ]
  },
  yuki_tanaka: {
    style: "avant-garde, experimental shapes, artistic",
    color: "deep purple with black and silver accents",
    appearance: `Asian man, 27, 5'9". Sharp angular features, monolid dark eyes with intense gaze, straight nose, 
    defined lips with subtle pout. Edgy asymmetrical haircut, jet black with purple undertones, shaved sides with long 
    top section. Slim build with long limbs, dancer's posture. Pale clear skin, bold straight brows, small silver ear 
    piercings. Artistic sleeve tattoo on right arm.`,
    settings: [
      "contemporary art museum with installations",
      "abstract gallery space with sculptures",
      "modern fashion district at night",
      "experimental design studio",
      "geometric architecture with purple lighting"
    ]
  },
  isabella_martinez: {
    style: "boho chic, flowing silhouettes, romantic details",
    color: "pink hues with floral patterns",
    appearance: `Mexican woman, 24, 5'5". Heart-shaped face, large doe eyes in rich brown with gold highlights, softly 
    arched brows, button nose, full lips with natural rose tint. Long wavy dark brown hair with caramel highlights, 
    reaching waist, natural volume. Petite hourglass figure, delicate bone structure. Warm golden skin tone, natural 
    glow, dimples when smiling. Small constellation tattoo behind left ear.`,
    settings: [
      "bohemian garden party setting",
      "vintage flower market with string lights",
      "rustic outdoor cafe with vines",
      "artisan studio with textiles",
      "mediterranean courtyard with bougainvillea"
    ]
  },
  james_anderson: {
    style: "classic menswear, tailored fits, timeless pieces",
    color: "navy blue with subtle patterns",
    appearance: `White man, 35, 6'0". Classic square jaw, deep-set blue eyes, strong straight brows, roman nose, 
    well-defined lips with confident smile. Short brown hair professionally styled with side part, slight grey at temples. 
    Classic athletic build, broad shoulders, trim waist. Fair skin with natural tan, light laugh lines, well-groomed 
    light stubble. Vintage watch always on left wrist.`,
    settings: [
      "private members club with leather chairs",
      "luxury yacht deck at sunset",
      "classic tailoring studio with mirrors",
      "upscale whiskey bar with wood panels",
      "vintage library with leather books"
    ]
  },
  zara_williams: {
    style: "contemporary fashion, bold statements, modern cuts",
    color: "vibrant yellow with white and black accents",
    appearance: `Black woman, 27, 5'9". Striking oval face, almond-shaped brown eyes with gold flecks, bold arched brows, 
    refined nose, full lips with glossy sheen. Natural hair in sophisticated twist-out style, dark coils with honey 
    highlights, shoulder length. Model build with long legs, elegant neck, refined collarbones. Rich dark brown skin with 
    flawless finish, high cheekbones, radiant complexion. Small gold septum ring.`,
    settings: [
      "modern fashion runway with geometric lights",
      "contemporary art gallery with white walls",
      "high-end photo studio with colorful backdrops",
      "urban fashion district with glass buildings",
      "designer showroom with artistic installations"
    ]
  }
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.blob();
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      await delay(DELAY_BETWEEN_BATCHES * (i + 1));
    }
  }
}

// Add variety arrays for dynamic prompt generation
const poseVariations = [
  "standing confidently with one hand on hip",
  "walking forward with natural stride",
  "casual lean against wall",
  "sitting elegantly on minimal chair",
  "mid-stride capturing movement",
  "turning to camera with subtle smile",
  "candid moment looking off-camera",
  "standing straight with hands relaxed",
  "dynamic pose showing outfit flow",
  "natural stance with subtle movement"
];

const cameraAngles = [
  "straight-on full body shot",
  "slight low angle emphasizing height",
  "3/4 view capturing outfit details",
  "subtle high angle fashion perspective",
  "editorial wide shot showing environment",
  "intimate medium shot with background blur",
  "dynamic angle capturing movement",
  "classic fashion photography angle",
  "contemporary street style perspective",
  "architectural composition with leading lines"
];

const lightingSetups = [
  "soft natural daylight streaming through windows",
  "golden hour sunlight creating warm glow",
  "bright diffused studio lighting",
  "dramatic side lighting with soft fill",
  "moody atmospheric lighting",
  "clean even lighting for detail",
  "backlit silhouette with rim light",
  "dappled light through architecture",
  "high-key fashion lighting",
  "editorial beauty lighting"
];

// Update the prompt generator to create URL-friendly prompts
const generatePrompt = (style, color, setting, appearance, index) => {
  const pose = poseVariations[index % poseVariations.length];
  const angle = cameraAngles[index % cameraAngles.length];
  const lighting = lightingSetups[index % lightingSetups.length];
  
  // Create a URL-friendly prompt with dashes
  return `professional-fashion-photo-${appearance.split('.')[0].toLowerCase().replace(/[^a-z0-9]+/g, '-')}-wearing-${
    color.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${
    style.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${
    pose.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${
    angle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${
    lighting.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${
    setting.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-8k-high-detail`;
};

async function generatePhotos() {
  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    for (const [influencerId, styleData] of Object.entries(influencerStyles)) {
      console.log(`\nGenerating photos for ${influencerId}...`);

      // Generate prompts for all 10 photos with variations
      const prompts = Array.from({ length: 10 }, (_, index) => {
        const setting = styleData.settings[index % styleData.settings.length];
        return {
          prompt: generatePrompt(styleData.style, styleData.color, setting, styleData.appearance, index),
          filename: `${influencerId}_${index + 1}.jpg`
        };
      });

      // Process in batches of CONCURRENT_REQUESTS
      for (let i = 0; i < prompts.length; i += CONCURRENT_REQUESTS) {
        const batch = prompts.slice(i, i + CONCURRENT_REQUESTS);
        const batchPromises = batch.map(async ({ prompt, filename }) => {
          try {
            console.log(`Starting generation of ${filename}...`);
            const imageBlob = await fetchWithRetry(`${BASE_URL}${encodeURIComponent(prompt)}`);
            const buffer = Buffer.from(await imageBlob.arrayBuffer());
            await fs.writeFile(path.join(OUTPUT_DIR, filename), buffer);
            console.log(`✓ Successfully generated ${filename}`);
          } catch (error) {
            console.error(`✗ Failed to generate ${filename}:`, error);
          }
        });

        await Promise.all(batchPromises);
        if (i + CONCURRENT_REQUESTS < prompts.length) {
          console.log(`Waiting ${DELAY_BETWEEN_BATCHES}ms before next batch...`);
          await delay(DELAY_BETWEEN_BATCHES);
        }
      }
    }

    console.log('\nPhoto generation completed!');
  } catch (error) {
    console.error('Fatal error during photo generation:', error);
  }
}

// Run the script
generatePhotos().then(() => {
  console.log('Script finished executing');
}).catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});