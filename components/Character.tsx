'use client'

import * as THREE from 'three'
import { useRef, useState, useImperativeHandle, forwardRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { PersonModel } from './PersonModel'
import type { KeyState } from '@/hooks/useKeyboard'

const MOVE_SPEED = 4
const JUMP_FORCE = 6
const GRAVITY = -15
const ROTATION_SPEED = 10
const MAP_BOUND = 24

interface CharacterProps {
  keys: React.RefObject<KeyState>
}

export const Character = forwardRef<THREE.Group, CharacterProps>(
  ({ keys }, ref) => {
    const groupRef = useRef<THREE.Group>(null!)
    const velocityY = useRef(0)
    const isGrounded = useRef(true)
    const targetRotation = useRef(0)
    const [isWalking, setIsWalking] = useState(false)
    const wasWalking = useRef(false)

    useImperativeHandle(ref, () => groupRef.current)

    useFrame((_, delta) => {
      if (!groupRef.current || !keys.current) return

      const dt = Math.min(delta, 0.1)
      const { forward, backward, left, right, jump } = keys.current

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
      if (moving !== wasWalking.current) {
        wasWalking.current = moving
        setIsWalking(moving)
      }

      groupRef.current.position.x += moveX * MOVE_SPEED * dt
      groupRef.current.position.z += moveZ * MOVE_SPEED * dt

      if (moving) {
        targetRotation.current = Math.atan2(moveX, moveZ)
      }

      let currentRot = groupRef.current.rotation.y
      let diff = targetRotation.current - currentRot
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
    })

    return (
      <group ref={groupRef}>
        <PersonModel isWalking={isWalking} scale={1} />
      </group>
    )
  }
)

Character.displayName = 'Character'
