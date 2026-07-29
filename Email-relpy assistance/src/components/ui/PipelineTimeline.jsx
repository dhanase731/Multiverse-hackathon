const NODES = [
  { icon: 'mail',       label: 'Received' },
  { icon: 'psychology', label: 'Analyzed' },
  { icon: 'edit_note',  label: 'Generated' },
  { icon: 'send',       label: 'Sent' },
]

export default function PipelineTimeline({ nodes, activeIndex = -1, failedIndex = -1 }) {
  const items = nodes ?? NODES

  return (
    <div className="flex items-center w-full max-w-3xl mx-auto px-lg">
      {items.map((node, i) => {
        const done = failedIndex === -1 ? (activeIndex === -1 ? true : i < activeIndex) : i < failedIndex
        const active = i === activeIndex
        const failed = i === failedIndex
        const faded = failedIndex !== -1 && i > failedIndex
        const isLast = i === items.length - 1

        return (
          <div key={i} className={`flex items-center ${isLast ? '' : 'flex-1'}`}>
            <div className={`flex flex-col items-center gap-sm relative z-10 ${faded ? 'opacity-20' : ''}`}>
              <div className={`flex items-center justify-center rounded-full ${
                active ? 'w-10 h-10 shadow-md animate-pulse' : 'w-8 h-8'
              } ${
                failed  ? 'bg-error text-on-error' :
                done    ? 'bg-secondary text-on-secondary' :
                active  ? 'bg-primary text-on-primary' :
                faded   ? 'border-2 border-dashed border-outline text-on-surface-variant' :
                'bg-surface-container-highest text-on-surface-variant'
              }`}>
                <span className="material-symbols-outlined text-[18px]">{node.icon}</span>
              </div>
              {node.label && (
                <span className={`text-label-md absolute -bottom-6 whitespace-nowrap ${failed ? 'text-error' : 'text-on-surface-variant'}`}>
                  {failed ? (node.errorLabel ?? node.label) : node.label}
                </span>
              )}
            </div>
            {!isLast && (
              <div className={`flex-1 h-0.5 mx-xs ${
                failed && i >= failedIndex ? 'bg-outline-variant opacity-30' :
                done ? 'bg-secondary' : 'bg-outline-variant'
              }`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
