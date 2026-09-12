import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold text-gray-900"
        >
          Disaster<span className="text-blue-600">Safe</span>
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            to="/"
            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            to="/disasters"
            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
          >
            Disasters
          </Link>

          <Link
            to="/preparedness"
            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
          >
            Preparedness
          </Link>

          <Link
            to="/learning"
            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
          >
            Learning
          </Link>

          <Link
            to="/resources"
            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
          >
            Resources
          </Link>
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden text-sm font-medium text-gray-700 hover:text-blue-600 sm:block"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  )
}

export default Navbar