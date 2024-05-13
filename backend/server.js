const express = require("express");
const cors = require("cors");
const app = express();
const Users = require("./Center");
const axios = require("axios");

// Configure CORS
const corsOptions = {
  origin: "http://localhost:3000", // Allow requests from this origin
  methods: "POST", // Allow only POST requests
};

app.use(cors(corsOptions));

// Parse JSON bodies
app.use(express.json());

// Database connection
require("./connection");

// Geocode address function (using OpenStreetMap Nominatim API)
async function geocodeAddress(address) {
  const response = await axios.get(
    `https://nominatim.openstreetmap.org/search?format=json&q=${address}`
  );
  const data = response.data;
  if (data && data.length > 0) {
    return [parseFloat(data[0].lon), parseFloat(data[0].lat)];
  } else {
    throw new Error("Address not found");
  }
}

// Calculate distance function (Haversine formula)
function calculateDistance(coord1, coord2) {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

// POST endpoint for registration
app.post("/center", async (req, res) => {
  console.log("Received request body:", req.body);
  try {
    const { name, email, address, phonenumber, password } = req.body;
    const user = new Users({ name, email, address, phonenumber, password });
    const result = await user.save();
    res.status(201).json(result);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Error registering user" });
  }
});

// POST endpoint for finding nearest centers
// POST endpoint for finding nearest centers
app.post("/find-nearest-center", async (req, res) => {
  const { userAddress } = req.body;
  console.log("User address:", userAddress);
  try {
    // Geocode user's address
    const userCoordinates = await geocodeAddress(userAddress);
    console.log("User coordinates:", userCoordinates);

    // Find all donation centers from the database
    const allCenters = await Users.find({}, "name address");

    // Create an array to store promises for geocoding each center's address
    const geocodePromises = allCenters.map(async (center) => {
      const centerAddress = center.address;
      try {
        // Geocode center's address
        const centerCoordinates = await geocodeAddress(centerAddress);
        // Log center's coordinates
        console.log(
          `Center coordinates for ${centerAddress}:`,
          centerCoordinates
        );
        // Calculate distance from user to center
        const distance = calculateDistance(userCoordinates, centerCoordinates);
        // Return an object with center's name, address, coordinates, and distance
        return { name: center.name, address: centerAddress, distance: distance };
      } catch (error) {
        // If geocoding fails for a center, log the error and return null
        console.error("Error geocoding center address:", error);
        return null;
      }
    });

    // Wait for all geocoding promises to resolve
    const centersWithDistance = await Promise.all(geocodePromises);

    // Filter out any centers with null coordinates (due to geocoding errors)
    const validCentersWithDistance = centersWithDistance.filter(
      (center) => center !== null
    );

    // Find the center with the minimum distance
    const minDistanceCenter = validCentersWithDistance.reduce(
      (min, center) => (center.distance < min.distance ? center : min),
      validCentersWithDistance[0]
    );

    // Send the min distance center data to the client
    res.status(200).json(minDistanceCenter);
  } catch (error) {
    console.error("Error finding nearest center:", error);
    res.status(500).json({ error: "Error finding nearest center" });
  }
});
// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
