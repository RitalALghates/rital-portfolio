import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MeshReflectorMaterial, RoundedBox, Sparkles, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { projects } from '../data'

const TAU = Math.PI * 2
const RADIUS = 4.6
const STEP = TAU / projects.length

const mod = (n, m) => ((n % m) + m) % m
const wrapToNearest = (target, current) => {
  // shortest signed distance around the circle
  const d = mod(target - current + Math.PI, TAU) - Math.PI
  return current + d
}

function Card({ project, index, ringRef, state, onSelect }) {
  const tex = useTexture(project.image)
  const group = useRef()
  const face = useRef()
  const [hover, setHover] = useState(false)
  const angle = index * STEP

  useMemo(() => {
    tex.anisotropy = 8
    tex.colorSpace = THREE.SRGBColorSpace
  }, [tex])

  useFrame((s, dt) => {
    const rotation = ringRef.current?.rotation.y ?? 0
    const facing = Math.cos(angle + rotation) // 1 = front, -1 = back
    const brightness = 0.28 + 0.72 * Math.max(0, (facing + 0.35) / 1.35)
    face.current.color.setScalar(brightness)
    const target = hover || facing > 0.97 ? 1.07 : 1
    const k = 1 - Math.exp(-8 * dt)
    group.current.scale.x += (target - group.current.scale.x) * k
    group.current.scale.y += (target - group.current.scale.y) * k
    group.current.position.y += ((hover ? 0.12 : 0) - group.current.position.y) * k
  })

  return (
    <group position={[Math.sin(angle) * RADIUS, 0, Math.cos(angle) * RADIUS]} rotation={[0, angle, 0]}>
      <group
        ref={group}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHover(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHover(false)
          document.body.style.cursor = ''
        }}
        onClick={(e) => {
          e.stopPropagation()
          if (e.delta < 6) onSelect(index)
        }}
      >
        <RoundedBox args={[3.35, 2.1, 0.07]} radius={0.07} smoothness={4} position={[0, 0, -0.04]}>
          <meshStandardMaterial color="#dcb872" metalness={1} roughness={0.2} envMapIntensity={1.5} />
        </RoundedBox>
        <RoundedBox args={[3.2, 2, 0.06]} radius={0.05} smoothness={4}>
          <meshStandardMaterial ref={face} map={tex} roughness={0.4} metalness={0.05} />
        </RoundedBox>
      </group>
    </group>
  )
}

function Ring({ state, onSelect, onActive }) {
  const ring = useRef()
  const { gl, size } = useThree()
  const dragging = useRef(false)
  const lastX = useRef(0)
  const velocity = useRef(0)
  const idle = useRef(0)
  const lastActive = useRef(0)
  const reduce = useMemo(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches, [])
  const scale = Math.min(1, size.width / 1100)

  // expose imperative controls to the parent
  useEffect(() => {
    state.current.goTo = (i) => {
      state.current.target = wrapToNearest(-i * STEP, state.current.target)
      idle.current = 0
    }
    state.current.next = (dir) => {
      state.current.target = Math.round(state.current.target / STEP) * STEP - dir * STEP
      idle.current = 0
    }
  }, [state])

  useEffect(() => {
    const el = gl.domElement
    const down = (e) => {
      dragging.current = true
      lastX.current = e.clientX
      velocity.current = 0
      el.setPointerCapture?.(e.pointerId)
    }
    const move = (e) => {
      if (!dragging.current) return
      const dx = e.clientX - lastX.current
      lastX.current = e.clientX
      const delta = (dx / size.width) * 3.2
      state.current.target += delta
      velocity.current = delta
      idle.current = 0
    }
    const up = () => {
      if (!dragging.current) return
      dragging.current = false
      state.current.target = Math.round((state.current.target + velocity.current * 10) / STEP) * STEP
    }
    el.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [gl, size.width, state])

  useFrame((s, dt) => {
    const st = state.current
    idle.current += dt
    if (!dragging.current && !reduce && !st.hold && idle.current > 5) {
      st.target -= STEP // auto-advance
      idle.current = 0
    }
    const k = dragging.current ? 1 - Math.exp(-18 * dt) : 1 - Math.exp(-5 * dt)
    ring.current.rotation.y += (st.target - ring.current.rotation.y) * k

    const idx = mod(Math.round(-ring.current.rotation.y / STEP), projects.length)
    if (idx !== lastActive.current) {
      lastActive.current = idx
      onActive(idx)
    }
  })

  return (
    <group scale={scale} position={[0, 0.2, 0]}>
      <group ref={ring}>
        {projects.map((project, i) => (
          <Card key={project.id} project={project} index={i} ringRef={ring} state={state} onSelect={onSelect} />
        ))}
      </group>
    </group>
  )
}

function Floor({ small }) {
  return (
    <group position={[0, -1.55, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        {small ? (
          <meshStandardMaterial color="#1a0b1c" roughness={0.6} metalness={0.4} />
        ) : (
          <MeshReflectorMaterial
            blur={[320, 90]}
            resolution={512}
            mixBlur={1}
            mixStrength={28}
            roughness={1}
            depthScale={1.1}
            minDepthThreshold={0.35}
            maxDepthThreshold={1.3}
            color="#1a0b1c"
            metalness={0.6}
            mirror={0}
          />
        )}
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[RADIUS - 0.08, RADIUS + 0.08, 160]} />
        <meshBasicMaterial color="#dcb872" transparent opacity={0.55} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[RADIUS * 0.55, RADIUS * 0.55 + 0.03, 160]} />
        <meshBasicMaterial color="#f2a9bf" transparent opacity={0.35} />
      </mesh>
    </group>
  )
}

export default function Gallery3D({ onActive, controlsRef, onSelect }) {
  const state = useRef({ target: 0, hold: false, goTo: () => {}, next: () => {} })
  const small = typeof window !== 'undefined' && window.innerWidth < 768

  useEffect(() => {
    if (controlsRef) controlsRef.current = state.current
  })

  return (
    <Canvas
      dpr={[1, small ? 1.4 : 1.8]}
      camera={{ position: [0, 1.4, 10.4], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: 'pan-y' }}
      onCreated={({ gl, camera }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        camera.lookAt(0, 0, 0)
      }}
    >
      <fog attach="fog" args={['#14070f', 12, 24]} />
      <ambientLight intensity={1.1} color="#ffe3ec" />
      <pointLight position={[0, 4, 7]} intensity={45} color="#fff0e6" />
      <pointLight position={[-7, 2, 3]} intensity={14} color="#f2a9bf" />
      <pointLight position={[7, 2, 3]} intensity={14} color="#ecd4a0" />
      <Suspense fallback={null}>
        <Ring state={state} onSelect={(i) => { state.current.goTo(i); onSelect?.(i) }} onActive={onActive} />
        <Floor small={small} />
        <Sparkles count={small ? 30 : 70} scale={[12, 5, 8]} position={[0, 1, 0]} size={2.5} speed={0.25} color="#ecd4a0" />
      </Suspense>
    </Canvas>
  )
}
