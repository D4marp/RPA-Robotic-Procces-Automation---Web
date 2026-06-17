'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { api, Job, Run } from '@/lib/api'
import RunStatusBadge from '@/components/RunStatusBadge'

export default function JobDetailPage() {
  const params = useParams()
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
  }

  const handleRun = async () => {
    await api.triggerRun(id)
    alert('Job dipicu!')
  }

  if (!job) return <div className="text-gray-500">Memuat...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Detail Job: {job.name}</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6 space-y-3">
        <input
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm"
        />
        <textarea
          value={form.script}
          onChange={e => setForm({ ...form, script: e.target.value })}
          className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm h-24 font-mono"
        />
        <input
          value={form.schedule}
          onChange={e => setForm({ ...form, schedule: e.target.value })}
          placeholder="Cron schedule"
          className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.enabled}
            onChange={e => setForm({ ...form, enabled: e.target.checked })}
          />
          Aktif
        </label>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Simpan
          </button>
          <button
            onClick={handleRun}
            className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            ▶ Run Now
          </button>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-3 text-gray-300">Riwayat Run</h2>
      <div className="space-y-2">
        {runs.map(r => (
          <div
            key={r.id}
            className="bg-gray-900 rounded-lg px-4 py-3 flex items-center justify-between border border-gray-800"
          >
            <span className="text-sm text-gray-400">
              {new Date(r.created_at).toLocaleString('id-ID')}
            </span>
            <RunStatusBadge status={r.status} />
          </div>
        ))}
        {runs.length === 0 && (
          <div className="text-gray-600 text-sm">Belum ada run untuk job ini.</div>
        )}
      </div>
    </div>
  )
}
