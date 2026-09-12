import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

type QuizHistory = {
  id: number
  quiz_id: number
  quiz_title: string
  score: number
  total_points: number
  percentage: number
  completed_at: string
}

function QuizHistoryPage() {
  const [history, setHistory] = useState<QuizHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/api/quizzes/history')
        setHistory(response.data)
      } catch (error) {
        console.error('Failed to load quiz history:', error)
        setError('Failed to load quiz history.')
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-bold text-gray-900">
            Disaster<span className="text-blue-600">Safe</span>
          </Link>

          <Link
            to="/quizzes"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Quizzes
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Progress
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Quiz History
          </h1>

          <p className="mt-2 text-gray-600">
            Review your previous quiz attempts and scores.
          </p>
        </div>

        {loading && (
          <p className="text-gray-600">Loading quiz history...</p>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && history.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <div className="text-4xl">📝</div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              No quiz attempts yet
            </h2>

            <p className="mt-2 text-gray-600">
              Take your first disaster-safety quiz to start building your
              learning progress.
            </p>

            <Link
              to="/quizzes"
              className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Take a Quiz →
            </Link>
          </div>
        )}

        {!loading && history.length > 0 && (
          <div className="space-y-4">
            {history.map((attempt) => (
              <div
                key={attempt.id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {attempt.quiz_title}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Attempted on{' '}
                      {new Date(attempt.completed_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-3xl font-bold text-blue-600">
                      {attempt.percentage}%
                    </p>

                    <p className="text-sm text-gray-500">
                      {attempt.score}/{attempt.total_points} points
                    </p>
                  </div>
                </div>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{ width: `${attempt.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default QuizHistoryPage