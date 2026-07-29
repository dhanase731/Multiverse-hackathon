import Layout from '../components/Layout'

const drafts = [
  {
    id: 1, initials: 'JD', name: 'Jane Doe', subject: 'Project Partnership',
    preview: '"Hello Jane, thank you for reaching out about the Q4 collaboration. Our team has reviewed the proposal and we are excited to move forward. Let\'s schedule a deep dive..."',
    age: '5m ago', initialsColor: '#c55500',
  },
  {
    id: 2, initials: 'MS', name: 'Mark Smith', subject: 'Technical Support Inquiry',
    preview: '"Hi Mark, I\'m sorry to hear you\'re experiencing issues with the dashboard sync. We\'ve identified a cache latency in your region and are deploying a fix..."',
    age: '12m ago', initialsColor: '#43474c',
  },
  {
    id: 3, initials: 'AR', name: 'Alice Rogers', subject: 'Workshop Invitation',
    preview: '"Hi Alice, thank you so much for the invitation to speak at the Design Summit. I\'d be honored to join. Could you let me know the specific dates and expected audience?"',
    age: '1h ago', initialsColor: '#5b5f64',
  },
  {
    id: 4, initials: 'BC', name: 'Bob Chen', subject: 'Inquiry regarding Pricing',
    preview: '"Hi Bob, I can certainly provide more detail on our Enterprise tier pricing. Depending on your user count, we can offer a volume discount..."',
    age: '2h ago', initialsColor: '#adc7ff',
  },
]

export default function WorkspaceAIDrafts() {
  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-on-surface">AI Drafts Queue</h2>
          <p className="text-sm text-on-surface-variant mt-1">Review and approve your AI-generated replies before they go out.</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {drafts.map(draft => (
            <div
              key={draft.id}
              className="bg-white rounded-2xl p-6 border border-outline-variant flex flex-col hover:border-primary/50 hover:shadow-lg transition-all duration-300"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-lg"
                    style={{ background: draft.initialsColor }}
                  >
                    {draft.initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-on-surface">{draft.name}</h3>
                    <span className="text-xs font-semibold tracking-wider text-on-surface-variant">{draft.subject}</span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                  Pending Review
                </span>
              </div>

              {/* Preview */}
              <div className="bg-surface-container-low p-4 rounded-xl mb-4 flex-1">
                <p className="text-sm italic text-on-surface-variant line-clamp-4">
                  {draft.preview}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-auto pt-2">
                <span className="flex items-center gap-1 text-[11px] font-semibold tracking-wider text-on-surface-variant">
                  <span className="material-symbols-outlined text-[14px]">history</span>
                  Created {draft.age}
                </span>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg bg-transparent text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-all cursor-pointer border-none">
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                  <button className="p-2 rounded-lg bg-transparent text-on-surface-variant hover:text-primary hover:bg-primary-container/10 transition-all cursor-pointer border-none">
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                  <button className="px-4 py-2 rounded-full text-xs font-bold tracking-wider bg-primary text-on-primary hover:opacity-90 active:scale-95 transition-all cursor-pointer border-none">
                    Approve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Banner */}
        <div className="mt-6 relative h-64 rounded-2xl overflow-hidden border border-outline-variant flex items-center justify-center bg-white shadow-sm">
          <div className="relative z-10 text-center px-6">
            <span className="material-symbols-outlined text-[48px] text-primary block mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <h4 className="text-lg font-semibold text-on-surface">Stay focused on high-value tasks</h4>
            <p className="text-sm text-on-surface-variant mt-1">Our AI continues to draft responses in the background.</p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-6 py-4 flex flex-col items-center gap-2 border-t border-outline-variant bg-white">
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Contact Support'].map(link => (
              <a key={link} href="#" className="text-xs font-semibold tracking-wider text-on-surface-variant hover:text-primary transition-colors no-underline">
                {link}
              </a>
            ))}
          </div>
          <p className="text-xs font-semibold tracking-wider text-on-surface-variant">© 2024 Email Reply Assistance. Powered by Advanced AI.</p>
        </footer>
      </div>
    </Layout>
  )
}
