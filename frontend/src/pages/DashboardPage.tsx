import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

type User = { full_name: string }
type KitItem = { id: number; is_completed: boolean }
type QuizHistory = { id: number; quiz_title: string; percentage: number; completed_at: string }
type Contact = { id: number }
type Alert = { id: number; headline: string; instruction: string; severity: string }
const severityLabel: Record<string, string> = { minor: 'Advisory', moderate: 'Be aware', severe: 'Take action', extreme: 'Emergency' }

function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [kitItems, setKitItems] = useState<KitItem[]>([])
  const [quizzes, setQuizzes] = useState<QuizHistory[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<User>('/api/auth/me'), api.get<KitItem[]>('/api/emergency-kit'), api.get<QuizHistory[]>('/api/quizzes/history'),
      api.get<Contact[]>('/api/emergency-contacts'), api.get<{ items: Alert[] }>('/api/alerts'),
    ]).then(([me, kit, history, savedContacts, activeAlerts]) => {
      setUser(me.data); setKitItems(kit.data); setQuizzes(history.data); setContacts(savedContacts.data); setAlerts(activeAlerts.data.items)
    }).catch(() => { localStorage.removeItem('access_token'); window.location.assign('/login') }).finally(() => setLoading(false))
  }, [])

  const completed = kitItems.filter((item) => item.is_completed).length
  const readiness = kitItems.length ? Math.round((completed / kitItems.length) * 100) : 0
  const bestQuiz = quizzes.length ? Math.max(...quizzes.map((quiz) => quiz.percentage)) : 0
  if (loading || !user) return <div className="loading-screen"><span className="pulse-ring" />Preparing your safety brief…</div>

  return <section className="dashboard-wrap">
    <div className="eyebrow">Your safety brief</div>
    <div className="hero-row"><div><h1>Good morning, {user.full_name.split(' ')[0]}.</h1><p>Here’s what matters for your preparedness today.</p></div><Link className="primary-button" to="/disasters">View live alerts <span>→</span></Link></div>
    {alerts.length ? <section className="live-alert" aria-live="polite"><div className="alert-icon">!</div><div><div className="alert-meta">{severityLabel[alerts[0].severity] ?? 'Active alert'} · Verified source</div><h2>{alerts[0].headline}</h2><p>{alerts[0].instruction}</p></div><Link to="/disasters">Open alert <span>→</span></Link></section> : <section className="quiet-alert"><div className="quiet-icon">✓</div><div><strong>No active verified alerts</strong><p>We’re monitoring official sources. Keep your emergency plan up to date.</p></div><Link to="/disasters">Open monitoring centre →</Link></section>}
    <section className="metric-grid" aria-label="Preparedness summary">
      <article className="metric-card readiness-card"><div className="metric-label">Readiness score</div><div className="score-row"><strong>{readiness}<small>%</small></strong><span className="score-orbit">◔</span></div><div className="progress-track"><span style={{ width: `${readiness}%` }} /></div><p>{completed} of {kitItems.length || '—'} kit items ready</p></article>
      <article className="metric-card"><div className="metric-icon blue">⌖</div><div className="metric-label">Safety network</div><strong>{contacts.length}</strong><p>Emergency contacts saved</p></article>
      <article className="metric-card"><div className="metric-icon amber">◈</div><div className="metric-label">Learning progress</div><strong>{bestQuiz}<small>%</small></strong><p>{quizzes.length} knowledge checks completed</p></article>
    </section>
    <section className="split-grid">
      <article className="panel"><div className="panel-heading"><div><span className="section-kicker">Next best action</span><h2>Build your emergency kit</h2></div><span className="round-icon">↗</span></div><p className="panel-copy">A few minutes of preparation can make the difference when time is limited.</p><div className="checklist-preview"><span className="mini-check">{completed ? '✓' : '○'}</span><span>{completed ? `${completed} items are marked ready` : 'Start with water, light and medicines'}</span></div><Link to="/preparedness" className="text-link">Open preparedness plan →</Link></article>
      <article className="panel dark-panel"><div className="panel-heading"><div><span className="section-kicker light">Safety learning</span><h2>Know what to do first.</h2></div><span className="round-icon dark">◈</span></div><p>Short, practical guidance for floods, earthquakes, fires and severe weather.</p><Link to="/learning" className="text-link light-link">Explore guides →</Link><div className="dark-shape" /></article>
    </section>
    <section className="panel activity-panel"><div className="panel-heading"><div><span className="section-kicker">Your activity</span><h2>Recent learning</h2></div><Link className="text-link" to="/quiz-history">View all →</Link></div>{quizzes.length ? <div className="activity-list">{quizzes.slice(0, 3).map((quiz) => <div className="activity-row" key={quiz.id}><span className="activity-icon">◈</span><div><strong>{quiz.quiz_title}</strong><p>{new Date(quiz.completed_at).toLocaleDateString()}</p></div><b>{quiz.percentage}%</b></div>)}</div> : <div className="empty-state">No learning activity yet. <Link to="/quizzes">Take your first quiz →</Link></div>}</section>
  </section>
}

export default DashboardPage
