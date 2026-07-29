export default function ProgressBar({ value, variant = 'static', color = 'bg-primary' }) {
  if (variant === 'flow') {
    return (
      <div className="h-1 rounded-full overflow-hidden animate-progress-flow" />
    )
  }
  if (variant === 'shimmer') {
    return (
      <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-container-highest">
        <div className="ai-shimmer h-full" style={{ width: `${value ?? 45}%` }} />
      </div>
    )
  }
  if (variant === 'indeterminate') {
    return <div className="progress-indeterminate" />
  }
  return (
    <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-1000 ${color}`} style={{ width: `${value ?? 0}%` }} />
    </div>
  )
}
