const colors = {
  pending: {
    border: 'border-yellow-500/20 bg-yellow-500/5 text-yellow-400 glow-indigo',
    dot: 'bg-yellow-400',
  },
  running: {
    border: 'border-blue-500/30 bg-blue-500/10 text-blue-400 pulse-glow glow-blue',
    dot: 'bg-blue-400',
  },
  success: {
    border: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400 glow-green',
    dot: 'bg-emerald-400',
  },
  failed: {
    border: 'border-red-500/20 bg-red-500/5 text-red-400 glow-red',
    dot: 'bg-red-400',
  },
}

export default function RunStatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase()
  const cfg = colors[s as keyof typeof colors] || {
    border: 'border-gray-700 bg-gray-800/20 text-gray-400',
    dot: 'bg-gray-400',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full font-semibold border ${cfg.border}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      <span>{status}</span>
    </span>
  )
}
