#!/usr/bin/env python3
"""
FluxImageGen API - Simple image generator
Usage: python generate_flux.py "your prompt here"
"""

import requests
import sys
import time
import os

BASE_URL = "https://fluximagegen.com/api"

def generate_image(prompt: str, style: str = "standard") -> str:
    """Generate an image using FluxImageGen API"""
    
    headers = {
        "Content-Type": "application/json"
    }
    
    payload = {
        "prompt": prompt,
        "style": style
    }
    
    print(f"🎨 Generating: {prompt}")
    print("⏳ Submitting request...")
    
    response = requests.post(
        f"{BASE_URL}/generate",
        headers=headers,
        json=payload,
        timeout=60
    )
    
    if response.status_code == 429:
        print("❌ Rate limit exceeded - try again tomorrow")
        return None
    
    if response.status_code != 200:
        print(f"❌ Error: {response.status_code} - {response.text}")
        return None
    
    data = response.json()
    
    if "imageUrl" in data:
        print(f"✅ Done! URL: {data['imageUrl']}")
        return data["imageUrl"]
    elif "remainingGenerations" in data:
        print(f"❌ No image - remaining: {data['remainingGenerations']}")
        return None
    
    return None


def download_and_save(url: str, filename: str = "output.png") -> bool:
    """Download and save the generated image"""
    try:
        response = requests.get(url, timeout=120)
        if response.status_code != 200:
            print(f"❌ Failed to download: {response.status_code}")
            return False
        
        with open(filename, "wb") as f:
            f.write(response.content)
        
        print(f"💾 Saved to: {filename}")
        return True
    except Exception as e:
        print(f"❌ Error saving: {e}")
        return False


def main():
    if len(sys.argv) < 2:
        print("Usage: python generate_flux.py \"your prompt here\"")
        print("Example: python generate_flux.py \"a cute cat\"")
        sys.exit(1)
    
    prompt = " ".join(sys.argv[1:])
    
    print("\n" + "="*50)
    print("🖼️  FluxImageGen Generator")
    print("="*50 + "\n")
    
    img_url = generate_image(prompt)
    
    if img_url:
        filename = f"generated_{int(time.time())}.png"
        if download_and_save(img_url, filename):
            print(f"\n🎉 Success! Image saved as: {filename}")
    else:
        print("\n❌ Failed")


if __name__ == "__main__":
    main()