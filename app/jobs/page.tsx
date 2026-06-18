'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api, Job } from '@/lib/api'

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [form, setForm] = useState({ name: '', script: '', schedule: '', enabled: true })
  const [showForm, setShowForm] = useState(false)

  const load = () => api.listJobs().then(setJobs)
  useEffect(() => {
    load()
  }, [])

  const handleCreate = async () => {
    if (!form.name || !form.script) {
      alert('Nama dan Script wajib diisi!')
      return
    }
    await api.createJob(form)
    setShowForm(false)
    setForm({ name: '', script: '', schedule: '', enabled: true })
    load()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus robot ini?')) return
    await api.deleteJob(id)
    load()
  }

  const handleRun = async (id: number) => {
    await api.triggerRun(id)
    alert('Job RPA berhasil dipicu!')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Robots (Jobs)</h1>
          <p className="text-gray-400 text-sm mt-1">Configure and manage automated shell runners</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wide shadow-md shadow-indigo-500/20 active:scale-98 transition-all"
        >
          {showForm ? '✕ Tutup Form' : '＋ Add Robot'}
        </button>
      </div>

      {showForm && (
        <div className="glass-card rounded-2xl p-6 border border-gray-800/60 space-y-4 glow-indigo">
          <h3 className="text-lg font-bold text-white">Create New Robot Job</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Robot Name</label>
              <input
                placeholder="e.g. Database Auto Backup"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-gray-900/60 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cron Schedule (Optional)</label>
              <input
                placeholder="e.g. */30 * * * * (empty = manual)"
                value={form.schedule}
                onChange={e => setForm({ ...form, schedule: e.target.value })}
                className="w-full bg-gray-900/60 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Execution Shell Script</label>
            <textarea
              placeholder="e.g. echo 'Run automated task...' && sleep 2 && exit 0"
              value={form.script}
              onChange={e => setForm({ ...form, script: e.target.value })}
              className="w-full bg-gray-900/60 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white h-28 font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div className="flex justify-end pt-2">
            <button
              onClick={handleCreate}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide shadow-md shadow-emerald-600/25 active:scale-98 transition-all"
            >
              ✓ Save Robot
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {jobs.map(j => (
          <div
            key={j.id}
            className="glass-card glass-card-hover rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gray-800/40 relative overflow-hidden"
          >
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2.5">
                <Link href={`/jobs/${j.id}`} className="font-bold text-white hover:text-indigo-400 text-base tracking-wide transition-colors break-words">
                  {j.name}
                </Link>
                {j.schedule && (
                  <span className="inline-flex items-center text-xxs font-bold px-2 py-0.5 rounded bg-gray-850 text-indigo-400 border border-gray-800/60 uppercase tracking-wide">
                    ⏱ {j.schedule}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500 font-mono bg-black/20 px-3 py-2 rounded-lg border border-gray-900 overflow-x-auto truncate" title={j.script}>
                {j.script}
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-900">
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                  j.enabled
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-gray-800/40 text-gray-500 border-gray-800'
                }`}
              >
                {j.enabled ? 'Active' : 'Disabled'}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRun(j.id)}
                  className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-xl font-bold tracking-wide transition-all active:scale-95 shadow-md shadow-indigo-650/15"
                >
                  ▶ Run
                </button>
                <button
                  onClick={() => handleDelete(j.id)}
                  className="text-xs bg-red-950/60 hover:bg-red-900/60 border border-red-900/20 text-red-400 px-3 py-2 rounded-xl font-bold tracking-wide transition-all active:scale-95"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {jobs.length === 0 && (
          <div className="glass-card rounded-2xl p-10 text-center text-gray-500 border border-gray-800/40">
            No robots found. Add a robot above to get started.
          </div>
        )}
      </div>
    </div>
  )
}
