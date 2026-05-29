import { useState, useCallback } from 'react'

function normalize(str) {
  return str
    .trim()
    // 全角英数字 → 半角英数字
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))
    // 全角スペース → 半角スペース
    .replace(/　/g, ' ')
    .trim()
    // 大文字 → 小文字
    .toLowerCase()
    // ひらがな → カタカナ（統一比較）
    .replace(/[ぁ-ゖ]/g, c => String.fromCharCode(c.charCodeAt(0) + 0x60))
}

export function useQuiz(mode, initialQuestions) {
  const [questions] = useState(initialQuestions || [])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [wrongWords, setWrongWords] = useState([])
  const [answerState, setAnswerState] = useState(null)

  const currentQuestion = questions[currentIndex]
  const totalQuestions = questions.length
  const isFinished = totalQuestions > 0 && currentIndex >= totalQuestions

  const getQuestionText = useCallback(() => {
    if (!currentQuestion) return ''
    return mode === 'jp-to-en' ? currentQuestion.meaning : currentQuestion.word
  }, [currentQuestion, mode])

  const getCorrectAnswer = useCallback(() => {
    if (!currentQuestion) return ''
    return mode === 'jp-to-en' ? currentQuestion.word : currentQuestion.meaning
  }, [currentQuestion, mode])

  const submitAnswer = useCallback((input) => {
    if (answerState !== null || !currentQuestion) return
    const correctRaw = mode === 'jp-to-en' ? currentQuestion.word : currentQuestion.meaning
    // カンマ区切りの別解をすべて正規化し、いずれか1つに一致すれば正解
    const variants = correctRaw.split(',').map(v => normalize(v))
    const isCorrect = variants.includes(normalize(input))
    setAnswerState(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) {
      setScore(prev => prev + 1)
    } else {
      setWrongWords(prev => [...prev, currentQuestion])
    }
  }, [answerState, currentQuestion, mode])

  const nextQuestion = useCallback(() => {
    setAnswerState(null)
    setCurrentIndex(prev => prev + 1)
  }, [])

  return {
    currentQuestion,
    currentIndex,
    totalQuestions,
    getQuestionText,
    getCorrectAnswer,
    submitAnswer,
    nextQuestion,
    answerState,
    score,
    wrongWords,
    isFinished,
  }
}
