'use client'

import { useRef } from 'react'
import * as THREE from 'three'
import { Character } from './Character'
import { CameraFollow } from './CameraFollow'
import { Environment } from './Environment'
import { NPCGroup } from './NPC'
import type { KeyState } from '@/hooks/useKeyboard'

export function Scene({ keys }: { keys: React.RefObject<KeyState> }) {
  const characterRef = useRef<THREE.Group>(null!)

  return (
    <>
      <Environment />
      <Character ref={characterRef} keys={keys} />
      <NPCGroup />
      <CameraFollow target={characterRef} />
    </>
  )
}
