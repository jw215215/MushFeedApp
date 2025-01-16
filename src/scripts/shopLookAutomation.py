from browser_use import Browser
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import base64
from typing import Optional

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/shop-look")
async def shop_look(image_path: str):
    try:
        # Initialize browser
        browser = Browser()
        
        # Create a natural language task
        task = f"""
        1. Go to https://www.mush.style/en/ai
        2. Click on "Upload your style inspiration" button
        3. Click on "upload file" button
        4. Upload the image from {image_path}
        5. Wait for processing to complete
        6. Return the results
        """
        
        # Execute the task
        result = await browser.run(task)
        
        # Close the browser
        await browser.close()
        
        return {"success": True, "result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 