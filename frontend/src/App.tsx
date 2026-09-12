import ProfilePage from './pages/ProfilePage'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import DashboardPage from './pages/DashboardPage'
import PreparednessPage from './pages/preparedness/PreparednessPage'
import LearningPage from './pages/learning/LearningPage'
import QuizPage from './pages/quizzes/QuizPage'
import ResourcesPage from './pages/resources/ResourcesPage'
import DisastersPage from './pages/disasters/DisastersPage'
import FamilyEmergencyPlanPage from './pages/preparedness/FamilyEmergencyPlanPage'
import EmergencyContactsPage from './pages/resources/EmergencyContactsPage'
import QuizTakingPage from './pages/quizzes/QuizTakingPage'
import QuizHistoryPage from './pages/quizzes/QuizHistoryPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('access_token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  }
/>
        <Route
          path="/disasters"
          element={
            <ProtectedRoute>
              <DisastersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/preparedness"
          element={
            <ProtectedRoute>
              <PreparednessPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/learning"
          element={
            <ProtectedRoute>
              <LearningPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quizzes"
          element={
            <ProtectedRoute>
              <QuizPage />
            </ProtectedRoute>
          }
        />
        <Route
  path="/quizzes/:quizId"
  element={
    <ProtectedRoute>
      <QuizTakingPage />
    </ProtectedRoute>
  }
/>
        <Route
          path="/resources"
          element={
            <ProtectedRoute>
              <ResourcesPage />
            </ProtectedRoute>
          }
        />
        <Route
  path="/family-plan"
  element={
    <ProtectedRoute>
      <FamilyEmergencyPlanPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/emergency-contacts"
  element={
    <ProtectedRoute>
      <EmergencyContactsPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/quiz-history"
  element={
    <ProtectedRoute>
      <QuizHistoryPage />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  )
}

export default App