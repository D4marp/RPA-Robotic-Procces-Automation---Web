'use client'

import { useEffect, useState } from 'react'
import { api, Run } from '@/lib/api'
import RunStatusBadge from '@/components/RunStatusBadge'

export default function LogsPage() {
  const [runs, setRuns] = useState<Run[]>([])
  const [selected, setSelected] = useState<Run | null>(null)

  useEffect(() => {
    const load = () => api.listRuns().then(setRuns)
    load()
    const t = setInterval(load, 3000)
    return () => clearInterval(t)
  }, [])

  const handleSelect = (r: Run) => api.getRun(r.id).then(setSelected)

  return (
    <div className="flex gap-4 h-full">
      <div className="w-80 space-y-2 overflow-y-auto">
        <h1 className="text-xl font-bold mb-3">Logs Run</h1>
        {runs.map(r => (
          <button
            key={r.id}
            onClick={() => handleSelect(r)}
            className={`w-full text-left bg-gray-900 border rounded-lg px-3 py-2 text-sm hover:border-indigo-600 transition-colors ${
              selected?.id === r.id ? 'border-indigo-500' : 'border-gray-800'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium truncate">{r.job?.name ?? `#${r.job_id}`}</span>
              <RunStatusBadge status={r.status} />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {new Date(r.created_at).toLocaleString('id-ID')}
            </div>
          </button>
        ))}
      </div>
      <div className="flex-1 bg-gray-900 rounded-xl border border-gray-800 p-4 overflow-auto">
        {selected ? (
          <>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-semibold">{selected.job?.name}</span>
              <RunStatusBadge status={selected.status} />
            </div>
            <pre className="text-xs font-mono text-green-400 whitespace-pre-wrap break-words">
              {selected.logs || '(tidak ada output)'}
            </pre>
          </>
        ) : (
          <div className="text-gray-600 text-sm mt-4">Pilih run untuk melihat log</div>
        )}
      </div>
    </div>
  )
}
