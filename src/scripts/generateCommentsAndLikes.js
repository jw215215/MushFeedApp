import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the existing sample data
const sampleDataPath = path.join(__dirname, '../data/sampleData.json');
const sampleData = JSON.parse(fs.readFileSync(sampleDataPath, 'utf8'));

// Define comment templates for each influencer
const influencerComments = {
  sofia_chen: [
    "This look is everything! 🔥",
    "Obsessed with your style! Where's the outfit from?",
    "You always nail it with these looks! 👏",
    "Need this entire outfit in my closet asap!"
  ],
  marcus_johnson: [
    "Clean fit! The proportions are perfect 👌",
    "This styling is next level",
    "Major inspo right here 🙌",
    "The way you put pieces together is amazing"
  ],
  priya_patel: [
    "Absolutely stunning combination! 💫",
    "Love how you styled this!",
    "This look is giving everything it needs to give!",
    "Need to recreate this asap!"
  ],
  diego_ramirez: [
    "Fire outfit! 🔥",
    "The styling here is impeccable",
    "This is such a vibe",
    "Need those pieces in my wardrobe!"
  ],
  emma_wilson: [
    "Absolutely love this look! 😍",
    "The way you styled this is perfect",
    "Major fashion inspiration!",
    "This outfit is everything!"
  ],
  raj_kumar: [
    "Incredible styling as always! 👌",
    "This fit goes hard!",
    "Need to cop this entire look",
    "The attention to detail here is crazy"
  ],
  yuki_tanaka: [
    "Such a well-curated look! ✨",
    "The styling is immaculate",
    "This is pure fashion excellence",
    "Every piece works so perfectly together"
  ],
  isabella_martinez: [
    "This look is absolutely stunning! 💖",
    "Fashion goals right here!",
    "Can't get over how perfect this styling is",
    "Need every single piece from this outfit"
  ],
  james_anderson: [
    "Killer outfit! The proportions are perfect 🔥",
    "This is how you put together a look!",
    "Style game always on point",
    "Such a clean fit!"
  ],
  zara_williams: [
    "Obsessed with this entire look! 💫",
    "The styling here is everything",
    "Fashion perfection!",
    "Need to recreate this asap!"
  ]
};

// Get all influencer IDs
const influencerIds = Object.keys(influencerComments);

// Function to generate a random number between min and max
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Function to get random comments for a post
const getRandomComments = (postCreatorId) => {
  const numComments = getRandomInt(3, 5);
  const comments = [];
  const usedInfluencers = new Set();

  while (comments.length < numComments) {
    const influencerId = influencerIds[Math.floor(Math.random() * influencerIds.length)];
    
    // Skip if we've used this influencer or if it's the post creator
    if (usedInfluencers.has(influencerId) || influencerId === postCreatorId) {
      continue;
    }

    const possibleComments = influencerComments[influencerId];
    const commentText = possibleComments[Math.floor(Math.random() * possibleComments.length)];
    
    comments.push({
      id: `comment_${Math.random().toString(36).substr(2, 9)}`,
      post_id: null, // Will be set in the loop
      user_id: influencerId,
      text: commentText,
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString() // Random time in last 24h
    });

    usedInfluencers.add(influencerId);
  }

  return comments;
};

// Generate comments and likes for each post
const allComments = [];
sampleData.posts = sampleData.posts.map(post => {
  // Generate random likes count
  const likesCount = getRandomInt(32, 500);
  
  // Generate comments for this post
  const postComments = getRandomComments(post.user_id);
  postComments.forEach(comment => {
    comment.post_id = post.id;
    allComments.push(comment);
  });

  // Create an array of random user IDs who liked the post
  const likedByUsers = [];
  const numLikes = likesCount;
  const availableUsers = influencerIds.filter(id => id !== post.user_id);
  
  while (likedByUsers.length < numLikes && availableUsers.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableUsers.length);
    const userId = availableUsers[randomIndex];
    likedByUsers.push(userId);
    availableUsers.splice(randomIndex, 1);
  }

  return {
    ...post,
    likes: likedByUsers
  };
});

// Update the comments in the sample data
sampleData.comments = allComments;

// Sort comments by timestamp
sampleData.comments.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

// Write the updated data back to the file
fs.writeFileSync(sampleDataPath, JSON.stringify(sampleData, null, 2));

console.log('Successfully generated comments and likes for all posts!'); 