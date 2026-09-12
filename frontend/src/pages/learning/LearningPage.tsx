import { Link } from 'react-router-dom'

function LearningPage() {
  const topics = [
    {
      icon: '🌊',
      title: 'Flood',
      description: 'Learn how to stay safe before, during, and after a flood.',
    },
    {
      icon: '🌍',
      title: 'Earthquake',
      description: 'Understand earthquake safety and emergency actions.',
    },
    {
      icon: '🌀',
      title: 'Cyclone',
      description: 'Learn how to prepare for strong winds and heavy rainfall.',
    },
    {
      icon: '🔥',
      title: 'Fire',
      description: 'Learn fire prevention and safe evacuation practices.',
    },
    {
      icon: '⛈️',
      title: 'Thunderstorm',
      description: 'Know what to do during lightning and severe storms.',
    },
    {
      icon: '🌡️',
      title: 'Heatwave',
      description: 'Learn how to protect yourself during extreme heat.',
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
            Learning Center
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Learn how to stay safe
          </h1>

          <p className="mt-2 max-w-2xl text-gray-600">
            Explore disaster safety information and learn what to do before,
            during, and after an emergency.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <div
              key={topic.title}
              className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="text-4xl">{topic.icon}</div>

              <h2 className="mt-4 text-xl font-bold text-gray-900">
                {topic.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                {topic.description}
              </p>

              <button className="mt-5 rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50">
                Learn More
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default LearningPage