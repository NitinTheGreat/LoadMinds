import { Link } from "react-router-dom"

function LandingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full bg-white/90 p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4 text-purple-800">Welcome to TaskFlow</h1>
        <p className="text-gray-600 mb-8">
          A simple task management application to help you stay organized and productive.
        </p>
        <Link
          to="/dashboard"
          className="inline-block px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-md hover:opacity-90 transition-opacity"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default LandingPage

