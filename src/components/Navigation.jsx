import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Home, BookOpen, Brain, BarChart3, Settings, User } from 'lucide-react'
import { useApp } from '../context/AppContext'

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { state } = useApp()
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/vocabulary', icon: BookOpen, label: 'Vocabulary' },
    { path: '/quiz', icon: Brain, label: 'Quiz' },
    { path: '/progress', icon: BarChart3, label: 'Progress' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-text">LangLeap</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links-desktop">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link ${isActive(path) ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        {/* User Section */}
        <div className="nav-user">
          {state.user ? (
            <div className="user-info">
              <span className="user-points">{state.progress.points} pts</span>
              <Link to="/account" className="user-avatar">
                <User size={24} />
              </Link>
            </div>
          ) : (
            <Link to="/account" className="login-btn">
              <User size={20} />
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="nav-links-mobile">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link-mobile ${isActive(path) ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}

export default Navigation 