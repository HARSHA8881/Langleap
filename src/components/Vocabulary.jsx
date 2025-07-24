import React, { useState, useEffect } from 'react'
import { Search, Plus, BookOpen, Volume2, Heart, Star, Filter } from 'lucide-react'
import { useApp } from '../context/AppContext'

// Mock vocabulary data - in real app, this would come from an API
const mockVocabulary = [
  { id: 1, word: 'hola', translation: 'hello', language: 'spanish', category: 'greetings', difficulty: 'beginner', example: 'Hola, ¿cómo estás?', pronunciation: 'OH-lah' },
  { id: 2, word: 'gracias', translation: 'thank you', language: 'spanish', category: 'courtesy', difficulty: 'beginner', example: 'Gracias por tu ayuda.', pronunciation: 'GRAH-see-ahs' },
  { id: 3, word: 'casa', translation: 'house', language: 'spanish', category: 'home', difficulty: 'beginner', example: 'Mi casa es grande.', pronunciation: 'KAH-sah' },
  { id: 4, word: 'comida', translation: 'food', language: 'spanish', category: 'food', difficulty: 'beginner', example: 'La comida está deliciosa.', pronunciation: 'koh-MEE-dah' },
  { id: 5, word: 'familia', translation: 'family', language: 'spanish', category: 'people', difficulty: 'beginner', example: 'Mi familia es muy grande.', pronunciation: 'fah-MEE-lee-ah' },
  { id: 6, word: 'trabajo', translation: 'work/job', language: 'spanish', category: 'work', difficulty: 'intermediate', example: 'Voy al trabajo temprano.', pronunciation: 'trah-BAH-hoh' },
  { id: 7, word: 'amigo', translation: 'friend', language: 'spanish', category: 'people', difficulty: 'beginner', example: 'Él es mi mejor amigo.', pronunciation: 'ah-MEE-goh' },
  { id: 8, word: 'escuela', translation: 'school', language: 'spanish', category: 'education', difficulty: 'beginner', example: 'Los niños van a la escuela.', pronunciation: 'es-KWAY-lah' }
]

const categories = ['all', 'greetings', 'courtesy', 'home', 'food', 'people', 'work', 'education']
const difficulties = ['all', 'beginner', 'intermediate', 'advanced']

function Vocabulary() {
  const { state, dispatch } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [vocabulary, setVocabulary] = useState([])
  const [favorites, setFavorites] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newWord, setNewWord] = useState({ word: '', translation: '', category: 'greetings', example: '' })

  useEffect(() => {
    // In a real app, this would fetch from an API
    setVocabulary([...mockVocabulary, ...state.vocabulary])
  }, [state.vocabulary])

  const filteredVocabulary = vocabulary.filter(item => {
    const matchesSearch = item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.translation.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || item.difficulty === selectedDifficulty
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const handleAddWord = (e) => {
    e.preventDefault()
    const word = {
      id: Date.now(),
      ...newWord,
      language: state.settings.targetLanguage,
      difficulty: 'beginner',
      pronunciation: ''
    }
    
    dispatch({ type: 'ADD_VOCABULARY', payload: word })
    setNewWord({ word: '', translation: '', category: 'greetings', example: '' })
    setShowAddForm(false)
  }

  const toggleFavorite = (wordId) => {
    setFavorites(prev => 
      prev.includes(wordId) 
        ? prev.filter(id => id !== wordId)
        : [...prev, wordId]
    )
  }

  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.lang = state.settings.targetLanguage === 'spanish' ? 'es-ES' : 'en-US'
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="vocabulary-page">
      <div className="vocabulary-container">
        {/* Header */}
        <div className="vocabulary-header">
          <div className="header-content">
            <h1>Vocabulary</h1>
            <p>Expand your {state.settings.targetLanguage} vocabulary</p>
            <div className="vocab-stats">
              <span>{filteredVocabulary.length} words available</span>
              <span>•</span>
              <span>{state.progress.totalWordsLearned} learned</span>
            </div>
          </div>
          <button 
            className="add-word-btn"
            onClick={() => setShowAddForm(true)}
          >
            <Plus size={20} />
            Add Word
          </button>
        </div>

        {/* Search and Filters */}
        <div className="vocabulary-controls">
          <div className="search-section">
            <div className="search-input">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search words or translations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="filters-section">
            <div className="filter-group">
              <Filter size={16} />
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <select 
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Vocabulary Grid */}
        <div className="vocabulary-grid">
          {filteredVocabulary.map(item => (
            <div key={item.id} className="vocabulary-card">
              <div className="card-header">
                <div className="word-info">
                  <h3 className="word">{item.word}</h3>
                  <p className="translation">{item.translation}</p>
                </div>
                <div className="card-actions">
                  <button 
                    className="action-btn"
                    onClick={() => speakWord(item.word)}
                    title="Pronounce word"
                  >
                    <Volume2 size={16} />
                  </button>
                  <button 
                    className={`action-btn ${favorites.includes(item.id) ? 'favorited' : ''}`}
                    onClick={() => toggleFavorite(item.id)}
                    title="Add to favorites"
                  >
                    <Heart size={16} />
                  </button>
                </div>
              </div>

              <div className="card-details">
                <div className="pronunciation">
                  {item.pronunciation && (
                    <span className="pronunciation-text">/{item.pronunciation}/</span>
                  )}
                </div>
                
                <div className="meta-info">
                  <span className={`difficulty-badge ${item.difficulty}`}>
                    {item.difficulty}
                  </span>
                  <span className="category-badge">
                    {item.category}
                  </span>
                </div>

                {item.example && (
                  <div className="example">
                    <strong>Example:</strong> {item.example}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredVocabulary.length === 0 && (
          <div className="no-results">
            <BookOpen size={48} />
            <h3>No words found</h3>
            <p>Try adjusting your search terms or filters</p>
          </div>
        )}

        {/* Add Word Modal */}
        {showAddForm && (
          <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Add New Word</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowAddForm(false)}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleAddWord}>
                <div className="form-group">
                  <label>Word ({state.settings.targetLanguage})</label>
                  <input
                    type="text"
                    value={newWord.word}
                    onChange={(e) => setNewWord({...newWord, word: e.target.value})}
                    required
                    placeholder="Enter the word"
                  />
                </div>

                <div className="form-group">
                  <label>Translation ({state.settings.nativeLanguage})</label>
                  <input
                    type="text"
                    value={newWord.translation}
                    onChange={(e) => setNewWord({...newWord, translation: e.target.value})}
                    required
                    placeholder="Enter the translation"
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

                <div className="form-group">
                  <label>Example (optional)</label>
                  <input
                    type="text"
                    value={newWord.example}
                    onChange={(e) => setNewWord({...newWord, example: e.target.value})}
                    placeholder="Example sentence"
                  />
                </div>

                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => setShowAddForm(false)}
                  >
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