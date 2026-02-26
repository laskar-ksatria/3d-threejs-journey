'use client'

import { useState } from 'react'

const keyStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(255, 255, 255, 0.12)',
  border: '1px solid rgba(255, 255, 255, 0.25)',
  borderBottom: '3px solid rgba(255, 255, 255, 0.18)',
  borderRadius: '6px',
  padding: '4px 10px',
  fontSize: '12px',
  fontWeight: 700,
  fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
  textAlign: 'center',
  minWidth: '32px',
  lineHeight: '1.3',
  letterSpacing: '0.5px',
}

function Key({ children }: { children: React.ReactNode }) {
  return <span style={keyStyle}>{children}</span>
}

export function Legend() {
  const [open, setOpen] = useState(true)

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '24px',
        left: '24px',
        userSelect: 'none',
      }}
    >
      {open ? (
        <div
          style={{
            background: 'rgba(10, 10, 30, 0.7)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '16px',
            padding: '18px 22px',
            color: 'white',
            fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
            fontSize: '13px',
            lineHeight: '1.6',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow:
              '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
            minWidth: '200px',
            animation: 'legendIn 0.2s ease-out',
          }}
        >
          <div
            style={{
              fontWeight: 700,
              marginBottom: '12px',
              fontSize: '14px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
              paddingBottom: '8px',
              letterSpacing: '0.3px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '16px' }}>🎮</span>
            <span style={{ flex: 1 }}>Controls</span>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '6px',
                color: 'rgba(255, 255, 255, 0.6)',
                cursor: 'pointer',
                fontSize: '11px',
                padding: '2px 8px',
                lineHeight: '1.4',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
                e.currentTarget.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
              }}
            >
              ✕
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              marginBottom: '12px',
            }}
          >
            <Key>W</Key>
            <div style={{ display: 'flex', gap: '4px' }}>
              <Key>A</Key>
              <Key>S</Key>
              <Key>D</Key>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: '6px 14px',
              alignItems: 'center',
            }}
          >
            <Key>W</Key>
            <span style={{ opacity: 0.85 }}>Forward</span>
            <Key>S</Key>
            <span style={{ opacity: 0.85 }}>Backward</span>
            <Key>A</Key>
            <span style={{ opacity: 0.85 }}>Left</span>
            <Key>D</Key>
            <span style={{ opacity: 0.85 }}>Right</span>
            <Key>Shift</Key>
            <span style={{ opacity: 0.85 }}>Sprint (hold)</span>
            <Key>Space</Key>
            <span style={{ opacity: 0.85 }}>Jump</span>
            <Key>Enter</Key>
            <span style={{ opacity: 0.85 }}>Emote</span>
          </div>

          <div
            style={{
              marginTop: '10px',
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.4)',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '8px',
              lineHeight: '1.5',
            }}
          >
            Shift + WASD to run &middot; W+A / W+D for diagonal
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          style={{
            background: 'rgba(10, 10, 30, 0.7)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            color: 'white',
            cursor: 'pointer',
            padding: '10px 16px',
            fontSize: '13px',
            fontWeight: 600,
            fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow:
              '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
            transition: 'all 0.15s ease',
            animation: 'legendIn 0.2s ease-out',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(10, 10, 30, 0.85)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(10, 10, 30, 0.7)'
          }}
        >
          <span style={{ fontSize: '16px' }}>🎮</span>
          Controls
        </button>
      )}

      <style>{`
        @keyframes legendIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
