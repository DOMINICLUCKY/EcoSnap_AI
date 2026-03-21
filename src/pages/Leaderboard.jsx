import React, { useState } from 'react'
import { Trophy, TrendingUp, Flame, Star, Zap, Award, Target } from 'lucide-react'

export default function Leaderboard() {
  const [sortBy, setSortBy] = useState('carbonSaved')

  // Extended leaderboard data with streaks
  const leaderboardData = [
    { rank: 1, name: 'EcoWarrior_NYC', scans: 5432, carbonSaved: 156.8, location: 'New York', streak: 87 },
    { rank: 2, name: 'GreenGuardian', scans: 4891, carbonSaved: 142.3, location: 'Los Angeles', streak: 62 },
    { rank: 3, name: 'RecycleChamp', scans: 4156, carbonSaved: 118.9, location: 'Chicago', streak: 45 },
    { rank: 4, name: 'TrashHunter', scans: 3842, carbonSaved: 109.2, location: 'Houston', streak: 38 },
    { rank: 5, name: 'EcoDetective', scans: 3521, carbonSaved: 98.4, location: 'Phoenix', streak: 29 },
    { rank: 6, name: 'SnapMaster', scans: 3156, carbonSaved: 87.6, location: 'Philadelphia', streak: 34 },
    { rank: 7, name: 'GreenMachine', scans: 2891, carbonSaved: 76.5, location: 'San Antonio', streak: 21 },
    { rank: 8, name: 'UpcycleKing', scans: 2543, carbonSaved: 64.2, location: 'San Diego', streak: 16 },
    { rank: 9, name: 'WasteWizard', scans: 2234, carbonSaved: 58.9, location: 'Dallas', streak: 12 },
    { rank: 10, name: 'RecycleQueen', scans: 1987, carbonSaved: 52.1, location: 'San Jose', streak: 9 },
  ]

  // Function to determine badge based on scan count
  const getBadge = (scans) => {
    if (scans >= 5000) return { name: 'Carbon Crusader', icon: Zap, color: 'text-yellow-400' }
    if (scans >= 3000) return { name: 'Eco Sniper', icon: Target, color: 'text-emerald-400' }
    return { name: 'Recycle Rookie', icon: Star, color: 'text-blue-400' }
  }

  // Sort data
  const sortedData = [...leaderboardData].sort((a, b) => {
    if (sortBy === 'carbonSaved') return b.carbonSaved - a.carbonSaved
    if (sortBy === 'scans') return b.scans - a.scans
    if (sortBy === 'streak') return b.streak - a.streak
    return 0
  })

  // Top 3 for podium
  const topThree = sortedData.slice(0, 3)

  return (
    <div className="space-y-8">
      {/* PODIUM SECTION */}
      <section className="px-6">
        <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
          <Trophy className="w-7 h-7 text-yellow-400" />
          Top 3 Champions
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Silver (2nd Place) */}
          {topThree.length > 1 && (
            <div className="col-span-1 relative group">
              <div className="h-full p-6 rounded-xl bg-gradient-to-br from-slate-700/30 to-slate-800/30 border-2 border-slate-400 shadow-[0_0_20px_rgba(148,163,184,0.2)]">
                {/* Medal Badge */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-slate-400 rounded-full flex items-center justify-center text-2xl shadow-lg">
                  🥈
                </div>

                <div className="text-center">
                  <p className="text-slate-400 text-sm font-semibold mb-2">2ND PLACE</p>
                  <h3 className="text-2xl font-black text-white mb-4">{topThree[1].name}</h3>
                  <div className="bg-slate-600/30 rounded-lg p-4 mb-4 border border-slate-500/30">
                    <p className="text-slate-400 text-xs mb-1">Carbon Saved</p>
                    <p className="text-3xl font-black text-slate-300">{topThree[1].carbonSaved.toFixed(1)} kg</p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <span className="text-slate-400">{topThree[1].scans} scans</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Flame className="w-4 h-4 text-orange-400" />
                      {topThree[1].streak} days
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Gold (1st Place) - Center */}
          {topThree.length > 0 && (
            <div className="col-span-1 relative group">
              <div className="h-full p-8 rounded-xl bg-gradient-to-br from-yellow-500/20 via-yellow-600/10 to-amber-700/20 border-2 border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.3)] group-hover:shadow-[0_0_50px_rgba(250,204,21,0.4)] transition-shadow">
                {/* Medal Badge */}
                <div className="absolute -top-5 -right-5 w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center text-3xl shadow-xl border-2 border-yellow-300">
                  🥇
                </div>

                <div className="text-center">
                  <p className="text-yellow-600 text-sm font-black mb-2 tracking-widest">👑 CHAMPION 👑</p>
                  <h3 className="text-3xl font-black text-white mb-6">{topThree[0].name}</h3>
                  <div className="bg-yellow-500/20 rounded-lg p-6 mb-6 border border-yellow-400/50">
                    <p className="text-yellow-600/80 text-xs mb-1 font-semibold">Carbon Saved</p>
                    <p className="text-5xl font-black bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
                      {topThree[0].carbonSaved.toFixed(1)} kg
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-sm">
                    <span className="text-yellow-600/80 font-semibold">{topThree[0].scans} scans</span>
                    <span className="text-yellow-400">•</span>
                    <span className="text-yellow-600/80 flex items-center gap-1 font-semibold">
                      <Flame className="w-5 h-5 text-red-500" />
                      {topThree[0].streak} days
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bronze (3rd Place) */}
          {topThree.length > 2 && (
            <div className="col-span-1 relative group">
              <div className="h-full p-6 rounded-xl bg-gradient-to-br from-orange-700/20 to-orange-800/20 border-2 border-orange-600 shadow-[0_0_20px_rgba(217,119,6,0.2)]">
                {/* Medal Badge */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-2xl shadow-lg">
                  🥉
                </div>

                <div className="text-center">
                  <p className="text-orange-600 text-sm font-semibold mb-2">3RD PLACE</p>
                  <h3 className="text-2xl font-black text-white mb-4">{topThree[2].name}</h3>
                  <div className="bg-orange-600/20 rounded-lg p-4 mb-4 border border-orange-600/30">
                    <p className="text-orange-600/80 text-xs mb-1">Carbon Saved</p>
                    <p className="text-3xl font-black text-orange-300">{topThree[2].carbonSaved.toFixed(1)} kg</p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <span className="text-orange-600/80">{topThree[2].scans} scans</span>
                    <span className="text-orange-700">•</span>
                    <span className="text-orange-600/80 flex items-center gap-1">
                      <Flame className="w-4 h-4 text-orange-500" />
                      {topThree[2].streak} days
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FULL LEADERBOARD TABLE */}
      <section className="px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-3 mb-1">
              <Trophy className="w-7 h-7 text-emerald-400" />
              Full Rankings
            </h2>
            <p className="text-slate-400 text-sm">All community members ranked by impact</p>
          </div>

          {/* Sort Controls */}
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('carbonSaved')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                sortBy === 'carbonSaved'
                  ? 'bg-emerald-500/30 text-emerald-400 border border-emerald-500/50'
                  : 'bg-slate-700/20 text-slate-400 border border-slate-600/30'
              }`}
            >
              Carbon Impact
            </button>
            <button
              onClick={() => setSortBy('scans')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                sortBy === 'scans'
                  ? 'bg-emerald-500/30 text-emerald-400 border border-emerald-500/50'
                  : 'bg-slate-700/20 text-slate-400 border border-slate-600/30'
              }`}
            >
              Scan Count
            </button>
            <button
              onClick={() => setSortBy('streak')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                sortBy === 'streak'
                  ? 'bg-emerald-500/30 text-emerald-400 border border-emerald-500/50'
                  : 'bg-slate-700/20 text-slate-400 border border-slate-600/30'
              }`}
            >
              Streak
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left text-slate-400 font-semibold py-4 px-4">Rank</th>
                <th className="text-left text-slate-400 font-semibold py-4 px-4">Name</th>
                <th className="text-left text-slate-400 font-semibold py-4 px-4">Badge</th>
                <th className="text-left text-slate-400 font-semibold py-4 px-4">Scans</th>
                <th className="text-left text-slate-400 font-semibold py-4 px-4">Carbon Saved</th>
                <th className="text-left text-slate-400 font-semibold py-4 px-4">Current Streak</th>
                <th className="text-left text-slate-400 font-semibold py-4 px-4">Location</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((user, idx) => {
                const badge = getBadge(user.scans)
                const BadgeIcon = badge.icon
                const isTopThree = idx < 3

                return (
                  <tr
                    key={user.name}
                    className={`border-b border-slate-700/30 transition-colors ${
                      isTopThree
                        ? 'bg-emerald-500/10 hover:bg-emerald-500/20'
                        : 'hover:bg-slate-700/20'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {idx < 3 ? (
                          <span className="text-2xl">
                            {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                          </span>
                        ) : (
                          <span className="text-white font-black w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center">
                            {idx + 1}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Name */}
                    <td className="py-4 px-4">
                      <p className={`font-bold ${isTopThree ? 'text-emerald-300' : 'text-white'}`}>
                        {user.name}
                      </p>
                    </td>

                    {/* Badge */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <BadgeIcon className={`w-5 h-5 ${badge.color}`} />
                        <span className="text-xs font-semibold text-slate-300">{badge.name}</span>
                      </div>
                    </td>

                    {/* Scans */}
                    <td className="py-4 px-4">
                      <span className="text-indigo-400 font-semibold flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {user.scans.toLocaleString()}
                      </span>
                    </td>

                    {/* Carbon Saved */}
                    <td className="py-4 px-4">
                      <span className="text-emerald-400 font-semibold">{user.carbonSaved.toFixed(1)} kg</span>
                    </td>

                    {/* Current Streak */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🔥</span>
                        <span className={`font-bold ${user.streak >= 30 ? 'text-red-400' : user.streak >= 15 ? 'text-orange-400' : 'text-yellow-400'}`}>
                          {user.streak} days
                        </span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-4 text-slate-400">{user.location}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* STATS FOOTER */}
      <section className="px-6">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="card bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
            <p className="text-slate-400 text-sm mb-2">Total Community Scans</p>
            <p className="text-3xl font-black text-emerald-400">284.5K</p>
          </div>
          <div className="card bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <p className="text-slate-400 text-sm mb-2">CO₂ Prevented</p>
            <p className="text-3xl font-black text-blue-400">8.1M kg</p>
          </div>
          <div className="card bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <p className="text-slate-400 text-sm mb-2">Active Users</p>
            <p className="text-3xl font-black text-purple-400">47.3K</p>
          </div>
          <div className="card bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
            <p className="text-slate-400 text-sm mb-2">Avg Streak (Days)</p>
            <p className="text-3xl font-black text-orange-400">34</p>
          </div>
        </div>
      </section>
    </div>
  )
}
