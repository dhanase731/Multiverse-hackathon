export default function StatusBadge({ status }) {
  const map = {
    delivered:   'bg-secondary-container text-on-secondary-container',
    processing:  'bg-primary-container text-on-primary-container',
    failed:      'bg-error-container text-on-error-container',
    queued:      'bg-surface-container-highest text-on-surface-variant',
    waiting:     'bg-[#987000] text-white',
    replied:     'bg-secondary-container text-on-secondary-container',
    drafting:    'bg-primary-container text-on-primary-container',
  }
  const icons = {
    delivered: 'check_circle',
    processing: 'sync',
    failed: 'error',
    queued: null,
    waiting: null,
    replied: null,
    drafting: 'sync',
  }
  const labels = {
    delivered: 'Delivered',
    processing: 'AI Drafting...',
    failed: 'Retry Failed',
    queued: 'QUEUED',
    waiting: 'WAITING',
    replied: 'REPLIED',
    drafting: 'AI Drafting...',
  }
  const cls = map[status] ?? 'bg-surface-container text-on-surface-variant'
  const icon = icons[status]
  const label = labels[status] ?? status

  return (
    <span className={`px-sm py-xs rounded-full text-label-md flex items-center gap-xs font-bold ${cls}`}>
      {icon && (
        <span className={`material-symbols-outlined text-[14px] ${status === 'processing' || status === 'drafting' ? 'status-pulse' : ''}`}>
          {icon}
        </span>
      )}
      {label}
    </span>
  )
}
