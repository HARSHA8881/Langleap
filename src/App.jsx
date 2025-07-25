import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Navigation from './components/Navigation'
import Welcome from './components/Welcome'
import Account from './components/Account'
import Dashboard from './components/Dashboard'
import Vocabulary from './components/Vocabulary'
import Quiz from './components/Quiz'
import Settings from './components/Settings'
import './styles/global.css'

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/account" element={<Account />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/vocabulary" element={<Vocabulary />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  )
}

export default App