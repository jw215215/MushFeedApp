import fs from 'fs';
import path from 'path';

// Read the sample data
const sampleData = JSON.parse(fs.readFileSync('./src/data/sampleData.json', 'utf8'));

// Comment templates for each influencer's style
const commentStyles = {
  sofia_chen: [
    "Love the minimalist vibes! 🤍",
    "This is such a clean look ✨",
    "Perfect blend of tech and style 💫",
    "Need this in my wardrobe ASAP!",
    "The aesthetic is everything 🙌",
    "Silicon Valley chic at its finest 💻✨"
  ],
  marcus_johnson: [
    "Street style on point! 🔥",
    "This fit goes hard 💯",
    "Urban luxury done right 🌆",
    "Need those kicks! 👟",
    "Straight fire my guy 🔥",
    "That's the wave 🌊"
  ],
  priya_patel: [
    "Absolutely stunning fusion! 💫",
    "The details are everything ✨",
    "Such elegant styling 🌟",
    "This is art! 🎨",
    "Pure luxury 💎",
    "Need this look for my next event! 🎉"
  ],
  diego_ramirez: [
    "Classic with a modern twist 👌",
    "Vintage vibes all day 🌟",
    "This is timeless 🕰️",
    "Style icon status 💫",
    "Bringing back the classics 🎩",
    "Need this in my collection!"
  ],
  emma_wilson: [
    "Sustainable fashion goals! 🌱",
    "Love this eco-conscious look 💚",
    "Earth-friendly and stylish 🌍",
    "This is the future of fashion ✨",
    "Beautiful and sustainable 🌿",
    "Where can I get this? 💚"
  ],
  raj_kumar: [
    "Future of fashion right here 🚀",
    "Tech-wear perfection 💫",
    "This is next level 🔥",
    "Innovation at its finest ⚡",
    "Need this in my rotation 🌟",
    "Absolutely groundbreaking 🌠"
  ],
  yuki_tanaka: [
    "Breaking boundaries as always! 🎨",
    "This is pure art 🖼️",
    "Avant-garde excellence ✨",
    "Revolutionary style 🌟",
    "Fashion as art 🎭",
    "Pushing creative limits 💫"
  ],
  isabella_martinez: [
    "Boho dreams come true 🌸",
    "Free spirit energy ✨",
    "This vibe is everything 🌺",
    "Romance meets modern 💫",
    "Absolutely dreamy 🌙",
    "Need this whole look! 🌸"
  ],
  james_anderson: [
    "Timeless elegance 🎩",
    "Classic menswear done right ✨",
    "Sophisticated style 💫",
    "This is pure class 🌟",
    "Impeccable taste 👔",
    "Gentleman's style guide 🎩"
  ],
  zara_williams: [
    "Bold and beautiful! ⚡",
    "This look is everything 💫",
    "Contemporary queen 👑",
    "Fashion forward as always ✨",
    "Absolutely iconic 🌟",
    "Need this entire outfit! 💖"
  ]
};

// Generate random number of comments (3-5) for each post
sampleData.posts.forEach(post => {
  const numComments = Math.floor(Math.random() * 3) + 3; // 3-5 comments
  const comments = [];
  const usedUsers = new Set();

  // Generate random likes count (32-500)
  post.likes = Math.floor(Math.random() * (500 - 32 + 1)) + 32;

  // Get list of users excluding the post creator
  const availableUsers = sampleData.users
    .filter(user => user.id !== post.user_id)
    .map(user => user.id);

  // Generate random comments
  for (let i = 0; i < numComments; i++) {
    // Select random user that hasn't commented yet
    let randomUserIndex;
    do {
      randomUserIndex = Math.floor(Math.random() * availableUsers.length);
    } while (usedUsers.has(availableUsers[randomUserIndex]));

    const userId = availableUsers[randomUserIndex];
    usedUsers.add(userId);

    // Get random comment from user's style
    const userComments = commentStyles[userId];
    const randomComment = userComments[Math.floor(Math.random() * userComments.length)];

    // Add comment with timestamp slightly after post
    const postDate = new Date(post.timestamp);
    const commentDate = new Date(postDate.getTime() + Math.random() * 24 * 60 * 60 * 1000); // Within 24 hours

    comments.push({
      id: `${post.id}_comment_${i + 1}`,
      user_id: userId,
      text: randomComment,
      timestamp: commentDate.toISOString()
    });
  }

  // Sort comments by timestamp
  comments.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
  // Add comments to post
  post.comments = comments;
});

// Write updated data back to file
fs.writeFileSync(
  './src/data/sampleData.json',
  JSON.stringify(sampleData, null, 2),
  'utf8'
);

console.log('Generated comments and likes for all posts!'); 