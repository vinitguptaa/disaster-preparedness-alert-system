import { Link } from 'react-router-dom'

function ResourcesPage() {
  const resources = [
    {
      icon: '🚨',
      title: 'Emergency Contacts',
      description:
        'Quickly access important emergency numbers and disaster response services.',
    },
    {
      icon: '🏥',
      title: 'Nearby Hospitals',
      description:
        'Find healthcare facilities that can help during an emergency.',
    },
    {
      icon: '🚒',
      title: 'Fire & Rescue',
      description:
        'Access fire and rescue services when immediate assistance is needed.',
    },
    {
      icon: '👮',
      title: 'Police',
      description:
        'Find police and law-enforcement resources for emergency situations.',
    },
    {
      icon: '📍',
      title: 'Disaster Map',
      description:
        'View disaster-related information and important locations on a map.',
    },
    {
      icon: '📰',
      title: 'Disaster News',
      description:
        'Stay updated with important disaster-related news and information.',
    },
  ]

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

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Emergency Resources
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Help when you need it
          </h1>

          <p className="mt-2 max-w-2xl text-gray-600">
            Quickly find emergency contacts, essential services, disaster
            information, and useful resources.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <div
              key={resource.title}
              className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="text-4xl">{resource.icon}</div>

              <h2 className="mt-4 text-xl font-bold text-gray-900">
                {resource.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                {resource.description}
              </p>

              <button className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Explore
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default ResourcesPage