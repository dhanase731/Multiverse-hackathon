import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Timer, StopCircle, UserCircle, Mic, MicOff, RefreshCw, Send } from 'lucide-react'
import styles from './LiveSession.module.css'

export default function LiveSession() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Retrieve the meeting session info or create a default one
  const meeting = location.state?.meeting || {
    meetingId: `meet_${Date.now()}`,
    meetingTitle: "Google Meet Live Session",
    userId: "123"
  }

  // State
  const [seconds, setSeconds] = useState(0)
  const [activeTab, setActiveTab] = useState('summary')
  const [transcript, setTranscript] = useState([])
  const [aiNotes, setAiNotes] = useState([])
  const [summaryText, setSummaryText] = useState('Listening to your audio... notes will generate shortly.')
  const [actionItems, setActionItems] = useState([])
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [inputText, setInputText] = useState('')
  const [speaker, setSpeaker] = useState('John')

  const feedRef = useRef(null)
  const recognitionRef = useRef(null)

  // Timer
  useEffect(() => {
    const id = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [])

  // Auto-scroll transcript feed
  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight
  }, [transcript])

  // Set up Speech Recognition on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const rec = new SpeechRecognition()
      rec.continuous = true
      rec.interimResults = false
      rec.lang = 'en-US'

      rec.onresult = (event) => {
        const lastResultIndex = event.results.length - 1
        const text = event.results[lastResultIndex][0].transcript.trim()
        if (text) {
          sendTranscriptChunk("Presenter", text)
        }
      }

      rec.onerror = (err) => {
        console.error("Speech Recognition error:", err)
      }

      rec.onend = () => {
        // Auto-restart if we want to keep transcribing
        if (isTranscribing) {
          try {
            recognitionRef.current.start()
          } catch (e) {
            console.error(e)
          }
        }
      }

      recognitionRef.current = rec
    } else {
      console.warn("Speech Recognition not supported in this browser.")
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [isTranscribing])

  const toggleTranscription = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome.")
      return
    }

    if (isTranscribing) {
      recognitionRef.current.stop()
      setIsTranscribing(false)
    } else {
      setIsTranscribing(true)
      try {
        recognitionRef.current.start()
      } catch (err) {
        console.error("Failed to start speech recognition:", err)
      }
    }
  }

  const fmt = s => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return [h, m, sec].map(v => String(v).padStart(2, '0')).join(':')
  }

  const sendTranscriptChunk = async (speakerName, text) => {
    if (!text.trim()) return

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const chunkText = `${speakerName}:\n${text}`

    // Optimistically update transcript feed
    setTranscript(prev => [...prev, { speaker: speakerName, color: 'var(--primary)', time: timeString, text }])

    try {
      const res = await fetch('http://localhost:5000/api/meetings/chunk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetingId: meeting.meetingId,
          chunkText
        })
      })

      if (res.ok) {
        const data = await res.json()
        setSummaryText(data.summary || "")
        setActionItems(data.actionItems || [])
        if (data.bulletPoints) {
          setAiNotes(data.bulletPoints.map(bp => ({ text: bp, time: timeString })))
        }
      }
    } catch (err) {
      console.error("Failed to sync transcript chunk:", err)
    }
  }

  const handleSendInput = () => {
    sendTranscriptChunk(speaker, inputText)
    setInputText('')
  }

  const stopMeeting = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    try {
      const res = await fetch('http://localhost:5000/api/meetings/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingId: meeting.meetingId })
      })
      if (res.ok) {
        const data = await res.json()
        navigate(`/summary?id=${meeting.meetingId}`, { state: { meeting: data.meeting } })
      } else {
        navigate('/')
      }
    } catch (err) {
      console.error("Error stopping meeting:", err)
      navigate('/')
    }
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerLeft}>
            <span className={styles.meetingTitle} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>{meeting.meetingTitle}</span>
            <div className={styles.liveBadge} style={{ marginRight: 12 }}>
              <span className={styles.liveDot} />
              <span className={styles.liveText}>LIVE</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '15px', fontSize: 12, border: '1px solid var(--outline-variant)' }}>
              <span style={{ color: 'var(--outline)' }}>Session ID:</span>
              <code style={{ color: 'var(--primary)', fontWeight: 600 }}>{meeting.meetingId}</code>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(meeting.meetingId);
                  alert("Session ID copied to clipboard!");
                }}
                style={{ background: 'none', border: 'none', color: 'var(--outline)', cursor: 'pointer', fontSize: 10, padding: "0 2px" }}
                title="Copy Session ID"
              >
                📋
              </button>
            </div>
          </div>
          <div className={styles.headerRight}>
            <button 
              className={styles.stopBtn} 
              style={{ background: isTranscribing ? 'var(--secondary)' : 'var(--outline)', marginRight: 8 }}
              onClick={toggleTranscription}
            >
              {isTranscribing ? <Mic size={18} /> : <MicOff size={18} />}
              {isTranscribing ? 'Transcribing Live' : 'Start Auto-Transcribing'}
            </button>
            <div className={styles.timer} style={{ marginRight: 16 }}>
              <Timer size={18} />
              <span className={styles.timerText}>{fmt(seconds)}</span>
            </div>
            <button className={styles.stopBtn} onClick={stopMeeting}>
              <StopCircle size={18} />
              Stop Notes
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid: Meet Embedding + Notes Panels */}
      <main className={styles.main} style={{ height: 'calc(100vh - 72px)', padding: '16px 20px', maxWidth: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.1fr', gap: 20, height: '100%', overflow: 'hidden' }}>

          
          {/* Left Panel: Open Google Meet Launchpad & Instructions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
            <div style={{ flex: 1, background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: 'var(--border-radius)', overflow: 'hidden', border: '1px solid var(--outline-variant)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.05, backgroundImage: 'radial-gradient(var(--primary) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              
              <div style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid var(--outline)', borderRadius: '50%', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, zIndex: 1 }}>
                <span style={{ fontSize: 40 }}>💬</span>
              </div>
              
              <h2 style={{ color: 'var(--on-surface)', fontSize: 22, fontWeight: 700, marginBottom: 12, zIndex: 1 }}>Launch Google Meet</h2>
              <p style={{ color: 'var(--outline)', fontSize: 14, maxWidth: 460, lineHeight: '1.6', marginBottom: 28, zIndex: 1 }}>
                Google Meet does not allow embedding within other websites. Click below to launch your meeting in a new tab, then activate the Chrome Extension to capture and stream notes here.
              </p>
              
              <a 
                href="https://meet.google.com/" 
                target="_blank" 
                rel="noreferrer"
                style={{ textDecoration: 'none', background: 'var(--primary)', color: '#ffffff', padding: '12px 28px', borderRadius: '30px', fontWeight: 600, fontSize: 15, transition: 'all 0.2s ease', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 12px rgba(37,99,235,0.2)', zIndex: 1 }}
              >
                <span>Create/Join Google Meet</span>
                <span>↗</span>
              </a>
            </div>
            
            {/* Live Audio Transcript Display */}
            <div className={styles.panel} style={{ height: '180px', flexShrink: 0 }}>
              <div className={styles.panelHeader}>
                <h3 className={styles.panelTitle}>Live Transcription Feed</h3>
                {isTranscribing && <span style={{ fontSize: 11, color: 'var(--secondary)', fontWeight: 600 }}>Capturing Browser Audio...</span>}
              </div>
              <div className={styles.panelBody} ref={feedRef} style={{ padding: 12, fontSize: 14 }}>
                {transcript.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--outline)', margin: 'auto' }}>
                    Click <strong>"Start Auto-Transcribing"</strong> to transcribe your microphone & meeting audio.
                  </div>
                ) : (
                  transcript.map((item, idx) => (
                    <div key={idx} style={{ marginBottom: 6 }}>
                      <strong style={{ color: 'var(--primary)' }}>{item.speaker}:</strong> {item.text}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: AI notes & Actions */}
          <div className={styles.rightCol} style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Notes */}
            <div className={styles.panel} style={{ flex: 1 }}>
              <div className={styles.panelHeader} style={{ background: 'rgba(37,99,235,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: 'var(--primary)', fontSize: 20 }}>✦</span>
                  <h2 className={styles.panelTitle}>AI Notes</h2>
                </div>
                <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>WebHook Linked</span>
              </div>
              <div className={styles.panelBody}>
                {aiNotes.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--outline)', margin: 'auto' }}>Awaiting notes generation...</div>
                ) : (
                  <ul className={styles.notesList}>
                    {aiNotes.map((note, i) => (
                      <li key={i} className={styles.noteItem}>
                        <div className={styles.noteDot} />
                        <div>
                          <p className={styles.noteText}>{note.text}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Bottom Tabs Panel */}
            <div className={styles.tabPanel} style={{ height: '220px' }}>
              <div className={styles.tabBar}>
                {['summary', 'actions'].map(tab => (
                  <button
                    key={tab}
                    className={`${styles.tabBtn} ${activeTab === tab ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'summary' ? 'Summary' : 'Action Items'}
                  </button>
                ))}
              </div>
              <div className={styles.tabContent}>
                {activeTab === 'summary' ? (
                  <p className={styles.summaryText}>{summaryText}</p>
                ) : actionItems.length === 0 ? (
                  <div style={{ color: 'var(--outline)', fontSize: 14 }}>No action items listed yet.</div>
                ) : (
                  <ul className={styles.actionList}>
                    {actionItems.map((item, idx) => (
                      <li key={idx} className={styles.actionItem}>
                        <span style={{ fontSize: 18, color: 'var(--outline)' }}>○</span>
                        <span className={styles.actionText}>
                          <strong style={{ color: 'var(--on-surface)' }}>{item.person || item.owner}:</strong> {item.task}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}




