import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Brain, CheckCircle, XCircle, RotateCcw, ArrowRight, Loader } from 'lucide-react'
import { useApp } from '../context/AppContext'
import '../styles/components/Quiz.css'

// Simple quiz questions - no difficulty levels
const quizQuestions = [
  {
    id: 1,
    question: "What does 'hola' mean in English?",
    options: ['goodbye', 'hello', 'please', 'thank you'],
    correct: 1
  },
  {
    id: 2,
    question: "How do you say 'thank you' in Spanish?",
    options: ['por favor', 'de nada', 'gracias', 'perdón'],
    correct: 2
  },
  {
    id: 3,
    question: "What does 'casa' mean?",
    options: ['car', 'house', 'food', 'work'],
    correct: 1
  },
  {
    id: 4,
    question: "Which word means 'family'?",
    options: ['amigo', 'trabajo', 'familia', 'escuela'],
    correct: 2
  },
  {
    id: 5,
    question: "How do you say 'good morning'?",
    options: ['buenas noches', 'buenos días', 'buenas tardes', 'hasta luego'],
    correct: 1
  }
]

function Quiz() {
  const { user, isAuthenticated, isLoading, settings, quizHistory, dispatch } = useApp()
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [answers, setAnswers] = useState([])
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)

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
      <div className="quiz-page">
        <div className="quiz-container">
          <div className="loading-container">
            <Loader size={48} className="spinner" />
            <p>Loading quiz...</p>
          </div>
        </div>
      </div>
    )
  }

  // If user is not authenticated, show message
  if (!isAuthenticated || !user) {
    return (
      <div className="quiz-page">
        <div className="simple-message">
          <p>Please log in to take a quiz!</p>
          <Link to="/account" className="btn-primary">Go to Login</Link>
        </div>
      </div>
    )
  }

  const startQuiz = () => {
    setQuizStarted(true)
    setCurrentQuestion(0)
    setAnswers([])
    setQuizCompleted(false)
  }

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex)
  }

  const handleNextQuestion = () => {
    const newAnswers = [...answers, selectedAnswer]
    setAnswers(newAnswers)
    setSelectedAnswer(null)

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleQuizComplete(newAnswers)
    }
  }

  const handleQuizComplete = (finalAnswers = answers) => {
    setQuizCompleted(true)
    
    // Calculate score
    let correctAnswers = 0
    quizQuestions.forEach((question, index) => {
      if (finalAnswers[index] === question.correct) {
        correctAnswers++
      }
    })

    const finalScore = Math.round((correctAnswers / quizQuestions.length) * 100)
    setScore(finalScore)

    // Save quiz result
    const quizResult = {
      score: finalScore,
      questions: quizQuestions.length,
      correctAnswers,
      completedAt: new Date().toISOString()
    }

    dispatch({ type: 'ADD_QUIZ_RESULT', payload: quizResult })
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setAnswers([])
    setQuizStarted(false)
    setQuizCompleted(false)
  }

  const getScoreMessage = (score) => {
    if (score >= 80) return { message: "Great job! You're doing very well!", icon: "🎉" }
    if (score >= 60) return { message: "Good work! Keep practicing!", icon: "👍" }
    return { message: "Keep studying! You'll improve with practice!", icon: "💪" }
  }

  if (!quizStarted) {
    return (
      <div className="quiz-page">
        <div className="quiz-container">
          <div className="quiz-intro">
            <div className="quiz-header">
              <Brain size={64} className="quiz-icon" />
              <h1>Ready for a Quiz?</h1>
              <p>Test your {settings.targetLanguage} knowledge</p>
            </div>

            <div className="quiz-info">
              <div className="info-item">
                <Brain size={24} />
                <div>
                  <strong>Questions</strong>
                  <span>{quizQuestions.length} questions</span>
                </div>
              </div>
            </div>

            {quizHistory.length > 0 && (
              <div className="recent-scores">
                <h3>Your Recent Scores</h3>
                <div className="scores-list">
                  {quizHistory.slice(-3).reverse().map((quiz, index) => (
                    <div key={index} className="score-item">
                      <span className={`score ${quiz.score >= 80 ? 'good' : quiz.score >= 60 ? 'average' : 'needs-improvement'}`}>
                        {quiz.score}%
                      </span>
                      <span>{new Date(quiz.completedAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button className="start-quiz-btn" onClick={startQuiz}>
              <Brain size={20} />
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (quizCompleted) {
    const scoreMessage = getScoreMessage(score)
    
    return (
      <div className="quiz-page">
        <div className="quiz-container">
          <div className="quiz-results">
            <div className="results-header">
              <div className="score-display">
                <span className="score-emoji">{scoreMessage.icon}</span>
                <h1 className={`final-score ${score >= 80 ? 'excellent' : score >= 60 ? 'good' : 'needs-improvement'}`}>
                  {score}%
                </h1>
                <p className="score-message">{scoreMessage.message}</p>
              </div>
            </div>

            <div className="results-stats">
              <div className="stat">
                <CheckCircle className="stat-icon correct" />
                <span>{answers.filter((ans, i) => ans === quizQuestions[i]?.correct).length} Correct</span>
              </div>
              
              <div className="stat">
                <XCircle className="stat-icon incorrect" />
                <span>{quizQuestions.length - answers.filter((ans, i) => ans === quizQuestions[i]?.correct).length} Incorrect</span>
              </div>
            </div>

            <div className="results-actions">
              <button className="btn-secondary" onClick={restartQuiz}>
                <RotateCcw size={20} />
                Try Again
              </button>
              
              <button 
                className="btn-primary"
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = quizQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100

  return (
    <div className="quiz-page">
      <div className="quiz-container">
        <div className="quiz-header-active">
          <div className="quiz-progress">
            <div className="progress-info">
              <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>

        <div className="quiz-question">
          <div className="question-container">
            <h2 className="question-text">{currentQ?.question}</h2>
            
            <div className="options-container">
              {currentQ?.options.map((option, index) => (
                <button
                  key={index}
                  className={`option-button ${selectedAnswer === index ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <span className="option-text">{option}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="quiz-navigation">
            <button 
              className="next-button"
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
            >
              {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Quiz 