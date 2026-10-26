import { profile, projects } from '../data'
import { Reveal, SectionTitle, Tilt } from './ui'

const stats = [
  [String(projects.length), 'Live projects'],
  ['1st', 'Class honors'],
  ['3+', 'Bootcamps & hackathons'],
]

export default function About() {
  return (
    <section id="about" className="relative px-6 py-28 sm:px-10">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <div className="group mx-auto max-w-sm">
            <Tilt className="glass rounded-[2.5rem] p-3" max={9}>
              <div className="relative flex aspect-[4/5] flex-col items-center justify-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-plum-700 via-plum-800 to-plum-950">
                <div className="absolute -top-16 -right-16 size-56 rounded-full bg-blush-400/30 blur-3xl" />
                <div className="absolute -bottom-20 -left-10 size-56 rounded-full bg-gold-400/25 blur-3xl" />
                <div className="relative text-center" style={{ transform: 'translateZ(60px)' }}>
                  <div className="font-display-italic gold-text text-[8rem] leading-none">R<span className="text-blush-300/80">/</span>A</div>
                  <div className="eyebrow mt-4 !tracking-[0.55em]">Rital Alghates</div>
                </div>
                <svg className="absolute inset-4 size-[calc(100%-2rem)] text-gold-400/40" viewBox="0 0 100 125" fill="none" preserveAspectRatio="none" aria-hidden="true">
                  <rect x="1" y="1" width="98" height="123" rx="14" stroke="currentColor" strokeWidth="0.25" />
                </svg>
              </div>
            </Tilt>
          </div>
        </Reveal>

        <div>
          <SectionTitle eyebrow="About me">
            Where <span className="font-display-italic gold-text">engineering</span> meets elegance.
          </SectionTitle>

          <Reveal delay={0.1}>
            <p className="max-w-2xl text-lg leading-8 font-light text-ivory/80">{profile.summary}</p>
            <p className="mt-5 max-w-2xl text-lg leading-8 font-light text-ivory/70">
              Based in {profile.location}, I enjoy turning ideas into products people love to use: researching the problem,
              designing the interface, and shipping it end to end — in Arabic, English, or both.
            </p>
          </Reveal>

          <Reveal delay={0.2} className="mt-10 grid grid-cols-3 gap-4">
            {stats.map(([n, label]) => (
              <div key={label} className="glass rounded-3xl p-5 text-center">
                <div className="font-display gold-text text-5xl">{n}</div>
                <div className="mt-1 text-[0.7rem] leading-snug tracking-[0.18em] text-ivory/60 uppercase">{label}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
