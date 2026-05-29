function speakWord(word) {
  if (!('speechSynthesis' in window)) return
  const cleaned = word.replace(/[~〜]/g, '').trim()
  const utt = new SpeechSynthesisUtterance(cleaned)
  utt.lang = 'en-US'
  utt.rate = 0.85
  speechSynthesis.cancel()
  speechSynthesis.speak(utt)
}

function MicBtn({ word }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); speakWord(word) }}
      title="発音を聞く"
      style={{
        background: 'none',
        border: '1px solid rgba(181,123,240,0.45)',
        borderRadius: '50%',
        cursor: 'pointer',
        width: '22px',
        height: '22px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.62rem',
        color: 'var(--purple-light)',
        flexShrink: 0,
        padding: 0,
        verticalAlign: 'middle',
        marginLeft: '6px',
      }}
    >
      🎤
    </button>
  )
}

const thStyle = {
  padding: '8px 12px',
  textAlign: 'left',
  color: 'var(--parchment-dim)',
  fontSize: '0.78rem',
  fontWeight: '600',
  letterSpacing: '0.04em',
  whiteSpace: 'nowrap',
}

const tdStyle = {
  padding: '7px 12px',
  color: 'var(--parchment)',
  fontSize: '0.88rem',
  lineHeight: 1.35,
}

const categoryStyle = {
  display: 'inline-block',
  padding: '1px 7px',
  background: 'rgba(181,123,240,0.12)',
  border: '1px solid rgba(181,123,240,0.25)',
  borderRadius: '10px',
  fontSize: '0.73rem',
  color: 'var(--purple-light)',
  whiteSpace: 'nowrap',
}

export default function PreviewScreen({ questions, mode, onStart }) {
  const isJpToEn = mode === 'jp-to-en'

  return (
    <div style={{ width: '100%', maxWidth: '720px' }}>

      {/* タイトル */}
      <div style={{ textAlign: 'center', marginBottom: '14px' }}>
        <h2 style={{ color: 'var(--gold)', fontSize: '1.3rem', fontWeight: '700', marginBottom: '4px' }}>
          ✨ 今日の10問
        </h2>
        <p style={{ color: 'var(--parchment-dim)', fontSize: '0.8rem' }}>
          {isJpToEn ? '🇯🇵 日本語 → 🇬🇧 英語' : '🇬🇧 英語 → 🇯🇵 日本語'} で出題されます
        </p>
      </div>

      {/* 一覧テーブル */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '14px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(200,155,60,0.06)', borderBottom: '1px solid rgba(200,155,60,0.2)' }}>
              <th style={{ ...thStyle, width: '30px', textAlign: 'center' }}>#</th>
              {isJpToEn ? (
                <>
                  <th style={thStyle}>日本語</th>
                  <th style={{ ...thStyle, width: '72px', textAlign: 'center' }}>品詞</th>
                  <th style={thStyle}>英単語</th>
                </>
              ) : (
                <>
                  <th style={{ ...thStyle, width: '72px', textAlign: 'center' }}>品詞</th>
                  <th style={thStyle}>英単語</th>
                  <th style={thStyle}>日本語</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {questions.map((q, i) => (
              <tr
                key={q.id}
                style={{
                  borderBottom: i < questions.length - 1 ? '1px solid rgba(181,123,240,0.08)' : 'none',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                }}
              >
                <td style={{ ...tdStyle, color: 'var(--parchment-dim)', textAlign: 'center', fontSize: '0.75rem' }}>
                  {i + 1}
                </td>
                {isJpToEn ? (
                  <>
                    <td style={tdStyle}>{q.meaning}</td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <span style={categoryStyle}>{q.category}</span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontWeight: '600' }}>{q.word}</span>
                      <MicBtn word={q.word} />
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <span style={categoryStyle}>{q.category}</span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontWeight: '600' }}>{q.word}</span>
                      <MicBtn word={q.word} />
                    </td>
                    <td style={tdStyle}>{q.meaning}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* スタートボタン */}
      <div style={{ textAlign: 'center' }}>
        <button
          className="btn btn-primary"
          style={{ fontSize: '1.05rem', padding: '13px 44px' }}
          onClick={onStart}
        >
          クイズを始める ▶
        </button>
      </div>
    </div>
  )
}
