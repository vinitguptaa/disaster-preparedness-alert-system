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

function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/api/auth/me')
        setUser(response.data)
      } catch {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-bold text-gray-900">
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

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            My Profile
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Account Information
          </h1>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="flex items-center gap-5 border-b pb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
              {user.full_name.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {user.full_name}
              </h2>

              <p className="text-sm text-gray-500">
                {user.email}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="mt-1 font-medium text-gray-900">
                {user.full_name}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="mt-1 font-medium text-gray-900">
                {user.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Account Status</p>
              <p className="mt-1 font-medium text-green-600">
                {user.is_active ? 'Active' : 'Inactive'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Account Type</p>
              <p className="mt-1 font-medium text-gray-900">
                {user.is_admin ? 'Administrator' : 'User'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">User ID</p>
              <p className="mt-1 font-medium text-gray-900">
                #{user.id}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProfilePage