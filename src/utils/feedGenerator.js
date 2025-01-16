// Sample feed post generator
function generateFeedPosts(imageUrls) {
  const posts = imageUrls.map((url, index) => {
    return {
      creator: {
        id: "sophie_chen_01",
        name: "Sophie Chen",
        profile: creatorProfile
      },
      image: {
        url: url,
        prompt: outfitPrompts[index]
      },
      caption: generateCaption(index),
      timestamp: new Date(Date.now() - index * 86400000), // Posts spread over last 10 days
      engagement: {
        likes: Math.floor(Math.random() * 1000) + 500,
        comments: Math.floor(Math.random() * 50) + 10
      }
    };
  });
  
  return posts;
}

function generateCaption(index) {
  const captions = [
    "Finding beauty in simplicity ✨ #minimalistfashion #sustainablestyle",
    "Less is more. Today's minimal look for meetings and coffee runs ☕️",
    "Embracing neutral tones and clean lines for the perfect weekend outfit 🤍",
    "The art of effortless style #minimalism #slowfashion",
    "Simple pieces, endless possibilities 🌟 #capsulewardrobe",
    "Clean lines and neutral tones - my uniform for creative days 🎨",
    "Minimal doesn't mean boring. It's all in the details ✨",
    "Sunday in neutrals. This shirt dress is a staple in my capsule wardrobe 🤍",
    "Finding peace in simplicity. This sweater is made from sustainable wool 🌿",
    "Art gallery ready in my favorite jumpsuit. Sometimes one piece is all you need ⚡️"
  ];
  
  return captions[index];
} 