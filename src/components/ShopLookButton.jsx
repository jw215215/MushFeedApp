import React, { useState } from 'react';
import './ShopLookButton.css';

function ShopLookButton({ imagePath }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleShopLook = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('http://localhost:3000/api/shop-look', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_path: imagePath }),
      });

      if (!response.ok) {
        throw new Error('Failed to process image');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to process image');
      }
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
      onClick={handleShopLook}
      disabled={isLoading}
    >
      {isLoading ? 'Processing...' : 'Shop this look'}
    </button>
  );
}

export default ShopLookButton; 