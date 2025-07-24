import React, { useState, useEffect } from 'react'
import { Brain, Clock, CheckCircle, XCircle, RotateCcw, Trophy, ArrowRight } from 'lucide-react'
import { useApp } from '../context/AppContext'

// Mock quiz data - in real app, this would come from an API
const quizQuestions = [
  {
    id: 1,
    question: "What does 'hola' mean in English?",
    options: ['goodbye', 'hello', 'please', 'thank you'],
    correct: 1,
    difficulty: 'beginner'
  },
  {
    id: 2,
    question: "How do you say 'thank you' in Spanish?",
    options: ['por favor', 'de nada', 'gracias', 'perdón'],
    correct: 2,
    difficulty: 'beginner'
  },
  {
    id: 3,
    question: "What does 'casa' mean?",
    options: ['car', 'house', 'food', 'work'],
    correct: 1,
    difficulty: 'beginner'
  },
  {
    id: 4,
    question: "Which word means 'family'?",
    options: ['amigo', 'trabajo', 'familia', 'escuela'],
    correct: 2,
    difficulty: 'beginner'
  },
  {
    id: 5,
    question: "How do you say 'good morning'?",
    options: ['buenas noches', 'buenos días', 'buenas tardes', 'hasta luego'],
    correct: 1,
    difficulty: 'intermediate'
  },
  {
    id: 6,
    question: "What does 'trabajar' mean?",
    options: ['to eat', 'to work', 'to sleep', 'to study'],
    correct: 1,
    difficulty: 'intermediate'
  },
  {
    id: 7,
    question: "Which phrase means 'I am hungry'?",
    options: ['Tengo sed', 'Tengo hambre', 'Tengo frío', 'Tengo calor'],
    correct: 1,
    difficulty: 'intermediate'
  },
  {
    id: 8,
    question: "What is the correct conjugation: 'Yo _____ español'?",
    options: ['hablas', 'habla', 'hablo', 'hablan'],
    correct: 2,
    difficulty: 'advanced'
  }
]

const QUIZ_TIME_LIMIT = 300 // 5 minutes in seconds

function Quiz() {
  const { state, dispatch } = useApp()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [answers, setAnswers] = useState([])
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME_LIMIT)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    // Filter questions based on user's difficulty level
    const userLevel = state.settings.difficulty
    let filteredQuestions = quizQuestions

    if (userLevel === 'beginner') {
      filteredQuestions = quizQuestions.filter(q => q.difficulty === 'beginner').slice(0, 5)
    } else if (userLevel === 'intermediate') {
      filteredQuestions = quizQuestions.filter(q => 
        q.difficulty === 'beginner' || q.difficulty === 'intermediate'
      ).slice(0, 6)
    } else {
      filteredQuestions = quizQuestions.slice(0, 8)
    }

    setQuestions(filteredQuestions)
  }, [state.settings.difficulty])

  // Timer effect
  useEffect(() => {
    if (quizStarted && !quizCompleted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !quizCompleted) {
      handleQuizComplete()
    }
  }, [timeLeft, quizStarted, quizCompleted])

  const startQuiz = () => {
    setQuizStarted(true)
    setCurrentQuestion(0)
    setAnswers([])
    setShowResult(false)
    setQuizCompleted(false)
    setTimeLeft(QUIZ_TIME_LIMIT)
  }

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex)
  }

  const handleNextQuestion = () => {
    const newAnswers = [...answers, selectedAnswer]
    setAnswers(newAnswers)
    setSelectedAnswer(null)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleQuizComplete(newAnswers)
    }
  }

  const handleQuizComplete = (finalAnswers = answers) => {
    setQuizCompleted(true)
    
    // Calculate score
    let correctAnswers = 0
    questions.forEach((question, index) => {
      if (finalAnswers[index] === question.correct) {
        correctAnswers++
      }
    })

    const finalScore = Math.round((correctAnswers / questions.length) * 100)
    setScore(finalScore)

    // Save quiz result
    const quizResult = {
      score: finalScore,
      questions: questions.length,
      correctAnswers,
      completedAt: new Date().toISOString(),
      timeSpent: QUIZ_TIME_LIMIT - timeLeft,
      difficulty: state.settings.difficulty
    }

    dispatch({ type: 'ADD_QUIZ_RESULT', payload: quizResult })
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setAnswers([])
    setShowResult(false)
    setQuizStarted(false)
    setQuizCompleted(false)
    setTimeLeft(QUIZ_TIME_LIMIT)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getScoreMessage = (score) => {
    if (score >= 90) return { message: "Excellent! You're mastering the language!", icon: "🌟" }
    if (score >= 80) return { message: "Great job! You're doing very well!", icon: "🎉" }
    if (score >= 70) return { message: "Good work! Keep practicing!", icon: "👍" }
    if (score >= 60) return { message: "Not bad! Review and try again!", icon: "📚" }
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
              <p>Test your {state.settings.targetLanguage} knowledge and track your progress</p>
            </div>

            <div className="quiz-info">
              <div className="info-item">
                <Clock size={24} />
                <div>
                  <strong>Time Limit</strong>
                  <span>{formatTime(QUIZ_TIME_LIMIT)}</span>
                </div>
              </div>
              
              <div className="info-item">
                <Brain size={24} />
                <div>
                  <strong>Questions</strong>
                  <span>{questions.length} questions</span>
                </div>
              </div>
              
              <div className="info-item">
                <Trophy size={24} />
                <div>
                  <strong>Difficulty</strong>
                  <span className={`difficulty-badge ${state.settings.difficulty}`}>
                    {state.settings.difficulty}
                  </span>
                </div>
              </div>
            </div>

            {state.quizHistory.length > 0 && (
              <div className="recent-scores">
                <h3>Your Recent Scores</h3>
                <div className="scores-list">
                  {state.quizHistory.slice(-3).reverse().map((quiz, index) => (
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
                <span>{answers.filter((ans, i) => ans === questions[i]?.correct).length} Correct</span>
              </div>
              
              <div className="stat">
                <XCircle className="stat-icon incorrect" />
                <span>{questions.length - answers.filter((ans, i) => ans === questions[i]?.correct).length} Incorrect</span>
              </div>
              
              <div className="stat">
                <Clock className="stat-icon" />
                <span>{formatTime(QUIZ_TIME_LIMIT - timeLeft)} Used</span>
              </div>
            </div>

            <div className="question-review">
              <h3>Review Your Answers</h3>
              {questions.map((question, index) => {
                const userAnswer = answers[index]
                const isCorrect = userAnswer === question.correct
                
                return (
                  <div key={question.id} className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                    <div className="question-info">
                      <span className="question-number">Q{index + 1}</span>
                      <span className="question-text">{question.question}</span>
                      {isCorrect ? <CheckCircle size={20} className="result-icon correct" /> : <XCircle size={20} className="result-icon incorrect" />}
                    </div>
                    
                    <div className="answer-info">
                      <div className="user-answer">
                        Your answer: <span className={isCorrect ? 'correct-text' : 'incorrect-text'}>
                          {question.options[userAnswer] || 'No answer'}
                        </span>
                      </div>
                      
                      {!isCorrect && (
                        <div className="correct-answer">
                          Correct answer: <span className="correct-text">
                            {question.options[question.correct]}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="results-actions">
              <button className="btn-secondary" onClick={restartQuiz}>
                <RotateCcw size={20} />
                Try Again
              </button>
              
              <button 
                className="btn-primary"
                onClick={() => window.location.href = '/dashboard'}
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

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="quiz-page">
      <div className="quiz-container">
        <div className="quiz-header-active">
          <div className="quiz-progress">
            <div className="progress-info">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span className="timer">{formatTime(timeLeft)}</span>
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
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Quiz 