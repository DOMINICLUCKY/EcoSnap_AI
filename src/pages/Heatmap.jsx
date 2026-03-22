import React, { useState, useEffect } from 'react'
import { AlertTriangle, Factory, Wind, CheckCircle, Activity, Radio, MapPin } from 'lucide-react'

// --- MOCK TELEMETRY DATA ---
const ZONE_DATA = [
  { id: 1, name: "Bhubaneswar Tech Hub", lat: 20.2961, lng: 85.8245, type: 'warning', co2: '45 ppm', waste: 'Moderate', status: 'Elevated Waste', color: '#eab308' },
  { id: 2, name: "Industrial Zone Alpha", lat: 20.2500, lng: 85.8000, type: 'danger', co2: '89 ppm', waste: 'Critical', status: 'Toxic Dumping', color: '#ef4444' },
  { id: 3, name: "Jaipatna City", lat: 19.4812, lng: 82.8200, type: 'safe', co2: '12 ppm', waste: 'Low', status: 'Optimal Recycling', color: '#10b981' },
  { id: 4, name: "EcoSnap Facility 01", lat: 20.3200, lng: 85.8100, type: 'safe', co2: '8 ppm', waste: 'Minimal', status: 'Active Processing', color: '#10b981' },
  { id: 5, name: "Cuttack Market Sector", lat: 20.4625, lng: 85.8830, type: 'warning', co2: '55 ppm', waste: 'High', status: 'High E-Waste', color: '#eab308' },
]

export default function Heatmap() {
  const [activeZone, setActiveZone] = useState(ZONE_DATA[0])
  const [livePulses, setLivePulses] = useState([])
  const [isLiveMode, setIsLiveMode] = useState(true)

  // --- SIMULATED LIVE SCANS ---
  useEffect(() => {
    if (!isLiveMode) return
    const pulseInterval = setInterval(() => {
      const randomZone = ZONE_DATA[Math.floor(Math.random() * ZONE_DATA.length)]
      const newPulse = {
        id: Date.now() + Math.random(),
        lat: randomZone.lat + (Math.random() - 0.5) * 0.08, 
        lng: randomZone.lng + (Math.random() - 0.5) * 0.08,
        timestamp: Date.now(),
      }
      setLivePulses(prev => [...prev.slice(-14), newPulse])
    }, 2500)
    return () => clearInterval(pulseInterval)
  }, [isLiveMode])

  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now()
      setLivePulses(prev => prev.filter(pulse => now - pulse.timestamp < 6000))
    }, 1000)
    return () => clearInterval(cleanupInterval)
  }, [])

  const getZoneStyles = (type) => {
    switch (type) {
      case 'danger': return { bg: 'bg-[#1a0b0b]', border: 'border-red-500/50', text: 'text-red-400', shadow: 'shadow-[0_0_30px_rgba(239,68,68,0.15)]', bar: 'bg-red-500', icon: <AlertTriangle className="w-4 h-4" /> }
      case 'warning': return { bg: 'bg-[#1a160b]', border: 'border-yellow-500/50', text: 'text-yellow-400', shadow: 'shadow-[0_0_30px_rgba(234,179,8,0.15)]', bar: 'bg-yellow-500', icon: <Factory className="w-4 h-4" /> }
      default: return { bg: 'bg-[#0a1a12]', border: 'border-emerald-500/40', text: 'text-emerald-400', shadow: 'shadow-[0_0_30px_rgba(16,185,129,0.15)]', bar: 'bg-emerald-500', icon: <CheckCircle className="w-4 h-4" /> }
    }
  }

  const activeStyles = getZoneStyles(activeZone.type)

  return (
    <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-6 pb-10">
      
      {/* ========================================== */}
      {/* LEFT COLUMN: TELEMETRY PANEL               */}
      {/* ========================================== */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        <div className="card bg-[#0d1410] border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-emerald-400" /> Global Telemetry
            </h2>
            <button onClick={() => setIsLiveMode(!isLiveMode)} className={`text-xs px-2 py-1 rounded border transition-all flex items-center gap-1 ${isLiveMode ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
              <Radio className={`w-3 h-3 ${isLiveMode ? 'animate-pulse' : ''}`} /> {isLiveMode ? 'LIVE SYNC' : 'OFFLINE'}
            </button>
          </div>
          <p className="text-slate-400 text-sm">Real-time environmental threat monitoring.</p>
        </div>

        <div className={`card flex-1 border transition-colors duration-500 ${activeStyles.bg} ${activeStyles.border} ${activeStyles.shadow}`}>
          <h3 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Sector Intelligence
          </h3>
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-2">{activeZone.name}</h1>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold bg-black/40 ${activeStyles.text} border ${activeStyles.border}`}>
              {activeStyles.icon} {activeZone.status}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400 flex items-center gap-2"><Wind className="w-4 h-4"/> Local CO₂ Levels</span>
                <span className="text-white font-mono">{activeZone.co2}</span>
              </div>
              <div className="w-full bg-black/50 rounded-full h-2 border border-slate-800">
                <div className={`h-2 rounded-full transition-all duration-1000 ${activeStyles.bar}`} style={{ width: activeZone.type === 'danger' ? '90%' : activeZone.type === 'warning' ? '60%' : '20%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400 flex items-center gap-2"><Factory className="w-4 h-4"/> Waste Density</span>
                <span className="text-white font-mono">{activeZone.waste}</span>
              </div>
              <div className="w-full bg-black/50 rounded-full h-2 border border-slate-800">
                <div className={`h-2 rounded-full transition-all duration-1000 ${activeStyles.bar}`} style={{ width: activeZone.type === 'danger' ? '85%' : activeZone.type === 'warning' ? '50%' : '15%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-[#0d1410] border-emerald-500/20">
          <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Monitored Zones</h3>
          <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
            {ZONE_DATA.map(zone => (
              <button key={zone.id} onClick={() => setActiveZone(zone)} className={`w-full text-left px-4 py-3 rounded-lg transition-all border ${activeZone.id === zone.id ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-black/40 border-slate-800 text-slate-400 hover:border-slate-600'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{zone.name}</span>
                  <span className={`w-2 h-2 rounded-full ${zone.type === 'danger' ? 'bg-red-500' : zone.type === 'warning' ? 'bg-yellow-500' : 'bg-emerald-500'}`} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* RIGHT COLUMN: THE 100% FREE RADAR MAP      */}
      {/* ========================================== */}
      <div className="col-span-12 lg:col-span-8 card p-0 border-emerald-500/30 relative shadow-[0_0_20px_rgba(16,185,129,0.15)] overflow-hidden">
        
        <div className="absolute top-6 left-6 z-[400] pointer-events-none">
          <div className="bg-black/90 backdrop-blur-md border border-slate-800 p-4 rounded-lg shadow-xl">
            <h4 className="text-emerald-400 font-bold text-xs mb-3 uppercase tracking-widest">Threat Legend</h4>
            <div className="flex flex-col gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" /> Safe Zone</span>
              <span className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_8px_#eab308]" /> Elevated Waste</span>
              <span className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" /> Critical Hazard</span>
            </div>
          </div>
        </div>

        {/* HACKATHON DUCT TAPE: Instant Google Maps iframe - 100% Free, Zero Setup */}
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119743.53374950294!2d85.73523821013758!3d20.296058696827725!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1909d2d5170aa5%3A0xfc580e2b68b33c8b!2sBhubaneswar%2C%20Odisha!5e1!3m2!1sen!2sin!4v1711000000000!5m2!1sen!2sin" 
          width="100%" 
          height="700" 
          style={{ border: 0, borderRadius: '0.5rem', filter: 'invert(90%) hue-rotate(180deg)' }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="EcoSnap Waste Management Map - Bhubaneswar, Odisha"
        />
        
        {/* Live Pulse Counter Overlay */}
        <div className="absolute bottom-6 left-6 z-[400] bg-black/90 backdrop-blur-md border border-emerald-500/40 p-3 rounded-lg shadow-xl">
          <div className="text-emerald-400 font-bold text-sm">
            <span className="animate-pulse">●</span> Live Scans: {livePulses.length}/15
          </div>
          <p className="text-slate-400 text-xs mt-1">{isLiveMode ? 'MONITORING' : 'PAUSED'}</p>
        </div>
      </div>
    </div>
  )
}
