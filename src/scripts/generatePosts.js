import fs from 'fs';

const sampleData = JSON.parse(fs.readFileSync('src/data/sampleData.json', 'utf8'));
const users = sampleData.users;

// Generate photo arrays for each user (10 photos each)
const userPhotos = {};
users.forEach(user => {
  userPhotos[user.id] = Array.from({length: 10}, (_, i) => 
    `/generated-photos/${user.id}_${i + 1}.jpg`
  );
});

const hashtags = {
  'sofia_chen': ['#minimal', '#techstyle', '#siliconvalley', '#innovation', '#clean'],
  'marcus_johnson': ['#streetwear', '#urban', '#luxury', '#style', '#fashion'],
  'priya_patel': ['#fusion', '#luxury', '#art', '#tradition', '#style'],
  'diego_ramirez': ['#vintage', '#classic', '#menswear', '#timeless', '#style'],
  'emma_wilson': ['#sustainable', '#eco', '#conscious', '#green', '#fashion'],
  'raj_kumar': ['#techwear', '#future', '#innovation', '#modern', '#style'],
  'yuki_tanaka': ['#avantgarde', '#art', '#creative', '#boundary', '#fashion'],
  'isabella_martinez': ['#boho', '#modern', '#romantic', '#free', '#style'],
  'james_anderson': ['#menswear', '#classic', '#elegant', '#timeless', '#luxury'],
  'zara_williams': ['#bold', '#contemporary', '#vision', '#modern', '#fashion']
};

const comments = {
  'sofia_chen': ['Love this minimal look! 🤍', 'Tech vibes on point', 'So clean and elegant', 'Need this in my wardrobe!'],
  'marcus_johnson': ['Street style goals 🔥', 'This fit is everything', 'Urban luxury done right', 'Killing it bro!'],
  'priya_patel': ['Absolutely stunning! ✨', 'Love the fusion', 'This is art', 'Perfect blend of styles'],
  'diego_ramirez': ['Classic never goes out of style 👌', 'Timeless look', 'Very sophisticated', 'Sharp as always'],
  'emma_wilson': ['Sustainable queen! 🌱', 'Love the eco-conscious style', 'Beautiful and sustainable', 'This is the future of fashion'],
  'raj_kumar': ['Future is now! 🚀', 'Tech-wear perfection', 'Innovative as always', 'Need this whole fit'],
  'yuki_tanaka': ['Art in motion 🎨', 'Breaking boundaries', 'So avant-garde', 'Creative genius'],
  'isabella_martinez': ['Boho dreams come true 🌸', 'Free spirit energy', 'Such a vibe', 'Romantic and modern'],
  'james_anderson': ['Gentleman style 🎩', 'Classic elegance', 'Impeccable taste', 'Sharp look'],
  'zara_williams': ['Bold and beautiful! ⚡', 'Contemporary queen', 'Fashion forward', 'Iconic look']
};

const captions = {
  'sofia_chen': ['Tech meets style ✨', 'Silicon Valley chic', 'Minimalist vibes today', 'Innovation in fashion'],
  'marcus_johnson': ['Urban luxury 🌆', 'Street style vibes', 'City nights', 'Fashion forward'],
  'priya_patel': ['Fusion of cultures ✨', 'Traditional meets modern', 'Luxury in details', 'Art in fashion'],
  'diego_ramirez': ['Classic vibes 🎩', 'Timeless style', 'Vintage inspiration', 'Modern classic'],
  'emma_wilson': ['Sustainable fashion 🌱', 'Eco-conscious style', 'Green fashion', 'Earth-friendly looks'],
  'raj_kumar': ['Future of fashion 🚀', 'Tech-inspired', 'Innovation meets style', 'Modern edge'],
  'yuki_tanaka': ['Breaking boundaries 🎨', 'Art meets fashion', 'Creative expression', 'Avant-garde style'],
  'isabella_martinez': ['Boho dreams 🌸', 'Modern romance', 'Free spirit style', 'Bohemian vibes'],
  'james_anderson': ['Timeless elegance 🎩', 'Classic menswear', 'Sophisticated style', 'Modern gentleman'],
  'zara_williams': ['Bold statement ⚡', 'Contemporary vision', 'Fashion forward', 'Modern edge']
};

function getRandomItems(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateComments(postId, postTimestamp, userId) {
  const numComments = Math.floor(Math.random() * 4) + 2; // 2-5 comments per post
  const commenters = users
    .map(u => u.id)
    .filter(id => id !== userId)
    .sort(() => 0.5 - Math.random())
    .slice(0, numComments);
  
  const postTime = new Date(postTimestamp);
  return commenters.map((commenterId, index) => {
    // Comments appear 5-30 minutes after post or previous comment
    const commentTime = new Date(postTime.getTime() + (5 + Math.random() * 25) * 60000 * (index + 1));
    
    return {
      id: `${postId}_comment_${index + 1}`,
      post_id: postId,
      user_id: commenterId,
      text: comments[commenterId][Math.floor(Math.random() * comments[commenterId].length)],
      timestamp: commentTime.toISOString()
    };
  });
}

function generatePosts(count) {
  const posts = [];
  const allComments = [];
  const baseDate = new Date('2024-01-15T00:00:00Z');
  
  // Track used photos for each user to avoid repeats
  const usedPhotos = {};
  users.forEach(user => {
    usedPhotos[user.id] = new Set();
  });
  
  for (let i = 1; i <= count; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const userId = user.id;
    const randomHours = Math.floor(Math.random() * 72); // Past 3 days
    const postDate = new Date(baseDate - randomHours * 3600000);
    const postId = `post_${i}`;
    
    // Get unused photo for this user
    let availablePhotos = userPhotos[userId].filter(photo => !usedPhotos[userId].has(photo));
    if (availablePhotos.length === 0) {
      // If all photos used, reset the used photos for this user
      usedPhotos[userId].clear();
      availablePhotos = userPhotos[userId];
    }
    const photo = availablePhotos[Math.floor(Math.random() * availablePhotos.length)];
    usedPhotos[userId].add(photo);
    
    // Generate post
    posts.push({
      id: postId,
      user_id: userId,
      image_url: photo,
      caption: captions[userId][Math.floor(Math.random() * captions[userId].length)],
      hashtags: getRandomItems(hashtags[userId], 3),
      likes: getRandomItems(
        users.map(u => u.id).filter(id => id !== userId), 
        Math.floor(Math.random() * 8) + 2 // 2-10 likes per post
      ),
      timestamp: postDate.toISOString()
    });
    
    // Generate comments for this post
    const postComments = generateComments(postId, postDate, userId);
    allComments.push(...postComments);
  }
  
  return {
    posts: posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
    comments: allComments.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  };
}

// Generate 100 posts with comments
const generated = generatePosts(100);
sampleData.posts = generated.posts;
sampleData.comments = generated.comments;

// Write back to file
fs.writeFileSync('src/data/sampleData.json', JSON.stringify(sampleData, null, 2));
console.log('Generated 100 posts with comments!');