import React, { useState, useEffect, useCallback } from 'react';
import Post from './Post';
import sampleData from '../data/sampleData.json';
import generatedContent from '../data/generatedContent.json';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);

  const loadPosts = useCallback(() => {
    setLoading(true);
    // Add creator data and AI-generated content to each post
    const postsWithContent = sampleData.posts.map(post => {
      const creator = sampleData.users.find(user => user.id === post.user_id) || {
        id: post.user_id,
        name: 'Unknown User',
        profile_pic: 'https://picsum.photos/32/32'
      };

      // Get the filename from the image_url
      const filename = post.image_url.split('/').pop();
      const aiContent = generatedContent[filename] || {
        caption: '',
        hashtags: []
      };

      return {
        ...post,
        creator,
        ai_generated_content: aiContent
      };
    });

    // Sort posts by timestamp (newest first)
    const sortedPosts = postsWithContent.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );

    setPosts(sortedPosts);
    setLoading(false);
  }, []);

  const handleTouchStart = (e) => {
    setStartY(e.touches[0].pageY);
  };

  const handleTouchMove = (e) => {
    const currentY = e.touches[0].pageY;
    const diff = currentY - startY;
    
    if (diff > 50 && window.scrollY === 0 && !refreshing) {
      setRefreshing(true);
      loadPosts().then(() => {
        setRefreshing(false);
      });
    }
  };

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  if (loading) {
    return <div className="loading-skeleton">Loading...</div>;
  }

  return (
    <div 
      className="feed"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {refreshing && (
        <div className="refresh-indicator">
          <div className="refresh-spinner"></div>
        </div>
      )}
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}

export default Feed; 