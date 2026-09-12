import { FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

type FamilyPlan = {
  id: number
  meeting_point: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
}

function FamilyEmergencyPlanPage() {
  const [plan, setPlan] = useState<FamilyPlan | null>(null)
  const [meetingPoint, setMeetingPoint] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await api.get('/api/family-plan')

        if (response.data) {
          setPlan(response.data)
          setMeetingPoint(response.data.meeting_point || '')
          setContactName(response.data.emergency_contact_name || '')
          setContactPhone(response.data.emergency_contact_phone || '')
        }
      } catch {
        setError('Failed to load your family emergency plan.')
      } finally {
        setLoading(false)
      }
    }

    fetchPlan()
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    const data = {
      meeting_point: meetingPoint,
      emergency_contact_name: contactName,
      emergency_contact_phone: contactPhone,
    }

    try {
      const response = plan
        ? await api.put('/api/family-plan', data)
        : await api.post('/api/family-plan', data)

      setPlan(response.data)
      setMessage(plan ? 'Family plan updated successfully!' : 'Family plan saved successfully!')
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          'Failed to save family emergency plan.',
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading family plan...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link to="/dashboard" className="text-xl font-bold text-gray-900">
            Disaster<span className="text-blue-600">Safe</span>
          </Link>

          <Link
            to="/preparedness"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back to Preparedness
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Preparedness
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Family Emergency Plan
          </h1>

          <p className="mt-2 text-gray-600">
            Decide where your family will meet and who to contact during an
            emergency.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-6 shadow-sm"
        >
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Family Meeting Point
              </label>

              <input
                type="text"
                value={meetingPoint}
                onChange={(e) => setMeetingPoint(e.target.value)}
                placeholder="e.g. Community Park near our home"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />

              <p className="mt-1 text-xs text-gray-500">
                A safe place where family members can meet.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Emergency Contact Name
              </label>

              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="e.g. Family Emergency Contact"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Emergency Contact Phone
              </label>

              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {message && (
            <div className="mt-6 rounded-lg bg-green-50 p-3 text-sm font-medium text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? 'Saving...'
              : plan
                ? 'Update Family Plan'
                : 'Save Family Plan'}
          </button>
        </form>
      </main>
    </div>
  )
}

export default FamilyEmergencyPlanPage