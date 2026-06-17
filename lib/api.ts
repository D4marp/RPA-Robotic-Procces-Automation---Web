const SERVER_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
const BASE = typeof window !== 'undefined' ? '' : SERVER_BASE

async function req<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export const api = {
  getStats: () => req<Stats>('/api/stats'),
  listJobs: () => req<Job[]>('/api/jobs'),
  getJob: (id: number) => req<Job>(`/api/jobs/${id}`),
  createJob: (b: Partial<Job>) =>
    req<Job>('/api/jobs', { method: 'POST', body: JSON.stringify(b) }),
  updateJob: (id: number, b: Partial<Job>) =>
    req<Job>(`/api/jobs/${id}`, { method: 'PUT', body: JSON.stringify(b) }),
  deleteJob: (id: number) =>
    req<void>(`/api/jobs/${id}`, { method: 'DELETE' }),
  triggerRun: (id: number) =>
    req<{ message: string }>(`/api/jobs/${id}/run`, { method: 'POST' }),
  listRuns: () => req<Run[]>('/api/runs'),
  getRun: (id: number) => req<Run>(`/api/runs/${id}`),
}

export interface Stats {
  total_jobs: number
  enabled_jobs: number
  runs_today: number
  success_today: number
  failed_today: number
}

export interface Job {
  id: number
  name: string
  script: string
  schedule: string
  enabled: boolean
  created_at: string
  updated_at: string
}

export interface Run {
  id: number
  job_id: number
  job?: Job
  status: 'pending' | 'running' | 'success' | 'failed'
  logs: string
  started_at: string
  finished_at: string
  created_at: string
}
