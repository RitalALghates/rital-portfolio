import { journey } from '../data'
import { Reveal, SectionTitle } from './ui'

export default function Journey() {
  return (
    <section id="journey" className="relative px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <SectionTitle eyebrow="Path so far">
          My <span className="font-display-italic gold-text">journey</span>
        </SectionTitle>

        <ol className="relative border-s border-white/10 ps-8 sm:ps-12">
          {journey.map((item, i) => (
            <Reveal as="li" key={item.title} delay={i * 0.08} className="relative mb-12 last:mb-0">
              <span className="absolute top-2 -start-[2.55rem] flex size-4 items-center justify-center rounded-full bg-plum-900 ring-1 ring-gold-400 sm:-start-[3.55rem]">
                <span className="size-1.5 rounded-full bg-gradient-to-br from-gold-300 to-blush-400" />
              </span>
              <p className="eyebrow mb-2 !tracking-[0.3em]">{item.date}</p>
              <h3 className="font-display text-3xl leading-tight sm:text-4xl">{item.title}</h3>
              <p className="font-display-italic mt-1 text-lg text-blush-200/80">{item.place}</p>
              <p className="mt-3 max-w-2xl leading-7 font-light text-ivory/70">{item.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
