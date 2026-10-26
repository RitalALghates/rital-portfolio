import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

const isSmall = () => typeof window !== 'undefined' && window.innerWidth < 768

/** Shared, mutable input state (kept out of React state to avoid re-renders). */
const input = { x: 0, y: 0, scroll: 0 }

function usePointerAndScroll() {
  useEffect(() => {
    const move = (e) => {
      input.x = (e.clientX / window.innerWidth) * 2 - 1
      input.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    const scroll = () => {
      input.scroll = window.scrollY / window.innerHeight
    }
    scroll()
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('scroll', scroll, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('scroll', scroll)
    }
  }, [])
}

function Pearl() {
  const mesh = useRef()
  useFrame((state, dt) => {
    mesh.current.rotation.y += dt * 0.15
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.12
  })
  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[1.45, 96, 96]} />
      <meshPhysicalMaterial
        color="#fde3ea"
        roughness={0.08}
        metalness={0.05}
        clearcoat={1}
        clearcoatRoughness={0.05}
        iridescence={1}
        iridescenceIOR={1.4}
        iridescenceThicknessRange={[120, 520]}
        sheen={1}
        sheenColor="#f2a9bf"
        envMapIntensity={1.6}
      />
    </mesh>
  )
}

function Rings() {
  const a = useRef()
  const b = useRef()
  useFrame((state, dt) => {
    a.current.rotation.z += dt * 0.25
    b.current.rotation.z -= dt * 0.18
  })
  return (
    <group rotation={[1.15, 0.35, 0]}>
      <mesh ref={a}>
        <torusGeometry args={[2.35, 0.022, 24, 220]} />
        <meshStandardMaterial color="#dcb872" metalness={1} roughness={0.18} envMapIntensity={2} />
      </mesh>
      <mesh ref={b} rotation={[0.5, 0.2, 0]}>
        <torusGeometry args={[2.85, 0.014, 24, 220]} />
        <meshStandardMaterial color="#f2a9bf" metalness={1} roughness={0.22} envMapIntensity={2} />
      </mesh>
    </group>
  )
}

function OrbitPearls({ count }) {
  const ref = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        radius: 2.1 + Math.random() * 1.6,
        speed: 0.08 + Math.random() * 0.22,
        offset: (i / count) * Math.PI * 2,
        tilt: (Math.random() - 0.5) * 1.3,
        size: 0.035 + Math.random() * 0.075,
      })),
    [count],
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime
    seeds.forEach((s, i) => {
      const a = s.offset + t * s.speed
      dummy.position.set(Math.cos(a) * s.radius, Math.sin(a * 1.3 + s.tilt) * 0.9 * s.tilt, Math.sin(a) * s.radius)
      dummy.scale.setScalar(s.size * (1 + Math.sin(t * 1.5 + i) * 0.15))
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    })
    ref.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshPhysicalMaterial color="#fff2f5" roughness={0.1} iridescence={1} clearcoat={1} envMapIntensity={1.5} />
    </instancedMesh>
  )
}

function Petals({ count }) {
  const ref = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const petals = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 14,
        y: Math.random() * 12 - 6,
        z: (Math.random() - 0.5) * 8 - 1,
        speed: 0.12 + Math.random() * 0.25,
        sway: 0.4 + Math.random() * 0.8,
        spin: (Math.random() - 0.5) * 1.2,
        phase: Math.random() * 10,
        size: 0.07 + Math.random() * 0.12,
      })),
    [count],
  )
  const colors = useMemo(() => {
    const palette = ['#f9cfdb', '#f2a9bf', '#fde8ee', '#e8789c', '#f3e2bd']
    return Float32Array.from(petals.flatMap(() => new THREE.Color(palette[Math.floor(Math.random() * palette.length)]).toArray()))
  }, [petals])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    petals.forEach((p, i) => {
      const y = ((p.y - t * p.speed + 6) % 12 + 12) % 12 - 6
      dummy.position.set(p.x + Math.sin(t * p.sway + p.phase) * 0.6, y, p.z)
      dummy.rotation.set(t * p.spin + p.phase, t * p.spin * 0.7, Math.sin(t + p.phase))
      dummy.scale.set(p.size * 1.7, p.size, p.size * 0.25)
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    })
    ref.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 14, 10]}>
        <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
      </sphereGeometry>
      <meshStandardMaterial vertexColors roughness={0.45} metalness={0.05} emissive="#f2a9bf" emissiveIntensity={0.12} />
    </instancedMesh>
  )
}

function Rig({ children }) {
  const group = useRef()
  useFrame((state, dt) => {
    const k = 1 - Math.exp(-4 * dt)
    const targetX = input.x * 0.55
    const targetY = -input.y * 0.35
    group.current.position.x += (targetX - group.current.position.x) * k
    group.current.position.y += (targetY + input.scroll * 2.2 - group.current.position.y) * k
    group.current.rotation.y += (input.x * 0.35 + input.scroll * 0.9 - group.current.rotation.y) * k
    group.current.rotation.x += (input.y * 0.12 - group.current.rotation.x) * k
    const s = Math.max(0.55, 1 - input.scroll * 0.25)
    group.current.scale.setScalar(s)
  })
  return <group ref={group}>{children}</group>
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.25} color="#ffd9e4" />
      <pointLight position={[-4, 3, 4]} intensity={30} color="#ffb6c9" />
      <pointLight position={[5, -2, 3]} intensity={22} color="#ecd4a0" />
      <Environment resolution={256} frames={1}>
        <mesh scale={60}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color="#3d1a45" side={THREE.BackSide} />
        </mesh>
        <Lightformer form="rect" intensity={5} color="#ffd9e4" position={[-5, 3, 3]} scale={[7, 4, 1]} />
        <Lightformer form="rect" intensity={4} color="#ffe9c4" position={[6, 2, -2]} scale={[5, 5, 1]} />
        <Lightformer form="ring" intensity={3} color="#f2a9bf" position={[0, -5, 2]} scale={5} />
        <Lightformer form="rect" intensity={2.5} color="#ffffff" position={[0, 6, 4]} scale={[8, 2, 1]} />
      </Environment>
    </>
  )
}

export default function HeroScene() {
  usePointerAndScroll()
  const [visible, setVisible] = useState(true)
  const small = isSmall()

  const wrap = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY < window.innerHeight * 1.6)
      // fade the scene out as the hero leaves the viewport
      const o = Math.max(0, Math.min(1, 1.15 - window.scrollY / (window.innerHeight * 0.9)))
      if (wrap.current) wrap.current.style.opacity = String(o)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={wrap} className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, small ? 1.4 : 1.8]}
        camera={{ position: [0, 0, 7.2], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.1
        }}
      >
        <fog attach="fog" args={['#14070f', 9, 20]} />
        <Lights />
        <Rig>
          <group position={[small ? 0 : 2.9, small ? 1.4 : 0.1, 0]} scale={small ? 0.75 : 1}>
            <Pearl />
            <Rings />
            <OrbitPearls count={small ? 24 : 46} />
          </group>
          <Petals count={small ? 28 : 64} />
          <Sparkles count={small ? 40 : 90} scale={[14, 9, 6]} size={2.4} speed={0.3} color="#ecd4a0" opacity={0.8} />
        </Rig>
      </Canvas>
    </div>
  )
}
