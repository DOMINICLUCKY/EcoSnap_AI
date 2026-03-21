import React, { useState, useEffect } from 'react';
import { TrendingUp, Award, Droplets, Leaf, Zap, BarChart3, Globe, AlertTriangle } from 'lucide-react';

const WASTE_STATS = [
  {
    id: 1,
    title: '2,450 tons Ocean Waste Collected',
    description: 'Global ocean cleanup initiative removes plastic from vulnerable marine ecosystems',
    metric: '2,450',
    unit: 'tons',
    trend: 'up',
    icon: Droplets,
    color: 'from-blue-500 to-cyan-500',
    date: '2026-03-21',
    source: 'Ocean Cleanup Foundation'
  },
  {
    id: 2,
    title: '85% Waste Successfully Processed',
    description: 'Advanced recycling facilities achieve record-breaking processing efficiency',
    metric: '85',
    unit: '%',
    trend: 'up',
    icon: BarChart3,
    color: 'from-emerald-500 to-green-500',
    date: '2026-03-20',
    source: 'Global Waste Management Coalition'
  },
  {
    id: 3,
    title: '3.2M Trees Equivalent Saved',
    description: 'Recycled materials prevent deforestation. Each ton of recycled plastic saves ~150 trees',
    metric: '3.2M',
    unit: 'trees',
    trend: 'up',
    icon: Leaf,
    color: 'from-green-500 to-emerald-500',
    date: '2026-03-19',
    source: 'Environmental Impact Report'
  },
  {
    id: 4,
    title: '156K tons CO₂ Emissions Avoided',
    description: 'Waste recycling programs prevent 156,000 tons of CO₂ from entering atmosphere',
    metric: '156K',
    unit: 'tons CO₂',
    trend: 'up',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    date: '2026-03-18',
    source: 'Carbon Reduction Initiative'
  },
  {
    id: 5,
    title: 'E-Waste Recovery Rate +42%',
    description: 'Electronic waste collection programs show 42% increase in recovery rates this quarter',
    metric: '42',
    unit: '% increase',
    trend: 'up',
    icon: TrendingUp,
    color: 'from-purple-500 to-pink-500',
    date: '2026-03-17',
    source: 'E-Waste Recycling Network'
  },
  {
    id: 6,
    title: '98K Plastic Bottles Prevented',
    description: 'Reuse initiative prevents 98,000 single-use plastic bottles from entering landfills',
    metric: '98K',
    unit: 'bottles',
    trend: 'up',
    icon: AlertTriangle,
    color: 'from-red-500 to-orange-500',
    date: '2026-03-16',
    source: 'Zero Waste Foundation'
  }
];

const IMPACT_PROJECTS = [
  {
    id: 1,
    title: 'Microplastics Removal Initiative',
    category: 'Ocean Cleanup',
    status: 'Active',
    progress: 73,
    location: 'Pacific Ocean',
    wasteCollected: '450 tons',
    impact: 'Protecting marine ecosystems'
  },
  {
    id: 2,
    title: 'Urban Waste Segregation Program',
    category: 'City Recycling',
    status: 'Active',
    progress: 88,
    location: 'Odisha, India',
    wasteCollected: '1,200 tons/month',
    impact: 'Zero landfill diversion'
  },
  {
    id: 3,
    title: 'Industrial Plastic Recovery',
    category: 'Manufacturing',
    status: 'Active',
    progress: 65,
    location: 'Southeast Asia',
    wasteCollected: '800 tons',
    impact: 'Circular economy model'
  },
  {
    id: 4,
    title: 'Coastal Beach Cleanup',
    category: 'Beach Restoration',
    status: 'Completed',
    progress: 100,
    location: '156 Beaches Worldwide',
    wasteCollected: '2,100 tons',
    impact: 'Full ecosystem recovery'
  }
];

export default function News() {
  const [activeTab, setActiveTab] = useState('statistics');
  const [selectedStat, setSelectedStat] = useState(WASTE_STATS[0]);
  const [sortBy, setSortBy] = useState('latest');

  const sortedStats = [...WASTE_STATS].sort((a, b) => {
    if (sortBy === 'latest') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'impact') return parseInt(b.metric) - parseInt(a.metric);
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="card bg-gradient-to-r from-[#050a07] to-[#0d1410] border border-emerald-500/30">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
              <Globe className="w-10 h-10 text-emerald-400" />
              Waste Management Impact
            </h1>
            <p className="text-slate-400 text-lg">Real-time tracking of global waste collection, processing, and environmental impact</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-sm uppercase tracking-wider">Global Metrics</p>
            <p className="text-emerald-400 font-bold text-2xl">Live Updated</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-700/50">
        {['statistics', 'projects', 'achievements'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-medium transition-all border-b-2 uppercase text-sm tracking-wider ${
              activeTab === tab
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* STATISTICS TAB */}
      {activeTab === 'statistics' && (
        <div className="space-y-6">
          {/* Sort Controls */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Waste Management Metrics</h2>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#1e293b] border border-emerald-500/30 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
            >
              <option value="latest">Latest First</option>
              <option value="impact">Highest Impact</option>
            </select>
          </div>

          {/* Featured Stat */}
          {selectedStat && (
            <div className={`card bg-gradient-to-r ${selectedStat.color} bg-opacity-10 border border-emerald-500/30 p-8 overflow-hidden relative`}>
              <div className="grid grid-cols-3 gap-6 relative z-10">
                <div>
                  <p className="text-slate-400 text-sm mb-2">Achievement</p>
                  <h3 className="text-2xl font-black text-white leading-tight mb-4">{selectedStat.title}</h3>
                  <p className="text-slate-300 text-sm">{selectedStat.description}</p>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <div className="text-5xl font-black text-emerald-400 mb-2">{selectedStat.metric}</div>
                  <div className="text-slate-400 font-semibold">{selectedStat.unit}</div>
                  {selectedStat.trend === 'up' && (
                    <div className="flex items-center gap-1 text-emerald-400 font-bold mt-4">
                      <TrendingUp className="w-5 h-5" /> Increasing
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Source</p>
                    <p className="text-white font-semibold">{selectedStat.source}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Last Updated</p>
                    <p className="text-slate-300 font-mono">{new Date(selectedStat.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedStats.map(stat => {
              const Icon = stat.icon;
              return (
                <button
                  key={stat.id}
                  onClick={() => setSelectedStat(stat)}
                  className={`card transition-all cursor-pointer ${
                    selectedStat?.id === stat.id
                      ? 'border-emerald-500 shadow-lg shadow-emerald-500/20'
                      : 'hover:border-emerald-500/50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-20`}>
                      <Icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-bold text-white text-sm line-clamp-2 mb-2">{stat.title}</h3>
                      <div className="text-2xl font-black text-emerald-400">{stat.metric}</div>
                      <p className="text-xs text-slate-500">{stat.unit}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* PROJECTS TAB */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Active Waste Management Projects</h2>
          <div className="space-y-4">
            {IMPACT_PROJECTS.map(project => (
              <div key={project.id} className="card hover:border-emerald-500/50 transition-all">
                <div className="grid grid-cols-12 gap-6 items-center">
                  <div className="col-span-12 lg:col-span-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-white text-lg mb-1">{project.title}</h3>
                        <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">{project.category}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        project.status === 'Active' 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-slate-700/20 text-slate-400'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">{project.impact}</p>
                  </div>

                  <div className="col-span-12 lg:col-span-5 space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Progress</span>
                        <span className="font-bold text-emerald-400">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-800/50 p-2 rounded">
                        <p className="text-slate-500">Location</p>
                        <p className="text-white font-semibold">{project.location}</p>
                      </div>
                      <div className="bg-slate-800/50 p-2 rounded">
                        <p className="text-slate-500">Collected</p>
                        <p className="text-emerald-400 font-semibold">{project.wasteCollected}</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-12 lg:col-span-3">
                    <button className="w-full btn-primary">View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACHIEVEMENTS TAB */}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Sustainability Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {/* Milestone Cards */}
            <div className="card bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40">
              <div className="flex items-start gap-4 mb-4">
                <Award className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-white text-lg">Zero Ocean Plastic Goal</h3>
                  <p className="text-slate-400 text-sm">2,450 tons removed from critical zones</p>
                </div>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-slate-500 text-xs mb-2">Target: 5,000 tons</p>
                    <p className="text-emerald-400 font-black text-2xl">49% Complete</p>
                  </div>
                  <div className="w-20 h-20 relative">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="8" />
                      <circle
                        cx="50" cy="50" r="40" fill="none" stroke="#10b981"
                        strokeWidth="8" strokeDasharray={`${2 * Math.PI * 40 * 0.49} ${2 * Math.PI * 40}`}
                        strokeDashoffset="0" transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/40">
              <div className="flex items-start gap-4 mb-4">
                <Leaf className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-white text-lg">Trees Saved Through Recycling</h3>
                  <p className="text-slate-400 text-sm">Recycled materials = forest preservation</p>
                </div>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="text-3xl font-black text-yellow-400">3.2M Trees</div>
                  <p className="text-slate-400 text-sm">Equivalent protection from deforestation</p>
                  <p className="text-xs text-slate-500 mt-3">📊 Each ton of recycled plastic = ~150 trees</p>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/40">
              <div className="flex items-start gap-4 mb-4">
                <Zap className="w-8 h-8 text-blue-400 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-white text-lg">CO₂ Emissions Prevented</h3>
                  <p className="text-slate-400 text-sm">Waste processing emissions reduction</p>
                </div>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="text-3xl font-black text-blue-400">156K Tons</div>
                  <p className="text-slate-400 text-sm">CO₂ prevented from atmosphere</p>
                  <p className="text-xs text-slate-500 mt-3">📈 Equivalent to removing 34K cars for a year</p>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/40">
              <div className="flex items-start gap-4 mb-4">
                <BarChart3 className="w-8 h-8 text-purple-400 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-white text-lg">Processing Efficiency Record</h3>
                  <p className="text-slate-400 text-sm">Waste conversion to resources</p>
                </div>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="text-3xl font-black text-purple-400">85% Processed</div>
                  <p className="text-slate-400 text-sm">Successfully converted to new materials</p>
                  <p className="text-xs text-slate-500 mt-3">🎯 Industry average: 62% | We exceed by 23%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Waste Collected', value: '8,340 tons', icon: Droplets },
          { label: 'Active Projects', value: '47', icon: Globe },
          { label: 'Countries Covered', value: '64', icon: Award },
          { label: 'Carbon Impact', value: '312K tons', icon: Zap }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="card text-center">
              <Icon className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-emerald-400">{stat.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}