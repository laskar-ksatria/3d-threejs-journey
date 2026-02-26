'use client'

import * as THREE from 'three'
import { useEffect, useRef, useMemo, useImperativeHandle, forwardRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'

export type AnimState = 'idle' | 'walk' | 'run' | 'emote'

interface PersonModelProps {
  animState: AnimState
  scale?: number
}

export const PersonModel = forwardRef<THREE.Group, PersonModelProps>(
  ({ animState, scale = 1, ...props }, ref) => {
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
      const isRun = animState === 'run'
      const clipName =
        animState === 'idle'
          ? 'wait'
          : animState === 'emote'
            ? 'coucou'
            : 'walk'

      const target = actions[clipName]

      Object.values(actions).forEach((action) => {
        if (action && action !== target) {
          action.fadeOut(0.3)
        }
      })

      if (!target) return

      if (animState === 'emote') {
        target.reset().fadeIn(0.2).setLoop(THREE.LoopOnce, 1).play()
        target.clampWhenFinished = true
        target.timeScale = 1
      } else {
        target.reset().fadeIn(0.3).setLoop(THREE.LoopRepeat, Infinity).play()
        target.timeScale = isRun ? 2.2 : 1
      }
    }, [animState, actions])

    return (
      <group ref={group} scale={scale} {...props} dispose={null}>
        <primitive object={clone} />
      </group>
    )
  }
)

PersonModel.displayName = 'PersonModel'
useGLTF.preload('/models/person.glb')
