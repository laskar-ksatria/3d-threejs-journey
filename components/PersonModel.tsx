'use client'

import * as THREE from 'three'
import { useEffect, useRef, useMemo, useImperativeHandle, forwardRef } from 'react'
import { useFrame } from '@react-three/fiber'
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
    const bonesRef = useRef<{
      armL: THREE.Bone | null
      armR: THREE.Bone | null
      head: THREE.Bone | null
    }>({ armL: null, armR: null, head: null })

    useImperativeHandle(ref, () => group.current)

    useEffect(() => {
      clone.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
        if ((child as THREE.Bone).isBone) {
          const bone = child as THREE.Bone
          if (bone.name === 'coude_bras_L' || bone.name === 'IKmain_L') {
            bonesRef.current.armL = bone
          }
          if (bone.name === 'coude_bras_R' || bone.name === 'IKmain_R') {
            bonesRef.current.armR = bone
          }
          if (bone.name === 'IKtete') {
            bonesRef.current.head = bone
          }
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
        target.timeScale = isRun ? 2.4 : 1
      }
    }, [animState, actions])

    useFrame((state) => {
      if (animState !== 'run') return

      const t = state.clock.elapsedTime
      const { armL, armR } = bonesRef.current

      // Pump arms harder during run - override after animation mixer
      if (armL) {
        armL.rotation.x += Math.sin(t * 14) * 0.15
      }
      if (armR) {
        armR.rotation.x += Math.sin(t * 14 + Math.PI) * 0.15
      }
    })

    return (
      <group ref={group} scale={scale} {...props} dispose={null}>
        <primitive object={clone} />
      </group>
    )
  }
)

PersonModel.displayName = 'PersonModel'
useGLTF.preload('/models/person.glb')
