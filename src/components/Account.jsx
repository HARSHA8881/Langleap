import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Lock, LogOut, BookOpen, Brain } from 'lucide-react'
import { useApp } from '../context/AppContext'

function Account() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }

    // Mock authentication - in real app, this would call an API
    const user = {
      id: Date.now(),
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
      joinedAt: new Date().toISOString()
    }

    dispatch({ type: 'SET_USER', payload: user })
    navigate('/dashboard')
  }

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' })
    setFormData({ name: '', email: '', password: '', confirmPassword: '' })
  }

  // If user is already logged in, show profile
  if (state.user) {
    return (
      <div className="account-page">
        <div className="account-container">
          <div className="profile-section">
            <div className="profile-header">
              <div className="profile-avatar">
                <User size={80} />
              </div>
              <div className="profile-info">
                <h1>{state.user.name}</h1>
                <p className="email">{state.user.email}</p>
                <p className="join-date">
                  Member since {new Date(state.user.joinedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="profile-stats">
              <div className="stat-card">
                <h3>{state.progress.totalWordsLearned}</h3>
                <p>Words Learned</p>
              </div>
              <div className="stat-card">
                <h3>{state.progress.points}</h3>
                <p>Total Points</p>
              </div>
              <div className="stat-card">
                <h3>{state.progress.streak}</h3>
                <p>Current Streak</p>
              </div>
              <div className="stat-card">
                <h3>Level {state.progress.currentLevel}</h3>
                <p>Current Level</p>
              </div>
            </div>

            <div className="profile-actions">
              <button className="btn-secondary">Edit Profile</button>
              <button 
                className="btn-danger"
                onClick={handleLogout}
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>

          <div className="achievements-section">
            <h2>Achievements</h2>
            <div className="achievements-grid">
              <div className="achievement-item earned">
                <div className="achievement-icon">🎯</div>
                <div className="achievement-info">
                  <h3>First Steps</h3>
                  <p>Completed your first quiz</p>
                </div>
              </div>
              <div className="achievement-item">
                <div className="achievement-icon">🔥</div>
                <div className="achievement-info">
                  <h3>On Fire</h3>
                  <p>Maintain a 7-day streak</p>
                </div>
              </div>
              <div className="achievement-item">
                <div className="achievement-icon">📚</div>
                <div className="achievement-info">
                  <h3>Word Master</h3>
                  <p>Learn 100 new words</p>
                </div>
              </div>
              <div className="achievement-item">
                <div className="achievement-icon">⭐</div>
                <div className="achievement-info">
                  <h3>Quiz Champion</h3>
                  <p>Score 90%+ on 10 quizzes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="account-page">
      <div className="auth-container">
        <div className="auth-form">
          <h1>{isLogin ? 'Welcome Back!' : 'Join LangLeap'}</h1>
          <p>{isLogin ? 'Sign in to continue your learning journey' : 'Create an account to start learning'}</p>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-with-icon">
                  <User size={20} />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required={!isLogin}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-with-icon">
                <Mail size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <Lock size={20} />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-with-icon">
                  <Lock size={20} />
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required={!isLogin}
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            )}

            <button type="submit" className="btn-primary">
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="auth-switch">
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                type="button"
                className="link-button"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

        <div className="auth-features">
          <h2>Start Your Language Learning Journey</h2>
          <div className="feature-list">
            <div className="feature-item">
              <BookOpen size={24} />
              <span>Access thousands of vocabulary words</span>
            </div>
            <div className="feature-item">
              <Brain size={24} />
              <span>Take interactive quizzes</span>
            </div>
            <div className="feature-item">
              <User size={24} />
              <span>Track your progress</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account 