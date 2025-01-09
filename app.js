const webhookURL = "https://script.google.com/macros/s/AKfycbye-4Y-BORY6QUEV4AnX4-vYHm0rGluuZfHITFH-CXPX4GY7jN1apbieTFTu57fIG9D/exec";
const statusElement = document.getElementById("status");

// Function to send location to webhook
async function sendLocationToWebhook(latitude, longitude) {
  const timestamp = new Date().toISOString();

  try {
    const response = await fetch(webhookURL, {
      redirect: "follow",
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        latitude,
        longitude,
        timestamp
      })
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    statusElement.textContent = `Location sent: (${latitude}, ${longitude}) at ${timestamp}`;
    console.log("Location sent successfully.");
  } catch (error) {
    statusElement.textContent = `Failed to send location: ${error.message}`;
    console.error("Error sending location:", error);
  }
}

// Function to track location
function trackLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        sendLocationToWebhook(latitude, longitude);
      },
      (error) => {
        console.error("Geolocation error:", error.message);
        statusElement.textContent = `Geolocation error: ${error.message}`;
      }
    );
  } else {
    statusElement.textContent = "Geolocation is not supported by this browser.";
    console.error("Geolocation not supported.");
  }
}

// Track location every 30 seconds
setInterval(trackLocation, 15000);
trackLocation(); // Run immediately on load
