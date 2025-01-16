import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import sampleData from '../data/sampleData.json';
import generatedContent from '../data/generatedContent.json';

function Explore() {
  const [searchParams] = useSearchParams();
  const [activeTag, setActiveTag] = useState(null);
  const hashtags = Object.entries(sampleData.hashtags);

  // Set active tag from URL parameter on mount and when URL changes
  useEffect(() => {
    const tagFromUrl = searchParams.get('tag');
    if (tagFromUrl) {
      setActiveTag(tagFromUrl);
    }
  }, [searchParams]);

  const getPostsByTag = (tag) => {
    // Ensure tag has # prefix for comparison
    const searchTag = tag.startsWith('#') ? tag : `#${tag}`;
    
    return sampleData.posts.filter(post => {
      // Check original hashtags
      if (post.hashtags.includes(searchTag)) {
        return true;
      }
      
      // Check AI-generated hashtags from generatedContent
      const filename = post.image_url.split('/').pop();
      const generatedTags = generatedContent[filename]?.hashtags || [];
      return generatedTags.includes(searchTag);
    });
  };

  return (
    <div className="explore">
      <div className="hashtag-list">
        {hashtags.map(([tag, data]) => (
          <button
            key={tag}
            className={`hashtag-button ${activeTag === tag ? 'active' : ''}`}
            onClick={() => setActiveTag(tag)}
          >
            #{tag}
            <span className="post-count">{data.post_count}</span>
          </button>
        ))}
      </div>

      <div className="explore-grid">
        {activeTag ? (
          getPostsByTag(activeTag).map(post => (
            <div key={post.id} className="grid-item">
              <img src={post.image_url} alt="" />
              <div className="grid-item-overlay">
                <span>❤️ {post.likes?.length || 0}</span>
                <span>💬 {sampleData.comments.filter(c => c.post_id === post.id).length}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="explore-prompt">
            Select a hashtag to explore related posts
          </div>
        )}
      </div>
    </div>
  );
}

export default Explore; 