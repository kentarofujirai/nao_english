import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

const QUIZ_SIZE = 50

function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function normalize(str) {
  return str.trim().toLowerCase()
}

export function useQuiz(mode) {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [wrongWords, setWrongWords] = useState([])
  const [answerState, setAnswerState] = useState(null) // null | 'correct' | 'wrong'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function fetchWords() {
      setLoading(true)
      const { data, error } = await supabase.from('words').select('*')
      if (cancelled) return
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      if (!data || data.length === 0) {
        setError('単語データが見つかりませんでした。')
        setLoading(false)
        return
      }
      setQuestions(shuffle(data).slice(0, QUIZ_SIZE))
      setLoading(false)
    }
    fetchWords()
    return () => { cancelled = true }
  }, [])

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
    const correct = normalize(mode === 'jp-to-en' ? currentQuestion.word : currentQuestion.meaning)
    const userAnswer = normalize(input)
    const isCorrect = correct === userAnswer

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
    loading,
    error,
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
