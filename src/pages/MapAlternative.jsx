import React, { useState } from 'react';
import { AlertCircle, MapPin } from 'lucide-react';

export default function MapAlternative() {
  const [selectedTile, setSelectedTile] = useState('cartodb');

  const tileProviders = {
    cartodb: {
      name: 'CartoDB Dark',
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attr: '&copy; CartoDB'
    },
    satellite: {
      name: 'Esri Satellite',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attr: '&copy; Esri'
    },
    osm: {
      name: 'OpenStreetMap',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attr: '&copy; OpenStreetMap'
    }
  };

  const currentTile = tileProviders[selectedTile];

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', background: '#0f0f0f' }}>
      {/* Header */}
      <div style={{ 
        padding: '15px 20px',
        background: '#1a1a1a',
        borderBottom: '1px solid #333',
        color: '#0f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <MapPin size={20} />
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>🗺️ Map Test - {currentTile.name}</span>
        </div>
        <div style={{ fontSize: '12px', color: '#666', fontFamily: 'monospace' }}>
          If the map below is black, try switching tile providers using the buttons below
        </div>
      </div>

      {/* Map Container */}
      <div style={{ 
        flex: 1, 
        position: 'relative',
        border: '2px solid #00ff00',
        overflow: 'hidden'
      }}>
        <iframe
          title="world-map"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            filter: 'invert(1)'
          }}
          src={`https://maps.openstreetmap.org/export/embed.html?bbox=85.1,19.8,86.5,20.8&layer=mapnik`}
        />
      </div>

      {/* Tile Selector */}
      <div style={{ 
        padding: '15px',
        background: '#1a1a1a',
        borderTop: '1px solid #333',
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        {Object.entries(tileProviders).map(([key, provider]) => (
          <button
            key={key}
            onClick={() => setSelectedTile(key)}
            style={{
              padding: '8px 16px',
              background: selectedTile === key ? '#0f0' : '#333',
              color: selectedTile === key ? '#000' : '#0f0',
              border: `1px solid ${selectedTile === key ? '#0f0' : '#666'}`,
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '12px',
              transition: 'all 0.3s'
            }}
          >
            {provider.name}
          </button>
        ))}
      </div>

      {/* Instructions */}
      <div style={{
        padding: '15px',
        background: '#2a2a2a',
        borderTop: '1px solid #333',
        fontSize: '13px',
        color: '#aaa',
        fontFamily: 'monospace'
      }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
          <AlertCircle size={16} style={{ flexShrink: 0, color: '#ff9800' }} />
          <span><strong>Black map?</strong> It might be a network issue. Try these:</span>
        </div>
        <ul style={{ margin: '5px 0 0 26px', paddingLeft: 0 }}>
          <li>Hard refresh: Ctrl+Shift+R</li>
          <li>Disable ad blocker</li>
          <li>Check browser console (F12) for errors</li>
          <li>Try a different tile provider button above</li>
        </ul>
      </div>
    </div>
  );
}
