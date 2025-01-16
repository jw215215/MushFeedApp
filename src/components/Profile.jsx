import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import sampleData from '../data/sampleData.json';
import generatedContent from '../data/generatedContent.json';
import AuthContext from '../contexts/AuthContext';

function Profile() {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [following, setFollowing] = useState(
    currentUser.id !== id && 
    sampleData.users.find(u => u.id === currentUser.id)?.following.includes(id)
  );

  const user = sampleData.users.find(u => u.id === id);
  const userPosts = sampleData.posts
    .filter(post => post.user_id === id)
    .map(post => {
      const filename = post.image_url.split('/').pop();
      const aiContent = generatedContent[filename] || {
        caption: '',
        hashtags: []
      };
      return { ...post, ai_generated_content: aiContent };
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const handleFollow = () => {
    setFollowing(!following);
  };

  if (!user) return <div>User not found</div>;

  return (
    <div className="profile">
      <div className="profile-header">
        <img 
          src={user.profile_pic} 
          alt={user.name} 
          className="profile-pic"
        />
        
        <div className="profile-info">
          <div className="profile-actions">
            <h1>{user.name}</h1>
            {currentUser.id !== id && (
              <button 
                onClick={handleFollow}
                className={`follow-button ${following ? 'following' : ''}`}
              >
                {following ? 'Following' : 'Follow'}
              </button>
            )}
          </div>

          <div className="profile-stats">
            <span><b>{userPosts.length}</b> posts</span>
            <span><b>{user.followers.length}</b> followers</span>
            <span><b>{user.following.length}</b> following</span>
          </div>

          <div className="profile-bio">
            {user.bio}
          </div>
        </div>
      </div>

      <div className="profile-grid">
        {userPosts.map(post => (
          <div key={post.id} className="grid-item">
            <img src={post.image_url} alt="" />
            <div className="grid-item-overlay">
              <span>❤️ {post.likes.length}</span>
              <span>💬 {sampleData.comments.filter(c => c.post_id === post.id).length}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile; 