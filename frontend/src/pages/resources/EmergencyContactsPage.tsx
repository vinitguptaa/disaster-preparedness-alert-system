import { FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

type EmergencyContact = {
  id: number
  name: string
  phone: string
  relationship_type: string
}

function EmergencyContactsPage() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [relationship, setRelationship] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await api.get('/api/emergency-contacts')
        setContacts(response.data)
      } catch {
        setError('Failed to load emergency contacts.')
      } finally {
        setLoading(false)
      }
    }

    fetchContacts()
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setSaving(true)
    setError('')
    setMessage('')

    try {
      const response = await api.post('/api/emergency-contacts', {
        name,
        phone,
        relationship_type: relationship,
      })

      setContacts((current) => [...current, response.data])

      setName('')
      setPhone('')
      setRelationship('')

      setMessage('Emergency contact added successfully!')
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          'Failed to add emergency contact.',
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (contactId: number) => {
    try {
      await api.delete(`/api/emergency-contacts/${contactId}`)

      setContacts((current) =>
        current.filter((contact) => contact.id !== contactId),
      )
    } catch {
      setError('Failed to delete emergency contact.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="text-xl font-bold text-gray-900"
          >
            Disaster<span className="text-blue-600">Safe</span>
          </Link>

          <Link
            to="/preparedness"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Preparedness
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* Heading */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Emergency
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Emergency Contacts
          </h1>

          <p className="mt-2 text-gray-600">
            Save trusted people who can be contacted during an emergency.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Add Contact */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Add Emergency Contact
            </h2>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Gupta"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Phone Number
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Relationship
                </label>

                <input
                  type="text"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  placeholder="e.g. Father, Mother, Friend"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {message && (
                <div className="rounded-lg bg-green-50 p-3 text-sm font-medium text-green-700">
                  {message}
                </div>
              )}

              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? 'Adding...' : 'Add Contact'}
              </button>
            </form>
          </div>

          {/* Contact List */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Your Contacts
            </h2>

            <div className="mt-6">
              {loading ? (
                <p className="text-sm text-gray-500">
                  Loading contacts...
                </p>
              ) : contacts.length === 0 ? (
                <div className="rounded-lg border border-dashed p-6 text-center">
                  <p className="text-sm text-gray-500">
                    No emergency contacts added yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="rounded-xl border p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {contact.name}
                          </h3>

                          <p className="mt-1 text-sm text-gray-600">
                            {contact.relationship_type}
                          </p>

                          <p className="mt-2 text-sm font-medium text-blue-600">
                            {contact.phone}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDelete(contact.id)}
                          className="text-sm font-medium text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default EmergencyContactsPage