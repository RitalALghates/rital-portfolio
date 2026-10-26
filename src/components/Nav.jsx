import { useEffect, useState } from 'react'
import { profile } from '../data'

const links = [
  ['About', '#about'],
  ['Skills', '#skills'],
  ['Work', '#work'],
  ['Journey', '#journey'],
  ['Contact', '#contact'],
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? window.scrollY / max : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-6'}`}>
      <div className={`mx-auto flex max-w-7xl items-center justify-between rounded-full px-5 transition-all duration-500 sm:px-7 ${scrolled ? 'glass mx-3 py-2.5 sm:mx-auto' : 'py-1'}`}>
        <a href="#top" className="flex items-center gap-3" aria-label="Rital Alghates — home">
          <span className="font-display-italic gold-text flex size-10 items-center justify-center rounded-full border border-gold-400/50 text-xl">R</span>
          <span className="font-display hidden text-xl tracking-wide whitespace-nowrap sm:block">{profile.name}</span>
        </a>

        <nav className="hidden items-center gap-9 lg:flex" aria-label="Primary">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="text-xs tracking-[0.25em] text-ivory/70 uppercase transition hover:text-gold-300">
              {label}
            </a>
          ))}
        </nav>

        <a href="#contact" className="btn btn-ghost hidden !px-5 !py-2.5 whitespace-nowrap lg:inline-flex">Let’s talk</a>

        <button
          className="flex size-10 items-center justify-center rounded-full border border-white/20 lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="glass mx-3 mt-2 rounded-3xl p-5 lg:hidden">
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="block py-3 text-sm tracking-[0.25em] uppercase">
              {label}
            </a>
          ))}
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 h-px bg-white/5">
        <div className="h-full origin-left bg-gradient-to-r from-gold-300 via-blush-300 to-blush-400" style={{ transform: `scaleX(${progress})` }} />
      </div>
    </header>
  )
}
