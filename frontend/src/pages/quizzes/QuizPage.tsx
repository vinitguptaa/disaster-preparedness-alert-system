import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { getApiErrorMessage } from '../../services/api'

type Quiz = { id: number; title: string; description: string; disaster_type: string }
const iconFor = (type: string) => ({ Flood: '≈', Earthquake: '⌂', Cyclone: '◌', 'All hazards': '◈' }[type] ?? '?')

function QuizPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => { api.get<Quiz[]>('/api/quizzes').then((response) => setQuizzes(response.data)).catch((reason: unknown) => setError(getApiErrorMessage(reason, 'Unable to load knowledge checks.'))).finally(() => setLoading(false)) }, [])
  return <section className="quiz-page"><div className="quiz-hero"><div><p className="section-label">Knowledge checks</p><h1>Practise the choices<br />that matter <em>under pressure.</em></h1><p>Short scenario-based quizzes with explanations. Learn the reason behind every safe action, not just the answer.</p></div><Link to="/quiz-history" className="quiz-history-link">View my attempts →</Link></div><div className="quiz-how"><b>How it works</b><span>01 Pick a hazard</span><span>02 Answer five scenarios</span><span>03 Review practical explanations</span></div>{loading && <div className="quiz-empty">Loading knowledge checks…</div>}{error && <div className="quiz-empty quiz-error">{error}</div>}{!loading && !error && !quizzes.length && <div className="quiz-empty">No quizzes are available yet. Run <code>python seed_quizzes.py</code> from the backend folder.</div>}{!loading && !error && quizzes.length > 0 && <div className="quiz-grid">{quizzes.map((quiz, index) => <article className="quiz-card" key={quiz.id}><span>0{index + 1}</span><div className="quiz-icon">{iconFor(quiz.disaster_type)}</div><p>{quiz.disaster_type}</p><h2>{quiz.title}</h2><div className="quiz-card-bottom"><small>5 questions · explanations included</small><Link to={`/quizzes/${quiz.id}`}>Start practice <b>→</b></Link></div></article>)}</div>}</section>
}

export default QuizPage
