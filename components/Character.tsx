'use client'

import * as THREE from 'three'
import { useRef, useState, useImperativeHandle, forwardRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { PersonModel } from './PersonModel'
import type { AnimState } from './PersonModel'
import type { KeyState } from '@/hooks/useKeyboard'

const WALK_SPEED = 4
const RUN_SPEED = 8
const JUMP_FORCE = 6
const GRAVITY = -15
const ROTATION_SPEED = 10
const MAP_BOUND = 24
const EMOTE_DURATION = 2.2

const RUN_LEAN = 0.35
const RUN_BOUNCE_AMP = 0.06
const RUN_BOUNCE_FREQ = 14
const WALK_BOUNCE_AMP = 0.02
const WALK_BOUNCE_FREQ = 8
const POSTURE_LERP = 8

interface CharacterProps {
  keys: React.RefObject<KeyState>
}

export const Character = forwardRef<THREE.Group, CharacterProps>(
  ({ keys }, ref) => {
    const groupRef = useRef<THREE.Group>(null!)
    const bodyRef = useRef<THREE.Group>(null!)
    const velocityY = useRef(0)
    const isGrounded = useRef(true)
    const targetRotation = useRef(0)
    const [animState, setAnimState] = useState<AnimState>('idle')
    const prevAnim = useRef<AnimState>('idle')
    const emoteTimer = useRef(0)
    const emoteCooldown = useRef(false)

    const currentLean = useRef(0)
    const currentBounce = useRef(0)
    const runTime = useRef(0)

    useImperativeHandle(ref, () => groupRef.current)

    useFrame((state, delta) => {
      if (!groupRef.current || !keys.current) return

      const dt = Math.min(delta, 0.1)
      const { forward, backward, left, right, jump, emote, sprint } = keys.current

      if (emoteTimer.current > 0) {
        emoteTimer.current -= dt
        if (emoteTimer.current <= 0) {
          emoteTimer.current = 0
          emoteCooldown.current = false
        }

        velocityY.current += GRAVITY * dt
        groupRef.current.position.y += velocityY.current * dt
        if (groupRef.current.position.y <= 0) {
          groupRef.current.position.y = 0
          velocityY.current = 0
          isGrounded.current = true
        }

        const newAnim: AnimState = emoteTimer.current > 0 ? 'emote' : 'idle'
        if (newAnim !== prevAnim.current) {
          prevAnim.current = newAnim
          setAnimState(newAnim)
        }

        if (bodyRef.current) {
          currentLean.current += (0 - currentLean.current) * Math.min(1, POSTURE_LERP * dt)
          currentBounce.current += (0 - currentBounce.current) * Math.min(1, POSTURE_LERP * dt)
          bodyRef.current.rotation.x = currentLean.current
          bodyRef.current.position.y = currentBounce.current
        }
        return
      }

      if (emote && !emoteCooldown.current && isGrounded.current) {
        emoteTimer.current = EMOTE_DURATION
        emoteCooldown.current = true
        prevAnim.current = 'emote'
        setAnimState('emote')
        return
      }

      let moveX = 0
      let moveZ = 0
      if (forward) moveZ -= 1
      if (backward) moveZ += 1
      if (left) moveX -= 1
      if (right) moveX += 1

      const length = Math.sqrt(moveX * moveX + moveZ * moveZ)
      if (length > 0) {
        moveX /= length
        moveZ /= length
      }

      const moving = length > 0
      const running = sprint && moving
      const speed = running ? RUN_SPEED : WALK_SPEED
      const newAnim: AnimState = moving ? (running ? 'run' : 'walk') : 'idle'
      if (newAnim !== prevAnim.current) {
        prevAnim.current = newAnim
        setAnimState(newAnim)
      }

      groupRef.current.position.x += moveX * speed * dt
      groupRef.current.position.z += moveZ * speed * dt

      if (moving) {
        targetRotation.current = Math.atan2(moveX, moveZ)
        runTime.current += dt
      }

      let diff = targetRotation.current - groupRef.current.rotation.y
      diff = ((diff + Math.PI) % (Math.PI * 2)) - Math.PI
      if (diff < -Math.PI) diff += Math.PI * 2
      groupRef.current.rotation.y += diff * Math.min(1, ROTATION_SPEED * dt)

      if (jump && isGrounded.current) {
        velocityY.current = JUMP_FORCE
        isGrounded.current = false
      }

      velocityY.current += GRAVITY * dt
      groupRef.current.position.y += velocityY.current * dt

      if (groupRef.current.position.y <= 0) {
        groupRef.current.position.y = 0
        velocityY.current = 0
        isGrounded.current = true
      }

      groupRef.current.position.x = THREE.MathUtils.clamp(
        groupRef.current.position.x,
        -MAP_BOUND,
        MAP_BOUND
      )
      groupRef.current.position.z = THREE.MathUtils.clamp(
        groupRef.current.position.z,
        -MAP_BOUND,
        MAP_BOUND
      )

      // Running posture
      if (bodyRef.current) {
        let targetLean = 0
        let targetBounce = 0

        if (running && isGrounded.current) {
          targetLean = RUN_LEAN
          targetBounce = Math.abs(Math.sin(runTime.current * RUN_BOUNCE_FREQ)) * RUN_BOUNCE_AMP
        } else if (moving && isGrounded.current) {
          targetLean = 0.05
          targetBounce = Math.abs(Math.sin(runTime.current * WALK_BOUNCE_FREQ)) * WALK_BOUNCE_AMP
        }

        const t = Math.min(1, POSTURE_LERP * dt)
        currentLean.current += (targetLean - currentLean.current) * t
        currentBounce.current += (targetBounce - currentBounce.current) * t

        bodyRef.current.rotation.x = currentLean.current
        bodyRef.current.position.y = currentBounce.current
      }
    })

    return (
      <group ref={groupRef}>
        <group ref={bodyRef}>
          <PersonModel animState={animState} scale={1} />
        </group>
      </group>
    )
  }
)

Character.displayName = 'Character'
