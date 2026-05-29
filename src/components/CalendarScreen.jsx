import { useState } from 'react'
import { useStudyRecords, getTodayJST } from '../hooks/useStudyRecords'

// ─────────────────────────────────────────
// 犬の成長ステージ設定
// ─────────────────────────────────────────
const STAGES = [
  { label: 'まだ出会っていない…',  color: 'var(--parchment-dim)' },
  { label: 'ちびっこ子犬 🐾',      color: '#E8A030' },
  { label: 'すくすく成長中 🌱',    color: '#D4A843' },
  { label: 'やんちゃ盛り！ 🎽',    color: '#C89030' },
  { label: 'りっぱな成犬 🌟',      color: '#A07820' },
  { label: '満ちたる名犬！ 👑',    color: '#886010' },
]
const MESSAGES = [
  '学習を始めると出会えるよ…🐾',
  'はじめまして！いっしょにがんばろ！',
  'えさをありがとう！大きくなるよ！',
  'ぼく、どんどん育ってるよ！えへへ',
  'まいにち続けてくれてありがとうね！',
  '最高のコンビだよ！ずっと一緒だよ✨',
]

function getDogStage(days) {
  if (days === 0) return 0
  if (days <= 3)  return 1
  if (days <= 7)  return 2
  if (days <= 14) return 3
  if (days <= 28) return 4
  return 5
}

// ─────────────────────────────────────────
// 犬 SVG コンポーネント
// ─────────────────────────────────────────
function DogSVG({ stage, justFed }) {
  if (stage === 0) {
    return (
      <svg viewBox="0 0 100 100" width="100" height="100">
        {/* 餌入れ */}
        <ellipse cx="50" cy="82" rx="30" ry="9"  fill="#8B6510" />
        <ellipse cx="50" cy="78" rx="28" ry="7"  fill="#C89030" />
        <ellipse cx="50" cy="77" rx="20" ry="4"  fill="#A06830" />
        {/* 足跡 */}
        <g fill="rgba(181,123,240,0.35)">
          <ellipse cx="24" cy="60" rx="5" ry="4" />
          <circle  cx="19" cy="54" r="2.5" />
          <circle  cx="24" cy="52" r="2.5" />
          <circle  cx="30" cy="53" r="2.5" />
          <ellipse cx="42" cy="44" rx="5" ry="4" />
          <circle  cx="37" cy="38" r="2.5" />
          <circle  cx="42" cy="36" r="2.5" />
          <circle  cx="48" cy="37" r="2.5" />
        </g>
        <text x="50" y="30" textAnchor="middle" fontSize="20" fill="rgba(181,123,240,0.4)">?</text>
      </svg>
    )
  }

  const showTongue  = stage >= 2
  const showCollar  = stage >= 3
  const animateTail = stage >= 4

  return (
    <svg viewBox="0 0 100 115" width="100%" height="100%" overflow="visible">
      {animateTail && (
        <style>{`
          .wag{transform-origin:64px 85px;animation:wag .45s ease-in-out infinite alternate}
          @keyframes wag{from{transform:rotate(-18deg)}to{transform:rotate(18deg)}}
        `}</style>
      )}
      {justFed && (
        <style>{`
          .heart{animation:floatH 1.8s ease-out forwards}
          @keyframes floatH{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-38px)}}
        `}</style>
      )}

      {/* 影 */}
      <ellipse cx="50" cy="113" rx="27" ry="5" fill="rgba(0,0,0,0.15)" />

      {/* しっぽ */}
      <path
        className={animateTail ? 'wag' : ''}
        d="M64,85 C78,74 89,58 80,44"
        stroke="#B87828" strokeWidth="8" fill="none" strokeLinecap="round"
      />

      {/* 胴体 */}
      <ellipse cx="49" cy="90" rx="30" ry="20" fill="#D4A843" />
      <ellipse cx="49" cy="96" rx="17" ry="11" fill="#EED080" />

      {/* 前足 */}
      <rect x="31" y="101" width="12" height="14" rx="6" fill="#D4A843" />
      <rect x="56" y="101" width="12" height="14" rx="6" fill="#D4A843" />

      {/* 首 */}
      <ellipse cx="49" cy="76" rx="13" ry="11" fill="#D4A843" />

      {/* 首輪 */}
      {showCollar && <>
        <rect x="38" y="80" width="22" height="5" rx="2.5" fill="#4848C0" />
        <circle cx="49" cy="82.5" r="2.5" fill="#FFD700" />
      </>}

      {/* 頭 */}
      <circle cx="49" cy="53" r="25" fill="#D4A843" />
      <ellipse cx="49" cy="37" rx="18" ry="14" fill="#C89030" />

      {/* 耳 */}
      <ellipse cx="27" cy="57" rx="12" ry="18" fill="#B87828" transform="rotate(-12 27 57)" />
      <ellipse cx="71" cy="57" rx="12" ry="18" fill="#B87828" transform="rotate(12 71 57)" />

      {/* マズル（鼻まわり） */}
      <ellipse cx="49" cy="63" rx="14" ry="10" fill="#EED080" />

      {/* 目 */}
      <circle cx="38" cy="49" r="5"   fill="white" />
      <circle cx="38" cy="49" r="3.8" fill="#2D1A0E" />
      <circle cx="39.5" cy="47.5" r="1.5" fill="white" />
      <circle cx="60" cy="49" r="5"   fill="white" />
      <circle cx="60" cy="49" r="3.8" fill="#2D1A0E" />
      <circle cx="61.5" cy="47.5" r="1.5" fill="white" />

      {/* 鼻 */}
      <ellipse cx="49" cy="59" rx="5" ry="3.2" fill="#2D1A0E" />
      <ellipse cx="48" cy="58" rx="2" ry="1.4" fill="rgba(255,255,255,0.4)" />

      {/* 口 */}
      <path d="M43,66 Q49,72 55,66" stroke="#2D1A0E" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* 舌 */}
      {showTongue && <>
        <ellipse cx="49" cy="71" rx="5.5" ry="4" fill="#E05050" />
        <line x1="49" y1="67" x2="49" y2="74.5" stroke="#C04040" strokeWidth="1" />
      </>}

      {/* エサをあげた直後のハート */}
      {justFed && <>
        <text className="heart" x="74" y="44" fontSize="14">❤️</text>
        <text className="heart" x="14" y="40" fontSize="11" style={{ animationDelay: '0.2s' }}>💛</text>
        <text className="heart" x="78" y="28" fontSize="10" style={{ animationDelay: '0.4s' }}>✨</text>
      </>}
    </svg>
  )
}

// ─────────────────────────────────────────
// 犬パネル
// ─────────────────────────────────────────
function DogPanel({ totalDays, justFed }) {
  const stage   = getDogStage(totalDays)
  const stageInfo = STAGES[stage]
  const message = MESSAGES[stage]
  const growthPct = Math.min(Math.round((totalDays / 28) * 100), 100)
  // stage 0 だと犬が見えないので最小幅を保持
  const dogSize = stage === 0 ? 100 : 80 + stage * 12

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      padding: '14px 12px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid var(--card-border)',
      borderRadius: '14px',
      width: '190px',
      flexShrink: 0,
    }}>
      <p style={{ color: 'var(--gold)', fontWeight: '700', fontSize: '0.85rem', marginBottom: '2px' }}>
        🐕 旅の仲間
      </p>

      {/* 犬 SVG */}
      <div style={{ width: `${dogSize}px`, height: `${dogSize}px` }}>
        <DogSVG stage={stage} justFed={justFed} />
      </div>

      {/* ステージ名 */}
      <p style={{ color: stageInfo.color, fontWeight: '700', fontSize: '0.8rem', textAlign: 'center' }}>
        {stageInfo.label}
      </p>

      {/* 学習日数 */}
      <p style={{ color: 'var(--parchment-dim)', fontSize: '0.76rem' }}>
        学習 {totalDays} 日 ／ エサ {totalDays} 回
      </p>

      {/* 成長バー */}
      <div style={{ width: '100%' }}>
        <div style={{ height: '7px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${growthPct}%`,
            background: `linear-gradient(90deg, ${stageInfo.color}, var(--gold-light))`,
            borderRadius: '4px',
            transition: 'width 0.8s ease',
          }} />
        </div>
        <p style={{ color: 'var(--parchment-dim)', fontSize: '0.68rem', textAlign: 'right', marginTop: '2px' }}>
          成長度 {growthPct}%
        </p>
      </div>

      {/* セリフ */}
      <p style={{
        color: 'var(--parchment-dim)',
        fontSize: '0.73rem',
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: 1.45,
      }}>
        「{message}」
      </p>
    </div>
  )
}

// ─────────────────────────────────────────
// メイン：カレンダー画面
// ─────────────────────────────────────────
const WEEK_LABELS = ['日', '月', '火', '水', '木', '金', '土']
const START_YEAR  = 2026
const START_MONTH = 5 // 0-indexed → June

export default function CalendarScreen({ onBack, justStudied = false }) {
  const { getRecords } = useStudyRecords()
  const records   = getRecords()
  const totalDays = Object.keys(records).length

  // 表示月（初期値：現在のJST月 or 開始月）
  const [displayDate, setDisplayDate] = useState(() => {
    const jst   = new Date(Date.now() + 9 * 60 * 60 * 1000)
    const start = new Date(START_YEAR, START_MONTH, 1)
    const curr  = new Date(jst.getFullYear(), jst.getMonth(), 1)
    return curr >= start ? curr : start
  })

  const year  = displayDate.getFullYear()
  const month = displayDate.getMonth()

  const canGoPrev = !(year === START_YEAR && month === START_MONTH)

  function prevMonth() {
    if (!canGoPrev) return
    setDisplayDate(new Date(year, month - 1, 1))
  }
  function nextMonth() {
    setDisplayDate(new Date(year, month + 1, 1))
  }

  // カレンダーセルを構築
  const firstDayOfWeek = new Date(year, month, 1).getDay() // 0=日
  const daysInMonth    = new Date(year, month + 1, 0).getDate()
  const todayStr       = getTodayJST()

  const cells = []
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    const mm  = String(month + 1).padStart(2, '0')
    const dd  = String(d).padStart(2, '0')
    const key = `${year}-${mm}-${dd}`
    cells.push({ day: d, key, record: records[key] || null })
  }
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div style={{ width: '100%', maxWidth: '860px' }}>

      {/* タイトル */}
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <h2 style={{ color: 'var(--gold)', fontSize: '1.2rem', fontWeight: '700' }}>
          📅 学習カレンダー
        </h2>
      </div>

      {/* カレンダー ＋ 犬パネル */}
      <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>

        {/* ── カレンダー ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* 月ナビゲーション */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <button
              onClick={prevMonth}
              disabled={!canGoPrev}
              style={{
                background: 'none',
                border: `1px solid ${canGoPrev ? 'rgba(200,155,60,0.4)' : 'rgba(200,155,60,0.15)'}`,
                borderRadius: '8px',
                color: canGoPrev ? 'var(--gold)' : 'rgba(200,155,60,0.25)',
                cursor: canGoPrev ? 'pointer' : 'default',
                padding: '5px 14px',
                fontSize: '0.88rem',
              }}
            >
              ◀ 前月
            </button>
            <span style={{ color: 'var(--gold)', fontWeight: '700', fontSize: '1.05rem' }}>
              {year}年 {month + 1}月
            </span>
            <button
              onClick={nextMonth}
              style={{
                background: 'none',
                border: '1px solid rgba(200,155,60,0.4)',
                borderRadius: '8px',
                color: 'var(--gold)',
                cursor: 'pointer',
                padding: '5px 14px',
                fontSize: '0.88rem',
              }}
            >
              次月 ▶
            </button>
          </div>

          {/* グリッド */}
          <div className="card" style={{ padding: '10px' }}>
            {/* 曜日ヘッダー */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '6px' }}>
              {WEEK_LABELS.map((label, i) => (
                <div key={label} style={{
                  textAlign: 'center',
                  fontSize: '0.76rem',
                  fontWeight: '600',
                  padding: '3px 0',
                  color: i === 0 ? '#ff7878' : i === 6 ? '#7898ff' : 'var(--parchment-dim)',
                }}>
                  {label}
                </div>
              ))}
            </div>

            {/* 日付セル */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' }}>
              {cells.map((cell, idx) => {
                if (!cell) return <div key={idx} style={{ minHeight: '50px' }} />

                const isToday   = cell.key === todayStr
                const isStudied = !!cell.record
                const dow       = idx % 7
                const rec       = cell.record

                return (
                  <div
                    key={cell.key}
                    style={{
                      minHeight: '50px',
                      borderRadius: '7px',
                      padding: '4px 4px',
                      textAlign: 'center',
                      background: isStudied
                        ? 'rgba(200,155,60,0.13)'
                        : isToday
                        ? 'rgba(181,123,240,0.1)'
                        : 'transparent',
                      border: isToday
                        ? '1.5px solid rgba(181,123,240,0.55)'
                        : isStudied
                        ? '1px solid rgba(200,155,60,0.35)'
                        : '1px solid transparent',
                    }}
                  >
                    {/* 日付 */}
                    <div style={{
                      fontSize: '0.78rem',
                      fontWeight: isToday ? '700' : '400',
                      color: dow === 0 ? '#ff7878'
                           : dow === 6 ? '#7898ff'
                           : isToday ? 'var(--purple-light)'
                           : 'var(--parchment)',
                      marginBottom: '2px',
                    }}>
                      {cell.day}
                    </div>

                    {/* 学習記録 */}
                    {rec && (
                      <div style={{
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        lineHeight: 1,
                        color: rec.score === rec.total
                          ? 'var(--correct-color)'
                          : rec.score >= rec.total * 0.7
                          ? 'var(--gold)'
                          : 'var(--wrong-color)',
                      }}>
                        {rec.score}/{rec.total}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* 凡例 */}
          <div style={{ display: 'flex', gap: '14px', marginTop: '8px', justifyContent: 'flex-end' }}>
            {[
              { color: 'var(--correct-color)', label: '10/10 全正解' },
              { color: 'var(--gold)',           label: '7/10〜9/10' },
              { color: 'var(--wrong-color)',    label: '〜6/10' },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
                <span style={{ color: 'var(--parchment-dim)', fontSize: '0.68rem' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── 犬パネル ── */}
        <DogPanel totalDays={totalDays} justFed={justStudied} />
      </div>

      {/* 戻るボタン */}
      <div style={{ textAlign: 'center', marginTop: '14px' }}>
        <button
          className="btn btn-primary"
          style={{ fontSize: '1rem', padding: '12px 36px' }}
          onClick={onBack}
        >
          クエストへ戻る
        </button>
      </div>
    </div>
  )
}
