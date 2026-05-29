import { useState, useEffect, useRef } from 'react'
import { useQuiz } from '../hooks/useQuiz'

function speakWord(word) {
  if (!('speechSynthesis' in window)) return
  const cleaned = word.replace(/[~〜]/g, '').trim()
  const utt = new SpeechSynthesisUtterance(cleaned)
  utt.lang = 'en-US'
  utt.rate = 0.85
  speechSynthesis.cancel()
  speechSynthesis.speak(utt)
}

function MicButton({ word }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); speakWord(word) }}
      title="発音を聞く"
      style={{
        background: 'rgba(181,123,240,0.1)',
        border: '1px solid rgba(181,123,240,0.5)',
        borderRadius: '50%',
        cursor: 'pointer',
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.9rem',
        color: 'var(--purple-light)',
        flexShrink: 0,
        padding: 0,
        alignSelf: 'flex-start',
        marginTop: '4px',
      }}
    >
      🎤
    </button>
  )
}

export default function QuizScreen({ mode, questions, onFinish }) {
  const {
    currentIndex, totalQuestions,
    getQuestionText, getCorrectAnswer,
    submitAnswer, nextQuestion,
    answerState, score, wrongWords, isFinished,
    currentQuestion,
  } = useQuiz(mode, questions)

  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (!isFinished && answerState === null && inputRef.current) {
      inputRef.current.focus()
    }
  }, [answerState, currentIndex, isFinished])

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
    if (e.key === 'Enter') handleSubmit()
  }

  // 回答後、少し待ってから Enter で次へ進めるようにする（送信の Enter と混在しないよう遅延）
  useEffect(() => {
    if (answerState === null) return
    const handler = (e) => {
      if (e.key === 'Enter') handleNext()
    }
    const timer = setTimeout(() => {
      document.addEventListener('keydown', handler)
    }, 200)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('keydown', handler)
    }
  }, [answerState, currentIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  if (isFinished) return null

  const progress = totalQuestions > 0 ? (currentIndex / totalQuestions) * 100 : 0
  const questionNumber = currentIndex + 1
  const isLastQuestion = questionNumber >= totalQuestions

  // 英単語を表示するかどうか（問題カード／フィードバックで使用）
  const englishWordInQuestion = mode === 'en-to-jp'
  const englishWordInAnswer   = mode === 'jp-to-en'

  return (
    <div style={{ width: '100%', maxWidth: '680px' }}>

      {/* ── ヘッダー ── */}
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

      {/* ── 問題カード ── */}
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

        {/* 英単語が問題の場合はマイクボタンを右上に配置 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '8px' }}>
          <p style={{ fontSize: '2rem', fontWeight: '700', lineHeight: 1.3, margin: 0 }}>
            {getQuestionText()}
          </p>
          {englishWordInQuestion && currentQuestion && (
            <MicButton word={currentQuestion.word} />
          )}
        </div>

        {currentQuestion?.category && (
          <span style={{
            marginTop: '14px',
            padding: '4px 14px',
            background: 'rgba(181,123,240,0.15)',
            border: '1px solid rgba(181,123,240,0.35)',
            borderRadius: '20px',
            fontSize: '0.82rem',
            color: 'var(--purple-light)',
          }}>
            {currentQuestion.category}
          </span>
        )}
      </div>

      {/* ── フィードバック ── */}
      {answerState !== null && (
        <div
          className="fade-in-up"
          style={{
            textAlign: 'center',
            marginBottom: '20px',
            padding: '16px 20px',
            borderRadius: '12px',
            background: answerState === 'correct'
              ? 'rgba(52,217,117,0.1)'
              : 'rgba(255,82,82,0.1)',
            border: `1px solid ${answerState === 'correct' ? 'var(--correct-color)' : 'var(--wrong-color)'}`,
          }}
        >
          {answerState === 'correct' ? (
            <>
              <p style={{ color: 'var(--correct-color)', fontSize: '1.3rem', fontWeight: '700', marginBottom: '12px' }}>
                ✨ 正解！ ✨
              </p>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '8px' }}>
                <p style={{ fontSize: '2rem', fontWeight: '700', lineHeight: 1.3, margin: 0 }}>
                  {getCorrectAnswer()}
                </p>
                {englishWordInAnswer && currentQuestion && (
                  <MicButton word={currentQuestion.word} />
                )}
              </div>
            </>
          ) : (
            <>
              <p style={{ color: 'var(--wrong-color)', fontSize: '1.3rem', fontWeight: '700', marginBottom: '12px' }}>
                ✗ 残念...
              </p>
              <p style={{ color: 'var(--parchment-dim)', fontSize: '0.9rem', marginBottom: '6px' }}>
                正解
              </p>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '8px' }}>
                <p style={{ fontSize: '2rem', fontWeight: '700', lineHeight: 1.3, margin: 0 }}>
                  {getCorrectAnswer()}
                </p>
                {englishWordInAnswer && currentQuestion && (
                  <MicButton word={currentQuestion.word} />
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── 入力エリア ── */}
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

      {/* ── 次へボタン ── */}
      {answerState !== null && (
        <div className="fade-in-up" style={{ textAlign: 'center' }}>
          <button
            className="btn btn-primary"
            style={{ fontSize: '1.1rem', padding: '16px 48px' }}
            onClick={handleNext}
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
