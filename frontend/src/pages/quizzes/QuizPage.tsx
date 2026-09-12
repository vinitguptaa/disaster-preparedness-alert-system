import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

type Quiz = {
  id: number
  title: string
  description: string
  disaster_type: string
}

function QuizPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await api.get('/api/quizzes')
        setQuizzes(response.data)
      } catch (err: any) {
        setError(
          err.response?.data?.detail ||
            'Failed to load quizzes.',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchQuizzes()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="text-xl font-bold text-gray-900"
          >
            Disaster<span className="text-blue-600">Safe</span>
          </Link>

          <Link
            to="/dashboard"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Knowledge
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Disaster Safety Quizzes
          </h1>

          <p className="mt-2 text-gray-600">
            Test your knowledge and improve your disaster preparedness.
          </p>
        </div>

        {loading && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-gray-600">
              Loading quizzes...
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl bg-red-50 p-6 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && quizzes.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-gray-600">
              No quizzes available yet.
            </p>
          </div>
        )}

        {!loading && !error && quizzes.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="text-4xl">
                  {quiz.disaster_type === 'Flood'
                    ? '🌊'
                    : quiz.disaster_type === 'Earthquake'
                      ? '🏚️'
                      : quiz.disaster_type === 'Cyclone'
                        ? '🌀'
                        : '🚨'}
                </div>

                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-blue-600">
                  {quiz.disaster_type}
                </p>

                <h2 className="mt-2 text-xl font-bold text-gray-900">
                  {quiz.title}
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {quiz.description}
                </p>

                <Link
                  to={`/quizzes/${quiz.id}`}
                  className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Start Quiz →
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default QuizPage