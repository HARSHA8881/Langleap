import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Home, BookOpen, Brain, BarChart3, Settings, User, LogOut } from 'lucide-react'
import { useApp } from '../context/AppContext'
import '../styles/components/Navigation.css'

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAuthenticated, isLoading, logout } = useApp()
  const location = useLocation()

  // Show different navigation items based on login status
  const navItems = isAuthenticated ? [
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/vocabulary', icon: BookOpen, label: 'Vocabulary' },
    { path: '/quiz', icon: Brain, label: 'Quiz' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ] : [
    { path: '/', icon: Home, label: 'Home' }
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false) // Close mobile menu if open
  }

  // Don't show navigation while loading to prevent flash
  if (isLoading) {
    return (
      <nav className="navigation">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-text">LangLeap</span>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="nav-logo">
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
          {isAuthenticated && user ? (
            <div className="user-info">
              <span className="user-name">Hi, {user.name}!</span>
              <Link to="/account" className="user-avatar">
                <User size={24} />
              </Link>
              <button className="logout-btn" onClick={handleLogout} title="Logout">
                <LogOut size={20} />
              </button>
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
          {isAuthenticated ? (
            <button
              className="nav-link-mobile logout-mobile"
              onClick={handleLogout}
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          ) : (
            <Link
              to="/account"
              className="nav-link-mobile"
              onClick={() => setIsMenuOpen(false)}
            >
              <User size={20} />
              <span>Login</span>
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navigation 