import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

// Helper component to auto-fit map to bounds
const FitMapToBounds = ({ locations }) => {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = locations.map(loc => [loc.lat, loc.lng]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [locations, map]);

  return null;
};

function CrisisMap() {
  const [approvedCrises, setApprovedCrises] = useState([]);

  useEffect(() => {
    const fetchCrises = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/crises/approved');
        const data = await res.json();

        // Geocode locations if lat/lng not provided
        const crisesWithCoords = await Promise.all(
          data.map(async (crisis) => {
            if (crisis.lat && crisis.lng) return crisis;

            try {
              const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(crisis.location)}`);
              const geoData = await response.json();

              if (geoData.length > 0) {
                crisis.lat = parseFloat(geoData[0].lat);
                crisis.lng = parseFloat(geoData[0].lon);
              }
            } catch (geoErr) {
              console.error('Geocoding error:', crisis.location, geoErr);
            }

            return crisis;
          })
        );

        setApprovedCrises(crisesWithCoords.filter(c => c.lat && c.lng));
      } catch (err) {
        console.error('Error fetching approved crises:', err);
      }
    };

    fetchCrises();
  }, []);

  return (
    <div>
      <Header />
      <main className="p-4">
        <h2>Crisis Map</h2>
        <div style={{ height: '500px', width: '100%' }}>
          <MapContainer center={[22.5937, 78.9629]} zoom={5} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Auto zoom to show all */}
            <FitMapToBounds locations={approvedCrises} />

            {/* Show big circles */}
            {approvedCrises.map((crisis, idx) => (
              <CircleMarker
                key={idx}
                center={[crisis.lat, crisis.lng]}
                radius={20} // Bigger icon
                pathOptions={{ color: 'red', fillColor: '#f03', fillOpacity: 0.5 }}
              >
                <Popup>
                  <strong>{crisis.title}</strong><br />
                  {crisis.location}<br />
                  {crisis.description}
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </main>
    </div>
  );
}

export default CrisisMap;
