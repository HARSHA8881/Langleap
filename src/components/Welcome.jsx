import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Brain, Star, Users } from 'lucide-react'
import { useApp } from '../context/AppContext'

function Welcome() {
  const { state } = useApp()

  // If user is already logged in, show personalized welcome
  if (state.user) {
    return (
      <div className="welcome-page logged-in">
        <div className="welcome-container">
          <h1>Welcome back, {state.user.name}!</h1>
          <p>Ready to continue your language learning journey?</p>
          
          <div className="quick-stats">
            <div className="stat">
              <span className="stat-number">{state.progress.totalWordsLearned}</span>
              <span className="stat-label">Words Learned</span>
            </div>
            <div className="stat">
              <span className="stat-number">{state.progress.streak}</span>
              <span className="stat-label">Day Streak</span>
            </div>
            <div className="stat">
              <span className="stat-number">{state.progress.points}</span>
              <span className="stat-label">Points</span>
            </div>
          </div>

          <div className="cta-buttons">
            <Link to="/dashboard" className="cta-primary">
              Continue Learning
              <ArrowRight size={20} />
            </Link>
            <Link to="/quiz" className="cta-secondary">
              Take a Quiz
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="welcome-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Master New Languages with <span className="highlight">LangLeap</span>
          </h1>
          <p className="hero-subtitle">
            Learn vocabulary, take interactive quizzes, and track your progress in a fun, gamified environment. Start your language learning journey today!
          </p>

          <div className="cta-buttons">
            <Link to="/account" className="cta-primary">
              Get Started
              <ArrowRight size={20} />
            </Link>
            <Link to="/vocabulary" className="cta-secondary">
              Explore Vocabulary
            </Link>
          </div>
        </div>

        <div className="hero-image">
          <div className="feature-preview">
            <div className="preview-card">
              <BookOpen size={40} />
              <h3>Interactive Learning</h3>
              <p>Engage with vocabulary and phrases</p>
            </div>
            <div className="preview-card">
              <Brain size={40} />
              <h3>Smart Quizzes</h3>
              <p>Test your knowledge with adaptive quizzes</p>
            </div>
            <div className="preview-card">
              <Star size={40} />
              <h3>Progress Tracking</h3>
              <p>Monitor your learning journey</p>
            </div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2>Why Choose LangLeap?</h2>
        <div className="features-grid">
          <div className="feature-item">
            <BookOpen size={48} className="feature-icon" />
            <h3>Rich Vocabulary</h3>
            <p>Access thousands of words and phrases with real-time translations and context examples.</p>
          </div>
          
          <div className="feature-item">
            <Brain size={48} className="feature-icon" />
            <h3>Adaptive Quizzes</h3>
            <p>Challenge yourself with multiple-choice quizzes that adapt to your learning level.</p>
          </div>
          
          <div className="feature-item">
            <Star size={48} className="feature-icon" />
            <h3>Gamified Experience</h3>
            <p>Earn points, maintain streaks, and unlock achievements as you progress.</p>
          </div>
          
          <div className="feature-item">
            <Users size={48} className="feature-icon" />
            <h3>Track Progress</h3>
            <p>Visual charts and statistics help you monitor your learning journey.</p>
          </div>
        </div>
      </div>

      <div className="call-to-action-section">
        <h2>Ready to Start Learning?</h2>
        <p>Join thousands of learners who have improved their language skills with LangLeap</p>
        <Link to="/account" className="cta-large">
          Start Your Journey
          <ArrowRight size={24} />
        </Link>
      </div>
    </div>
  )
}

export default Welcome 