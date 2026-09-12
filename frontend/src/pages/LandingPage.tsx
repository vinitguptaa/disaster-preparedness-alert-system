import Navbar from '../components/Navbar'

function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Disaster Preparedness & Alert System
          </p>

          <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-6xl">
            Be prepared before disaster strikes.
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            Get reliable disaster information, real-time alerts,
            preparedness guidance, learning resources, and personalized
            risk insights in one place.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700">
              Get Started
            </button>

            <button className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100">
              Explore Resources
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LandingPage