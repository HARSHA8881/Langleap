import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, Brain, Loader } from 'lucide-react'
import { useApp } from '../context/AppContext'
import '../styles/components/Dashboard.css'

function Dashboard() {
  const { user, isAuthenticated, isLoading, progress, quizHistory } = useApp()
  const navigate = useNavigate()

  // Redirect to account if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('User not authenticated, redirecting to login')
      navigate('/account')
    }
  }, [isAuthenticated, isLoading, navigate])

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="loading-container">
            <Loader size={48} className="spinner" />
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show message if not authenticated (while redirecting)
  if (!isAuthenticated || !user) {
    return (
      <div className="dashboard-page">
        <div className="simple-message">
          <p>Please log in to access your dashboard!</p>
          <Link to="/account" className="btn-primary">Go to Login</Link>
        </div>
      </div>
    )
  }

  const averageScore = quizHistory.length > 0 
    ? Math.round(quizHistory.reduce((sum, quiz) => sum + quiz.score, 0) / quizHistory.length)
    : 0

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Hi {user.name}!</h1>
          <p>Here's what you've done so far:</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-box">
            <h3>Words Learned</h3>
            <div className="stat-number">{progress.totalWordsLearned}</div>
            <small>Mark words as learned in vocabulary</small>
          </div>

          <div className="stat-box">
            <h3>Quizzes Completed</h3>
            <div className="stat-number">{progress.quizzesCompleted}</div>
            <small>Total quizzes you've finished</small>
          </div>

          {averageScore > 0 && (
            <div className="stat-box">
              <h3>Average Score</h3>
              <div className="stat-number">{averageScore}%</div>
              <small>Your quiz performance</small>
            </div>
          )}
        </div>

        <div className="dashboard-actions">
          <h2>What do you want to do?</h2>
          <div className="action-buttons">
            <Link to="/vocabulary" className="action-button">
              <BookOpen size={32} />
              <span>Learn Words</span>
              <small>Study and mark words as learned</small>
            </Link>
            <Link to="/quiz" className="action-button">
              <Brain size={32} />
              <span>Take Quiz</span>
              <small>Test your knowledge</small>
            </Link>
          </div>
        </div>

        {quizHistory.length > 0 && (
          <div className="recent-quizzes">
            <h3>Your Recent Quizzes</h3>
            <div className="quiz-list">
              {quizHistory.slice(-5).reverse().map((quiz, index) => (
                <div key={index} className="quiz-item">
                  <span>Quiz #{quizHistory.length - index}</span>
                  <span>Score: {quiz.score}%</span>
                  <span>{new Date(quiz.completedAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
            {quizHistory.length > 5 && (
              <p className="quiz-count">+ {quizHistory.length - 5} more quizzes</p>
            )}
          </div>
        )}

        {quizHistory.length === 0 && progress.totalWordsLearned === 0 && (
          <div className="no-progress">
            <h3>Get started with your learning!</h3>
            <p>Go to Vocabulary to learn some words, then take a quiz to test yourself.</p>
            <div className="getting-started">
              <Link to="/vocabulary" className="btn-primary">Start Learning Words</Link>
            </div>
          </div>
        )}

        {quizHistory.length === 0 && progress.totalWordsLearned > 0 && (
          <div className="no-quizzes">
            <p>Great! You've learned {progress.totalWordsLearned} words. Now test yourself with a quiz!</p>
            <Link to="/quiz" className="btn-primary">Take your first quiz</Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard 