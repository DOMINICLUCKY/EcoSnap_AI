import React from 'react'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Activity } from 'lucide-react'

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
})

// Dummy data for trash hotspots across NYC
const hotspots = [
  { id: 1, pos: [40.7128, -74.0060], type: 'Plastic Heavy', intensity: 0.8, count: 247 },
  { id: 2, pos: [40.7580, -73.9855], type: 'Mixed Waste', intensity: 0.5, count: 142 },
  { id: 3, pos: [40.7489, -73.9680], type: 'Glass Bottles', intensity: 0.6, count: 189 },
  { id: 4, pos: [40.7614, -73.9776], type: 'Metal Cans', intensity: 0.4, count: 98 },
  { id: 5, pos: [40.7282, -73.7949], type: 'Organic Waste', intensity: 0.7, count: 203 },
]

export default function Heatmap() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
              <Activity className="w-8 h-8 text-emerald-400" />
              Live Impact Heatmap
            </h1>
            <p className="text-slate-400">Real-time geographic distribution of detected waste in New York City</p>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="card p-0 overflow-hidden h-[600px] relative z-0">
        <MapContainer 
          center={[40.730610, -73.935242]} 
          zoom={12} 
          className="h-full w-full"
          style={{ borderRadius: '1rem' }}
        >
          {/* Dark mode map tiles from CARTO */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            maxZoom={19}
          />

          {/* Render hotspot circles */}
          {hotspots.map(spot => (
            <CircleMarker
              key={spot.id}
              center={spot.pos}
              radius={Math.max(10, spot.intensity * 35)}
              pathOptions={{
                fillColor: '#10b981',
                color: '#059669',
                weight: 2,
                opacity: 0.7,
                fillOpacity: 0.4 + spot.intensity * 0.3
              }}
            >
              <Popup className="leaflet-popup-content-wrapper">
                <div className="text-white text-sm p-2 bg-slate-800">
                  <b className="text-emerald-400 block mb-1">{spot.type}</b>
                  <span className="text-xs text-slate-300">
                    Detections: {spot.count}
                  </span>
                  <p className="text-xs text-slate-400 mt-1">
                    Intensity: {Math.round(spot.intensity * 100)}%
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Legend & Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-slate-400 text-xs font-semibold uppercase mb-2">Total Detections</p>
          <p className="text-3xl font-bold text-white">879</p>
          <p className="text-emerald-400 text-xs mt-2 font-medium">↑ 23% today</p>
        </div>

        <div className="card">
          <p className="text-slate-400 text-xs font-semibold uppercase mb-2">Hottest Zone</p>
          <p className="text-3xl font-bold text-emerald-400">Downtown</p>
          <p className="text-slate-400 text-xs mt-2">247 scans detected</p>
        </div>

        <div className="card">
          <p className="text-slate-400 text-xs font-semibold uppercase mb-2">Peak Activity</p>
          <p className="text-3xl font-bold text-white">2-4 PM</p>
          <p className="text-slate-400 text-xs mt-2">Most detections observed</p>
        </div>

        <div className="card">
          <p className="text-slate-400 text-xs font-semibold uppercase mb-2">Top Material</p>
          <p className="text-3xl font-bold text-blue-400">Plastic</p>
          <p className="text-slate-400 text-xs mt-2">42% of all scans</p>
        </div>
      </div>

      {/* Legend */}
      <div className="card">
        <h3 className="text-lg font-bold text-white mb-4">Hotspot Legend</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/60 border-2 border-emerald-600 flex-shrink-0 mt-1"></div>
            <div>
              <p className="text-white font-medium text-sm">High Concentration</p>
              <p className="text-slate-400 text-xs">Intensity 60-100%</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/40 border-2 border-emerald-600 flex-shrink-0 mt-1"></div>
            <div>
              <p className="text-white font-medium text-sm">Medium Concentration</p>
              <p className="text-slate-400 text-xs">Intensity 30-60%</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 border-2 border-emerald-600 flex-shrink-0 mt-1"></div>
            <div>
              <p className="text-white font-medium text-sm">Low Concentration</p>
              <p className="text-slate-400 text-xs">Intensity &lt;30%</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-4 h-4 bg-slate-700 rounded flex-shrink-0 mt-1.5"></div>
            <div>
              <p className="text-white font-medium text-sm">View Details</p>
              <p className="text-slate-400 text-xs">Click hotspots for info</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
