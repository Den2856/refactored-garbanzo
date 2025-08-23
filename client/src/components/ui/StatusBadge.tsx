export interface StatusBadgeProps {
  available: boolean
}

export default function StatusBadge({ available }: StatusBadgeProps) {
  if (available) {
    return (
      <span className="relative top-4 left-4 inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
        <span className="w-2 h-2 mr-2 bg-green-600 rounded-full" />
        Available now
      </span>
    )
  }
  if (!available) {
    return (
      <span className="relative top-4 left-4 inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
        <span className="w-2 h-2 mr-2 bg-yellow-600 rounded-full" />
        Coming soon
      </span>
    )
  }
  return null
}
