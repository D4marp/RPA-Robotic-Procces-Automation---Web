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
    <div className="flex flex-col md:flex-row gap-4 h-full min-h-[calc(100vh-100px)] md:min-h-0">
      <div className="w-full md:w-80 space-y-2 overflow-y-auto max-h-[320px] md:max-h-none border-b md:border-b-0 pb-4 md:pb-0 border-gray-800">
        <h1 className="text-xl font-bold mb-3 sticky top-0 bg-gray-950 py-1">Logs Run</h1>
        {runs.map(r => (
          <button
            key={r.id}
            onClick={() => handleSelect(r)}
            className={`w-full text-left bg-gray-900 border rounded-lg px-3 py-2 text-sm hover:border-indigo-600 transition-colors ${
              selected?.id === r.id ? 'border-indigo-500' : 'border-gray-800'
            }`}
          >
            <div className="flex justify-between items-center gap-2">
              <span className="font-medium truncate">{r.job?.name ?? `#${r.job_id}`}</span>
              <RunStatusBadge status={r.status} />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {new Date(r.created_at).toLocaleString('id-ID')}
            </div>
          </button>
        ))}
      </div>
      <div className="flex-1 bg-gray-900 rounded-xl border border-gray-800 p-4 overflow-auto min-h-[300px] md:min-h-0">
        {selected ? (
          <>
            <div className="flex items-center gap-3 mb-3 border-b border-gray-800 pb-2">
              <span className="font-semibold text-base">{selected.job?.name}</span>
              <RunStatusBadge status={selected.status} />
            </div>
            <pre className="text-xs font-mono text-green-400 whitespace-pre-wrap break-words bg-gray-950 p-3 rounded-lg border border-gray-850">
              {selected.logs || '(tidak ada output)'}
            </pre>
          </>
        ) : (
          <div className="text-gray-550 text-sm mt-4 text-center md:text-left">Pilih run untuk melihat log</div>
        )}
      </div>
    </div>
  )
}
