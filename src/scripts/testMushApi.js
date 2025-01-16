import fetch from 'node-fetch';

async function testMushApi() {
  try {
    // Use the provided S3 image URL
    const imageUrl = 'https://prod-mush-frontend-authstack-profilebucket8bf528d8-pbjhhwzuhlna.s3.eu-central-1.amazonaws.com/246451a415010614b3b4d225a93b6570e34afd644f1c24111a228a8038fa056b.png';
    
    console.log('Sending request to mush.style API...');
    const response = await fetch('https://backend.mush.style/api/v1/ai/outfits/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://www.mush.style',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      body: JSON.stringify({
        url: imageUrl,
        source: 'external'
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API returned ${response.status}: ${response.statusText}\n${errorText}`);
    }
    
    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testMushApi(); 