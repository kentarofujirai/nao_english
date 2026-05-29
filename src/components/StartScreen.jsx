import { useState } from 'react'

export default function StartScreen({ onStart, onShowCalendar }) {
  const [mode, setMode] = useState('jp-to-en')

  return (
    <div style={{ width: '100%', maxWidth: '560px' }}>
      <div className="card" style={{ textAlign: 'center' }}>

        {/* タイトル */}
        <div style={{ marginBottom: '8px', fontSize: '2.8rem' }}>⚔️</div>
        <h1 className="rpg-title" style={{ fontSize: '2.6rem', marginBottom: '6px' }}>
          英語クエスト
        </h1>
        <p style={{ color: 'var(--parchment-dim)', fontSize: '1rem', marginBottom: '8px' }}>
          なおの英単語大冒険
        </p>
        <div className="gold-divider" style={{ marginBottom: '36px' }} />

        {/* モード選択 */}
        <p style={{ color: 'var(--gold)', fontWeight: '700', fontSize: '0.95rem', marginBottom: '14px', letterSpacing: '0.05em' }}>
          ─── 出題モードを選んでね ───
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginBottom: '36px', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-mode ${mode === 'jp-to-en' ? 'active' : ''}`}
            onClick={() => setMode('jp-to-en')}
          >
            🇯🇵 日本語 → 英語
          </button>
          <button
            className={`btn btn-mode ${mode === 'en-to-jp' ? 'active' : ''}`}
            onClick={() => setMode('en-to-jp')}
          >
            🇬🇧 英語 → 日本語
          </button>
        </div>

        {/* クエスト開始ボタン */}
        <button
          className="btn btn-primary"
          style={{ fontSize: '1.25rem', padding: '18px 56px', marginBottom: '16px' }}
          onClick={() => onStart(mode)}
        >
          ▶ クエスト開始！
        </button>

        {/* 学習カレンダーボタン */}
        <div>
          <button
            onClick={onShowCalendar}
            style={{
              background: 'none',
              border: '1px solid rgba(200,155,60,0.35)',
              borderRadius: '10px',
              color: 'var(--parchment-dim)',
              cursor: 'pointer',
              padding: '10px 28px',
              fontSize: '0.92rem',
              fontFamily: 'inherit',
              transition: 'all 0.18s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--gold)'
              e.currentTarget.style.color = 'var(--gold)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(200,155,60,0.35)'
              e.currentTarget.style.color = 'var(--parchment-dim)'
            }}
          >
            📅 学習カレンダーを見る
          </button>
        </div>

        <p style={{ marginTop: '18px', color: 'var(--parchment-dim)', fontSize: '0.85rem' }}>
          1日10問ランダム出題 ✦ 最後に結果を確認
        </p>
      </div>
    </div>
  )
}
