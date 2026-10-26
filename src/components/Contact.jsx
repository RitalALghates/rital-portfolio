import { profile } from '../data'
import { ArrowIcon, Reveal } from './ui'

export default function Contact() {
  return (
    <section id="contact" className="relative px-6 pt-28 pb-10 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <Reveal className="glass relative overflow-hidden rounded-[3rem] px-8 py-16 text-center sm:px-16 sm:py-24">
          <div className="absolute -top-24 left-1/2 size-80 -translate-x-1/2 rounded-full bg-blush-400/25 blur-3xl" />
          <div className="relative">
            <p className="eyebrow mb-5">Let’s create together</p>
            <h2 className="font-display text-5xl leading-[1.02] sm:text-7xl">
              Have an idea? <br />
              <span className="font-display-italic gold-text">Let’s make it beautiful.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-lg font-light text-ivory/70">
              I’m open to work in {profile.location.split(',')[0]} (on-site or hybrid). Reach out on LinkedIn or take a look at my code on GitHub.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn btn-gold">
                LinkedIn <ArrowIcon />
              </a>
              <a href={profile.github} target="_blank" rel="noreferrer" className="btn btn-ghost">
                GitHub <ArrowIcon />
              </a>
            </div>
          </div>
        </Reveal>

        <footer className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 text-xs tracking-[0.2em] text-ivory/45 uppercase sm:flex-row">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span className="font-display-italic text-base tracking-normal normal-case text-blush-200/70">Designed &amp; built with React, Tailwind &amp; three.js</span>
        </footer>
      </div>
    </section>
  )
}
