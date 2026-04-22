#!/usr/bin/env python3
"""
AI Horde Image Generator - Simple script
Usage: python generate_image.py "your prompt here"
"""

import requests
import sys
import time
import os

API_KEY = "0000000000"  # Anonymous key (10 zeros)
BASE_URL = "https://aihorde.net/api/v2"

def generate_image(prompt: str, model: str = "stable_diffusion", width: int = 512, height: int = 512) -> str:
    """Generate an image using AI Horde"""
    
    headers = {
        "Content-Type": "application/json",
        "apikey": API_KEY
    }
    
    payload = {
        "prompt": prompt,
        "model": model,
        "width": width,
        "height": height,
        "steps": 25,
        "n": 1,
        "share": True
    }
    
    print(f"🎨 Generating image: '{prompt}'")
    print("⏳ Submitting request...")
    
    # Submit generation request
    response = requests.post(
        f"{BASE_URL}/generate/async",
        headers=headers,
        json=payload,
        timeout=30
    )
    
    if response.status_code != 202:
        print(f"❌ Error submitting: {response.status_code} - {response.text}")
        return None
    
    data = response.json()
    job_id = data.get("id")
    print(f"📋 Job ID: {job_id}")
    
    # Poll for completion
    print("⏳ Waiting for generation...")
    while True:
        status_response = requests.get(
            f"{BASE_URL}/generate/status/{job_id}",
            headers=headers,
            timeout=30
        )
        
        if status_response.status_code != 200:
            print(f"❌ Error checking status: {status_response.status_code}")
            return None
        
        status_data = status_response.json()
        status = status_data.get("status")
        
        if status == "completed":
            print("✅ Generation complete!")
            # Get the generated image URL
            generations = status_data.get("generations", [])
            if generations:
                img_url = generations[0].get("img") or generations[0].get("base64")
                return img_url
            return None
        elif status in ["failed", "cancelled"]:
            print(f"❌ Generation {status}")
            return None
        else:
            done = status_data.get("done", 0)
            total = status_data.get("total", 1)
            print(f"⏳ Progress: {done}/{total}")
            time.sleep(3)


def download_and_save(url: str, filename: str = "output.png") -> bool:
    """Download and save the generated image"""
    try:
        # Check if it's a base64 string
        if "," in url:
            # It's a data URL
            import base64
            header, b64data = url.split(",", 1)
            img_data = base64.b64decode(b64data)
        else:
            # It's a URL
            response = requests.get(url, timeout=60)
            if response.status_code != 200:
                print(f"❌ Failed to download: {response.status_code}")
                return False
            img_data = response.content
        
        with open(filename, "wb") as f:
            f.write(img_data)
        
        print(f"💾 Saved to: {filename}")
        return True
    except Exception as e:
        print(f"❌ Error saving: {e}")
        return False


def main():
    if len(sys.argv) < 2:
        print("Usage: python generate_image.py \"your prompt here\"")
        print("Example: python generate_image.py \"a cute cat sitting on a chair\"")
        sys.exit(1)
    
    prompt = " ".join(sys.argv[1:])
    
    print("\n" + "="*50)
    print("🖼️  AI Horde Image Generator")
    print("="*50 + "\n")
    
    img_url = generate_image(prompt)
    
    if img_url:
        filename = f"generated_{int(time.time())}.png"
        if download_and_save(img_url, filename):
            print(f"\n🎉 Success! Image saved as: {filename}")
    else:
        print("\n❌ Failed to generate image")


if __name__ == "__main__":
    main()
