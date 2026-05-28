import { useState } from 'react'
import StartScreen from './components/StartScreen'
import QuizScreen from './components/QuizScreen'
import ResultScreen from './components/ResultScreen'

export default function App() {
  const [screen, setScreen] = useState('start')
  const [mode, setMode] = useState('jp-to-en')
  const [quizResult, setQuizResult] = useState(null)

  function handleStart(selectedMode) {
    setMode(selectedMode)
    setScreen('quiz')
  }

  function handleFinish(result) {
    setQuizResult(result)
    setScreen('result')
  }

  function handleRestart() {
    setQuizResult(null)
    setScreen('start')
  }

  return (
    <div className="app">
      {screen === 'start' && <StartScreen onStart={handleStart} />}
      {screen === 'quiz' && <QuizScreen mode={mode} onFinish={handleFinish} />}
      {screen === 'result' && (
        <ResultScreen result={quizResult} onRestart={handleRestart} />
      )}
    </div>
  )
}
