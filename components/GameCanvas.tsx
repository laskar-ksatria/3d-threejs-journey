'use client'

import { Canvas } from '@react-three/fiber'
import { Scene } from './Scene'
import { Legend } from './Legend'
import { useKeyboard } from '@/hooks/useKeyboard'

export default function GameCanvas() {
  const keys = useKeyboard()

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas
        shadows
        camera={{ position: [0, 6, 10], fov: 60, near: 0.1, far: 200 }}
        style={{ background: '#87CEEB' }}
        gl={{ antialias: true }}
      >
        <Scene keys={keys} />
      </Canvas>
      <Legend />
    </div>
  )
}
