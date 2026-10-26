import { lazy, Suspense, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { projects } from '../data'
import { ArrowIcon, Reveal, SectionTitle, Tilt } from './ui'

const Gallery3D = lazy(() => import('../three/Gallery3D'))

function Info({ project }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={project.id}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.45 }}
        className="glass mx-auto max-w-3xl rounded-[2rem] p-7 text-center sm:p-9"
        aria-live="polite"
      >
        <p className="eyebrow mb-3">{project.kind}</p>
        <h3 className="font-display text-4xl sm:text-5xl">{project.title}</h3>
        <p className="font-display-italic mt-1 text-xl text-blush-200/80">{project.subtitle}</p>
        <p className="mx-auto mt-5 max-w-2xl leading-7 font-light text-ivory/75">{project.description}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {project.tags.map((t) => (
            <span key={t} className="rounded-full border border-gold-400/30 px-3 py-1 text-[0.68rem] tracking-[0.16em] text-gold-300 uppercase">{t}</span>
          ))}
        </div>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a href={project.demo} target="_blank" rel="noreferrer" className="btn btn-gold">
            {project.demoLabel} <ArrowIcon />
          </a>
          <a href={project.repo} target="_blank" rel="noreferrer" className="btn btn-ghost">Source code</a>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function Grid() {
  return (
    <div className="mt-24">
      <Reveal className="mb-8 flex items-center gap-5">
        <span className="eyebrow">All projects</span>
        <span className="h-px flex-1 bg-white/10" />
      </Reveal>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <Reveal key={p.id} delay={(i % 3) * 0.08}>
            <div className="group h-full">
              <Tilt className="glass h-full overflow-hidden rounded-[1.75rem]" max={6}>
                <a href={p.demo} target="_blank" rel="noreferrer" className="block overflow-hidden" aria-label={`${p.title}: ${p.demoLabel}`}>
                  <img
                    src={p.image}
                    alt={`${p.title} screenshot`}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover object-top transition duration-700 group-hover:scale-105"
                  />
                </a>
                <div className="p-6">
                  <p className="eyebrow mb-2 !text-[0.62rem]">{p.kind}</p>
                  <h3 className="font-display text-3xl">{p.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 font-light text-ivory/65">{p.description}</p>
                  <div className="mt-5 flex items-center gap-5 text-xs tracking-[0.2em] uppercase">
                    <a href={p.demo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-gold-300 transition hover:text-blush-300">
                      {p.demoLabel} <ArrowIcon className="size-3.5" />
                    </a>
                    <a href={p.repo} target="_blank" rel="noreferrer" className="text-ivory/50 transition hover:text-ivory">Code</a>
                  </div>
                </div>
              </Tilt>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

export default function Projects() {
  const [active, setActive] = useState(0)
  const controls = useRef(null)

  const go = (dir) => controls.current?.next(dir)

  return (
    <section id="work" className="relative px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow="Selected work" className="text-center">
          Projects you can <span className="font-display-italic gold-text">try live</span>
        </SectionTitle>

        <Reveal>
          <div className="relative -mx-6 h-[26rem] cursor-grab touch-pan-y active:cursor-grabbing sm:-mx-10 sm:h-[34rem] lg:mx-0 lg:h-[38rem]">
            <Suspense
              fallback={<div className="flex h-full items-center justify-center text-xs tracking-[0.4em] text-gold-300/70 uppercase">Loading gallery…</div>}
            >
              <Gallery3D onActive={setActive} controlsRef={controls} />
            </Suspense>

            <button
              onClick={() => go(-1)}
              className="glass absolute top-1/2 left-2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full transition hover:border-gold-400 sm:left-4"
              aria-label="Previous project"
            >
              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m15 5-7 7 7 7" /></svg>
            </button>
            <button
              onClick={() => go(1)}
              className="glass absolute top-1/2 right-2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full transition hover:border-gold-400 sm:right-4"
              aria-label="Next project"
            >
              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m9 5 7 7-7 7" /></svg>
            </button>
          </div>
          <p className="mt-2 text-center text-[0.68rem] tracking-[0.35em] text-ivory/40 uppercase">Drag · click a card · use the arrows</p>
        </Reveal>

        <div className="mt-6 flex justify-center gap-2" role="tablist" aria-label="Projects">
          {projects.map((p, i) => (
            <button
              key={p.id}
              role="tab"
              aria-selected={i === active}
              aria-label={p.title}
              onClick={() => controls.current?.goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? 'w-10 bg-gradient-to-r from-gold-300 to-blush-300' : 'w-3 bg-white/20 hover:bg-white/40'}`}
            />
          ))}
        </div>

        <div className="mt-10">
          <Info project={projects[active]} />
        </div>

        <Grid />
      </div>
    </section>
  )
}
