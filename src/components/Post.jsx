import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import sampleData from '../data/sampleData.json';
import ShopLookButton from './ShopLookButton';
import './Post.css';
import axios from 'axios';

function Post({ post }) {
  const [isLiked, setIsLiked] = useState(post.likes?.includes('tim_01') || false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [newComment, setNewComment] = useState('');

  const comments = sampleData.comments.filter(comment => comment.post_id === post.id) || [];

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setNewComment('');
  };

  const handleShopLook = async () => {
    try {
      const fullImageUrl = post.image_url.startsWith('http') 
        ? post.image_url 
        : `https://mush-feed-app.vercel.app${post.image_url}`;
      
      console.log('Sending image URL:', fullImageUrl);
      
      const apiUrl = 'https://mush-feed-app.vercel.app/api/shop-look';
      console.log('Using API URL:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image_path: fullImageUrl
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`Failed to analyze outfit: ${errorText}`);
      }

      const data = await response.json();
      console.log('Server response data:', data);
      if (data.success) {
        console.log('Successfully sent image to Mush.style');
      } else {
        throw new Error(data.error || 'Failed to analyze outfit');
      }
    } catch (error) {
      console.error('Error analyzing outfit:', error);
      alert('Failed to analyze outfit. Please try again.');
    }
  };

  const renderCommentText = (text, links) => {
    if (!links?.length) return text;
    
    return (
      <span>
        {text}{' '}
        {links.map((link, i) => (
          <a 
            key={i}
            href={link.url}
            className="shopping-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.text}
          </a>
        ))}
      </span>
    );
  };

  if (!post || !post.creator) {
    return null;
  }

  return (
    <div className="post">
      <div className="post-header">
        <Link to={`/profile/${post.creator.id}`} className="post-user">
          <img src={post.creator.profile_pic} alt={post.creator.name} className="avatar" />
          <span>{post.creator.name}</span>
        </Link>
      </div>
      
      <div className="post-image" style={{ position: 'relative' }} onDoubleClick={handleLike}>
        <img src={post.image_url} alt="" />
        <ShopLookButton imagePath={post.image_url} onClick={handleShopLook} />
      </div>
      
      <div className="post-actions">
        <button 
          onClick={handleLike} 
          className={`like-button ${isLiked ? 'liked' : ''}`}
        >
          {isLiked ? '❤️' : '🤍'}
        </button>
        <span>💬 {comments.length}</span>
      </div>
      
      <div className="post-info">
        <div className="likes-count">{likesCount} likes</div>
        <div className="caption">
          <Link to={`/profile/${post.creator.id}`} className="username">
            {post.creator.name}
          </Link>{' '}
          {post.ai_generated_content?.caption || post.caption}
        </div>
        
        <div className="comments-section">
          {comments.map(comment => (
            <div key={comment.id} className="comment">
              <img 
                src={sampleData.users.find(u => u.id === comment.user_id)?.profile_pic} 
                alt="" 
                className="comment-avatar" 
              />
              <div className="comment-content">
                <Link to={`/profile/${comment.user_id}`}>
                  {sampleData.users.find(u => u.id === comment.user_id)?.name || 'Unknown User'}
                </Link>{' '}
                {renderCommentText(comment.text, comment.shopping_links)}
              </div>
            </div>
          ))}
          
          <form onSubmit={handleAddComment} className="add-comment">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit">Post</button>
          </form>
        </div>
        <div className="hashtags">
          {(post.ai_generated_content?.hashtags || post.hashtags || []).map(tag => (
            <Link 
              key={tag} 
              to={`/explore?tag=${tag.slice(1)}`} 
              className="hashtag"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Post; 