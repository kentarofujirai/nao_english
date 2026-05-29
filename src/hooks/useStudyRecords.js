const STORAGE_KEY = 'nao_english_study_records'

export function getTodayJST() {
  const jst = new Date(Date.now() + 9 * 60 * 60 * 1000)
  return jst.toISOString().slice(0, 10) // "YYYY-MM-DD"
}

export function useStudyRecords() {
  function getRecords() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    } catch {
      return {}
    }
  }

  function saveRecord(score, total) {
    const records = getRecords()
    records[getTodayJST()] = { score, total }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  }

  return { getRecords, saveRecord }
}
