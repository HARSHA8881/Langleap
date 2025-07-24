import React, { createContext, useContext, useReducer, useEffect } from 'react'

const AppContext = createContext()

const initialState = {
  user: null,
  vocabulary: [],
  progress: {
    totalWordsLearned: 0,
    quizScore: 0,
    currentLevel: 1,
    points: 0,
    streak: 0,
    achievements: []
  },
  quizHistory: [],
  currentQuiz: null,
  settings: {
    theme: 'light',
    targetLanguage: 'spanish',
    nativeLanguage: 'english',
    difficulty: 'beginner',
    notifications: true
  }
}

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload }
    case 'LOGOUT':
      return { ...state, user: null }
    case 'ADD_VOCABULARY':
      return {
        ...state,
        vocabulary: [...state.vocabulary, action.payload],
        progress: {
          ...state.progress,
          totalWordsLearned: state.progress.totalWordsLearned + 1,
          points: state.progress.points + 10
        }
      }
    case 'UPDATE_PROGRESS':
      return { ...state, progress: { ...state.progress, ...action.payload } }
    case 'ADD_QUIZ_RESULT':
      return {
        ...state,
        quizHistory: [...state.quizHistory, action.payload],
        progress: {
          ...state.progress,
          quizScore: action.payload.score,
          points: state.progress.points + (action.payload.score * 5),
          streak: action.payload.score > 70 ? state.progress.streak + 1 : 0
        }
      }
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } }
    case 'LOAD_STATE':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('langleap-state')
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState)
        dispatch({ type: 'LOAD_STATE', payload: parsedState })
      } catch (error) {
        console.error('Error loading saved state:', error)
      }
    }
  }, [])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('langleap-state', JSON.stringify(state))
  }, [state])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
} 