import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

type User = {
  id: number
  full_name: string
  email: string
  is_active: boolean
  is_admin: boolean
}

type KitItem = {
  id: number
  item_name: string
  is_completed: boolean
}

type QuizHistory = {
  id: number
  quiz_id: number
  quiz_title: string
  score: number
  total_points: number
  percentage: number
  completed_at: string
}

type Contact = {
  id: number
  name: string
  phone: string
  relationship_type: string
}

function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [kitItems, setKitItems] = useState<KitItem[]>([])
  const [quizHistory, setQuizHistory] = useState<QuizHistory[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [userResponse, kitResponse, quizResponse, contactResponse] =
          await Promise.all([
            api.get('/api/auth/me'),
            api.get('/api/emergency-kit'),
            api.get('/api/quizzes/history'),
            api.get('/api/emergency-contacts'),
          ])

        setUser(userResponse.data)
        setKitItems(kitResponse.data)
        setQuizHistory(quizResponse.data)
        setContacts(contactResponse.data)
      } catch (error) {
        console.error('Failed to load dashboard:', error)

        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    )
  }

  const completedKitItems = kitItems.filter(
    (item) => item.is_completed,
  ).length

  const preparednessScore =
    kitItems.length > 0
      ? Math.round((completedKitItems / kitItems.length) * 100)
      : 0

  const bestQuizScore =
    quizHistory.length > 0
      ? Math.max(...quizHistory.map((quiz) => quiz.percentage))
      : 0

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

          <div className="flex items-center gap-4">
            <Link
              to="/profile"
              className="text-sm font-medium text-gray-600 hover:text-blue-600"
            >
              {user.full_name}
            </Link>

            <button
              onClick={() => {
                localStorage.removeItem('access_token')
                localStorage.removeItem('user')
                window.location.href = '/login'
              }}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* Welcome */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Welcome, {user.full_name} 👋
          </h1>

          <p className="mt-2 text-gray-600">
            Stay informed, prepared, and ready for emergencies.
          </p>
        </div>

        {/* Alert */}
        <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-bold text-red-800">
            🚨 Disaster Alerts
          </h2>

          <p className="mt-2 text-sm text-red-700">
            No active emergency alerts for your location right now.
          </p>

          <Link
            to="/disasters"
            className="mt-4 inline-block text-sm font-semibold text-red-700 hover:underline"
          >
            View disaster information →
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="text-3xl">🛡️</div>

            <p className="mt-4 text-sm text-gray-500">
              Preparedness Score
            </p>

            <p className="mt-1 text-3xl font-bold text-blue-600">
              {preparednessScore}%
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="text-3xl">📝</div>

            <p className="mt-4 text-sm text-gray-500">
              Quizzes Completed
            </p>

            <p className="mt-1 text-3xl font-bold text-blue-600">
              {quizHistory.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="text-3xl">🏆</div>

            <p className="mt-4 text-sm text-gray-500">
              Best Quiz Score
            </p>

            <p className="mt-1 text-3xl font-bold text-blue-600">
              {bestQuizScore}%
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="text-3xl">📞</div>

            <p className="mt-4 text-sm text-gray-500">
              Emergency Contacts
            </p>

            <p className="mt-1 text-3xl font-bold text-blue-600">
              {contacts.length}
            </p>
          </div>

        </div>

        {/* Main Features */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          <Link
            to="/preparedness"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="text-3xl">🛡️</div>

            <h3 className="mt-4 font-bold text-gray-900">
              Preparedness
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Check your preparedness score and emergency checklist.
            </p>

            <p className="mt-4 text-sm font-semibold text-blue-600">
              {completedKitItems}/{kitItems.length} kit items completed
            </p>
          </Link>

          <Link
            to="/learning"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="text-3xl">📚</div>

            <h3 className="mt-4 font-bold text-gray-900">
              Learn
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Learn what to do before, during, and after disasters.
            </p>
          </Link>

          <Link
            to="/quizzes"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="text-3xl">🧠</div>

            <h3 className="mt-4 font-bold text-gray-900">
              Quizzes
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Test your disaster knowledge and earn points.
            </p>

            <p className="mt-4 text-sm font-semibold text-blue-600">
              {quizHistory.length} attempts
            </p>
          </Link>

          <Link
            to="/resources"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="text-3xl">📍</div>

            <h3 className="mt-4 font-bold text-gray-900">
              Resources
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Find emergency contacts and useful resources.
            </p>

            <p className="mt-4 text-sm font-semibold text-blue-600">
              {contacts.length} saved contacts
            </p>
          </Link>

        </div>

        {/* Preparedness Progress */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Your Preparedness
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                Complete your emergency kit to improve your score.
              </p>
            </div>

            <span className="text-2xl font-bold text-blue-600">
              {preparednessScore}%
            </span>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{ width: `${preparednessScore}%` }}
            />
          </div>

          <div className="mt-3 flex justify-between text-sm text-gray-500">
            <span>
              {completedKitItems} completed
            </span>

            <Link
              to="/preparedness"
              className="font-semibold text-blue-600 hover:underline"
            >
              Complete checklist →
            </Link>
          </div>

        </div>

        {/* Quiz History Preview */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Recent Quiz Attempts
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                Track your learning progress.
              </p>
            </div>

            <Link
              to="/quiz-history"
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              View all →
            </Link>
          </div>

          {quizHistory.length === 0 ? (
            <p className="mt-6 text-sm text-gray-500">
              You haven't attempted any quizzes yet.
            </p>
          ) : (
            <div className="mt-5 space-y-3">
              {quizHistory.slice(0, 3).map((attempt) => (
                <div
                  key={attempt.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {attempt.quiz_title}
                    </p>

                    <p className="text-sm text-gray-500">
                      {new Date(
                        attempt.completed_at,
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-blue-600">
                      {attempt.percentage}%
                    </p>

                    <p className="text-xs text-gray-500">
                      {attempt.score}/{attempt.total_points}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </main>
    </div>
  )
}

export default DashboardPage