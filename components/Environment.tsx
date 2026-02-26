'use client'

import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sky } from '@react-three/drei'

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function Tree({
  position,
  scale = 1,
  seed = 0,
}: {
  position: [number, number, number]
  scale?: number
  seed?: number
}) {
  const color = useMemo(() => {
    const g = 0.35 + seededRandom(seed * 7) * 0.25
    return new THREE.Color(0.12, g, 0.1)
  }, [seed])

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.22, 1.5, 6]} />
        <meshStandardMaterial color="#6B3E26" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.0, 0]} castShadow>
        <coneGeometry args={[1.2, 2, 7]} />
        <meshStandardMaterial color={color} roughness={0.8} flatShading />
      </mesh>
      <mesh position={[0, 2.8, 0]} castShadow>
        <coneGeometry args={[0.9, 1.5, 7]} />
        <meshStandardMaterial
          color={color.clone().multiplyScalar(1.15)}
          roughness={0.8}
          flatShading
        />
      </mesh>
      <mesh position={[0, 3.5, 0]} castShadow>
        <coneGeometry args={[0.55, 1.2, 7]} />
        <meshStandardMaterial
          color={color.clone().multiplyScalar(1.3)}
          roughness={0.8}
          flatShading
        />
      </mesh>
    </group>
  )
}

function Rock({
  position,
  scale = 1,
  seed = 0,
}: {
  position: [number, number, number]
  scale?: number
  seed?: number
}) {
  const rotation = useMemo(
    () =>
      [
        seededRandom(seed * 3) * Math.PI,
        seededRandom(seed * 3 + 1) * Math.PI,
        seededRandom(seed * 3 + 2) * Math.PI,
      ] as [number, number, number],
    [seed]
  )

  const color = useMemo(() => {
    const shade = 0.4 + seededRandom(seed * 5) * 0.25
    return new THREE.Color(shade, shade * 0.95, shade * 0.88)
  }, [seed])

  return (
    <mesh
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
      receiveShadow
    >
      <dodecahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color={color} roughness={0.95} flatShading />
    </mesh>
  )
}

function Flower({
  position,
  seed = 0,
}: {
  position: [number, number, number]
  seed?: number
}) {
  const color = useMemo(() => {
    const colors = [
      '#FF69B4',
      '#FFD700',
      '#FF6347',
      '#DDA0DD',
      '#87CEEB',
      '#FFA07A',
      '#FF1493',
      '#ADFF2F',
    ]
    return colors[Math.floor(seededRandom(seed * 11) * colors.length)]
  }, [seed])

  return (
    <group position={position}>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 4]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.08, 6, 6]} />
        <meshStandardMaterial color={color} roughness={0.5} emissive={color} emissiveIntensity={0.1} />
      </mesh>
    </group>
  )
}

function Mushroom({
  position,
  seed = 0,
}: {
  position: [number, number, number]
  seed?: number
}) {
  const capColor = useMemo(() => {
    const colors = ['#CC3333', '#CC6633', '#996633']
    return colors[Math.floor(seededRandom(seed * 13) * colors.length)]
  }, [seed])

  return (
    <group position={position}>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 0.25, 6]} />
        <meshStandardMaterial color="#F5DEB3" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.28, 0]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[0.16, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color={capColor} roughness={0.6} flatShading />
      </mesh>
    </group>
  )
}

function Pond() {
  const waterRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (waterRef.current) {
      waterRef.current.position.y =
        0.03 + Math.sin(state.clock.elapsedTime * 0.8) * 0.015
    }
  })

  const pondRocks = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => {
      const angle = (i / 14) * Math.PI * 2
      const r = 3.6 + Math.sin(i * 2.7) * 0.4
      return {
        position: [
          Math.cos(angle) * r,
          0.12,
          Math.sin(angle) * r,
        ] as [number, number, number],
        scale: 0.3 + seededRandom(i * 17) * 0.35,
      }
    })
  }, [])

  return (
    <group position={[10, 0, -10]}>
      <mesh
        ref={waterRef}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[3.5, 32]} />
        <meshStandardMaterial
          color="#3388AA"
          transparent
          opacity={0.75}
          roughness={0.05}
          metalness={0.4}
        />
      </mesh>
      {/* Darker pond bottom */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <circleGeometry args={[3.5, 32]} />
        <meshStandardMaterial color="#1a4455" />
      </mesh>
      {pondRocks.map((rock, i) => (
        <Rock
          key={`pond-rock-${i}`}
          position={rock.position}
          scale={rock.scale}
          seed={i + 500}
        />
      ))}
    </group>
  )
}

function Bridge() {
  return (
    <group position={[10, 0.15, -6]}>
      {/* Bridge planks */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={`plank-${i}`}
          position={[0, 0, i * 0.45 - 1.6]}
          receiveShadow
          castShadow
        >
          <boxGeometry args={[1.6, 0.08, 0.35]} />
          <meshStandardMaterial color="#A0522D" roughness={0.85} />
        </mesh>
      ))}
      {/* Railings */}
      {[-0.75, 0.75].map((x) => (
        <group key={`rail-${x}`}>
          <mesh position={[x, 0.4, -1.6]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.7, 5]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <mesh position={[x, 0.4, 1.6]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.7, 5]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <mesh
            position={[x, 0.7, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.03, 0.03, 3.4, 5]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function FenceSection({
  start,
  end,
}: {
  start: [number, number, number]
  end: [number, number, number]
}) {
  const posts = useMemo(() => {
    const count = 10
    const result: [number, number, number][] = []
    for (let i = 0; i <= count; i++) {
      const t = i / count
      result.push([
        start[0] + (end[0] - start[0]) * t,
        0.4,
        start[2] + (end[2] - start[2]) * t,
      ])
    }
    return result
  }, [start, end])

  return (
    <group>
      {posts.map((pos, i) => (
        <mesh key={`post-${i}`} position={pos} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.8, 4]} />
          <meshStandardMaterial color="#654321" roughness={0.9} />
        </mesh>
      ))}
      {/* Top rail */}
      <mesh
        position={[
          (start[0] + end[0]) / 2,
          0.65,
          (start[2] + end[2]) / 2,
        ]}
        rotation={[
          0,
          Math.atan2(end[0] - start[0], end[2] - start[2]) + Math.PI / 2,
          Math.PI / 2,
        ]}
        castShadow
      >
        <cylinderGeometry
          args={[
            0.03,
            0.03,
            Math.sqrt(
              (end[0] - start[0]) ** 2 + (end[2] - start[2]) ** 2
            ),
            4,
          ]}
        />
        <meshStandardMaterial color="#654321" roughness={0.9} />
      </mesh>
      {/* Bottom rail */}
      <mesh
        position={[
          (start[0] + end[0]) / 2,
          0.3,
          (start[2] + end[2]) / 2,
        ]}
        rotation={[
          0,
          Math.atan2(end[0] - start[0], end[2] - start[2]) + Math.PI / 2,
          Math.PI / 2,
        ]}
        castShadow
      >
        <cylinderGeometry
          args={[
            0.025,
            0.025,
            Math.sqrt(
              (end[0] - start[0]) ** 2 + (end[2] - start[2]) ** 2
            ),
            4,
          ]}
        />
        <meshStandardMaterial color="#654321" roughness={0.9} />
      </mesh>
    </group>
  )
}

export function Environment() {
  const trees = useMemo(() => {
    const result: { pos: [number, number, number]; scale: number }[] = []
    for (let i = 0; i < 35; i++) {
      const x = seededRandom(i * 3) * 48 - 24
      const z = seededRandom(i * 3 + 1) * 48 - 24

      if (Math.abs(x) < 4 && Math.abs(z) < 4) continue
      if (Math.abs(x) < 2.5 || Math.abs(z) < 2.5) continue
      if (Math.sqrt((x - 10) ** 2 + (z + 10) ** 2) < 6) continue

      result.push({
        pos: [x, 0, z],
        scale: 0.7 + seededRandom(i * 3 + 2) * 0.9,
      })
    }
    return result
  }, [])

  const rocks = useMemo(() => {
    const result: { pos: [number, number, number]; scale: number }[] = []
    for (let i = 0; i < 20; i++) {
      const x = seededRandom(i * 5 + 100) * 46 - 23
      const z = seededRandom(i * 5 + 101) * 46 - 23
      if (Math.abs(x) < 3 && Math.abs(z) < 3) continue
      result.push({
        pos: [x, 0.15, z],
        scale: 0.25 + seededRandom(i * 5 + 102) * 0.55,
      })
    }
    return result
  }, [])

  const flowers = useMemo(() => {
    const result: [number, number, number][] = []
    for (let i = 0; i < 60; i++) {
      const x = seededRandom(i * 7 + 200) * 46 - 23
      const z = seededRandom(i * 7 + 201) * 46 - 23
      if (Math.abs(x) < 3 && Math.abs(z) < 3) continue
      if (Math.abs(x) < 2.5 || Math.abs(z) < 2.5) continue
      if (Math.sqrt((x - 10) ** 2 + (z + 10) ** 2) < 5) continue
      result.push([x, 0, z])
    }
    return result
  }, [])

  const mushrooms = useMemo(() => {
    const result: [number, number, number][] = []
    for (let i = 0; i < 12; i++) {
      const x = seededRandom(i * 11 + 300) * 40 - 20
      const z = seededRandom(i * 11 + 301) * 40 - 20
      if (Math.abs(x) < 4 && Math.abs(z) < 4) continue
      result.push([x, 0, z])
    }
    return result
  }, [])

  const grassPatches = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      x: seededRandom(i * 13 + 400) * 44 - 22,
      z: seededRandom(i * 13 + 401) * 44 - 22,
      size: 1.5 + seededRandom(i * 13 + 402) * 3.5,
      rotation: seededRandom(i * 13 + 403) * Math.PI,
    }))
  }, [])

  return (
    <>
      <Sky
        distance={450000}
        sunPosition={[100, 40, 100]}
        inclination={0.5}
        azimuth={0.25}
        turbidity={8}
        rayleigh={2}
      />

      <ambientLight intensity={0.4} color="#B0D4F1" />
      <directionalLight
        position={[15, 25, 10]}
        intensity={1.8}
        color="#FFF5E0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={70}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-bias={-0.0005}
      />
      <hemisphereLight args={['#87CEEB', '#4a7c3f', 0.35]} />

      {/* Main ground */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
      >
        <planeGeometry args={[52, 52]} />
        <meshStandardMaterial color="#5a9c4f" roughness={0.92} />
      </mesh>

      {/* Grass variety patches */}
      {grassPatches.map((patch, i) => (
        <mesh
          key={`grass-${i}`}
          rotation={[-Math.PI / 2, 0, patch.rotation]}
          position={[patch.x, 0.003, patch.z]}
          receiveShadow
        >
          <circleGeometry args={[patch.size, 8]} />
          <meshStandardMaterial color="#4a8c3f" roughness={0.95} />
        </mesh>
      ))}

      {/* Subtle grid */}
      <gridHelper
        args={[50, 50, '#3a6c2f', '#3a6c2f']}
        position={[0, 0.005, 0]}
      />

      {/* Cross paths */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.008, 0]}
        receiveShadow
      >
        <planeGeometry args={[2.5, 52]} />
        <meshStandardMaterial color="#C4A16A" roughness={0.95} />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.008, 0]}
        receiveShadow
      >
        <planeGeometry args={[52, 2.5]} />
        <meshStandardMaterial color="#C4A16A" roughness={0.95} />
      </mesh>
      {/* Path edges */}
      {[-1.35, 1.35].map((offset) => (
        <group key={`path-edge-${offset}`}>
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[offset, 0.009, 0]}
            receiveShadow
          >
            <planeGeometry args={[0.15, 52]} />
            <meshStandardMaterial color="#A0875A" roughness={0.95} />
          </mesh>
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.009, offset]}
            receiveShadow
          >
            <planeGeometry args={[52, 0.15]} />
            <meshStandardMaterial color="#A0875A" roughness={0.95} />
          </mesh>
        </group>
      ))}

      <Pond />
      <Bridge />

      {trees.map((tree, i) => (
        <Tree
          key={`tree-${i}`}
          position={tree.pos}
          scale={tree.scale}
          seed={i}
        />
      ))}

      {rocks.map((rock, i) => (
        <Rock
          key={`rock-${i}`}
          position={rock.pos}
          scale={rock.scale}
          seed={i + 100}
        />
      ))}

      {flowers.map((pos, i) => (
        <Flower key={`flower-${i}`} position={pos} seed={i + 200} />
      ))}

      {mushrooms.map((pos, i) => (
        <Mushroom key={`mushroom-${i}`} position={pos} seed={i + 300} />
      ))}

      {/* Fences around perimeter */}
      <FenceSection start={[-25, 0, -25]} end={[25, 0, -25]} />
      <FenceSection start={[25, 0, -25]} end={[25, 0, 25]} />
      <FenceSection start={[25, 0, 25]} end={[-25, 0, 25]} />
      <FenceSection start={[-25, 0, 25]} end={[-25, 0, -25]} />

      <fog attach="fog" args={['#c9e6ff', 25, 60]} />
    </>
  )
}
