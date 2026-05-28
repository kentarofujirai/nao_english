export default function ResultScreen({ result, onRestart }) {
  const { score, totalQuestions, wrongWords } = result
  const percentage = Math.round((score / totalQuestions) * 100)

  const { label, color } = getRank(percentage)

  return (
    <div style={{ width: '100%', maxWidth: '680px' }}>

      {/* ── Score card ── */}
      <div className="card" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '2.4rem', marginBottom: '8px' }}>🏆</div>
        <h2 className="rpg-title" style={{ fontSize: '2.2rem', marginBottom: '6px' }}>
          クエスト完了！
        </h2>
        <div className="gold-divider" style={{ marginBottom: '20px' }} />

        <p style={{ color, fontWeight: '700', fontSize: '1.15rem', marginBottom: '24px' }}>
          {label}
        </p>

        {/* Score number */}
        <div style={{ marginBottom: '6px' }}>
          <span style={{
            fontSize: '4.5rem',
            fontWeight: '700',
            color: 'var(--gold-light)',
            filter: 'drop-shadow(0 0 12px var(--gold-glow))',
            lineHeight: 1,
          }}>
            {score}
          </span>
          <span style={{ fontSize: '2rem', color: 'var(--parchment-dim)', marginLeft: '4px' }}>
            / {totalQuestions}
          </span>
        </div>
        <p style={{ color: 'var(--parchment-dim)', marginBottom: '28px' }}>
          正解率 {percentage}%
        </p>

        <button
          className="btn btn-primary"
          style={{ fontSize: '1.1rem', padding: '16px 48px' }}
          onClick={onRestart}
        >
          ▶ もう一度挑戦する
        </button>
      </div>

      {/* ── Wrong words ── */}
      {wrongWords.length === 0 ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--correct-color)', fontSize: '1.15rem' }}>
            🎉 全問正解！間違えた単語はありません！
          </p>
        </div>
      ) : (
        <div className="card">
          <h3 style={{ color: 'var(--wrong-color)', marginBottom: '16px', fontSize: '1.1rem', fontWeight: '700' }}>
            ✗ 間違えた単語一覧（{wrongWords.length} 問）
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {wrongWords.map(word => (
              <div
                key={word.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: 'rgba(255, 82, 82, 0.07)',
                  border: '1px solid rgba(255, 82, 82, 0.2)',
                  borderRadius: '8px',
                  gap: '12px',
                }}
              >
                <span style={{ fontWeight: '700', fontSize: '1.05rem' }}>{word.word}</span>
                {word.category && (
                  <span style={{
                    padding: '2px 10px',
                    background: 'rgba(181, 123, 240, 0.12)',
                    border: '1px solid rgba(181, 123, 240, 0.3)',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    color: 'var(--purple-light)',
                    flexShrink: 0,
                  }}>
                    {word.category}
                  </span>
                )}
                <span style={{ color: 'var(--parchment-dim)', marginLeft: 'auto' }}>{word.meaning}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function getRank(percentage) {
  if (percentage === 100) return { label: '👑 完璧！伝説の英雄！',   color: '#ffd700' }
  if (percentage >= 80)  return { label: '⭐ 素晴らしい！英雄級！', color: '#c89b3c' }
  if (percentage >= 60)  return { label: '🗡️ 合格！勇者認定！',     color: '#b57bf0' }
  if (percentage >= 40)  return { label: '📖 もう少し！見習い勇者', color: '#60a0e0' }
  return                        { label: '🔥 もう一度チャレンジ！', color: '#ff5252' }
}
