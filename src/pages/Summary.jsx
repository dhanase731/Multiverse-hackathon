import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { UserCircle, CalendarDays, Clock, Download, Copy, Plus, CheckCircle } from 'lucide-react'
import styles from './Summary.module.css'

export default function Summary() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const meetingId = searchParams.get('id') || location.state?.meeting?.meetingId

  const [meeting, setMeeting] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const getMeetingDetails = async () => {
      if (!meetingId) {
        setLoading(false)
        return
      }
      try {
        const res = await fetch(`http://localhost:5000/api/meetings/${meetingId}`)
        if (res.ok) {
          const data = await res.json()
          setMeeting(data)
        }
      } catch (err) {
        console.error("Failed to load meeting summary:", err)
      } finally {
        setLoading(false)
      }
    }
    getMeetingDetails()
  }, [meetingId])

  const handleCopy = () => {
    if (!meeting) return
    const text = `
Meeting Title: ${meeting.meetingTitle}
Summary: ${meeting.summary}
Key Points:
${(meeting.keyPoints || meeting.bulletPoints || []).map(p => `- ${p}`).join('\n')}

Action Items:
${(meeting.actionItems || []).map(a => `- ${a.person || a.owner}: ${a.task}`).join('\n')}
    `.trim()
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadPDF = () => {
    window.print()
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', color: 'var(--on-surface-variant)' }}>
        Loading Summary...
      </div>
    )
  }

  if (!meeting) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', gap: 16 }}>
        <p style={{ color: 'var(--on-surface-variant)' }}>No meeting session found.</p>
        <button className={styles.btnSecondary} onClick={() => navigate('/')} style={{ background: 'var(--primary)', color: 'white' }}>
          Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.logo} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Meeting Notes AI</h1>
          <div className={styles.headerRight}>
            <nav className={styles.nav}>
              <a href="#summary" className={styles.navActive}>Summary</a>
              <a href="#actions" className={styles.navLink}>Action Items</a>
            </nav>
            <UserCircle size={32} color="var(--primary)" style={{ cursor: 'pointer' }} />
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {/* Page heading */}
        <div className={styles.pageHead}>
          <h2 className={styles.pageTitle}>{meeting.meetingTitle}</h2>
          <div className={styles.pageMeta}>
            <span className={styles.metaTag}>Product Sync</span>
            <span className={styles.metaItem}><CalendarDays size={16} /> {new Date(meeting.timestamp).toLocaleDateString()}</span>
            <span className={styles.metaItem}><Clock size={16} /> {meeting.status === 'LIVE' ? 'Live' : 'Completed'}</span>
          </div>
        </div>

        <div className={styles.cards}>
          {/* Summary Card */}
          <section id="summary" className={styles.card}>
            <div className={styles.cardHeader}>
              <span style={{ fontSize: 24, color: 'var(--primary)' }}>📄</span>
              <h3 className={styles.cardTitle}>Summary & Notes</h3>
            </div>
            <div className={styles.summaryBody}>
              <p className={styles.summaryIntro}>{meeting.summary}</p>
              
              <h4 style={{ fontSize: 16, marginTop: 20, marginBottom: 8, color: 'var(--on-surface)' }}>Key Points</h4>
              <ul className={styles.bulletList}>
                {(meeting.keyPoints && meeting.keyPoints.length > 0 ? meeting.keyPoints : meeting.bulletPoints || []).map((pt, i) => (
                  <li key={i} className={styles.bulletItem}>
                    <span className={styles.bullet} />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>

              {meeting.decisions && meeting.decisions.length > 0 && (
                <>
                  <h4 style={{ fontSize: 16, marginTop: 20, marginBottom: 8, color: 'var(--secondary)' }}>Decisions Made</h4>
                  <ul className={styles.bulletList}>
                    {meeting.decisions.map((dec, i) => (
                      <li key={i} className={styles.bulletItem}>
                        <span className={styles.bullet} style={{ backgroundColor: 'var(--secondary)' }} />
                        <span>{dec}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </section>

          {/* Action Items Card */}
          <section id="actions" className={styles.card}>
            <div className={styles.cardHeader}>
              <span style={{ fontSize: 24, color: 'var(--primary)' }}>✅</span>
              <h3 className={styles.cardTitle}>Action Items</h3>
            </div>
            <div className={styles.actionGrid}>
              {(!meeting.actionItems || meeting.actionItems.length === 0) ? (
                <p style={{ color: 'var(--outline)', padding: 16 }}>No action items identified during this meeting sync.</p>
              ) : (
                meeting.actionItems.map((item, idx) => {
                  const person = item.person || item.owner || "Team"
                  const initial = person.split(' ').map(n => n[0]).join('')
                  return (
                    <div
                      key={idx}
                      className={styles.actionRow}
                    >
                      <div className={styles.actionLeft}>
                        <div className={styles.ownerInitial}>
                          {initial}
                        </div>
                        <div>
                          <p className={styles.ownerName}>{person}</p>
                          <p className={styles.taskText}>{item.task}</p>
                          {item.priority && (
                            <span style={{ fontSize: 10, background: '#fee2e2', color: 'var(--error)', padding: '2px 6px', borderRadius: 4, fontWeight: 700, textTransform: 'uppercase', marginTop: 4, display: 'inline-block' }}>
                              {item.priority}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </section>
        </div>

        {/* Actions Footer */}
        <div className={styles.footer}>
          <div className={styles.footerInner}>
            <button className={styles.btnPrimary} onClick={handleDownloadPDF}>
              <Download size={18} /> Download PDF
            </button>
            <button className={styles.btnSecondary} onClick={handleCopy}>
              <Copy size={18} /> {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
            <button className={styles.btnSecondary} onClick={() => navigate('/')}>
              <Plus size={18} /> New Meeting
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
