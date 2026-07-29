import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserCircle, Plus, FileText, CheckSquare, ChevronRight, RefreshCw } from 'lucide-react'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const navigate = useNavigate()
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchMeetings = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/meetings')
      if (res.ok) {
        const data = await res.json()
        setMeetings(data)
      }
    } catch (err) {
      console.error("Failed to fetch meetings:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMeetings()
  }, [])

  const startMeeting = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/meetings/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetingId: `meet_${Date.now()}`,
          meetingTitle: "Sprint Planning Sync",
          userId: "123"
        })
      })
      if (res.ok) {
        const data = await res.json()
        navigate('/session', { state: { meeting: data.meeting } })
      }
    } catch (err) {
      console.error("Failed to start meeting:", err)
      // Local fallback in case server isn't running
      navigate('/session', { 
        state: { 
          meeting: {
            meetingId: `meet_mock_${Date.now()}`,
            meetingTitle: "Sprint Planning Sync (Offline Mock)",
            userId: "123"
          } 
        } 
      })
    }
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.logo} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Meeting Notes AI</h1>
          <UserCircle size={32} color="var(--primary)" style={{ cursor: 'pointer' }} />
        </div>
      </header>

      <main className={styles.main}>
        {/* Welcome */}
        <section className={styles.welcome}>
          <h2 className={styles.greeting}>Good Morning</h2>
          <p className={styles.subtitle}>Ready to capture your next big idea?</p>
        </section>


        {/* Primary Action */}
        <section className={styles.actionSection} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className={styles.pulseWrapper}>
            <div className={styles.pulseRing} />
            <button className={styles.startBtn} onClick={startMeeting}>
              <Plus size={28} strokeWidth={2.5} />
              Start Meeting
            </button>
          </div>

          {/* Google Meet 1-Click Bridge Widget */}
          <div style={{
            background: 'var(--surface-container-low)',
            borderRadius: 'var(--border-radius)',
            padding: '24px',
            border: '1px solid var(--outline-variant)',
            boxShadow: 'var(--shadow-soft)',
            textAlign: 'left',
            marginTop: '10px'
          }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, color: 'var(--primary)', marginBottom: 8 }}>
              <span>🎙️</span> Google Meet Real-Time Bridge
            </h3>
            <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', marginBottom: 16 }}>
              Connect live meetings directly. Streaming real-time captions to your notes.
            </p>

            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <button 
                onClick={() => {
                  const targetMeetingId = `meet_${Date.now()}`;
                  // Create meeting in backend
                  fetch('http://localhost:5000/api/meetings/start', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      meetingId: targetMeetingId,
                      meetingTitle: "Google Meet Live Session",
                      userId: "123"
                    })
                  }).then(() => {
                    window.open('https://meet.new', '_blank');
                    // Redirect React to the session view
                    navigate('/session', { 
                      state: { 
                        meeting: { meetingId: targetMeetingId, meetingTitle: "Google Meet Live Session" } 
                      } 
                    });
                  });
                }}
                style={{
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                1. Launch Google Meet
              </button>

              <button 
                onClick={() => {
                  const bookmarkletCode = `javascript:(function(){const meetingId = prompt("Enter active meetingId from your dashboard:","meet_sync");if(!meetingId)return;const buttons = Array.from(document.querySelectorAll("button"));const ccButton = buttons.find(btn => {const label = (btn.getAttribute("aria-label") || "").toLowerCase();const text = (btn.innerText || "").toLowerCase();return label.includes("caption") || label.includes("cc") || text.includes("cc") || text.includes("caption");});if (ccButton && ccButton.getAttribute("aria-pressed") !== "true") {ccButton.click();console.log("Captions activated");}alert("Bridge connected to session: " + meetingId);const processed = new Set();const obs = new MutationObserver(() => {document.querySelectorAll(".iTTPOb").forEach(block => {const speakerEl = block.querySelector(".gV33Ad, [data-sender-name]");const textEl = block.querySelector(".zs7s8d, .VbkSUe");if (textEl) {const text = textEl.innerText.trim();const speakerName = speakerEl ? speakerEl.innerText.trim() : "Speaker";if (text && !processed.has(text)) {processed.add(text);fetch("http://localhost:5000/api/meetings/chunk", {method: "POST",headers: { "Content-Type": "application/json" },body: JSON.stringify({ meetingId, chunkText: speakerName + ":\\n" + text })}).catch(console.error);}}});});obs.observe(document.body, { childList: true, subtree: true });})();`;
                  navigator.clipboard.writeText(bookmarkletCode);
                  alert("Bookmarklet script copied to clipboard!\n\nInstructions:\n1. Create a bookmark in your browser.\n2. Edit the bookmark and paste this script in the URL field.\n3. Click it while inside Google Meet to stream transcripts!");
                }}
                style={{
                  background: 'white',
                  color: 'var(--on-surface)',
                  border: '1px solid var(--outline-variant)',
                  padding: '10px 16px',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer'
                }}
              >
                2. Copy 1-Click Script
              </button>
            </div>
            
            <div style={{ background: 'white', padding: '10px 14px', borderRadius: 8, fontSize: 12, border: '1px dashed var(--outline-variant)', color: 'var(--on-surface-variant)' }}>
              <strong>Demo steps:</strong> Launch Google Meet, activate live closed-captions, click your saved Bookmarklet script, enter the dashboard meeting ID, and watch notes pop up instantly on the right.
            </div>
          </div>
        </section>


        {/* Recent Meetings */}
        <section className={styles.recentSection}>
          <div className={styles.recentHeader}>
            <h3 className={styles.recentTitle}>Recent Meetings</h3>
            <button className={styles.viewAll} onClick={fetchMeetings}>
              <RefreshCw size={14} style={{ marginRight: 4 }} />
              Refresh
            </button>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--on-surface-variant)' }}>Loading meetings...</div>
          ) : meetings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--on-surface-variant)' }}>No recent meetings found.</div>
          ) : (
            <div className={styles.meetingList}>
              {meetings.map((meeting) => {
                const isLive = meeting.status === 'LIVE'
                const Icon = isLive ? CheckSquare : FileText
                return (
                  <div 
                    key={meeting.meetingId} 
                    className={styles.meetingCard} 
                    onClick={() => navigate(isLive ? '/session' : `/summary?id=${meeting.meetingId}`, { state: { meeting } })}
                  >
                    <div className={styles.meetingLeft}>
                      <div className={styles.meetingIcon}>
                        <Icon size={20} color={isLive ? "var(--secondary)" : "var(--primary)"} />
                      </div>
                      <div>
                        <h4 className={styles.meetingTitle}>{meeting.meetingTitle}</h4>
                        <div className={styles.meetingMeta}>
                          <span>{new Date(meeting.timestamp).toLocaleDateString()}</span>
                          <span className={styles.dot} />
                          <span>{isLive ? 'LIVE' : 'Completed'}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={20} color="var(--outline)" />
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </main>

      {/* Floating decor */}
      <div className={styles.decorTop} />
      <div className={styles.decorBottom} />
    </div>
  )
}

