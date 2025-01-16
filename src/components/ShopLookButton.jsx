import React, { useState } from 'react';
import './ShopLookButton.css';

function ShopLookButton({ imagePath, onClick }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      await onClick();
    } catch (error) {
      console.error('Error shopping look:', error);
      alert('Sorry, there was an error processing your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      className={`shop-look-button ${isLoading ? 'loading' : ''}`} 
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? 'Processing...' : 'Shop this look'}
    </button>
  );
}

export default ShopLookButton; 