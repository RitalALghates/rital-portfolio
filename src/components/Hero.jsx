import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { profile } from '../data'
import { ArrowIcon } from './ui'

const words = ['thoughtful web apps', 'elegant interfaces', 'Android experiences', '3D adventures']

function Rotating() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % words.length), 2600)
    return () => clearInterval(t)
  }, [])
  return (
    <span className="inline-grid align-bottom">
      {words.map((w, idx) => (
        <span
          key={w}
          className={`gold-text col-start-1 row-start-1 transition-all duration-700 ${idx === i ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
          aria-hidden={idx !== i}
        >
          {w}
        </span>
      ))}
    </span>
  )
}

const stack = ['React', 'REST APIs', 'MySQL', 'UI/UX']

/** The headline as a polished plaque: a spotlight follows the pointer and the card leans towards it. */
function Plaque() {
  const ref = useRef(null)

  const onMove = (e) => {
    const el = ref.current
    if (!el || e.pointerType === 'touch') return
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    el.style.setProperty('--mx', `${x}px`)
    el.style.setProperty('--my', `${y}px`)
    const rx = (0.5 - y / r.height) * 7
    const ry = (x / r.width - 0.5) * 9
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`
  }
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = ''
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mt-9 max-w-2xl"
    >
      <div ref={ref} className="plaque" onPointerMove={onMove} onPointerLeave={onLeave}>
        <h2 className="sr-only">Fresh Graduate Software Engineer | Full-Stack Developer | React · REST APIs · MySQL · UI/UX</h2>

        <div aria-hidden="true">
          <div className="flex items-center gap-4">
            <span className="eyebrow !tracking-[0.5em]">Fresh Graduate</span>
            <motion.span
              className="rule flex-1"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 1.1, ease: 'easeOut' }}
            />
          </div>

          <p className="font-display-italic gold-text mt-3 text-[clamp(2.4rem,5.4vw,3.8rem)] leading-[1.02]">Software Engineer</p>

          <p className="font-display mt-2 flex items-center gap-3 text-2xl tracking-wide text-ivory/90 sm:text-3xl">
            <span className="text-gold-400">|</span>
            Full-Stack Developer
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {stack.map((s, i) => (
              <motion.a
                key={s}
                href="#skills"
                className="chip"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 + i * 0.1 }}
              >
                {s}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen items-center px-6 pt-28 pb-20 sm:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="eyebrow mb-6"
        >
          Portfolio · {new Date().getFullYear()}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[clamp(3.6rem,10vw,8.5rem)] leading-[0.92] font-medium"
        >
          Rital
          <br />
          <span className="font-display-italic gold-text">Alghates</span>
        </motion.h1>

        <Plaque />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.35 }}
          className="mt-8 max-w-xl text-lg leading-relaxed font-light text-ivory/80 sm:text-xl"
        >
          Crafting <Rotating />, with a love for detail.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.55 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <a href="#work" className="btn btn-gold">
            Explore my work <ArrowIcon />
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn btn-ghost">LinkedIn</a>
          <a href={profile.github} target="_blank" rel="noreferrer" className="btn btn-ghost">GitHub</a>
        </motion.div>
      </div>

      <a href="#about" className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[0.65rem] tracking-[0.4em] text-ivory/50 uppercase sm:flex" aria-label="Scroll down">
        Scroll
        <span className="relative block h-12 w-px overflow-hidden bg-white/15">
          <span className="absolute inset-x-0 top-0 h-5 animate-[drop_2s_ease-in-out_infinite] bg-gold-300" />
        </span>
      </a>
      <style>{`@keyframes drop { 0% { transform: translateY(-100%); } 100% { transform: translateY(260%); } }`}</style>
    </section>
  )
}
