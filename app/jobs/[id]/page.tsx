'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api, Job, Run } from '@/lib/api'
import RunStatusBadge from '@/components/RunStatusBadge'

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)
  const [job, setJob] = useState<Job | null>(null)
  const [runs, setRuns] = useState<Run[]>([])
  const [form, setForm] = useState({ name: '', script: '', schedule: '', enabled: true })

  useEffect(() => {
    if (!id) return
    api.getJob(id).then(j => {
      setJob(j)
      setForm({ name: j.name, script: j.script, schedule: j.schedule, enabled: j.enabled })
    })
    api.listRuns().then(all => setRuns(all.filter(r => r.job_id === id)))
  }, [id])

  const handleSave = async () => {
    const updated = await api.updateJob(id, form)
    setJob(updated)
    alert('Konfigurasi robot berhasil diperbarui!')
  }

  const handleRun = async () => {
    await api.triggerRun(id)
    alert('Job RPA berhasil dipicu!')
  }

  if (!job) return <div className="text-gray-500 p-8 text-center">Memuat data robot...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white px-3 py-1.5 rounded-lg bg-gray-900/40 border border-gray-800/60 text-xs font-bold transition-all"
        >
          ← Kembali
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Robot: {job.name}</h1>
          <p className="text-gray-400 text-xs mt-0.5">Configuration & execution history log</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 border border-gray-800/60 space-y-4">
        <h3 className="text-base font-bold text-white border-b border-gray-900 pb-2">Edit Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Robot Name</label>
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full bg-gray-900/60 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cron Schedule</label>
            <input
              value={form.schedule}
              onChange={e => setForm({ ...form, schedule: e.target.value })}
              placeholder="e.g. */30 * * * * (empty = manual)"
              className="w-full bg-gray-900/60 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Shell Script</label>
          <textarea
            value={form.script}
            onChange={e => setForm({ ...form, script: e.target.value })}
            className="w-full bg-gray-900/60 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white h-24 font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        <div className="flex items-center justify-between border-t border-gray-900 pt-4">
          <label className="flex items-center gap-2.5 text-sm font-bold text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={form.enabled}
              onChange={e => setForm({ ...form, enabled: e.target.checked })}
              className="h-4 w-4 rounded border-gray-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-gray-950 bg-gray-900"
            />
            Enable Robot Schedule
          </label>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wide active:scale-98 transition-all"
            >
              ✓ Simpan
            </button>
            <button
              onClick={handleRun}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wide active:scale-98 transition-all"
            >
              ▶ Run Now
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-bold text-white tracking-tight">Execution History</h2>
        
        <div className="glass-card rounded-2xl overflow-hidden border border-gray-900">
          <div className="divide-y divide-gray-900/60">
            {runs.map(r => (
              <div
                key={r.id}
                className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-gray-900/20 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-6 w-6 rounded bg-gray-900/60 border border-gray-800 flex items-center justify-center text-xxs font-bold text-gray-500">
                    #
                  </div>
                  <span className="text-sm text-gray-300 font-semibold">
                    {new Date(r.created_at).toLocaleString('id-ID')}
                  </span>
                </div>
                <RunStatusBadge status={r.status} />
              </div>
            ))}
            {runs.length === 0 && (
              <div className="p-8 text-center text-gray-500 text-sm">Belum ada riwayat eksekusi untuk robot ini.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
