import React, { createContext, useContext, useReducer, useEffect } from 'react'

const AppContext = createContext()

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Add loading state for initial auth check
  vocabulary: [],
  learnedWords: new Set(),
  progress: {
    totalWordsLearned: 0,
    quizzesCompleted: 0
  },
  quizHistory: [],
  settings: {
    theme: 'light',
    targetLanguage: 'spanish',
    nativeLanguage: 'english'
  }
}

function appReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      console.log('LOGIN_SUCCESS:', action.payload)
      return { 
        ...state, 
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false
      }
    case 'LOGOUT':
      console.log('LOGOUT: Clearing user session')
      return { 
        ...state, 
        user: null,
        isAuthenticated: false,
        isLoading: false
      }
    case 'AUTH_INITIALIZED':
      console.log('AUTH_INITIALIZED:', action.payload)
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: action.payload.isAuthenticated,
        isLoading: false
      }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'ADD_VOCABULARY':
      return {
        ...state,
        vocabulary: [...state.vocabulary, action.payload]
      }
    case 'TOGGLE_LEARNED_WORD':
      const newLearnedWords = new Set(state.learnedWords)
      if (newLearnedWords.has(action.payload)) {
        newLearnedWords.delete(action.payload)
      } else {
        newLearnedWords.add(action.payload)
      }
      return {
        ...state,
        learnedWords: newLearnedWords,
        progress: {
          ...state.progress,
          totalWordsLearned: newLearnedWords.size
        }
      }
    case 'ADD_QUIZ_RESULT':
      return {
        ...state,
        quizHistory: [...state.quizHistory, action.payload],
        progress: {
          ...state.progress,
          quizzesCompleted: state.progress.quizzesCompleted + 1
        }
      }
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } }
    case 'LOAD_USER_DATA':
      // Load user-specific data (vocabulary, progress, etc.)
      const loadedData = { ...action.payload }
      
      // Convert learnedWords array back to Set
      if (loadedData.learnedWords && Array.isArray(loadedData.learnedWords)) {
        loadedData.learnedWords = new Set(loadedData.learnedWords)
      } else {
        loadedData.learnedWords = new Set()
      }
      
      // Ensure progress exists
      if (!loadedData.progress) {
        loadedData.progress = initialState.progress
      }
      
      console.log('LOAD_USER_DATA:', loadedData)
      return {
        ...state,
        ...loadedData
      }
    default:
      return state
  }
}

// Auth utility functions
const AuthService = {
  // Save auth data to localStorage
  saveAuthData: (user, token) => {
    try {
      const authData = {
        user,
        token,
        timestamp: Date.now()
      }
      localStorage.setItem('langleap-auth', JSON.stringify(authData))
      console.log('Auth data saved to localStorage:', authData)
    } catch (error) {
      console.error('Error saving auth data:', error)
    }
  },

  // Get auth data from localStorage
  getAuthData: () => {
    try {
      const authData = localStorage.getItem('langleap-auth')
      if (authData) {
        const parsed = JSON.parse(authData)
        console.log('Auth data loaded from localStorage:', parsed)
        return parsed
      }
      return null
    } catch (error) {
      console.error('Error loading auth data:', error)
      localStorage.removeItem('langleap-auth')
      return null
    }
  },

  // Clear auth data
  clearAuthData: () => {
    try {
      localStorage.removeItem('langleap-auth')
      console.log('Auth data cleared from localStorage')
    } catch (error) {
      console.error('Error clearing auth data:', error)
    }
  },

  // Mock login function
  login: async (email, password, name = null) => {
    console.log('Attempting login:', { email, password, name })
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock authentication logic
    if (email && password) {
      const user = {
        id: Date.now(),
        name: name || email.split('@')[0],
        email: email,
        joinedAt: new Date().toISOString()
      }
      
      const token = `demo-token-${Date.now()}`
      
      console.log('Login successful:', user)
      return { user, token }
    }
    
    throw new Error('Invalid credentials')
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Initialize authentication on app start
  useEffect(() => {
    const initializeAuth = () => {
      console.log('Initializing authentication...')
      
      const authData = AuthService.getAuthData()
      
      if (authData && authData.user && authData.token) {
        // User is authenticated
        dispatch({
          type: 'AUTH_INITIALIZED',
          payload: {
            user: authData.user,
            isAuthenticated: true
          }
        })
        
        // Load user-specific data
        loadUserData()
      } else {
        // No valid auth data
        dispatch({
          type: 'AUTH_INITIALIZED',
          payload: {
            user: null,
            isAuthenticated: false
          }
        })
      }
    }

    initializeAuth()
  }, [])

  // Load user-specific data from localStorage
  const loadUserData = () => {
    try {
      const userData = localStorage.getItem('langleap-user-data')
      if (userData) {
        const parsedData = JSON.parse(userData)
        dispatch({ type: 'LOAD_USER_DATA', payload: parsedData })
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  // Save user-specific data to localStorage
  useEffect(() => {
    if (state.isAuthenticated && state.user) {
      try {
        const userDataToSave = {
          vocabulary: state.vocabulary,
          learnedWords: Array.from(state.learnedWords),
          progress: state.progress,
          quizHistory: state.quizHistory,
          settings: state.settings
        }
        localStorage.setItem('langleap-user-data', JSON.stringify(userDataToSave))
        console.log('User data saved to localStorage')
      } catch (error) {
        console.error('Error saving user data:', error)
      }
    }
  }, [state.vocabulary, state.learnedWords, state.progress, state.quizHistory, state.settings, state.isAuthenticated, state.user])

  // Auth functions
  const login = async (email, password, name = null) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const { user, token } = await AuthService.login(email, password, name)
      
      // Save to localStorage
      AuthService.saveAuthData(user, token)
      
      // Update state
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      })
      
      console.log('Login completed successfully')
      return { success: true, user }
      
    } catch (error) {
      console.error('Login failed:', error)
      dispatch({ type: 'SET_LOADING', payload: false })
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    console.log('Logging out user...')
    
    // Clear localStorage
    AuthService.clearAuthData()
    localStorage.removeItem('langleap-user-data')
    
    // Update state
    dispatch({ type: 'LOGOUT' })
    
    console.log('Logout completed')
  }

  const contextValue = {
    // State
    ...state,
    
    // Auth functions
    login,
    logout,
    
    // Other dispatch function
    dispatch
  }

  return (
    <AppContext.Provider value={contextValue}>
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

// Export auth service for use in components if needed
export { AuthService } 