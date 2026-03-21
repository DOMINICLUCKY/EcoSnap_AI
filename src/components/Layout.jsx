import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { BarChart3, TrendingUp, Users, Newspaper, User } from 'lucide-react'

export default function Layout() {
  const location = useLocation()

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { name: 'Heatmap', path: '/heatmap', icon: TrendingUp },
    { name: 'Leaderboard', path: '/leaderboard', icon: Users },
    { name: 'Eco News', path: '/news', icon: Newspaper },
    { name: 'Profile', path: '/profile', icon: User },
  ]

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-[#1e293b] border-r border-slate-700/50 flex flex-col">
        {/* Logo */}
        <div className="px-6 py-8 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="M12 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
              <path d="M12 12v4"/>
              <path d="M8 12h8"/>
            </svg>
            <div>
              <div className="text-lg font-black text-white tracking-wider">
                Eco<span className="text-emerald-400">Snap</span>
              </div>
              <div className="text-emerald-400 text-xs font-semibold">AI DETECTION</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <a
                key={item.path}
                href={item.path}
                className={`sidebar-link ${isActive ? 'sidebar-active' : ''}`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </a>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-6 border-t border-slate-700/50 text-slate-500 text-xs">
          <p>© 2026 EcoSnap AI</p>
          <p>Enterprise Edition</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <header className="h-16 bg-[#1e293b]/95 border-b border-slate-700/50 flex items-center px-8 sticky top-0 z-10 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-emerald-500 rounded-full pulse-dot"></div>
            <span className="text-slate-300 text-sm font-semibold tracking-wider">LIVE DATA</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
