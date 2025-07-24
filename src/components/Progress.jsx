import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { Trophy, Target, Calendar, TrendingUp, Award, Star, Brain, BookOpen } from 'lucide-react'
import { useApp } from '../context/AppContext'

function Progress() {
  const { state } = useApp()

  // Mock data for charts - in real app, this would come from user's actual data
  const weeklyData = [
    { day: 'Mon', wordsLearned: 8, quizScore: 85 },
    { day: 'Tue', wordsLearned: 12, quizScore: 78 },
    { day: 'Wed', wordsLearned: 6, quizScore: 92 },
    { day: 'Thu', wordsLearned: 15, quizScore: 88 },
    { day: 'Fri', wordsLearned: 10, quizScore: 90 },
    { day: 'Sat', wordsLearned: 18, quizScore: 95 },
    { day: 'Sun', wordsLearned: 14, quizScore: 87 }
  ]

  const categoryData = [
    { name: 'Greetings', value: 25, color: '#8884d8' },
    { name: 'Food', value: 30, color: '#82ca9d' },
    { name: 'Family', value: 20, color: '#ffc658' },
    { name: 'Work', value: 15, color: '#ff7c7c' },
    { name: 'Education', value: 10, color: '#8dd1e1' }
  ]

  const monthlyProgress = [
    { month: 'Jan', words: 120, quizzes: 15 },
    { month: 'Feb', words: 180, quizzes: 22 },
    { month: 'Mar', words: 240, quizzes: 28 },
    { month: 'Apr', words: 320, quizzes: 35 },
    { month: 'May', words: 390, quizzes: 42 }
  ]

  const achievements = [
    { id: 1, name: 'First Steps', description: 'Complete your first quiz', earned: true, icon: '🎯', date: '2024-01-15' },
    { id: 2, name: 'Quick Learner', description: 'Learn 50 words', earned: true, icon: '⚡', date: '2024-02-01' },
    { id: 3, name: 'Quiz Master', description: 'Score 90%+ on 5 quizzes', earned: true, icon: '🧠', date: '2024-02-15' },
    { id: 4, name: 'Consistent', description: 'Maintain a 7-day streak', earned: false, icon: '🔥', date: null },
    { id: 5, name: 'Vocabulary Builder', description: 'Learn 100 words', earned: false, icon: '📚', date: null },
    { id: 6, name: 'Champion', description: 'Score 95%+ on 10 quizzes', earned: false, icon: '🏆', date: null }
  ]

  const getProgressLevel = () => {
    const pointsForNextLevel = 1000 - (state.progress.points % 1000)
    const progressPercentage = ((state.progress.points % 1000) / 1000) * 100
    
    return { pointsForNextLevel, progressPercentage }
  }

  const { pointsForNextLevel, progressPercentage } = getProgressLevel()

  return (
    <div className="progress-page">
      <div className="progress-container">
        {/* Header */}
        <div className="progress-header">
          <h1>Your Learning Progress</h1>
          <p>Track your journey in mastering {state.settings.targetLanguage}</p>
        </div>

        {/* Overview Cards */}
        <div className="overview-grid">
          <div className="overview-card">
            <div className="card-icon">
              <BookOpen size={32} />
            </div>
            <div className="card-content">
              <h3>{state.progress.totalWordsLearned}</h3>
              <p>Words Learned</p>
              <small>+12 this week</small>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon">
              <Brain size={32} />
            </div>
            <div className="card-content">
              <h3>{state.quizHistory.length}</h3>
              <p>Quizzes Completed</p>
              <small>Avg: {state.quizHistory.length > 0 ? Math.round(state.quizHistory.reduce((sum, q) => sum + q.score, 0) / state.quizHistory.length) : 0}%</small>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon">
              <Trophy size={32} />
            </div>
            <div className="card-content">
              <h3>{state.progress.streak}</h3>
              <p>Current Streak</p>
              <small>days in a row</small>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon">
              <Star size={32} />
            </div>
            <div className="card-content">
              <h3>Level {state.progress.currentLevel}</h3>
              <p>{state.progress.points} Points</p>
              <small>{pointsForNextLevel} to next level</small>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="level-progress-section">
          <div className="level-progress-card">
            <div className="level-info">
              <h3>Level {state.progress.currentLevel}</h3>
              <p>{state.progress.points} / {state.progress.currentLevel * 1000} points</p>
            </div>
            <div className="level-progress-bar">
              <div 
                className="level-progress-fill" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="next-level-info">
              <span>Next Level: {pointsForNextLevel} points needed</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          {/* Weekly Activity */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Weekly Activity</h3>
              <Calendar size={20} />
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="wordsLearned" fill="#8884d8" name="Words Learned" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quiz Performance */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Quiz Performance</h3>
              <TrendingUp size={20} />
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="quizScore" 
                    stroke="#82ca9d" 
                    strokeWidth={3}
                    name="Quiz Score (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Vocabulary Categories */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Vocabulary by Category</h3>
              <Target size={20} />
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Progress */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Monthly Progress</h3>
              <BarChart size={20} />
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="words" fill="#8884d8" name="Words Learned" />
                  <Bar dataKey="quizzes" fill="#82ca9d" name="Quizzes Completed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="achievements-section">
          <div className="section-header">
            <h2>Achievements</h2>
            <Award size={24} />
          </div>
          
          <div className="achievements-grid">
            {achievements.map(achievement => (
              <div 
                key={achievement.id} 
                className={`achievement-card ${achievement.earned ? 'earned' : 'locked'}`}
              >
                <div className="achievement-icon">
                  {achievement.earned ? (
                    <span className="emoji">{achievement.icon}</span>
                  ) : (
                    <span className="locked-icon">🔒</span>
                  )}
                </div>
                
                <div className="achievement-info">
                  <h4>{achievement.name}</h4>
                  <p>{achievement.description}</p>
                  {achievement.earned && achievement.date && (
                    <small>Earned on {new Date(achievement.date).toLocaleDateString()}</small>
                  )}
                </div>
                
                {achievement.earned && (
                  <div className="earned-badge">
                    <Star size={16} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Goals Section */}
        <div className="goals-section">
          <h2>Current Goals</h2>
          <div className="goals-grid">
            <div className="goal-card">
              <div className="goal-header">
                <BookOpen size={24} />
                <h3>Weekly Vocabulary Goal</h3>
              </div>
              <div className="goal-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${Math.min((12 / 50) * 100, 100)}%` }}
                  ></div>
                </div>
                <span>12 / 50 words this week</span>
              </div>
            </div>

            <div className="goal-card">
              <div className="goal-header">
                <Brain size={24} />
                <h3>Daily Quiz Goal</h3>
              </div>
              <div className="goal-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${Math.min((1 / 3) * 100, 100)}%` }}
                  ></div>
                </div>
                <span>1 / 3 quizzes today</span>
              </div>
            </div>

            <div className="goal-card">
              <div className="goal-header">
                <Trophy size={24} />
                <h3>Streak Goal</h3>
              </div>
              <div className="goal-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${Math.min((state.progress.streak / 30) * 100, 100)}%` }}
                  ></div>
                </div>
                <span>{state.progress.streak} / 30 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Progress 