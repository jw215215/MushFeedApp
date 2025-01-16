// Content script for mush.style image uploader
if (window.location.hostname === 'www.mush.style') {
  // Wait for the upload button to be available
  const checkForUploadButton = setInterval(() => {
    const uploadButton = document.querySelector('button:has-text("Upload your style inspiration")');
    if (uploadButton) {
      clearInterval(checkForUploadButton);
      
      // Get the image URL from localStorage
      const imageUrl = localStorage.getItem('mushImageUrl');
      if (imageUrl) {
        // Create a file input element
        const input = document.createElement('input');
        input.type = 'file';
        input.style.display = 'none';
        document.body.appendChild(input);
        
        // Fetch the image and create a File object
        fetch(imageUrl)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            input.files = dataTransfer.files;
            
            // Trigger the file upload
            const changeEvent = new Event('change', { bubbles: true });
            input.dispatchEvent(changeEvent);
          })
          .catch(console.error);
      }
    }
  }, 1000);
} 