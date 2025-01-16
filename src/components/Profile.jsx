import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import sampleData from '../data/sampleData.json';
import generatedContent from '../data/generatedContent.json';
import Post from './Post';
import './Profile.css';

function Profile() {
  const { id } = useParams();
  const user = sampleData.users.find(u => u.id === id);
  
  // Get user's posts with creator info and sort by timestamp
  const userPosts = sampleData.posts
    .filter(post => post.user_id === id)
    .map(post => ({
      ...post,
      creator: user,
      ai_generated_content: generatedContent[post.image_url.split('/').pop()] || {
        caption: '',
        hashtags: []
      }
    }))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  if (!user) return <div>User not found</div>;

  return (
    <div className="feed">
      {userPosts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}

export default Profile; 