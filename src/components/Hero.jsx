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

const segments = [
  { line: 0, text: 'Fresh Graduate', speed: 55 },
  { line: 1, text: 'Software Engineer', speed: 62 },
  { line: 2, text: 'Full-Stack Developer', speed: 45 },
  { line: 3, text: 'React', speed: 70 },
  { line: 3, text: 'REST APIs', speed: 55 },
  { line: 3, text: 'MySQL', speed: 70 },
  { line: 3, text: 'UI/UX', speed: 80 },
]

/** Types the segments out one after another; returns how many characters of each are visible and where the caret is. */
function useTypewriter() {
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const [pos, setPos] = useState(reduce ? { s: segments.length, c: 0 } : { s: 0, c: 0 })

  useEffect(() => {
    if (pos.s >= segments.length) return
    const seg = segments[pos.s]
    const first = pos.s === 0 && pos.c === 0
    let wait
    let next
    if (pos.c < seg.text.length) {
      wait = first ? 900 : seg.speed + Math.random() * 30
      next = { s: pos.s, c: pos.c + 1 }
    } else {
      const sameLine = segments[pos.s + 1]?.line === seg.line
      wait = sameLine ? 220 : 420
      next = { s: pos.s + 1, c: 0 }
    }
    const t = setTimeout(() => setPos(next), wait)
    return () => clearTimeout(t)
  }, [pos])

  const done = pos.s >= segments.length
  const visible = (i) => (done || i < pos.s ? segments[i].text.length : i === pos.s ? pos.c : 0)
  // the caret rests on the segment being typed, or on the last one once everything is written
  const caretAt = done ? segments.length - 1 : pos.s
  return { visible, caretAt, started: (i) => done || i < pos.s || (i === pos.s && pos.c > 0) }
}

/** A word that reserves its final width, so typing never shifts the layout. */
function Typed({ index, tw, className = '' }) {
  const seg = segments[index]
  return (
    <span className={`relative inline-grid ${className}`}>
      <span className="invisible col-start-1 row-start-1">{seg.text}</span>
      <span className="col-start-1 row-start-1 whitespace-nowrap">
        {seg.text.slice(0, tw.visible(index))}
        {tw.caretAt === index && <span className="caret" />}
      </span>
    </span>
  )
}

/** The headline writes itself, line by line, in one coordinated gold-and-blush palette. */
function Headline() {
  const tw = useTypewriter()

  return (
    <div className="headline mt-9">
      <h2 className="sr-only">Fresh Graduate Software Engineer | Full-Stack Developer | React · REST APIs · MySQL · UI/UX</h2>

      <motion.span
        className="headline-bar"
        aria-hidden="true"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 2.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />

      <div aria-hidden="true">
        <p className="eyebrow flex items-center gap-3 !tracking-[0.5em]">
          <span className="tech-dot" />
          <Typed index={0} tw={tw} />
        </p>

        <p className="font-display-italic mt-2 pb-1 text-[clamp(2.7rem,6.2vw,4.9rem)] leading-[1.02]">
          <Typed index={1} tw={tw} className="gold-shine" />
        </p>

        <p className="font-display mt-1 text-2xl tracking-wide text-blush-200 sm:text-[2rem]">
          <Typed index={2} tw={tw} />
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
          {segments.slice(3).map((seg, k) => {
            const i = k + 3
            return (
              <span key={seg.text} className="flex items-center gap-4">
                {k > 0 && <span className={`tech-dot transition-opacity duration-500 ${tw.started(i) ? 'opacity-80' : 'opacity-0'}`} />}
                <a href="#skills" className="tech">
                  <Typed index={i} tw={tw} />
                </a>
              </span>
            )
          })}
        </div>
      </div>
    </div>
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

        <Headline />

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
