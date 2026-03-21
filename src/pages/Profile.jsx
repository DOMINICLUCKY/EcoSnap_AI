import React from 'react'
import { Trophy, Zap, Leaf, Calendar } from 'lucide-react'

export default function Profile() {
  const user = {
    username: 'EcoWarrior_07',
    avatar: '👤',
    memberSince: 'January 2026',
    totalScans: 247,
    carbonSaved: 84.5,
    badgesEarned: 8
  }

  const achievements = [
    { id: 1, name: 'First Upcycle', description: 'Complete your first upcycling project', icon: '🎯', unlocked: true },
    { id: 2, name: '10kg Carbon Club', description: 'Save 10kg of CO₂ through scanning', icon: '🌱', unlocked: true },
    { id: 3, name: 'Plastic Warrior', description: 'Scan 50 plastic items', icon: '♻️', unlocked: true },
    { id: 4, name: 'Community Champion', description: 'Reach top 10 leaderboard ranking', icon: '🏆', unlocked: false },
    { id: 5, name: 'Scanning Streak', description: 'Scan items 7 days in a row', icon: '🔥', unlocked: false },
    { id: 6, name: 'Master Upcycler', description: 'Complete 25 upcycling projects', icon: '✨', unlocked: false },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="card">
        <div className="flex items-center gap-8">
          {/* Avatar */}
          <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center text-6xl border-2 border-emerald-500">
            {user.avatar}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{user.username}</h1>
            <div className="flex items-center gap-2 text-slate-400 mb-4">
              <Calendar className="w-4 h-4" />
              <span>Member since {user.memberSince}</span>
            </div>
            <button className="btn-primary">Edit Profile</button>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="text-right">
              <p className="text-slate-400 text-sm">Account Level</p>
              <p className="text-2xl font-bold text-emerald-400">⭐⭐⭐ PRO</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - My Impact */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-2xl font-bold text-white mb-6">My Impact</h2>
            
            <div className="grid grid-cols-3 gap-4">
              {/* Total Scans */}
              <div className="bg-slate-700/30 rounded-lg p-6 text-center border border-emerald-500/20">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-emerald-400" />
                </div>
                <p className="text-slate-400 text-sm mb-1">Total Scans</p>
                <h3 className="text-3xl font-bold text-white">{user.totalScans}</h3>
                <p className="text-emerald-400 text-xs mt-2">↑ 12 this week</p>
              </div>

              {/* Carbon Saved */}
              <div className="bg-slate-700/30 rounded-lg p-6 text-center border border-emerald-500/20">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Leaf className="w-6 h-6 text-emerald-400" />
                </div>
                <p className="text-slate-400 text-sm mb-1">Carbon Saved</p>
                <h3 className="text-3xl font-bold text-white">{user.carbonSaved} kg</h3>
                <p className="text-emerald-400 text-xs mt-2">↑ 2.4 kg this week</p>
              </div>

              {/* Badges */}
              <div className="bg-slate-700/30 rounded-lg p-6 text-center border border-emerald-500/20">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-6 h-6 text-emerald-400" />
                </div>
                <p className="text-slate-400 text-sm mb-1">Badges Earned</p>
                <h3 className="text-3xl font-bold text-white">{user.badgesEarned}/12</h3>
                <p className="text-emerald-400 text-xs mt-2">67% Complete</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
            
            <div className="space-y-4">
              {[
                { item: 'Plastic Bottle', type: 'Scanned', time: '2 hours ago', carbon: 0.8 },
                { item: 'Glass Jar', type: 'Scanned', time: '1 day ago', carbon: 0.5 },
                { item: 'Aluminum Can', type: 'Scanned', time: '2 days ago', carbon: 1.2 },
                { item: 'Plastic Bag', type: 'Scanned', time: '3 days ago', carbon: 0.3 },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-700/20 rounded-lg hover:bg-slate-700/40 transition-colors">
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.item}</p>
                    <p className="text-slate-400 text-sm">{activity.type} · {activity.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400 font-semibold">{activity.carbon} kg CO₂</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Achievements */}
        <div className="card h-fit">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Achievements</h2>
          
          <div className="space-y-3">
            {achievements.map(badge => (
              <div 
                key={badge.id} 
                className={`p-4 rounded-lg border transition-all ${
                  badge.unlocked
                    ? 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/60'
                    : 'bg-slate-700/20 border-slate-600/30 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl mt-1">{badge.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold mb-1 ${badge.unlocked ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {badge.name}
                    </p>
                    <p className="text-xs text-slate-500">{badge.description}</p>
                    {badge.unlocked && (
                      <p className="text-xs text-emerald-400 mt-1">✓ Unlocked</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-slate-400 text-sm mb-2">Badge Progress</p>
            <div className="w-full bg-slate-700/50 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-2 rounded-full"
                style={{ width: '67%' }}
              ></div>
            </div>
            <p className="text-sl text-slate-400 mt-2">3 more badges to unlock exclusive rewards!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
