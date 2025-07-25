import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Settings as SettingsIcon, Moon, Sun, Globe, Loader } from 'lucide-react'
import { useApp } from '../context/AppContext'
import '../styles/components/Settings.css'

function Settings() {
  const { user, isAuthenticated, isLoading, settings, dispatch } = useApp()
  const navigate = useNavigate()
  const [localSettings, setLocalSettings] = useState(settings)

  // Redirect to account if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('User not authenticated, redirecting to login')
      navigate('/account')
    }
  }, [isAuthenticated, isLoading, navigate])

  useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="settings-page">
        <div className="settings-container">
          <div className="loading-container">
            <Loader size={48} className="spinner" />
            <p>Loading settings...</p>
          </div>
        </div>
      </div>
    )
  }

  // If user is not authenticated, show message
  if (!isAuthenticated || !user) {
    return (
      <div className="settings-page">
        <div className="simple-message">
          <p>Please log in to access settings!</p>
          <Link to="/account" className="btn-primary">Go to Login</Link>
        </div>
      </div>
    )
  }

  const handleSettingChange = (key, value) => {
    const newSettings = { ...localSettings, [key]: value }
    setLocalSettings(newSettings)
    dispatch({ type: 'UPDATE_SETTINGS', payload: { [key]: value } })
  }

  const toggleTheme = () => {
    const newTheme = localSettings.theme === 'light' ? 'dark' : 'light'
    handleSettingChange('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <SettingsIcon size={32} />
          <h1>Settings</h1>
          <p>Customize your learning experience</p>
        </div>

        <div className="settings-sections">
          <div className="settings-section">
            <h2>Appearance</h2>
            
            <div className="setting-item">
              <div className="setting-info">
                <label>Theme</label>
                <span>Choose your preferred theme</span>
              </div>
              <button 
                className="theme-toggle"
                onClick={toggleTheme}
              >
                {localSettings.theme === 'light' ? (
                  <>
                    <Sun size={20} />
                    Light
                  </>
                ) : (
                  <>
                    <Moon size={20} />
                    Dark
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="settings-section">
            <h2>Language Learning</h2>
            
            <div className="setting-item">
              <div className="setting-info">
                <label>Target Language</label>
                <span>Language you're learning</span>
              </div>
              <select
                value={localSettings.targetLanguage}
                onChange={(e) => handleSettingChange('targetLanguage', e.target.value)}
                className="setting-select"
              >
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="german">German</option>
                <option value="italian">Italian</option>
              </select>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label>Native Language</label>
                <span>Your native language</span>
              </div>
              <select
                value={localSettings.nativeLanguage}
                onChange={(e) => handleSettingChange('nativeLanguage', e.target.value)}
                className="setting-select"
              >
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="german">German</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings 