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
    await api.createJob(form)
    setShowForm(false)
    setForm({ name: '', script: '', schedule: '', enabled: true })
    load()
  }

  const handleDelete = async (id: number) => {
    await api.deleteJob(id)
    load()
  }

  const handleRun = async (id: number) => {
    await api.triggerRun(id)
    alert('Job dipicu!')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Jobs</h1>
        <button
          onClick={() => setShowForm(v => !v)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          + Tambah Job
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 mb-6 space-y-3">
          <input
            placeholder="Nama job"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm"
          />
          <textarea
            placeholder="Script / perintah shell"
            value={form.script}
            onChange={e => setForm({ ...form, script: e.target.value })}
            className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm h-20 font-mono"
          />
          <input
            placeholder="Cron schedule (kosong = manual)"
            value={form.schedule}
            onChange={e => setForm({ ...form, schedule: e.target.value })}
            className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm"
          />
          <button
            onClick={handleCreate}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Simpan
          </button>
        </div>
      )}

      <div className="space-y-3">
        {jobs.map(j => (
          <div
            key={j.id}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4"
          >
            <div className="flex-1">
              <Link href={`/jobs/${j.id}`} className="font-semibold hover:text-indigo-400">
                {j.name}
              </Link>
              <div className="text-xs text-gray-500 font-mono mt-1">{j.script}</div>
              {j.schedule && <div className="text-xs text-gray-400 mt-1">⏰ {j.schedule}</div>}
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                j.enabled ? 'bg-green-900 text-green-300' : 'bg-gray-800 text-gray-500'
              }`}
            >
              {j.enabled ? 'Aktif' : 'Nonaktif'}
            </span>
            <button
              onClick={() => handleRun(j.id)}
              className="text-xs bg-blue-700 hover:bg-blue-600 px-3 py-1 rounded-lg"
            >
              ▶ Run
            </button>
            <button
              onClick={() => handleDelete(j.id)}
              className="text-xs bg-red-900 hover:bg-red-800 px-3 py-1 rounded-lg"
            >
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
