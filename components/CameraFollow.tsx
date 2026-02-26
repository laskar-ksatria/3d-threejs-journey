'use client'

import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

const OFFSET = new THREE.Vector3(0, 6, 10)
const LOOK_OFFSET = new THREE.Vector3(0, 1.5, 0)
const SMOOTH_SPEED = 3

export function CameraFollow({
  target,
}: {
  target: React.RefObject<THREE.Group | null>
}) {
  const { camera } = useThree()
  const desiredPos = useRef(new THREE.Vector3())
  const desiredLookAt = useRef(new THREE.Vector3())

  useFrame((_, delta) => {
    if (!target.current) return

    const pos = target.current.position

    desiredPos.current.set(
      pos.x + OFFSET.x,
      pos.y + OFFSET.y,
      pos.z + OFFSET.z
    )
    desiredLookAt.current.set(
      pos.x + LOOK_OFFSET.x,
      pos.y + LOOK_OFFSET.y,
      pos.z + LOOK_OFFSET.z
    )

    const t = 1 - Math.exp(-SMOOTH_SPEED * delta)
    camera.position.lerp(desiredPos.current, t)
    camera.lookAt(desiredLookAt.current)
  })

  return null
}
