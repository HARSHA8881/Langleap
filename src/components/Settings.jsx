import React, { useState } from 'react'
import { Settings as SettingsIcon, Moon, Sun, Globe, Bell, User, Save, RotateCcw } from 'lucide-react'
import { useApp } from '../context/AppContext'

function Settings() {
  const { state, dispatch } = useApp()
  const [tempSettings, setTempSettings] = useState({ ...state.settings })
  const [hasChanges, setHasChanges] = useState(false)

  const handleSettingChange = (key, value) => {
    setTempSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const saveSettings = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: tempSettings })
    setHasChanges(false)
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', tempSettings.theme)
  }

  const resetSettings = () => {
    setTempSettings({ ...state.settings })
    setHasChanges(false)
  }

  const languages = [
    { code: 'spanish', name: 'Spanish', flag: '🇪🇸' },
    { code: 'french', name: 'French', flag: '🇫🇷' },
    { code: 'german', name: 'German', flag: '🇩🇪' },
    { code: 'italian', name: 'Italian', flag: '🇮🇹' },
    { code: 'portuguese', name: 'Portuguese', flag: '🇵🇹' }
  ]

  const nativeLanguages = [
    { code: 'english', name: 'English', flag: '🇺🇸' },
    { code: 'spanish', name: 'Spanish', flag: '🇪🇸' },
    { code: 'french', name: 'French', flag: '🇫🇷' }
  ]

  const difficulties = [
    { value: 'beginner', label: 'Beginner', description: 'Basic vocabulary and simple grammar' },
    { value: 'intermediate', label: 'Intermediate', description: 'Expanded vocabulary and complex structures' },
    { value: 'advanced', label: 'Advanced', description: 'Advanced vocabulary and nuanced expressions' }
  ]

  return (
    <div className="settings-page">
      <div className="settings-container">
        {/* Header */}
        <div className="settings-header">
          <div className="header-content">
            <SettingsIcon size={32} />
            <div>
              <h1>Settings</h1>
              <p>Customize your learning experience</p>
            </div>
          </div>
          
          {hasChanges && (
            <div className="settings-actions">
              <button className="btn-secondary" onClick={resetSettings}>
                <RotateCcw size={16} />
                Reset
              </button>
              <button className="btn-primary" onClick={saveSettings}>
                <Save size={16} />
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Settings Sections */}
        <div className="settings-content">
          
          {/* Appearance Section */}
          <div className="settings-section">
            <div className="section-header">
              <h2>Appearance</h2>
              <p>Customize the look and feel of your app</p>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label>Theme</label>
                <span>Choose between light and dark mode</span>
              </div>
              <div className="setting-control">
                <div className="theme-toggle">
                  <button
                    className={`theme-option ${tempSettings.theme === 'light' ? 'active' : ''}`}
                    onClick={() => handleSettingChange('theme', 'light')}
                  >
                    <Sun size={20} />
                    Light
                  </button>
                  <button
                    className={`theme-option ${tempSettings.theme === 'dark' ? 'active' : ''}`}
                    onClick={() => handleSettingChange('theme', 'dark')}
                  >
                    <Moon size={20} />
                    Dark
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Language Section */}
          <div className="settings-section">
            <div className="section-header">
              <Globe size={24} />
              <div>
                <h2>Languages</h2>
                <p>Set your learning and native languages</p>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label>Target Language</label>
                <span>The language you want to learn</span>
              </div>
              <div className="setting-control">
                <select
                  value={tempSettings.targetLanguage}
                  onChange={(e) => handleSettingChange('targetLanguage', e.target.value)}
                  className="language-select"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label>Native Language</label>
                <span>Your primary language for translations</span>
              </div>
              <div className="setting-control">
                <select
                  value={tempSettings.nativeLanguage}
                  onChange={(e) => handleSettingChange('nativeLanguage', e.target.value)}
                  className="language-select"
                >
                  {nativeLanguages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Learning Section */}
          <div className="settings-section">
            <div className="section-header">
              <User size={24} />
              <div>
                <h2>Learning Preferences</h2>
                <p>Customize your learning experience</p>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label>Difficulty Level</label>
                <span>Adjust quiz and content difficulty</span>
              </div>
              <div className="setting-control">
                <div className="difficulty-options">
                  {difficulties.map(diff => (
                    <div key={diff.value} className="difficulty-option">
                      <input
                        type="radio"
                        id={diff.value}
                        name="difficulty"
                        value={diff.value}
                        checked={tempSettings.difficulty === diff.value}
                        onChange={(e) => handleSettingChange('difficulty', e.target.value)}
                      />
                      <label htmlFor={diff.value}>
                        <div className="difficulty-header">
                          <strong>{diff.label}</strong>
                        </div>
                        <div className="difficulty-description">
                          {diff.description}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="settings-section">
            <div className="section-header">
              <Bell size={24} />
              <div>
                <h2>Notifications</h2>
                <p>Manage your notification preferences</p>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label>Push Notifications</label>
                <span>Receive reminders to practice</span>
              </div>
              <div className="setting-control">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={tempSettings.notifications}
                    onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label>Daily Reminders</label>
                <span>Get reminded to practice daily</span>
              </div>
              <div className="setting-control">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={tempSettings.dailyReminders || false}
                    onChange={(e) => handleSettingChange('dailyReminders', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label>Weekly Progress Reports</label>
                <span>Receive weekly summary of your progress</span>
              </div>
              <div className="setting-control">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={tempSettings.weeklyReports || false}
                    onChange={(e) => handleSettingChange('weeklyReports', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Data Section */}
          <div className="settings-section">
            <div className="section-header">
              <h2>Data & Privacy</h2>
              <p>Manage your learning data</p>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label>Export Learning Data</label>
                <span>Download your vocabulary and progress data</span>
              </div>
              <div className="setting-control">
                <button className="btn-secondary">
                  Download Data
                </button>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label>Reset Progress</label>
                <span className="danger-text">This will clear all your learning progress</span>
              </div>
              <div className="setting-control">
                <button className="btn-danger">
                  Reset All Progress
                </button>
              </div>
            </div>
          </div>

          {/* Account Section */}
          {state.user && (
            <div className="settings-section">
              <div className="section-header">
                <User size={24} />
                <div>
                  <h2>Account</h2>
                  <p>Manage your account settings</p>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <label>Account Email</label>
                  <span>{state.user.email}</span>
                </div>
                <div className="setting-control">
                  <button className="btn-secondary">
                    Change Email
                  </button>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <label>Password</label>
                  <span>Last updated: Never</span>
                </div>
                <div className="setting-control">
                  <button className="btn-secondary">
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save Button Fixed at Bottom */}
        {hasChanges && (
          <div className="settings-footer">
            <div className="footer-content">
              <span>You have unsaved changes</span>
              <div className="footer-actions">
                <button className="btn-secondary" onClick={resetSettings}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={saveSettings}>
                  <Save size={16} />
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Settings 