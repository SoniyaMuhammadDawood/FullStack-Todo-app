import asyncio
import httpx
import json

async def test_signup():
    """
    Test the signup endpoint to verify it works with the database fixes
    """
    async with httpx.AsyncClient(base_url="http://127.0.0.1:8000") as client:
        # Test signup
        signup_data = {
            "email": "testuser@example.com",
            "username": "testuser",
            "password": "SecurePassword123!"
        }
        
        try:
            response = await client.post("/auth/signup", json=signup_data)
            print(f"Signup Response Status: {response.status_code}")
            
            if response.status_code == 201:
                print("✓ Signup successful!")
                print(f"Response: {response.json()}")
            elif response.status_code == 400:
                print(f"⚠ Signup failed with validation error: {response.json()}")
            elif response.status_code == 500:
                print(f"✗ Signup failed with server error: {response.json()}")
            else:
                print(f"⚠ Unexpected response: {response.json()}")
                
        except httpx.ConnectError:
            print("✗ Cannot connect to the server. Make sure the backend is running on port 8000.")
        except Exception as e:
            print(f"✗ Error during signup test: {e}")

if __name__ == "__main__":
    print("Testing signup endpoint...")
    asyncio.run(test_signup())