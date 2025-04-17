//Weather.js

import React, { useEffect, useState } from 'react';

// Custom safety suggestions
const suggestions = {
  thunderstorm: [
    "Stay indoors and avoid windows.",
    "Unplug electrical appliances.",
    "Avoid taking shelter under trees.",
    "Keep emergency lights handy."
  ],
  rain: [
    "Avoid driving through waterlogged areas.",
    "Keep umbrellas and raincoats ready.",
    "Watch for slippery roads.",
    "Check for flood alerts in your region."
  ],
  clear: [
    "Perfect time to review your emergency kit.",
    "Stay hydrated and use sunscreen if sunny.",
    "Consider volunteering for relief efforts.",
    "Check your area's emergency contact numbers."
  ],
  clouds: [
    "Weather is stable, but stay updated.",
    "Carry light jackets if it’s chilly.",
    "Prepare for potential rain if clouds look heavy."
  ],
  haze: [
    "Wear a mask if sensitive to air quality.",
    "Avoid outdoor exercise.",
    "Close windows to prevent indoor pollution."
  ]
};

function Weather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tips, setTips] = useState([]);

  const API_KEY = "3a657775ef99761ce04887736d402432";

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
          );
          const data = await res.json();

          if (data.cod === 200) {
            setWeather(data);

            const condition = data.weather?.[0]?.main.toLowerCase();
            const safeTips =
              suggestions[condition] || ["No specific tips available. Stay safe!"];
            setTips(safeTips);
          } else {
            setError("Could not fetch weather.");
          }

          setLoading(false);
        } catch (err) {
          console.error("Fetch error:", err);
          setError("Error getting weather.");
          setLoading(false);
        }
      }, (err) => {
        console.error("Geolocation error:", err);
        setError("Location access denied.");
        setLoading(false);
      });
    } else {
      setError("Geolocation not supported.");
      setLoading(false);
    }
  }, []);

  if (loading) return <p>Loading weather...</p>;
  if (error) return <p>{error}</p>;
  if (!weather) return <p>No weather data.</p>;

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.9)',
      padding: '1.5rem',
      borderRadius: '12px',
      marginTop: '1rem',
      maxWidth: '500px',
      marginLeft: 'auto',
      marginRight: 'auto',
      textAlign: 'center',
      boxShadow: '0 0 12px rgba(0,0,0,0.15)'
    }}>
      <h3>🌦️ Current Weather</h3>
      <p><strong>📍 Location:</strong> {weather.name}</p>
      <p><strong>🌡️ Temperature:</strong> {weather.main?.temp}°C</p>
      <p><strong>🌥️ Condition:</strong> {weather.weather?.[0]?.description}</p>

      <div style={{
        marginTop: '1rem',
        background: '#f4f8f9',
        borderLeft: '5px solid #007bff',
        borderRadius: '8px',
        padding: '1rem',
        textAlign: 'left'
      }}>
        <h4>🛡️ Safety Tips</h4>
        <ul>
          {tips.map((tip, idx) => (
            <li key={idx}>✅ {tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Weather;
