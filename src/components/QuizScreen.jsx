import { useState, useEffect, useRef } from 'react'
import { useQuiz } from '../hooks/useQuiz'

export default function QuizScreen({ mode, onFinish }) {
  const {
    loading, error,
    currentIndex, totalQuestions,
    getQuestionText, getCorrectAnswer,
    submitAnswer, nextQuestion,
    answerState, score, wrongWords, isFinished,
    currentQuestion,
  } = useQuiz(mode)

  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (!loading && !isFinished && answerState === null && inputRef.current) {
      inputRef.current.focus()
    }
  }, [loading, answerState, currentIndex, isFinished])

  useEffect(() => {
    if (isFinished) {
      onFinish({ score, totalQuestions, wrongWords })
    }
  }, [isFinished]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSubmit() {
    if (answerState !== null || !inputValue.trim()) return
    submitAnswer(inputValue)
  }

  function handleNext() {
    setInputValue('')
    nextQuestion()
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      if (answerState === null) {
        handleSubmit()
      } else {
        handleNext()
      }
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '1.4rem', color: 'var(--gold)' }}>✨ 冒険の準備中...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card" style={{ textAlign: 'center', maxWidth: '500px' }}>
        <p style={{ color: 'var(--wrong-color)', fontSize: '1.1rem', marginBottom: '8px' }}>
          ⚠️ データ読み込みエラー
        </p>
        <p style={{ color: 'var(--parchment-dim)', fontSize: '0.9rem' }}>{error}</p>
      </div>
    )
  }

  if (isFinished) return null

  const progress = totalQuestions > 0 ? (currentIndex / totalQuestions) * 100 : 0
  const questionNumber = currentIndex + 1
  const isLastQuestion = questionNumber >= totalQuestions

  return (
    <div style={{ width: '100%', maxWidth: '680px' }}>

      {/* ── Header: progress ── */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ color: 'var(--gold)', fontWeight: '700', fontSize: '1.05rem' }}>
            第 {questionNumber} / {totalQuestions} 問
          </span>
          <span style={{ color: 'var(--parchment-dim)', fontSize: '0.95rem' }}>
            ✅ {score} 正解
          </span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* ── Question Card ── */}
      <div
        className={`card ${
          answerState === 'correct' ? 'card-correct' :
          answerState === 'wrong'   ? 'card-wrong'   : ''
        }`}
        style={{
          textAlign: 'center',
          minHeight: '170px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
        }}
      >
        <p style={{ color: 'var(--parchment-dim)', fontSize: '0.85rem', marginBottom: '14px' }}>
          {mode === 'jp-to-en' ? '🇯🇵 日本語 → 🇬🇧 英語' : '🇬🇧 英語 → 🇯🇵 日本語'}
        </p>
        <p style={{ fontSize: '2rem', fontWeight: '700', lineHeight: 1.3 }}>
          {getQuestionText()}
        </p>
        {currentQuestion?.category && (
          <span style={{
            marginTop: '14px',
            padding: '4px 14px',
            background: 'rgba(181, 123, 240, 0.15)',
            border: '1px solid rgba(181, 123, 240, 0.35)',
            borderRadius: '20px',
            fontSize: '0.82rem',
            color: 'var(--purple-light)',
          }}>
            {currentQuestion.category}
          </span>
        )}
      </div>

      {/* ── Feedback ── */}
      {answerState !== null && (
        <div
          className="fade-in-up"
          style={{
            textAlign: 'center',
            marginBottom: '20px',
            padding: '16px 20px',
            borderRadius: '12px',
            background: answerState === 'correct'
              ? 'rgba(52, 217, 117, 0.1)'
              : 'rgba(255, 82, 82, 0.1)',
            border: `1px solid ${answerState === 'correct' ? 'var(--correct-color)' : 'var(--wrong-color)'}`,
          }}
        >
          {answerState === 'correct' ? (
            <p style={{ color: 'var(--correct-color)', fontSize: '1.3rem', fontWeight: '700' }}>
              ✨ 正解！ ✨
            </p>
          ) : (
            <>
              <p style={{ color: 'var(--wrong-color)', fontSize: '1.3rem', fontWeight: '700', marginBottom: '8px' }}>
                ✗ 残念...
              </p>
              <p style={{ color: 'var(--parchment-dim)', fontSize: '1rem' }}>
                正解：
                <span style={{ color: 'var(--parchment)', fontWeight: '700', fontSize: '1.1rem', marginLeft: '6px' }}>
                  {getCorrectAnswer()}
                </span>
              </p>
            </>
          )}
        </div>
      )}

      {/* ── Input ── */}
      {answerState === null && (
        <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
          <input
            ref={inputRef}
            type="text"
            className="quiz-input"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={mode === 'jp-to-en' ? '英語で入力してね...' : '日本語で入力してね...'}
          />
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!inputValue.trim()}
            style={{ flexShrink: 0, fontSize: '1rem', padding: '14px 24px' }}
          >
            決定
          </button>
        </div>
      )}

      {/* ── Next button ── */}
      {answerState !== null && (
        <div className="fade-in-up" style={{ textAlign: 'center' }}>
          <button
            className="btn btn-primary"
            style={{ fontSize: '1.1rem', padding: '16px 48px' }}
            onClick={handleNext}
            autoFocus
          >
            {isLastQuestion ? '結果を見る ▶' : '次の問題へ ▶'}
          </button>
          <p style={{ marginTop: '10px', color: 'var(--parchment-dim)', fontSize: '0.82rem' }}>
            Enter キーでも次に進めます
          </p>
        </div>
      )}
    </div>
  )
}
