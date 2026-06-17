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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {stats &&
          [
            { label: 'Total Jobs', val: stats.total_jobs },
            { label: 'Aktif', val: stats.enabled_jobs },
            { label: 'Run Hari Ini', val: stats.runs_today },
            { label: 'Sukses', val: stats.success_today },
            { label: 'Gagal', val: stats.failed_today },
          ].map(s => (
            <div key={s.label} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="text-3xl font-bold text-white">{s.val}</div>
              <div className="text-sm text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
      </div>

      <h2 className="text-lg font-semibold mb-3 text-gray-300">Run Terbaru</h2>
      <div className="space-y-2">
        {runs.map(r => (
          <div
            key={r.id}
            className="bg-gray-900 rounded-lg px-4 py-3 flex items-center justify-between border border-gray-800"
          >
            <div>
              <span className="font-medium">{r.job?.name ?? `Job #${r.job_id}`}</span>
              <span className="ml-3 text-xs text-gray-500">
                {new Date(r.created_at).toLocaleString('id-ID')}
              </span>
            </div>
            <RunStatusBadge status={r.status} />
          </div>
        ))}
      </div>
    </div>
  )
}
