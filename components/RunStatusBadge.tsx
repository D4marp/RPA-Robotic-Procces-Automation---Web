const colors = {
  pending: 'bg-yellow-900 text-yellow-300',
  running: 'bg-blue-900 text-blue-300 animate-pulse',
  success: 'bg-green-900 text-green-300',
  failed: 'bg-red-900 text-red-300',
}

export default function RunStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
        colors[status as keyof typeof colors] || 'bg-gray-800 text-gray-400'
      }`}
    >
      {status}
    </span>
  )
}
