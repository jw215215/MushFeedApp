const generateHashtags = (caption) => {
  // Simple hashtag extraction from caption
  const explicitTags = caption.match(/#[\w]+/g) || [];
  
  // Auto-generate additional hashtags based on content
  const keywords = caption.toLowerCase().split(' ');
  const autoTags = [];
  
  const fashionKeywords = {
    style: ['fashion', 'outfit', 'look'],
    color: ['black', 'white', 'blue', 'red'],
    occasion: ['casual', 'formal', 'party'],
    season: ['summer', 'winter', 'spring', 'fall']
  };

  keywords.forEach(word => {
    Object.entries(fashionKeywords).forEach(([category, words]) => {
      if (words.includes(word)) {
        autoTags.push(`#${category}${word.charAt(0).toUpperCase()}${word.slice(1)}`);
      }
    });
  });

  return [...new Set([...explicitTags, ...autoTags])];
};

export default generateHashtags; 