import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('api client', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  it('getStats calls correct endpoint', async () => {
    const mockStats = {
      total_jobs: 1,
      enabled_jobs: 1,
      runs_today: 0,
      success_today: 0,
      failed_today: 0,
    }
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockStats,
    } as Response)

    const { api } = await import('@/lib/api')
    const result = await api.getStats()

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/stats'),
      expect.objectContaining({ headers: { 'Content-Type': 'application/json' } })
    )
    expect(result).toEqual(mockStats)
  })

  it('throws on non-ok response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      text: async () => 'server error',
    } as Response)

    const { api } = await import('@/lib/api')
    await expect(api.listJobs()).rejects.toThrow('server error')
  })
})
