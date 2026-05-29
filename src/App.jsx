import { useState } from 'react'
import { supabase } from './lib/supabaseClient'
import StartScreen from './components/StartScreen'
import PreviewScreen from './components/PreviewScreen'
import QuizScreen from './components/QuizScreen'
import ResultScreen from './components/ResultScreen'

const QUIZ_SIZE = 10

function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export default function App() {
  const [screen, setScreen] = useState('start')
  const [mode, setMode] = useState('jp-to-en')
  const [quizResult, setQuizResult] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const [fetchError, setFetchError] = useState(null)

  async function handleStart(selectedMode) {
    setMode(selectedMode)
    setLoadingQuestions(true)
    setFetchError(null)
    const { data, error } = await supabase.from('words').select('*')
    if (error) {
      setFetchError(error.message)
      setLoadingQuestions(false)
      return
    }
    if (!data || data.length === 0) {
      setFetchError('単語データが見つかりませんでした。')
      setLoadingQuestions(false)
      return
    }
    setQuestions(shuffle(data).slice(0, QUIZ_SIZE))
    setLoadingQuestions(false)
    setScreen('preview')
  }

  function handleFinish(result) {
    setQuizResult(result)
    setScreen('result')
  }

  function handleRestart() {
    setQuizResult(null)
    setQuestions([])
    setScreen('start')
  }

  if (loadingQuestions) {
    return (
      <div className="app">
        <p style={{ fontSize: '1.4rem', color: 'var(--gold)' }}>✨ 冒険の準備中...</p>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="app">
        <div className="card" style={{ textAlign: 'center', maxWidth: '500px' }}>
          <p style={{ color: 'var(--wrong-color)', fontSize: '1.1rem', marginBottom: '8px' }}>⚠️ データ読み込みエラー</p>
          <p style={{ color: 'var(--parchment-dim)', fontSize: '0.9rem' }}>{fetchError}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      {screen === 'start'   && <StartScreen onStart={handleStart} />}
      {screen === 'preview' && <PreviewScreen questions={questions} mode={mode} onStart={() => setScreen('quiz')} />}
      {screen === 'quiz'    && <QuizScreen mode={mode} questions={questions} onFinish={handleFinish} />}
      {screen === 'result'  && <ResultScreen result={quizResult} onRestart={handleRestart} />}
    </div>
  )
}
