import { useState, useCallback } from 'react'

function normalize(str) {
  return str.trim().toLowerCase()
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
    const correct = normalize(mode === 'jp-to-en' ? currentQuestion.word : currentQuestion.meaning)
    const isCorrect = normalize(input) === correct
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
