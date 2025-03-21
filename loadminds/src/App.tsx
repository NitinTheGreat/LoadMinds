import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "../src/pages/landingpage"
import Dashboard from "../src/pages/dashboard"
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-pink-200 to-purple-300">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

