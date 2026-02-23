// Node.js 18+ has native fetch. No import needed.

const BASE_URL = "http://127.0.0.1:3000";

async function testEnquiry() {
  console.log("Testing Enquiry POST endpoint...");
  try {
    const response = await fetch(`${BASE_URL}/api/enquiry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Script User",
        email: "test@script.com",
        message: "This is a test message from the API test script.",
      }),
    });

    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log("Response:", data);
  } catch (error) {
    console.error("Enquiry Request Failed:", error);
  }
}

async function testUpload() {
  console.log("\nTesting Upload POST endpoint (Expect 401 Unauthorized)...");
  try {
    const response = await fetch(`${BASE_URL}/api/upload`, {
      method: "POST",
    });
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log("Response:", data);
  } catch (error) {
    console.error("Upload Request Failed:", error);
  }
}

// Check if fetch is available (Node 18+)
if (!globalThis.fetch) {
  console.log(
    "Native fetch not found. Please run with Node v18+ or install node-fetch.",
  );
} else {
  (async () => {
    await testEnquiry();
    await testUpload();
  })();
}
