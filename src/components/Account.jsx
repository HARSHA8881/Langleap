import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Lock, LogOut, Loader } from 'lucide-react'
import { useApp } from '../context/AppContext'
import '../styles/components/Account.css'

function Account() {
  const { user, isAuthenticated, isLoading, login, logout } = useApp()
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated && user && !isLoading) {
      console.log('User is authenticated, redirecting to dashboard')
      navigate('/dashboard')
    }
  }, [isAuthenticated, user, isLoading, navigate])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="account-page">
        <div className="account-container">
          <div className="loading-container">
            <Loader size={48} className="spinner" />
            <p>Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  const handleInputChange = (e) => {
    setError('')
    setSuccess('')
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required')
      return false
    }

    if (!isLogin) {
      if (!formData.name) {
        setError('Name is required for signup')
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return false
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters')
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setFormLoading(true)
    setError('')
    setSuccess('')

    try {
      console.log(`Attempting ${isLogin ? 'login' : 'signup'}...`)
      
      const result = await login(
        formData.email, 
        formData.password, 
        isLogin ? null : formData.name
      )

      if (result.success) {
        setSuccess(`${isLogin ? 'Login' : 'Signup'} successful! Redirecting...`)
        console.log('Authentication successful, will redirect to dashboard')
        
        // Navigation will happen via useEffect when isAuthenticated becomes true
        
      } else {
        setError(result.error || 'Authentication failed')
        console.error('Authentication failed:', result.error)
      }
    } catch (error) {
      setError('An unexpected error occurred')
      console.error('Authentication error:', error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleLogout = () => {
    console.log('Logging out...')
    logout()
    setFormData({ name: '', email: '', password: '', confirmPassword: '' })
    setError('')
    setSuccess('Logged out successfully')
  }

  const switchMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setSuccess('')
    setFormData({ name: '', email: '', password: '', confirmPassword: '' })
  }

  // If user is authenticated, show profile
  if (isAuthenticated && user) {
    return (
      <div className="account-page">
        <div className="account-container">
          <div className="profile-section">
            <div className="profile-header">
              <div className="profile-avatar">
                <User size={80} />
              </div>
              <div className="profile-info">
                <h1>{user.name}</h1>
                <p className="email">{user.email}</p>
                <p className="join-date">
                  Member since {new Date(user.joinedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="profile-actions">
              <button 
                className="btn-danger"
                onClick={handleLogout}
                disabled={formLoading}
              >
                <LogOut size={20} />
                Logout
              </button>
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
          <p>{isLogin ? 'Sign in to continue learning' : 'Create an account to start learning'}</p>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              {success}
            </div>
          )}

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
                    placeholder="Enter your name"
                    disabled={formLoading}
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
                  disabled={formLoading}
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
                  disabled={formLoading}
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
                    disabled={formLoading}
                  />
                </div>
              </div>
            )}

            <button 
              type="submit" 
              className="btn-primary"
              disabled={formLoading}
            >
              {formLoading ? (
                <>
                  <Loader size={16} className="spinner" />
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="auth-switch">
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                type="button"
                className="link-button"
                onClick={switchMode}
                disabled={formLoading}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Demo credentials hint */}
          <div className="demo-hint">
            <p><strong>Demo:</strong> Use any email and password to test the app</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account 