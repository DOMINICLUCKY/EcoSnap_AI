import React, { useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MapTest() {
  return (
    <div style={{ 
      height: '100vh', 
      width: '100%', 
      border: '4px solid red',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ padding: '10px', background: '#333', color: '#0f0', fontFamily: 'monospace' }}>
        🧪 MAP TEST - CartoDB Dark Tiles
      </div>
      
      <div style={{ flex: 1, height: 'calc(100vh - 50px)', width: '100%', position: 'relative' }}>
        <MapContainer 
          center={[20.2961, 85.8245]}
          zoom={10}
          style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }}
          preferCanvas={true}
        >
          {/* CartoDB Dark Tile (Most Reliable) */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            maxZoom={19}
            className="leaflet-tile"
          />
          
          {/* Fallback: OpenStreetMap Standard */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxZoom={19}
            className="leaflet-tile-fallback"
            style={{ display: 'none' }}
          />
        </MapContainer>
      </div>
    </div>
  );
}
