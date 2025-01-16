import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import sampleData from '../data/sampleData.json';
import ShopLookButton from './ShopLookButton';
import './Post.css';

function Post({ post }) {
  const [isLiked, setIsLiked] = useState(post.likes?.includes('tim_01') || false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
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
        <ShopLookButton imagePath={post.image_url} />
      </div>
      
      <div className="post-actions">
        <button 
          onClick={handleLike} 
          className={`like-button ${isLiked ? 'liked' : ''}`}
        >
          {isLiked ? '❤️' : '🤍'}
        </button>
        <button onClick={() => setShowComments(!showComments)}>💬</button>
      </div>
      
      <div className="post-info">
        <div className="likes-count">{likesCount} likes</div>
        <div className="caption">
          <Link to={`/profile/${post.creator.id}`} className="username">
            {post.creator.name}
          </Link>{' '}
          {post.ai_generated_content?.caption || post.caption}
        </div>
        
        {showComments && (
          <div className="comments-section">
            {comments.map(comment => (
              <div key={comment.id} className="comment">
                <Link to={`/profile/${comment.user_id}`}>
                  {sampleData.users.find(u => u.id === comment.user_id)?.name || 'Unknown User'}
                </Link>
                {renderCommentText(comment.text, comment.shopping_links)}
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
        )}
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