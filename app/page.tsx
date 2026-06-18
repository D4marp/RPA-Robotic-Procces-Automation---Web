'use client'

import { useEffect, useState } from 'react'
import { api, Stats, Run } from '@/lib/api'
import RunStatusBadge from '@/components/RunStatusBadge'

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [runs, setRuns] = useState<Run[]>([])

  useEffect(() => {
    api.getStats().then(setStats)
    api.listRuns().then(r => setRuns(r.slice(0, 10)))
    const t = setInterval(() => api.listRuns().then(r => setRuns(r.slice(0, 10))), 5000)
    return () => clearInterval(t)
  }, [])

  const statItems = stats
    ? [
        { label: 'Total Robots', val: stats.total_jobs, color: 'from-blue-500 to-indigo-500', icon: '🤖' },
        { label: 'Active Tasks', val: stats.enabled_jobs, color: 'from-emerald-500 to-teal-500', icon: '⚡' },
        { label: 'Runs Today', val: stats.runs_today, color: 'from-violet-500 to-purple-500', icon: '🔄' },
        { label: 'Successful Runs', val: stats.success_today, color: 'from-green-500 to-emerald-500', icon: '✅' },
        { label: 'Failed Runs', val: stats.failed_today, color: 'from-red-500 to-rose-500', icon: '❌' },
      ]
    : []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-400 text-sm mt-1">Real-time Robotic Process Automation task metrics</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statItems.map(s => (
          <div key={s.label} className="glass-card glass-card-hover rounded-2xl p-5 relative overflow-hidden group">
            {/* Background glowing circle */}
            <div className={`absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-gradient-to-br ${s.color} opacity-10 group-hover:scale-150 transition-transform duration-500`} />
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{s.icon}</span>
              <span className={`text-xxs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gradient-to-r ${s.color} bg-opacity-20 text-white`}>Live</span>
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight">{s.val}</div>
            <div className="text-xs font-semibold text-gray-400 mt-1.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">Recent Executions</h2>
          <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">Auto-refreshing</span>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden border border-gray-900">
          <div className="divide-y divide-gray-900/60">
            {runs.map(r => (
              <div
                key={r.id}
                className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-900/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gray-900/60 border border-gray-800 flex items-center justify-center text-sm font-bold text-gray-300">
                    #
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm text-gray-200">{r.job?.name ?? `Job #${r.job_id}`}</span>
                    <span className="text-xxs text-gray-500 mt-0.5">ID: {r.id}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="text-xs text-gray-400 font-medium">
                    {new Date(r.created_at).toLocaleString('id-ID')}
                  </span>
                  <RunStatusBadge status={r.status} />
                </div>
              </div>
            ))}
            {runs.length === 0 && (
              <div className="p-8 text-center text-gray-500 text-sm">No recent job executions recorded.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
