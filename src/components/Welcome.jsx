import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, Brain, Loader } from 'lucide-react'
import { useApp } from '../context/AppContext'
import '../styles/components/Welcome.css'

function Welcome() {
  const { user, isAuthenticated, isLoading } = useApp()
  const navigate = useNavigate()

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated && user && !isLoading) {
      console.log('User is authenticated, redirecting to dashboard')
      navigate('/dashboard')
    }
  }, [isAuthenticated, user, isLoading, navigate])

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="welcome-page">
        <div className="welcome-container">
          <div className="loading-container">
            <Loader size={48} className="spinner" />
            <p>Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  // Don't render if user is authenticated (will redirect)
  if (isAuthenticated && user) {
    return null
  }

  return (
    <div className="welcome-page">
      <div className="welcome-container">
        <div className="welcome-header">
          <h1>Welcome to LangLeap</h1>
          <p>Learn Spanish words and test your knowledge with quizzes</p>
        </div>

        <div className="features-section">
          <h2>What you can do:</h2>
          <div className="features-list">
            <div className="feature">
              <BookOpen size={32} />
              <h3>Learn Vocabulary</h3>
              <p>Study Spanish words with translations</p>
            </div>
            <div className="feature">
              <Brain size={32} />
              <h3>Take Quizzes</h3>
              <p>Test your knowledge and track progress</p>
            </div>
          </div>
        </div>

        <div className="welcome-buttons">
          <Link to="/account" className="btn-primary">
            Get Started
          </Link>
          <Link to="/account" className="btn-secondary">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Welcome 