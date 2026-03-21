import React from 'react'
import { Trophy, TrendingUp } from 'lucide-react'

export default function Leaderboard() {
  const leaderboardData = [
    { rank: 1, name: 'EcoWarrior_NYC', scans: 5432, carbonSaved: 156.8, location: 'New York' },
    { rank: 2, name: 'GreenGuardian', scans: 4891, carbonSaved: 142.3, location: 'Los Angeles' },
    { rank: 3, name: 'RecycleChamp', scans: 4156, carbonSaved: 118.9, location: 'Chicago' },
    { rank: 4, name: 'TrashHunter', scans: 3842, carbonSaved: 109.2, location: 'Houston' },
    { rank: 5, name: 'EcoDetective', scans: 3521, carbonSaved: 98.4, location: 'Phoenix' },
    { rank: 6, name: 'SnapMaster', scans: 3156, carbonSaved: 87.6, location: 'Philadelphia' },
    { rank: 7, name: 'GreenMachine', scans: 2891, carbonSaved: 76.5, location: 'San Antonio' },
    { rank: 8, name: 'UpcycleKing', scans: 2543, carbonSaved: 64.2, location: 'San Diego' },
  ]

  return (
    <div className="max-w-5xl mx-auto card">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            Global Leaderboard
          </h1>
          <p className="text-slate-400">Top performers in the EcoSnap community</p>
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-sm">You are ranked</p>
          <p className="text-3xl font-bold text-indigo-400">#12</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-left text-slate-400 font-semibold py-4 px-4">Rank</th>
              <th className="text-left text-slate-400 font-semibold py-4 px-4">Name</th>
              <th className="text-left text-slate-400 font-semibold py-4 px-4">Location</th>
              <th className="text-left text-slate-400 font-semibold py-4 px-4">Scans</th>
              <th className="text-left text-slate-400 font-semibold py-4 px-4">Carbon Saved (kg)</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((user, idx) => (
              <tr key={user.rank} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    {user.rank <= 3 ? (
                      <span className="text-2xl">
                        {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'}
                      </span>
                    ) : (
                      <span className="text-white font-bold w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center">
                        {user.rank}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <p className="text-white font-semibold">{user.name}</p>
                </td>
                <td className="py-4 px-4 text-slate-400">{user.location}</td>
                <td className="py-4 px-4">
                  <span className="text-indigo-400 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {user.scans}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-emerald-400 font-semibold">{user.carbonSaved.toFixed(1)} kg</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stats Footer */}
      <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-700/50">
        <div className="text-center">
          <p className="text-slate-400 text-sm mb-2">Total Community Scans</p>
          <p className="text-3xl font-bold text-white">284.5K</p>
        </div>
        <div className="text-center">
          <p className="text-slate-400 text-sm mb-2">CO₂ Prevented</p>
          <p className="text-3xl font-bold text-emerald-400">8.1M kg</p>
        </div>
        <div className="text-center">
          <p className="text-slate-400 text-sm mb-2">Active Users</p>
          <p className="text-3xl font-bold text-blue-400">47.3K</p>
        </div>
      </div>
    </div>
  )
}
