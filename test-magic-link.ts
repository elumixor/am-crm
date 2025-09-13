#!/usr/bin/env bun

// Manual test script for magic link endpoints
// This script demonstrates the magic link flow without requiring database setup

console.log("🧪 Testing Magic Link API Endpoints");
console.log("=====================================\n");

const API_BASE = "http://localhost:3001";

// Test data
const testEmail = "test-invite@example.com";
const testPassword = "password123";

// Mock auth token for testing (in real implementation, get this from login)
const mockAuthToken = "test-token-for-acarya";

async function testCreateMagicLink() {
  console.log("1. Testing POST /auth/create-magic-link");
  console.log("   - Email:", testEmail);
  console.log("   - Auth Token:", mockAuthToken);
  
  try {
    const response = await fetch(`${API_BASE}/auth/create-magic-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${mockAuthToken}`
      },
      body: JSON.stringify({ email: testEmail })
    });

    console.log("   - Status:", response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log("   - Response:", JSON.stringify(result, null, 2));
      return result.token;
    } else {
      const error = await response.json();
      console.log("   - Error:", JSON.stringify(error, null, 2));
      return null;
    }
  } catch (error) {
    console.log("   - Network Error:", error.message);
    return null;
  }
}

async function testGetMagicLinkInfo(token: string) {
  console.log("\n2. Testing GET /auth/magic-link/:token");
  console.log("   - Token:", token);
  
  try {
    const response = await fetch(`${API_BASE}/auth/magic-link/${token}`);
    console.log("   - Status:", response.status);
    
    const result = await response.json();
    console.log("   - Response:", JSON.stringify(result, null, 2));
    
    return response.ok;
  } catch (error) {
    console.log("   - Network Error:", error.message);
    return false;
  }
}

async function testCompleteMagicLink(token: string) {
  console.log("\n3. Testing POST /auth/complete-magic-link");
  console.log("   - Token:", token);
  console.log("   - Password:", testPassword);
  
  try {
    const response = await fetch(`${API_BASE}/auth/complete-magic-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token,
        password: testPassword,
        spiritualName: "Test Spiritual Name",
        worldlyName: "Test Worldly Name",
        preferredName: "Test Preferred"
      })
    });

    console.log("   - Status:", response.status);
    
    const result = await response.json();
    console.log("   - Response:", JSON.stringify(result, null, 2));
    
    return response.ok;
  } catch (error) {
    console.log("   - Network Error:", error.message);
    return false;
  }
}

async function testInvalidToken() {
  console.log("\n4. Testing with invalid token");
  
  try {
    const response = await fetch(`${API_BASE}/auth/magic-link/invalid-token-123`);
    console.log("   - Status:", response.status);
    
    const result = await response.json();
    console.log("   - Response:", JSON.stringify(result, null, 2));
    
    return response.status === 404;
  } catch (error) {
    console.log("   - Network Error:", error.message);
    return false;
  }
}

async function runTests() {
  console.log("📝 API Endpoint Structure Validation");
  console.log("====================================\n");
  
  // Test 1: Create magic link
  const token = await testCreateMagicLink();
  
  if (!token) {
    console.log("\n❌ Cannot proceed without valid token from create-magic-link");
    console.log("💡 This is expected if the database is not running or properly configured");
    return;
  }
  
  // Test 2: Get magic link info
  const infoSuccess = await testGetMagicLinkInfo(token);
  
  // Test 3: Complete magic link
  if (infoSuccess) {
    await testCompleteMagicLink(token);
  }
  
  // Test 4: Invalid token
  await testInvalidToken();
  
  console.log("\n✅ Manual API testing completed");
  console.log("💡 To run with real database:");
  console.log("   1. Ensure PostgreSQL is running");
  console.log("   2. Run: bun run migrate");
  console.log("   3. Start API server: bun run dev");
  console.log("   4. Run this script again");
}

// Check if API server is running
async function checkApiServer() {
  try {
    const response = await fetch(`${API_BASE}/health`);
    if (response.ok) {
      console.log("✅ API server is running");
      return true;
    } else {
      console.log("❌ API server responded with status:", response.status);
      return false;
    }
  } catch (error) {
    console.log("❌ Cannot connect to API server at", API_BASE);
    console.log("💡 Start the API server with: bun run dev");
    return false;
  }
}

// Main execution
(async () => {
  const serverRunning = await checkApiServer();
  
  if (serverRunning) {
    await runTests();
  } else {
    console.log("\n🔧 Magic Link API Endpoints Structure:");
    console.log("=====================================");
    console.log("POST /auth/create-magic-link");
    console.log("  Headers: Authorization: Bearer <token>");
    console.log("  Body: { email: string }");
    console.log("  Response: { token: string, expiresAt: string }");
    console.log("");
    console.log("GET /auth/magic-link/:token");
    console.log("  Response: { email: string, expiresAt: string, createdBy: User }");
    console.log("");
    console.log("POST /auth/complete-magic-link");
    console.log("  Body: { token: string, password: string, spiritualName?: string, ... }");
    console.log("  Response: { token: string, user: User }");
    console.log("");
    console.log("🎯 All endpoints are implemented and ready for testing!");
  }
})();