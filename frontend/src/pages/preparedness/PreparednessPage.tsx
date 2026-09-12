import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

function PreparednessPage() {
  type KitItem = {
    id: number
    item_name: string
    is_completed: boolean
  }

  const [items, setItems] = useState<KitItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get('/api/emergency-kit')
        setItems(response.data)
      } catch (error) {
        console.error('Failed to load emergency kit:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  const completedItems = items.filter(
    (item) => item.is_completed,
  ).length

  const preparednessScore =
    items.length === 0
      ? 0
      : Math.round((completedItems / items.length) * 100)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Page Heading */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Preparedness
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Be ready before disaster strikes
          </h1>

          <p className="mt-2 text-gray-600">
            Build your emergency plan, prepare your emergency kit, and improve
            your preparedness score.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {/* Emergency Kit Intro */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="text-3xl">🎒</div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Emergency Kit
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Create and manage your essential emergency supplies checklist.
            </p>

            <button
              className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              View Checklist
            </button>
          </div>

          {/* Emergency Kit Checklist */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="text-3xl">🎒</div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Emergency Kit
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Your emergency supplies checklist.
            </p>

            <div className="mt-5">
              {loading ? (
                <p className="text-sm text-gray-500">
                  Loading checklist...
                </p>
              ) : items.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No items added yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-3 rounded-lg border p-3"
                    >
                      <input
                        type="checkbox"
                        checked={item.is_completed}
                        onChange={async () => {
                          try {
                            const response = await api.patch(
                              `/api/emergency-kit/${item.id}`,
                              {
                                is_completed: !item.is_completed,
                              },
                            )

                            setItems((currentItems) =>
                              currentItems.map((currentItem) =>
                                currentItem.id === item.id
                                  ? response.data
                                  : currentItem,
                              ),
                            )
                          } catch (error) {
                            console.error(
                              'Failed to update emergency kit item:',
                              error,
                            )
                          }
                        }}
                        className="h-4 w-4"
                      />

                      <span
                        className={`text-sm font-medium ${
                          item.is_completed
                            ? 'text-gray-400 line-through'
                            : 'text-gray-700'
                        }`}
                      >
                        {item.item_name}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Preparedness Score */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="text-3xl">📊</div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Preparedness Score
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Track how prepared you are and discover areas that need
              improvement.
            </p>

            <div className="mt-5 text-4xl font-bold text-blue-600">
              {preparednessScore}%
            </div>

            <div className="mt-3 h-3 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{
                  width: `${preparednessScore}%`,
                }}
              />
            </div>

            <p className="mt-3 text-sm text-gray-500">
              {completedItems} of {items.length} kit items completed
            </p>
          </div>

          {/* Family Emergency Plan */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="text-3xl">👨‍👩‍👧‍👦</div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Family Emergency Plan
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Plan where your family will meet and who to contact during an
              emergency.
            </p>

            <Link
              to="/family-plan"
              className="mt-5 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Create Family Plan →
            </Link>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
  <div className="text-3xl">📞</div>

  <h2 className="mt-4 text-xl font-bold text-gray-900">
    Emergency Contacts
  </h2>

  <p className="mt-2 text-sm text-gray-600">
    Save important people you can contact during an emergency.
  </p>

  <Link
    to="/emergency-contacts"
    className="mt-5 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
  >
    Manage Contacts →
  </Link>
</div>

        </div>
      </main>
    </div>
  )
}

export default PreparednessPage