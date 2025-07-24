import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  BookOpen, Brain, BarChart3, Trophy, Target, 
  Calendar, ArrowRight, Play, Star, Award 
} from 'lucide-react'
import { useApp } from '../context/AppContext'

function Dashboard() {
  const { state } = useApp()
  const navigate = useNavigate()

  // Redirect to account if not logged in
  React.useEffect(() => {
    if (!state.user) {
      navigate('/account')
    }
  }, [state.user, navigate])

  if (!state.user) {
    return (
      <div className="dashboard-page">
        <div className="redirect-message">
          <p>Please log in to access your dashboard.</p>
          <Link to="/account" className="btn-primary">Go to Login</Link>
        </div>
      </div>
    )
  }

  const todayQuizzes = state.quizHistory.filter(quiz => {
    const today = new Date().toDateString()
    return new Date(quiz.completedAt).toDateString() === today
  }).length

  const weeklyProgress = Math.round((state.progress.totalWordsLearned / 50) * 100) // Assuming weekly goal of 50 words
  const levelProgress = ((state.progress.points % 1000) / 1000) * 100 // 1000 points per level

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h1>Welcome back, {state.user.name}!</h1>
          <p>Ready to continue your {state.settings.targetLanguage} learning journey?</p>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <Link to="/quiz" className="action-card primary">
            <div className="action-icon">
              <Play size={24} />
            </div>
            <div className="action-content">
              <h3>Start Quiz</h3>
              <p>Test your knowledge</p>
            </div>
            <ArrowRight size={20} className="action-arrow" />
          </Link>

          <Link to="/vocabulary" className="action-card">
            <div className="action-icon">
              <BookOpen size={24} />
            </div>
            <div className="action-content">
              <h3>Learn Words</h3>
              <p>Expand vocabulary</p>
            </div>
            <ArrowRight size={20} className="action-arrow" />
          </Link>

          <Link to="/progress" className="action-card">
            <div className="action-icon">
              <BarChart3 size={24} />
            </div>
            <div className="action-content">
              <h3>View Progress</h3>
              <p>Check your stats</p>
            </div>
            <ArrowRight size={20} className="action-arrow" />
          </Link>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <BookOpen size={32} className="stat-icon" />
              <div>
                <h3>{state.progress.totalWordsLearned}</h3>
                <p>Words Learned</p>
              </div>
            </div>
            <div className="stat-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${weeklyProgress}%` }}
                ></div>
              </div>
              <small>Weekly Goal: 50 words</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <Star size={32} className="stat-icon" />
              <div>
                <h3>{state.progress.points}</h3>
                <p>Total Points</p>
              </div>
            </div>
            <div className="stat-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${levelProgress}%` }}
                ></div>
              </div>
              <small>Level {state.progress.currentLevel}</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <Trophy size={32} className="stat-icon" />
              <div>
                <h3>{state.progress.streak}</h3>
                <p>Day Streak</p>
              </div>
            </div>
            <div className="stat-progress">
              <div className="streak-display">
                {[...Array(7)].map((_, i) => (
                  <div 
                    key={i}
                    className={`streak-day ${i < state.progress.streak ? 'active' : ''}`}
                  ></div>
                ))}
              </div>
              <small>7-day goal</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <Target size={32} className="stat-icon" />
              <div>
                <h3>{todayQuizzes}</h3>
                <p>Quizzes Today</p>
              </div>
            </div>
            <div className="stat-progress">
              <div className="daily-goal">
                <div className={`goal-indicator ${todayQuizzes >= 3 ? 'completed' : ''}`}>
                  <Award size={20} />
                </div>
                <small>Daily Goal: 3 quizzes</small>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {state.quizHistory.length > 0 ? (
              state.quizHistory.slice(-5).reverse().map((quiz, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    <Brain size={20} />
                  </div>
                  <div className="activity-content">
                    <p><strong>Quiz Completed</strong></p>
                    <p>Score: {quiz.score}% • {quiz.questions} questions</p>
                    <small>{new Date(quiz.completedAt).toLocaleDateString()}</small>
                  </div>
                  <div className={`activity-score ${quiz.score >= 80 ? 'good' : quiz.score >= 60 ? 'average' : 'needs-improvement'}`}>
                    {quiz.score}%
                  </div>
                </div>
              ))
            ) : (
              <div className="no-activity">
                <p>No recent activity. Start a quiz to see your progress!</p>
                <Link to="/quiz" className="btn-primary">Take Your First Quiz</Link>
              </div>
            )}
          </div>
        </div>

        {/* Daily Challenge */}
        <div className="daily-challenge">
          <div className="challenge-header">
            <h2>Today's Challenge</h2>
            <Calendar size={24} />
          </div>
          <div className="challenge-content">
            <div className="challenge-info">
              <h3>Master 10 New Words</h3>
              <p>Learn 10 new {state.settings.targetLanguage} words to earn bonus points!</p>
              <div className="challenge-reward">
                <Star size={16} />
                <span>+50 bonus points</span>
              </div>
            </div>
            <Link to="/vocabulary" className="challenge-cta">
              Start Challenge
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 