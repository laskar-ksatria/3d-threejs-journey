'use client'

import * as THREE from 'three'
import { useEffect, useRef, useMemo, useImperativeHandle, forwardRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'

interface PersonModelProps {
  isWalking: boolean
  scale?: number
}

export const PersonModel = forwardRef<THREE.Group, PersonModelProps>(
  ({ isWalking, scale = 1, ...props }, ref) => {
    const group = useRef<THREE.Group>(null!)
    const { scene, animations } = useGLTF('/models/person.glb')
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
    const { actions } = useAnimations(animations, group)

    useImperativeHandle(ref, () => group.current)

    useEffect(() => {
      clone.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    }, [clone])

    useEffect(() => {
      const targetName = isWalking ? 'walk' : 'wait'
      const target = actions[targetName]

      Object.values(actions).forEach((action) => {
        if (action && action !== target) {
          action.fadeOut(0.3)
        }
      })

      target?.reset().fadeIn(0.3).play()
    }, [isWalking, actions])

    return (
      <group ref={group} scale={scale} {...props} dispose={null}>
        <primitive object={clone} />
      </group>
    )
  }
)

PersonModel.displayName = 'PersonModel'
useGLTF.preload('/models/person.glb')
