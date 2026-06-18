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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Execution Logs</h1>
        <p className="text-gray-400 text-sm mt-1">Monitor real-time outputs of automated task runners</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 h-full min-h-[calc(100vh-180px)] md:min-h-0">
        {/* Left Side: Runs List */}
        <div className="w-full md:w-80 space-y-2.5 overflow-y-auto max-h-[320px] md:max-h-[600px] border-b md:border-b-0 pb-4 md:pb-0 border-gray-900">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">Runs list</div>
          {runs.map(r => {
            const active = selected?.id === r.id
            return (
              <button
                key={r.id}
                onClick={() => handleSelect(r)}
                className={`w-full text-left bg-gray-950/40 backdrop-blur-sm border rounded-xl px-4 py-3 text-sm hover:border-indigo-500/40 transition-all ${
                  active ? 'border-indigo-500 shadow-md shadow-indigo-900/10' : 'border-gray-900'
                }`}
              >
                <div className="flex justify-between items-center gap-2">
                  <span className={`font-semibold truncate ${active ? 'text-white' : 'text-gray-300'}`}>
                    {r.job?.name ?? `Job #${r.job_id}`}
                  </span>
                  <RunStatusBadge status={r.status} />
                </div>
                <div className="text-xxs text-gray-500 mt-1.5 flex justify-between">
                  <span>ID: {r.id}</span>
                  <span>{new Date(r.created_at).toLocaleString('id-ID')}</span>
                </div>
              </button>
            )
          })}
          {runs.length === 0 && (
            <div className="text-gray-600 text-sm text-center py-8">Belum ada data eksekusi.</div>
          )}
        </div>

        {/* Right Side: Log Console Panel */}
        <div className="flex-1 flex flex-col min-h-[350px] md:min-h-0">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">Console output</div>
          
          <div className="flex-1 bg-black/60 backdrop-blur-md rounded-2xl border border-gray-900/80 p-5 overflow-auto flex flex-col font-mono">
            {selected ? (
              <div className="space-y-4 h-full flex flex-col">
                <div className="flex items-center gap-3 border-b border-gray-900 pb-3">
                  <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="font-semibold text-sm text-gray-300">{selected.job?.name}</span>
                  <RunStatusBadge status={selected.status} />
                </div>
                
                <pre className="flex-1 text-xs text-green-400 whitespace-pre-wrap break-words bg-black/40 p-4 rounded-xl border border-gray-950 font-mono leading-relaxed overflow-y-auto min-h-[220px]">
                  <span className="text-gray-600 select-none mr-2">$ cat /var/log/rpa/run-{selected.id}.log</span>
                  {"\n"}
                  {selected.logs || '(tidak ada output / log kosong)'}
                </pre>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-600 text-sm py-12">
                <div className="text-3xl mb-2">📟</div>
                <div>Pilih salah satu log eksekusi di sebelah kiri</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
