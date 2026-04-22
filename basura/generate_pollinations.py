#!/usr/bin/env python3
"""
Pollinations AI - Free Image Generation
"""

import requests
import sys
import time
import json

def generate_image(prompt: str, seed: int = None) -> str:
    """Generate image using Pollinations AI"""
    
    # Add seed for reproducibility
    if seed is None:
        seed = int(time.time()) % 1000000
    
    # Pollinations URL with prompt
    encoded_prompt = prompt.replace(" ", "%20")
    url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1024&height=1024&seed={seed}&nologo=true"
    
    print(f"🎨 Generating: {prompt}")
    print(f"🔗 URL: {url[:80]}...")
    
    try:
        response = requests.get(url, timeout=60, allow_redirects=True)
        
        if response.status_code == 200:
            # Check if we got an image or error page
            content_type = response.headers.get('content-type', '')
            if 'image' in content_type:
                return response.content
            else:
                print(f"❌ Got content-type: {content_type}")
                return None
        else:
            print(f"❌ HTTP {response.status_code}")
            return None
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return None


def save_image(content: bytes, filename: str) -> bool:
    """Save image content to file"""
    try:
        with open(filename, "wb") as f:
            f.write(content)
        print(f"💾 Saved: {filename}")
        return True
    except Exception as e:
        print(f"❌ Save error: {e}")
        return False


def main():
    if len(sys.argv) < 2:
        print("Usage: python generate_pollinations.py \"prompt here\" [seed]")
        sys.exit(1)
    
    prompt = " ".join(sys.argv[1:])
    seed = int(sys.argv[2]) if len(sys.argv) > 2 else None
    
    print("\n" + "="*50)
    print("🖼️  Pollinations AI Generator")
    print("="*50 + "\n")
    
    content = generate_image(prompt, seed)
    
    if content:
        filename = f"generated_{int(time.time())}.png"
        if save_image(content, filename):
            print(f"\n✅ Success! {filename}")
    else:
        print("\n❌ Failed")


if __name__ == "__main__":
    main()