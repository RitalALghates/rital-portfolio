import { skills } from '../data'
import { Reveal, SectionTitle } from './ui'

function Ring() {
  const radius = 330
  return (
    <div className="ring-scene relative mx-auto hidden h-[22rem] w-full max-w-4xl md:block" aria-hidden="true">
      <div className="absolute inset-0" style={{ transform: 'rotateX(-14deg)', transformStyle: 'preserve-3d' }}>
      <div className="ring absolute top-1/2 left-1/2 size-0">
        {skills.map((skill, i) => {
          const angle = (360 / skills.length) * i
          return (
            <div
              key={skill}
              className="glass absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-6 py-3 text-sm tracking-[0.18em] whitespace-nowrap uppercase"
              style={{ transform: `rotateY(${angle}deg) translateZ(${radius}px)` }}
            >
              <span className="gold-text">{skill}</span>
            </div>
          )
        })}
      </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
    </div>
  )
}

function Marquee() {
  const row = [...skills, ...skills]
  return (
    <div className="relative mt-4 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      <div className="flex w-max animate-[marquee_40s_linear_infinite] gap-4">
        {row.map((s, i) => (
          <span key={`${s}-${i}`} className="font-display-italic text-4xl whitespace-nowrap text-ivory/25 sm:text-5xl">
            {s} <span className="mx-3 text-blush-400/60">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="relative overflow-hidden px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow="Toolbox">
          Skills &amp; <span className="font-display-italic gold-text">tools</span>
        </SectionTitle>
        <Ring />
        <Reveal className="mt-4 flex flex-wrap justify-center gap-3 md:hidden">
          {skills.map((s) => (
            <span key={s} className="glass rounded-full px-4 py-2 text-xs tracking-[0.15em] uppercase">{s}</span>
          ))}
        </Reveal>
        <Marquee />
      </div>
    </section>
  )
}
