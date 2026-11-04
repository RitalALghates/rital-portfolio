import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, MeshReflectorMaterial, RoundedBox, Sparkles, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { projects } from '../data'

const TAU = Math.PI * 2
const RADIUS = 4.7
const STEP = TAU / projects.length
const CARD_W = 3.4
const CARD_H = 2.12

const mod = (n, m) => ((n % m) + m) % m
const clamp01 = (v) => Math.min(1, Math.max(0, v))
const wrapToNearest = (target, current) => {
  // shortest signed distance around the circle
  const d = mod(target - current + Math.PI, TAU) - Math.PI
  return current + d
}

/** Soft radial glow used for the halo behind the front card and the pool of light on the floor. */
function useGlowTexture(inner, outer) {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 256
    const g = c.getContext('2d')
    const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128)
    grad.addColorStop(0, inner)
    grad.addColorStop(0.45, outer)
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    g.fillStyle = grad
    g.fillRect(0, 0, 256, 256)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [inner, outer])
}

/** A diagonal band of light that sweeps across a card, like light catching glass. */
function useSheenTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 1024
    c.height = 512
    const g = c.getContext('2d')
    g.clearRect(0, 0, 1024, 512)
    g.translate(512, 256)
    g.rotate(-0.42)
    const band = g.createLinearGradient(-90, 0, 90, 0)
    band.addColorStop(0, 'rgba(255,255,255,0)')
    band.addColorStop(0.5, 'rgba(255,244,226,0.9)')
    band.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = band
    g.fillRect(-90, -600, 180, 1200)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping
    return t
  }, [])
}

function Card({ project, index, ringRef, sheenBase, glowTex, onSelect }) {
  const tex = useTexture(project.image)
  const sheen = useMemo(() => sheenBase.clone(), [sheenBase])
  const group = useRef()
  const face = useRef()
  const frame = useRef()
  const glow = useRef()
  const sheenMat = useRef()
  const [hover, setHover] = useState(false)
  const angle = index * STEP

  useMemo(() => {
    tex.anisotropy = 8
    tex.colorSpace = THREE.SRGBColorSpace
    sheen.needsUpdate = true
  }, [tex, sheen])

  useFrame((s, dt) => {
    const t = s.clock.elapsedTime
    const rotation = ringRef.current?.rotation.y ?? 0
    const facing = Math.cos(angle + rotation) // 1 = front, -1 = back
    const front = clamp01((facing - 0.55) / 0.45)

    face.current.color.setScalar(0.4 + 0.6 * clamp01((facing + 0.15) / 1.1))
    frame.current.emissiveIntensity = 0.05 + 0.4 * front
    glow.current.opacity = 0.62 * front * front

    const k = 1 - Math.exp(-7 * dt)
    const targetScale = hover ? 1.09 : 1 + 0.05 * front
    group.current.scale.x += (targetScale - group.current.scale.x) * k
    group.current.scale.y += (targetScale - group.current.scale.y) * k

    // gentle float, plus a slight lean towards the pointer on the card in front
    const bob = Math.sin(t * 0.9 + index * 1.7) * 0.05
    group.current.position.y += ((hover ? 0.14 : 0) + bob - group.current.position.y) * k
    const lean = front > 0.5 ? 0.1 : 0
    group.current.rotation.y += (s.pointer.x * lean - group.current.rotation.y) * k
    group.current.rotation.x += (-s.pointer.y * lean * 0.6 - group.current.rotation.x) * k

    // light sweep
    const sweep = ((t * 0.28 + index * 0.9) % 3.2) / 3.2
    sheen.repeat.set(0.62, 1)
    sheen.offset.x = 1.05 - sweep * 1.9
    sheenMat.current.opacity = 0.1 + 0.55 * front
  })

  return (
    <group position={[Math.sin(angle) * RADIUS, 0, Math.cos(angle) * RADIUS]} rotation={[0, angle, 0]}>
      <mesh position={[0, 0, -0.3]}>
        <planeGeometry args={[CARD_W * 1.7, CARD_H * 1.9]} />
        <meshBasicMaterial ref={glow} map={glowTex} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>

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
        {/* gold bezel */}
        <RoundedBox args={[CARD_W + 0.14, CARD_H + 0.14, 0.1]} radius={0.08} smoothness={5} position={[0, 0, -0.045]}>
          <meshStandardMaterial
            ref={frame}
            color="#e8c987"
            metalness={1}
            roughness={0.22}
            envMapIntensity={1.7}
            emissive="#b8822c"
            emissiveIntensity={0.05}
          />
        </RoundedBox>
        {/* plum velvet back, so the cards behind read as framed pieces rather than flat gold */}
        <mesh position={[0, 0, -0.0965]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[CARD_W, CARD_H]} />
          <meshStandardMaterial color="#2b1233" metalness={0.45} roughness={0.38} envMapIntensity={0.9} />
        </mesh>
        {/* inner dark mat so the screenshot sits inside a clean edge */}
        <RoundedBox args={[CARD_W + 0.03, CARD_H + 0.03, 0.06]} radius={0.05} smoothness={4} position={[0, 0, -0.005]}>
          <meshStandardMaterial color="#120709" metalness={0.4} roughness={0.5} />
        </RoundedBox>
        {/* the project, unlit so its own colours stay true */}
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[CARD_W, CARD_H]} />
          <meshBasicMaterial ref={face} map={tex} toneMapped={false} />
        </mesh>
        {/* glass: sheen sweep */}
        <mesh position={[0, 0, 0.034]}>
          <planeGeometry args={[CARD_W, CARD_H]} />
          <meshBasicMaterial
            ref={sheenMat}
            map={sheen}
            transparent
            opacity={0.1}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  )
}

function Ring({ state, onSelect, onActive, sheenBase, glowTex, scale }) {
  const ring = useRef()
  const { gl, size } = useThree()
  const dragging = useRef(false)
  const lastX = useRef(0)
  const velocity = useRef(0)
  const idle = useRef(0)
  const lastActive = useRef(0)
  const reduce = useMemo(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches, [])

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
    <group scale={scale} position={[0, 0.25, 0]}>
      <group ref={ring}>
        {projects.map((project, i) => (
          <Card key={project.id} project={project} index={i} ringRef={ring} sheenBase={sheenBase} glowTex={glowTex} onSelect={onSelect} />
        ))}
      </group>
    </group>
  )
}

/** The stage: a glossy plum floor, a pool of light and a turntable ring with engraved ticks. */
function Stage({ small, poolTex }) {
  const ticks = useRef()
  const spin = useRef()

  useEffect(() => {
    const dummy = new THREE.Object3D()
    const count = 144
    for (let i = 0; i < count; i++) {
      const a = (i / count) * TAU
      const long = i % 6 === 0
      dummy.position.set(Math.sin(a) * (RADIUS + 0.42), 0, Math.cos(a) * (RADIUS + 0.42))
      dummy.rotation.set(0, a, 0)
      dummy.scale.set(long ? 0.03 : 0.016, 1, long ? 0.2 : 0.09)
      dummy.updateMatrix()
      ticks.current.setMatrixAt(i, dummy.matrix)
    }
    ticks.current.instanceMatrix.needsUpdate = true
  }, [])

  useFrame((s, dt) => {
    spin.current.rotation.y += dt * 0.04
  })

  return (
    <group position={[0, -1.55, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[46, 46]} />
        {small ? (
          <meshStandardMaterial color="#1c0c20" roughness={0.45} metalness={0.5} />
        ) : (
          <MeshReflectorMaterial
            blur={[420, 110]}
            resolution={768}
            mixBlur={1}
            mixStrength={1.9}
            roughness={0.85}
            depthScale={1.2}
            minDepthThreshold={0.3}
            maxDepthThreshold={1.4}
            color="#2a1230"
            metalness={0.6}
            mirror={0.55}
          />
        )}
      </mesh>

      {/* pool of warm light under the cards */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <planeGeometry args={[RADIUS * 3.1, RADIUS * 3.1]} />
        <meshBasicMaterial map={poolTex} transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>

      {/* gold turntable rings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[RADIUS - 0.07, RADIUS + 0.07, 180]} />
        <meshStandardMaterial color="#e8c987" metalness={1} roughness={0.25} envMapIntensity={1.6} emissive="#a8741f" emissiveIntensity={0.35} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[RADIUS + 0.62, RADIUS + 0.64, 180]} />
        <meshBasicMaterial color="#f2a9bf" transparent opacity={0.4} toneMapped={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[RADIUS * 0.52, RADIUS * 0.52 + 0.025, 180]} />
        <meshBasicMaterial color="#f2a9bf" transparent opacity={0.28} toneMapped={false} />
      </mesh>
      <group ref={spin}>
        <instancedMesh ref={ticks} args={[undefined, undefined, 144]} position={[0, 0.022, 0]}>
          <boxGeometry args={[1, 0.004, 1]} />
          <meshBasicMaterial color="#ecd4a0" transparent opacity={0.7} toneMapped={false} />
        </instancedMesh>
      </group>
    </group>
  )
}

/** Light studio reflections so the gold bezels actually read as polished metal. */
function Lights() {
  return (
    <>
      <ambientLight intensity={0.35} color="#ffd9e4" />
      <pointLight position={[0, 4.5, 7]} intensity={40} color="#fff0e6" />
      <pointLight position={[-7, 2, 3]} intensity={16} color="#f2a9bf" />
      <pointLight position={[7, 2, 3]} intensity={16} color="#ecd4a0" />
      <Environment resolution={256} frames={1}>
        <mesh scale={60}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color="#2b1233" side={THREE.BackSide} />
        </mesh>
        <Lightformer form="rect" intensity={5} color="#ffd9e4" position={[-5, 3, 4]} scale={[7, 4, 1]} />
        <Lightformer form="rect" intensity={4.5} color="#ffe9c4" position={[6, 2.5, 3]} scale={[6, 4, 1]} />
        <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 6, 2]} scale={[10, 2, 1]} />
        <Lightformer form="ring" intensity={2.5} color="#f2a9bf" position={[0, -4, 4]} scale={5} />
      </Environment>
    </>
  )
}

/** Eases the camera a touch towards the pointer for a sense of depth. */
function CameraRig() {
  useFrame((s, dt) => {
    const k = 1 - Math.exp(-3 * dt)
    s.camera.position.x += (s.pointer.x * 0.7 - s.camera.position.x) * k
    s.camera.position.y += (1.5 + s.pointer.y * 0.35 - s.camera.position.y) * k
    s.camera.lookAt(0, 0.1, 0)
  })
  return null
}

function Scene({ state, onSelect, onActive, small }) {
  const { size } = useThree()
  // keep the front card readable on phones: shrink the ring, but never below 0.8
  const scale = Math.min(1, Math.max(0.8, size.width / 1000))
  const sheenBase = useSheenTexture()
  const glowTex = useGlowTexture('rgba(255,214,160,0.85)', 'rgba(242,169,191,0.35)')
  const poolTex = useGlowTexture('rgba(255,196,150,0.55)', 'rgba(190,90,150,0.2)')
  return (
    <>
      <fog attach="fog" args={['#14070f', 13, 27]} />
      <Lights />
      <CameraRig />
      <Suspense fallback={null}>
        <Ring state={state} onSelect={onSelect} onActive={onActive} sheenBase={sheenBase} glowTex={glowTex} scale={scale} />
        <group scale={scale}>
          <Stage small={small} poolTex={poolTex} />
        </group>
        <Sparkles count={small ? 36 : 90} scale={[13, 5.5, 9]} position={[0, 1.1, 0]} size={2.8} speed={0.25} color="#ecd4a0" />
        <Sparkles count={small ? 14 : 36} scale={[11, 5, 8]} position={[0, 1, 0]} size={3.4} speed={0.15} color="#f9cfdb" opacity={0.8} />
      </Suspense>
    </>
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
      camera={{ position: [0, 1.5, 10.6], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: 'pan-y' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
      }}
    >
      <Scene
        state={state}
        small={small}
        onActive={onActive}
        onSelect={(i) => {
          state.current.goTo(i)
          onSelect?.(i)
        }}
      />
    </Canvas>
  )
}
