'use client'

import * as THREE from 'three'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { PersonModel } from './PersonModel'
import type { AnimState } from './PersonModel'

const SPEED = 1.5
const ROTATION_SPEED = 8
const ARRIVE_THRESHOLD = 0.5
const IDLE_MIN = 1.5
const IDLE_MAX = 4
const WANDER_RADIUS = 18
const EMOTE_CHANCE = 0.25
const EMOTE_DURATION = 2.2

function randomTarget(origin: THREE.Vector2, radius: number): THREE.Vector2 {
  const angle = Math.random() * Math.PI * 2
  const dist = 3 + Math.random() * radius
  const x = THREE.MathUtils.clamp(origin.x + Math.cos(angle) * dist, -22, 22)
  const z = THREE.MathUtils.clamp(origin.y + Math.sin(angle) * dist, -22, 22)
  return new THREE.Vector2(x, z)
}

interface NPCProps {
  startPosition: [number, number, number]
  npcScale?: number
  seed?: number
}

export function NPC({ startPosition, npcScale = 0.45, seed = 0 }: NPCProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const [animState, setAnimState] = useState<AnimState>('idle')
  const prevAnim = useRef<AnimState>('idle')
  const targetRotation = useRef(0)

  const state = useRef({
    target: new THREE.Vector2(startPosition[0], startPosition[2]),
    timer: 1 + seed * 0.5,
    phase: 'idle' as 'idle' | 'walking' | 'emote',
  })

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const dt = Math.min(delta, 0.1)
    const pos = groupRef.current.position
    const s = state.current

    if (s.phase === 'emote') {
      s.timer -= dt
      if (s.timer <= 0) {
        s.phase = 'idle'
        s.timer = IDLE_MIN + Math.random() * (IDLE_MAX - IDLE_MIN)
      }
    } else if (s.phase === 'idle') {
      s.timer -= dt
      if (s.timer <= 0) {
        if (Math.random() < EMOTE_CHANCE) {
          s.phase = 'emote'
          s.timer = EMOTE_DURATION
        } else {
          s.target = randomTarget(new THREE.Vector2(pos.x, pos.z), WANDER_RADIUS)
          s.phase = 'walking'
        }
      }
    } else if (s.phase === 'walking') {
      const dx = s.target.x - pos.x
      const dz = s.target.y - pos.z
      const dist = Math.sqrt(dx * dx + dz * dz)

      if (dist < ARRIVE_THRESHOLD) {
        s.phase = 'idle'
        s.timer = IDLE_MIN + Math.random() * (IDLE_MAX - IDLE_MIN)
      } else {
        const nx = dx / dist
        const nz = dz / dist
        pos.x += nx * SPEED * dt
        pos.z += nz * SPEED * dt
        targetRotation.current = Math.atan2(nx, nz)
      }
    }

    const newAnim: AnimState =
      s.phase === 'emote' ? 'emote' : s.phase === 'walking' ? 'walk' : 'idle'
    if (newAnim !== prevAnim.current) {
      prevAnim.current = newAnim
      setAnimState(newAnim)
    }

    let diff = targetRotation.current - groupRef.current.rotation.y
    diff = ((diff + Math.PI) % (Math.PI * 2)) - Math.PI
    if (diff < -Math.PI) diff += Math.PI * 2
    groupRef.current.rotation.y += diff * Math.min(1, ROTATION_SPEED * dt)
  })

  return (
    <group ref={groupRef} position={startPosition}>
      <PersonModel animState={animState} scale={npcScale} />
    </group>
  )
}

const NPC_SPAWNS: { pos: [number, number, number]; scale: number }[] = [
  { pos: [8, 0, 5], scale: 0.3 },
  { pos: [-10, 0, -7], scale: 0.55 },
  { pos: [-6, 0, 12], scale: 0.25 },
  { pos: [14, 0, -15], scale: 0.45 },
  { pos: [-15, 0, -3], scale: 0.6 },
]

export function NPCGroup() {
  return (
    <>
      {NPC_SPAWNS.map((npc, i) => (
        <NPC
          key={`npc-${i}`}
          startPosition={npc.pos}
          seed={i}
          npcScale={npc.scale}
        />
      ))}
    </>
  )
}
