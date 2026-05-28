import { useState } from 'react'

export default function StartScreen({ onStart }) {
  const [mode, setMode] = useState('jp-to-en')

  return (
    <div style={{ width: '100%', maxWidth: '560px' }}>
      <div className="card" style={{ textAlign: 'center' }}>

        {/* Title */}
        <div style={{ marginBottom: '8px', fontSize: '2.8rem' }}>⚔️</div>
        <h1 className="rpg-title" style={{ fontSize: '2.6rem', marginBottom: '6px' }}>
          英語クエスト
        </h1>
        <p style={{ color: 'var(--parchment-dim)', fontSize: '1rem', marginBottom: '8px' }}>
          なおの英単語大冒険
        </p>
        <div className="gold-divider" style={{ marginBottom: '36px' }} />

        {/* Mode selection */}
        <p style={{ color: 'var(--gold)', fontWeight: '700', fontSize: '0.95rem', marginBottom: '14px', letterSpacing: '0.05em' }}>
          ─── 出題モードを選んでね ───
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginBottom: '40px', flexWrap: 'wrap' }}>
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

        {/* Start button */}
        <button
          className="btn btn-primary"
          style={{ fontSize: '1.25rem', padding: '18px 56px' }}
          onClick={() => onStart(mode)}
        >
          ▶ クエスト開始！
        </button>

        <p style={{ marginTop: '24px', color: 'var(--parchment-dim)', fontSize: '0.85rem' }}>
          50問ランダム出題 ✦ 最後に結果を確認
        </p>
      </div>
    </div>
  )
}
