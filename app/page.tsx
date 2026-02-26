'use client'

import dynamic from 'next/dynamic'

const GameCanvas = dynamic(() => import('@/components/GameCanvas'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        gap: '12px',
      }}
    >
      <div style={{ fontSize: '20px', fontWeight: 600 }}>
        Loading 3D World...
      </div>
      <div style={{ fontSize: '14px', opacity: 0.5 }}>
        Preparing your adventure
      </div>
    </div>
  ),
})

export default function Home() {
  return <GameCanvas />
}
