// src/components/EmergencyMap.jsx
import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, HeatmapLayer } from "@react-google-maps/api";
import { getReport } from "../services/apiCalls";

const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};

const center = {
  lat: 20.5937, // Default center (India)
  lng: 78.9629,
};

const GOOGLE_MAPS_API_KEY = process.env.MapApi; // Replace with your Google Maps API key

const EmergencyMap = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [heatmapData, setHeatmapData] = useState([]);

  // Fetch emergencies from the backend
  useEffect(() => {
    const fetchEmergencies = async () => {
      try {
        const response = await getReport();
        console.log("Fetched Emergencies:", response);

        const emergencyData = response.data || response;
        if (!Array.isArray(emergencyData)) {
          throw new Error("Expected an array of emergencies");
        }

        setEmergencies(emergencyData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching emergencies:", error);
        setError("Failed to load emergency data");
        setLoading(false);
      }
    };
    fetchEmergencies();
  }, []);

  // Geocode location strings to coordinates
  const geocodeLocation = async (location) => {
    if (!location || typeof location !== "string") {
      console.warn("Invalid location:", location);
      return null; // Return null for invalid locations
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          location
        )}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        return { lat, lng };
      } else {
        console.warn(`Geocoding failed for ${location}: ${data.status}`);
        return null;
      }
    } catch (error) {
      console.error(`Error geocoding ${location}:`, error);
      return null;
    }
  };

  // Prepare heatmap data after emergencies and map are loaded
  useEffect(() => {
    if (!mapLoaded || emergencies.length === 0) return;

    const prepareHeatmapData = async () => {
      const geocodedData = await Promise.all(
        emergencies.map(async (emergency) => {
          const coords = await geocodeLocation(emergency.location);
          if (!coords) {
            return null; // Skip if geocoding fails
          }
          return {
            location: new window.google.maps.LatLng(coords.lat, coords.lng),
            weight:
              emergency.severity === "Critical"
                ? 5
                : emergency.severity === "High"
                ? 3
                : emergency.severity === "Medium"
                ? 2
                : 1,
          };
        })
      );

      // Filter out null entries (failed geocoding)
      const validHeatmapData = geocodedData.filter((data) => data !== null);
      console.log("Heatmap Data:", validHeatmapData);
      setHeatmapData(validHeatmapData);
    };

    prepareHeatmapData();
  }, [mapLoaded, emergencies]);

  return (
    <LoadScript
      googleMapsApiKey={GOOGLE_MAPS_API_KEY} // Use your API key here
      libraries={["visualization"]}
      onLoad={() => {
        console.log("Google Maps API Loaded");
        setMapLoaded(true);
      }}
      onError={(e) => {
        console.error("Google Maps API Load Error:", e);
        setError("Failed to load Google Maps API");
      }}
    >
      <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={5}>
        {loading ? (
          <div>Loading emergencies...</div>
        ) : error ? (
          <div>{error}</div>
        ) : mapLoaded && heatmapData.length > 0 ? (
          <HeatmapLayer
            data={heatmapData}
            options={{
              radius: 30,
              opacity: 0.8,
            }}
          />
        ) : (
          <div>No emergencies to display</div>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default EmergencyMap;