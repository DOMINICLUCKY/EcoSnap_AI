import React, { useState } from 'react'
import { Camera, Upload } from 'lucide-react'

export default function LiveScanner() {
  const [scanning, setScanning] = useState(false)

  return (
    <div className="max-w-5xl mx-auto card">
      <h1 className="text-3xl font-bold text-white mb-2">Live Scanner</h1>
      <p className="text-slate-400 mb-8">Upload or capture images of trash to get instant AI detection and upcycling recommendations.</p>

      <div className="grid grid-cols-2 gap-8">
        {/* Camera Section */}
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-600 rounded-xl hover:border-indigo-500 transition-colors cursor-pointer">
          <Camera className="w-16 h-16 text-indigo-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Launch Camera</h3>
          <p className="text-slate-400 text-sm text-center mb-4">Use your device camera for real-time detection</p>
          <button className="btn-primary">Open Camera</button>
        </div>

        {/* Upload Section */}
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-600 rounded-xl hover:border-indigo-500 transition-colors cursor-pointer">
          <Upload className="w-16 h-16 text-emerald-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Upload Image</h3>
          <p className="text-slate-400 text-sm text-center mb-4">Select an image file for analysis</p>
          <button className="btn-primary">Choose File</button>
        </div>
      </div>

      {/* Recent Uploads */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-white mb-6">Recent Scans</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg"></div>
                <div>
                  <p className="text-white font-medium">Scan #{1000 + i}</p>
                  <p className="text-slate-400 text-sm">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-slate-300 text-sm">Plastic Bottle</p>
                  <p className="text-emerald-400 text-xs font-semibold">99% Confidence</p>
                </div>
                <button className="btn-primary text-xs">View</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
