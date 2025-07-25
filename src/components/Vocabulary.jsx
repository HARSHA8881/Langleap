import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, Plus, BookOpen, Check, Volume2, Loader } from 'lucide-react'
import { useApp } from '../context/AppContext'
import '../styles/components/Vocabulary.css'

// Expanded vocabulary data with categories
const mockVocabulary = [
  // Greetings
  { id: 1, word: 'hola', translation: 'hello', category: 'greetings' },
  { id: 2, word: 'adiós', translation: 'goodbye', category: 'greetings' },
  { id: 3, word: 'buenos días', translation: 'good morning', category: 'greetings' },
  { id: 4, word: 'buenas noches', translation: 'good night', category: 'greetings' },
  
  // Courtesy
  { id: 5, word: 'gracias', translation: 'thank you', category: 'courtesy' },
  { id: 6, word: 'por favor', translation: 'please', category: 'courtesy' },
  { id: 7, word: 'perdón', translation: 'excuse me', category: 'courtesy' },
  { id: 8, word: 'de nada', translation: 'you\'re welcome', category: 'courtesy' },
  
  // Family & People
  { id: 9, word: 'familia', translation: 'family', category: 'people' },
  { id: 10, word: 'amigo', translation: 'friend', category: 'people' },
  { id: 11, word: 'madre', translation: 'mother', category: 'people' },
  { id: 12, word: 'padre', translation: 'father', category: 'people' },
  { id: 13, word: 'hermano', translation: 'brother', category: 'people' },
  { id: 14, word: 'hermana', translation: 'sister', category: 'people' },
  
  // Home & Places
  { id: 15, word: 'casa', translation: 'house', category: 'places' },
  { id: 16, word: 'escuela', translation: 'school', category: 'places' },
  { id: 17, word: 'trabajo', translation: 'work/job', category: 'places' },
  { id: 18, word: 'tienda', translation: 'store', category: 'places' },
  
  // Food
  { id: 19, word: 'comida', translation: 'food', category: 'food' },
  { id: 20, word: 'agua', translation: 'water', category: 'food' },
  { id: 21, word: 'pan', translation: 'bread', category: 'food' },
  { id: 22, word: 'leche', translation: 'milk', category: 'food' },
  
  // Basic verbs
  { id: 23, word: 'hablar', translation: 'to speak', category: 'verbs' },
  { id: 24, word: 'comer', translation: 'to eat', category: 'verbs' },
  { id: 25, word: 'dormir', translation: 'to sleep', category: 'verbs' },
  { id: 26, word: 'estudiar', translation: 'to study', category: 'verbs' }
]

const categories = ['all', 'greetings', 'courtesy', 'people', 'places', 'food', 'verbs']

function Vocabulary() {
  const { user, isAuthenticated, isLoading, vocabulary, learnedWords, settings, dispatch } = useApp()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [allVocabulary, setAllVocabulary] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newWord, setNewWord] = useState({ word: '', translation: '', category: 'greetings' })

  // Redirect to account if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('User not authenticated, redirecting to login')
      navigate('/account')
    }
  }, [isAuthenticated, isLoading, navigate])

  useEffect(() => {
    setAllVocabulary([...mockVocabulary, ...vocabulary])
  }, [vocabulary])

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="vocabulary-page">
        <div className="vocabulary-container">
          <div className="loading-container">
            <Loader size={48} className="spinner" />
            <p>Loading vocabulary...</p>
          </div>
        </div>
      </div>
    )
  }

  // If user is not authenticated, show message
  if (!isAuthenticated || !user) {
    return (
      <div className="vocabulary-page">
        <div className="simple-message">
          <p>Please log in to access vocabulary!</p>
          <Link to="/account" className="btn-primary">Go to Login</Link>
        </div>
      </div>
    )
  }

  const filteredVocabulary = allVocabulary.filter(item => {
    const matchesSearch = item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.translation.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddWord = (e) => {
    e.preventDefault()
    if (!newWord.word || !newWord.translation) return
    
    const word = {
      id: Date.now(),
      word: newWord.word,
      translation: newWord.translation,
      category: newWord.category
    }
    
    dispatch({ type: 'ADD_VOCABULARY', payload: word })
    setNewWord({ word: '', translation: '', category: 'greetings' })
    setShowAddForm(false)
  }

  const toggleLearned = (wordId) => {
    dispatch({ type: 'TOGGLE_LEARNED_WORD', payload: wordId })
  }

  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.lang = settings.targetLanguage === 'spanish' ? 'es-ES' : 'en-US'
      speechSynthesis.speak(utterance)
    }
  }

  const groupedByCategory = categories.slice(1).reduce((acc, category) => {
    acc[category] = filteredVocabulary.filter(word => word.category === category)
    return acc
  }, {})

  return (
    <div className="vocabulary-page">
      <div className="vocabulary-container">
        {/* Header */}
        <div className="vocabulary-header">
          <h1>Vocabulary</h1>
          <p>Learn {settings.targetLanguage} words</p>
          <div className="vocab-stats">
            <span>{filteredVocabulary.length} words available</span>
            <span>•</span>
            <span>{learnedWords.size} learned</span>
          </div>
        </div>

        {/* Controls */}
        <div className="vocabulary-controls">
          <div className="search-input">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search words..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          <button 
            className="add-word-btn"
            onClick={() => setShowAddForm(true)}
          >
            <Plus size={20} />
            Add Word
          </button>
        </div>

        {/* Word Grid */}
        {selectedCategory === 'all' ? (
          // Show by categories
          <div className="vocabulary-sections">
            {Object.entries(groupedByCategory).map(([category, words]) => (
              words.length > 0 && (
                <div key={category} className="vocabulary-section">
                  <h3 className="section-title">{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                  <div className="vocabulary-grid">
                    {words.map(item => (
                      <div key={item.id} className={`vocabulary-card ${learnedWords.has(item.id) ? 'learned' : ''}`}>
                        <div className="card-content">
                          <div className="word-pair">
                            <div className="word">{item.word}</div>
                            <div className="translation">{item.translation}</div>
                          </div>
                          <div className="card-actions">
                            <button
                              className="action-btn"
                              onClick={() => speakWord(item.word)}
                              title="Pronounce"
                            >
                              <Volume2 size={16} />
                            </button>
                            <button
                              className={`action-btn learned-btn ${learnedWords.has(item.id) ? 'active' : ''}`}
                              onClick={() => toggleLearned(item.id)}
                              title="Mark as learned"
                            >
                              <Check size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        ) : (
          // Show filtered results
          <div className="vocabulary-grid">
            {filteredVocabulary.map(item => (
              <div key={item.id} className={`vocabulary-card ${learnedWords.has(item.id) ? 'learned' : ''}`}>
                <div className="card-content">
                  <div className="word-pair">
                    <div className="word">{item.word}</div>
                    <div className="translation">{item.translation}</div>
                  </div>
                  <div className="card-actions">
                    <button
                      className="action-btn"
                      onClick={() => speakWord(item.word)}
                      title="Pronounce"
                    >
                      <Volume2 size={16} />
                    </button>
                    <button
                      className={`action-btn learned-btn ${learnedWords.has(item.id) ? 'active' : ''}`}
                      onClick={() => toggleLearned(item.id)}
                      title="Mark as learned"
                    >
                      <Check size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredVocabulary.length === 0 && (
          <div className="no-results">
            <BookOpen size={48} />
            <p>No words found</p>
          </div>
        )}

        {/* Improved Add Word Form */}
        {showAddForm && (
          <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Add New Word</h2>
              <form onSubmit={handleAddWord}>
                <div className="form-group">
                  <label>Word ({settings.targetLanguage})</label>
                  <input
                    type="text"
                    value={newWord.word}
                    onChange={(e) => setNewWord({...newWord, word: e.target.value})}
                    placeholder="Enter word"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Translation</label>
                  <input
                    type="text"
                    value={newWord.translation}
                    onChange={(e) => setNewWord({...newWord, translation: e.target.value})}
                    placeholder="Enter translation"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={newWord.category}
                    onChange={(e) => setNewWord({...newWord, category: e.target.value})}
                  >
                    {categories.slice(1).map(cat => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    <Plus size={16} />
                    Add Word
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Vocabulary 