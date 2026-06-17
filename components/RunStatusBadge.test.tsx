import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import RunStatusBadge from '@/components/RunStatusBadge'

describe('RunStatusBadge', () => {
  it('renders success status', () => {
    render(<RunStatusBadge status="success" />)
    expect(screen.getByText('success')).toBeInTheDocument()
  })

  it('renders failed status', () => {
    render(<RunStatusBadge status="failed" />)
    expect(screen.getByText('failed')).toBeInTheDocument()
  })

  it('renders running status', () => {
    render(<RunStatusBadge status="running" />)
    expect(screen.getByText('running')).toBeInTheDocument()
  })

  it('renders unknown status with fallback styling', () => {
    render(<RunStatusBadge status="unknown" />)
    expect(screen.getByText('unknown')).toBeInTheDocument()
  })
})
