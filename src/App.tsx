import { Fragment, useEffect, useRef, useState, type CSSProperties } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { GaneshMark } from './GaneshMark'

gsap.registerPlugin(useGSAP, ScrollTrigger)
const weddingTime = new Date('2026-11-21T19:00:00+05:30').getTime()
const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('N. R. Paradise, Sitawali Phatak, Benad Road, Jaipur, Rajasthan')

function remainingTime() {
  const ms = Math.max(0, weddingTime - Date.now())
  return [Math.floor(ms / 86400000), Math.floor(ms / 3600000) % 24, Math.floor(ms / 60000) % 60, Math.floor(ms / 1000) % 60]
}

function Ornament({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 220 50" fill="none" aria-hidden="true"><path d="M0 25h75m70 0h75M80 25c14-2 20-13 30-23 10 10 16 21 30 23-14 2-20 13-30 23-10-10-16-21-30-23Z" stroke="currentColor" strokeWidth="1.3"/><circle cx="110" cy="25" r="5" fill="currentColor"/></svg>
}

function AuspiciousMark() {
  return <svg className="auspicious-mark" viewBox="0 0 320 120" fill="none" aria-hidden="true">
    <g stroke="#912339" strokeWidth="9" strokeLinecap="round"><path d="M49 13v94M68 13v94M252 13v94M271 13v94"/></g>
    <g stroke="#c68746" strokeWidth="1.6"><path d="M38 13v94M79 13v94M241 13v94M282 13v94"/></g>
    <path d="M160 60V22h33M160 60h37v33M160 60v38h-33M160 60h-37V27" stroke="#f0bd77" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M160 60V22h33M160 60h37v33M160 60v38h-33M160 60h-37V27" stroke="#912339" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
    <g fill="#912339"><circle cx="140" cy="39" r="4.7"/><circle cx="181" cy="40" r="4.7"/><circle cx="139" cy="81" r="4.7"/><circle cx="181" cy="81" r="4.7"/></g>
    <g fill="#c68746"><circle cx="26" cy="60" r="3"/><circle cx="294" cy="60" r="3"/></g>
  </svg>
}

function Mandala({ side }: { side: 'left' | 'right' }) {
  return <div className={`mandala-scroll mandala-scroll--${side}`} aria-hidden="true"><div className="mandala-spin"><img src="/assets/hero/floral-rangoli.webp" alt="" loading="lazy" /></div></div>
}

function FlowerFall() {
  return <div className="flower-fall" aria-hidden="true">{Array.from({ length: 10 }, (_, i) => {
    const style = {'--flower-left': `${(i * 43 + 7) % 100}%`, '--flower-size': `${14 + (i * 7) % 13}px`, '--flower-duration': `${17 + (i * 3) % 9}s`, '--flower-delay': `${-((i * 11) % 24)}s`, '--flower-drift': `${(i * 31) % 130 - 65}px`, '--flower-turn': `${i % 2 ? 390 : -330}deg`} as CSSProperties
    return <span className="falling-flower" style={style} key={i}><img src={i % 3 === 0 ? '/assets/hero/marigold-floret.webp' : '/assets/hero/rose-petal.webp'} alt="" /></span>
  })}</div>
}

function CounterIcon({ index }: { index: number }) {
  const paths = [<><rect x="4" y="6" width="16" height="15" rx="1"/><path d="M4 10h16M8 3v5m8-5v5M8 14h3m3 0h3m-9 4h3"/></>, <><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 3"/></>, <><path d="M6 3h12M6 21h12M7 3c0 5 3 6 5 9-2 3-5 4-5 9m10-18c0 5-3 6-5 9 2 3 5 4 5 9M9 7l3 3 3-3M9 17l3-3 3 3"/></>, <><circle cx="12" cy="13" r="8"/><path d="M12 13l3-4M9 2h6m-3 0v3m6 1 2-2"/></>]
  return <svg className="counter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[index]}</svg>
}

function SlotNumber({ value }: { value: number }) {
  const next = String(value).padStart(2, '0')
  const [slot, setSlot] = useState<{current: string; previous: string | null}>({current: next, previous: null})
  useEffect(() => {
    setSlot(old => old.current === next ? old : {current: next, previous: old.current})
    const timer = window.setTimeout(() => setSlot(old => ({...old, previous: null})), 520)
    return () => window.clearTimeout(timer)
  }, [next])
  return <strong className="slot-number" aria-hidden="true"><span className={slot.previous === null ? 'slot-number__current' : 'slot-number__current is-rolling'}>{slot.current}</span>{slot.previous !== null && <span className="slot-number__previous">{slot.previous}</span>}</strong>
}

function ScratchReveal({ reducedMotion }: { reducedMotion: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const lastPoint = useRef<{x: number; y: number} | null>(null)
  const distance = useRef(0)
  const [revealed, setRevealed] = useState(reducedMotion)
  const [burst, setBurst] = useState(false)
  const burstTimer = useRef<number | null>(null)

  useEffect(() => {
    if (reducedMotion) setRevealed(true)
    return () => { if (burstTimer.current !== null) window.clearTimeout(burstTimer.current) }
  }, [reducedMotion])

  const reveal = () => {
    if (revealed) return
    setRevealed(true)
    if (!reducedMotion) {
      setBurst(true)
      burstTimer.current = window.setTimeout(() => setBurst(false), 1900)
    }
  }

  useEffect(() => {
    if (reducedMotion || revealed) return
    const element = canvas.current
    if (!element) return
    const paint = () => {
      const box = element.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      element.width = Math.round(box.width * ratio)
      element.height = Math.round(box.height * ratio)
      const ctx = element.getContext('2d')
      if (!ctx) return
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      const lacquer = ctx.createLinearGradient(0, 0, box.width, box.height)
      lacquer.addColorStop(0, '#690d21'); lacquer.addColorStop(.34, '#9b2031'); lacquer.addColorStop(.7, '#741328'); lacquer.addColorStop(1, '#4d0b1b')
      ctx.fillStyle = lacquer; ctx.fillRect(0, 0, box.width, box.height)
      ctx.strokeStyle = 'rgba(239,187,109,.19)'; ctx.lineWidth = 1
      for (let y = 9; y < box.height; y += 18) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(box.width,y); ctx.stroke() }
      ctx.textAlign = 'center'; ctx.fillStyle = '#ffe5b1'; ctx.font = `italic ${Math.min(27,box.width*.075)}px Georgia,serif`
      ctx.fillText('A date to remember', box.width/2, box.height/2 - 5)
      ctx.font = '600 11px sans-serif'; ctx.letterSpacing = '3px'; ctx.fillText('SCRATCH TO REVEAL', box.width/2, box.height/2 + 23)
    }
    paint()
    const observer = new ResizeObserver(paint); observer.observe(element)
    return () => observer.disconnect()
  }, [revealed, reducedMotion])

  const point = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    return { x: event.clientX - box.left, y: event.clientY - box.top }
  }
  const scratch = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !canvas.current) return
    const p = point(event), before = lastPoint.current ?? p
    const ctx = canvas.current.getContext('2d')
    if (!ctx) return
    const ratio = canvas.current.width / canvas.current.getBoundingClientRect().width
    ctx.save(); ctx.setTransform(ratio,0,0,ratio,0,0); ctx.globalCompositeOperation = 'destination-out'; ctx.lineWidth = 44; ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    ctx.beginPath(); ctx.moveTo(before.x,before.y); ctx.lineTo(p.x,p.y); ctx.stroke(); ctx.restore()
    distance.current += Math.hypot(p.x-before.x,p.y-before.y)
    lastPoint.current = p
    if (distance.current > canvas.current.getBoundingClientRect().width * 2.8) reveal()
  }
  return <div className={`scratch-reveal${revealed ? ' is-revealed' : ''}`}>
    <div className="scratch-reveal__message"><strong><span>Jai</span><em>&</em><span>Yogita</span></strong><span>Saturday, 21 November 2026</span><small>Blessings & dinner from 7:00 PM</small></div>
    {burst && <div className="reveal-confetti" aria-hidden="true">{Array.from({length: 36}, (_, i) => {
      const angle = (i * 137.5) * Math.PI / 180
      const reach = 100 + (i % 5) * 24
      const style = {'--confetti-x': `${Math.cos(angle) * reach}px`, '--confetti-y': `${Math.sin(angle) * reach - 45}px`, '--confetti-rotate': `${(i % 2 ? 1 : -1) * (420 + i * 29)}deg`, '--confetti-delay': `${(i % 7) * 22}ms`, '--confetti-color': ['#f4b24d','#d7415e','#fff0ad','#a82844'][i % 4]} as CSSProperties
      return <i key={i} style={style}/>
    })}</div>}
    {!revealed && <canvas ref={canvas} className="scratch-reveal__canvas" aria-label="Scratch to reveal the wedding date" onPointerDown={event => { drawing.current = true; lastPoint.current = point(event); event.currentTarget.setPointerCapture(event.pointerId); scratch(event) }} onPointerMove={scratch} onPointerUp={() => { drawing.current = false; lastPoint.current = null }} onPointerCancel={() => { drawing.current = false; lastPoint.current = null }}/ >}
    {!revealed && <button className="scratch-reveal__button" type="button" onClick={reveal}>Reveal date</button>}
  </div>
}

function RoyalCouple() {
  return <section className="royal-couple" aria-labelledby="royal-couple-title">
    <div className="royal-couple__inner">
      <p className="royal-couple__blessing">With the blessings of our elders</p>
      <h2 id="royal-couple-title">The Royal Couple</h2>
      <Ornament className="royal-couple__ornament" />
      <div className="royal-couple__portraits">
        <article className="royal-portrait royal-portrait--groom">
          <div className="royal-portrait__art">
            <img className="royal-portrait__image" src="/assets/couple/groom.webp" alt="Symbolic illustrated portrait of the groom" loading="lazy" />
            <img className="royal-portrait__frame" src="/assets/couple/portrait-frame.svg" alt="" />
          </div>
          <p>The Groom</p><h3>Jai</h3><p className="royal-portrait__nickname"><span>aka</span><strong>Vishal</strong></p>
        </article>
        <span className="royal-couple__amp">Weds</span>
        <article className="royal-portrait royal-portrait--bride">
          <div className="royal-portrait__art">
            <img className="royal-portrait__image" src="/assets/couple/bride.webp" alt="Symbolic illustrated portrait of the bride" loading="lazy" />
            <img className="royal-portrait__frame" src="/assets/couple/portrait-frame.svg" alt="" />
          </div>
          <p>The Bride</p><h3>Yogita</h3><p className="royal-portrait__nickname"><span>aka</span><strong>Gudiya</strong></p>
        </article>
      </div>
    </div>
  </section>
}

const gallerySlides = [
  { src: '/assets/hero/hawa-mahal-trees.webp', alt: 'Hawa Mahal framed by Jaipur trees', title: 'Jaipur' },
  { src: '/assets/hero/couple-back.png', alt: 'Jai and Yogita looking toward the palace', title: 'Jai & Yogita' },
  { src: '/assets/couple/groom.webp', alt: 'Portrait of Jai in wedding attire', title: 'Jai' },
  { src: '/assets/couple/bride.webp', alt: 'Portrait of Yogita in wedding attire', title: 'Yogita' },
  { src: '/assets/ring-reveal/end-frame.png', alt: 'The couple revealing their wedding rings', title: 'The Rings' },
  { src: '/assets/hawa-mahal.webp', alt: 'The Hawa Mahal in Jaipur', title: 'Hawa Mahal' },
  { src: '/assets/ring-reveal/start-frame.png', alt: 'Two hands reaching toward one another', title: 'A Promise' },
]

function Gallery() {
  const [active, setActive] = useState(0)
  const step = (direction: number) => setActive(index => (index + direction + gallerySlides.length) % gallerySlides.length)

  return <section className="gallery" aria-labelledby="gallery-title">
    <Mandala side="right"/><Mandala side="left"/>
    <div className="gallery__inner">
      <header className="gallery__heading">
        <p>Moments to treasure</p>
        <h2 id="gallery-title">Royal Gallery</h2>
        <Ornament className="gallery__ornament" />
      </header>
      <div className="gallery__carousel" role="region" aria-roledescription="carousel" aria-label="Wedding gallery">
        {gallerySlides.map((slide, index) => {
          let offset = index - active
          if (offset > gallerySlides.length / 2) offset -= gallerySlides.length
          if (offset < -gallerySlides.length / 2) offset += gallerySlides.length
          return <button
            className={`gallery__slide${offset === 0 ? ' is-active' : ''}`}
            data-position={offset === 0 ? 'current' : Math.abs(offset) === 1 ? 'adjacent' : 'far'}
            type="button"
            key={index}
            style={{ '--gallery-angle': `${offset * 360 / gallerySlides.length}deg` } as CSSProperties}
            aria-label={`${offset === 0 ? 'Current photo' : 'Show photo'}: ${slide.title}`}
            aria-current={offset === 0 ? 'true' : undefined}
            onClick={() => offset === 0 ? undefined : setActive(index)}
            tabIndex={offset === 0 ? 0 : -1}
          >
            <span className="gallery__photo"><img src={slide.src} alt={slide.alt} loading="lazy"/><span className="gallery__caption">{slide.title}</span></span>
          </button>
        })}
      </div>
      <nav className="gallery__controls" aria-label="Gallery controls">
        <button className="gallery__arrow" type="button" onClick={() => step(-1)} aria-label="Previous photo"><span aria-hidden="true">‹</span></button>
        <div className="gallery__dots" role="group" aria-label="Choose a photo">
          {gallerySlides.map((slide, index) => <button key={`${slide.title}-${index}`} type="button" className={`gallery__dot${index === active ? ' is-active' : ''}`} onClick={() => setActive(index)} aria-label={`Show ${slide.title}`} aria-current={index === active ? 'true' : undefined}/>) }
        </div>
        <button className="gallery__arrow" type="button" onClick={() => step(1)} aria-label="Next photo"><span aria-hidden="true">›</span></button>
      </nav>
    </div>
  </section>
}

function WeddingCar() {
  return <img className="wedding-car" src="/assets/timeline/rajasthani-wedding-baggi.webp" alt="A miniature Rajasthani wedding carriage drawn by two white horses" />
}

type WeddingMoment = {
  id: string
  hindi: string
  title: string
  times: string[]
  place?: string[]
}

const weddingMoments: WeddingMoment[] = [
  { id: 'nikasi', hindi: 'निकासी', title: 'Nikasi', times: ['9:15 AM'], place: ['Family residence'] },
  { id: 'lagan-sagai', hindi: 'लग्न-सगाई', title: 'Lagan–Sagai', times: ['11:00 AM'] },
  { id: 'baraat', hindi: 'बारात रवानगी', title: 'Baraat Departure', times: ['6:00 PM'], place: ['Shiv Shakti Enterprises', 'Near Kasturi Bagh', 'Proceeding to N. R. Paradise'] },
  { id: 'wedding', hindi: 'पाणिग्रहण संस्कार', title: 'The Wedding Ceremony', times: ['At an auspicious time', 'Blessings & dinner from 7:00 PM'], place: ['N. R. Paradise', 'Sitawali Phatak · Benad Road · Jaipur'] },
]

function EventScroll({ event, index }: { event: WeddingMoment; index: number }) {
  return <article className={`event-scroll event-scroll--${event.id}`}>
    <div className="event-scroll__reveal">
      <img className="event-scroll__art" src="/assets/timeline/embroidered-banner.webp" alt="" aria-hidden="true" />
      <div className="event-scroll__paper">
        <span className="event-scroll__number">0{index}</span>
        <p className="event-scroll__eyebrow">{event.hindi}</p>
        <h3>{event.title}</h3>
        <div className="event-scroll__ornament" aria-hidden="true"><span/><b>✦</b><span/></div>
        {event.place?.length ? <p className="event-scroll__where">{event.place.map((line, lineIndex) => lineIndex === 0 ? <Fragment key={line}>{line}<br/></Fragment> : <span key={line}>{line}<br/></span>)}</p> : null}
      </div>
    </div>
    <img className="event-scroll__bottom-roller" src="/assets/timeline/matching-scroll-roller.webp" alt="" aria-hidden="true" />
  </article>
}

function Festivities() {
  return <section className="festivities" aria-labelledby="festivities-title">
    <div className="festivities__mandala festivities__mandala--top" aria-hidden="true"/>
    <div className="festivities__mandala festivities__mandala--bottom" aria-hidden="true"/>
    <header className="festivities__heading">
      <p className="festivities__script">Saturday · 21 November 2026</p>
      <h2 id="festivities-title">The Wedding Day</h2>
      <Ornament className="festivities__ornament" />
    </header>
    <div className="festivities__timeline">
      <div className="festivities__route" aria-hidden="true"><span className="festivities__route-line"/><span className="festivities__route-progress"/><div className="festivities__route-garland">{Array.from({length: 23}, (_, index) => <span className="festivities__route-bloom" style={{top: `${((index + 1) * 100) / 24}%`}} key={index}><img src="/assets/hero/marigold-floret.webp" alt=""/></span>)}</div><div className="festivities__flower festivities__flower--start"><img src="/assets/hero/marigold-floret.webp" alt=""/><img src="/assets/hero/rose-petal.webp" alt=""/><img src="/assets/hero/marigold-floret.webp" alt=""/></div><div className="festivities__flower festivities__flower--end"><img src="/assets/hero/marigold-floret.webp" alt=""/><img src="/assets/hero/rose-petal.webp" alt=""/><img src="/assets/hero/marigold-floret.webp" alt=""/></div><div className="festivities__car"><WeddingCar/></div></div>
      {weddingMoments.map((event, index) => <article key={event.id} className={`event-stop event-stop--${index % 2 === 0 ? 'left' : 'right'}`}>
        <EventScroll event={event} index={index + 1}/>
        <div className="event-stop__details"><span>21 NOVEMBER 2026</span><div className="event-stop__times">{event.times.map(time => <p key={time}>{time}</p>)}</div></div>
      </article>)}
    </div>
  </section>
}

export default function App() {
  const root = useRef<HTMLDivElement>(null)
  const [time, setTime] = useState(remainingTime)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const timer = window.setInterval(() => setTime(remainingTime()), 1000)
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(media.matches)
    sync(); media.addEventListener('change', sync)
    return () => { window.clearInterval(timer); media.removeEventListener('change', sync) }
  }, [])

  useGSAP(() => {
    if (!root.current || reducedMotion) return
    const paths = gsap.utils.toArray<SVGPathElement>('.hero .ganesh-mark [data-draw]', root.current)
    paths.forEach(path => { const length = path.getTotalLength(); gsap.set(path, { strokeDasharray: length, strokeDashoffset: length }) })
    gsap.to(paths, { strokeDashoffset: 0, duration: 2.1, stagger: .06, ease: 'power2.inOut' })
    gsap.from('.hero-name', { y: 28, autoAlpha: 0, duration: 1.15, stagger: .14, ease: 'power3.out', delay: .35 })
    gsap.from('.hero-couple', { y: 22, autoAlpha: 0, duration: 1.2, ease: 'power2.out', delay: .5 })
    const markPaths = gsap.utils.toArray<SVGPathElement>('.auspicious-mark path', root.current)
    markPaths.forEach(path => { const length = path.getTotalLength(); gsap.set(path, { strokeDasharray: length, strokeDashoffset: length }) })
    gsap.timeline({ scrollTrigger: { trigger: '.auspicious-mark', start: 'top 85%', toggleActions: 'play none none reverse' } })
      .to(markPaths, { strokeDashoffset: 0, duration: 1.15, stagger: .1, ease: 'power2.inOut' })
      .from('.auspicious-mark circle', { scale: 0, autoAlpha: 0, transformOrigin: 'center center', stagger: .06, duration: .38, ease: 'back.out(2)' }, .65)
    gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .75 } })
      .to('.hero-palace', { scale: 1.14, yPercent: 5, ease: 'none' }, 0)
      .to('.hero-couple', { yPercent: 7, scale: 1.08, ease: 'none' }, 0)
      .to('.hero-arch', { scale: 1.22, ease: 'none' }, 0)
      .to('.hero-content', { yPercent: -24, autoAlpha: 0, ease: 'none' }, .18)
    gsap.from('.invitation-copy', { y: 50, opacity: 0, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: '.celebration-section', start: 'top 72%', toggleActions: 'play none none reverse' } })
    gsap.from('.countdown-niche', { y: 42, opacity: 0, stagger: .08, duration: .65, ease: 'back.out(1.4)', scrollTrigger: { trigger: '.countdown-grid', start: 'top 85%', toggleActions: 'play none none reverse' } })
    gsap.from('.save-date', { y: 65, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.save-date', start: 'top 78%', toggleActions: 'play none none reverse' } })
    gsap.from('.royal-couple__blessing, .royal-couple h2, .royal-couple__ornament', { y: 25, opacity: 0, stagger: .12, duration: .85, ease: 'power2.out', scrollTrigger: { trigger: '.royal-couple', start: 'top 78%', toggleActions: 'play none none reverse' } })
    gsap.from('.royal-portrait--groom', { x: -32, opacity: 0, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: '.royal-couple__portraits', start: 'top 82%', toggleActions: 'play none none reverse' } })
    gsap.from('.royal-portrait--bride', { x: 32, opacity: 0, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: '.royal-couple__portraits', start: 'top 82%', toggleActions: 'play none none reverse' } })
    gsap.from('.festivities__heading > *', { y: 32, opacity: 0, stagger: .12, duration: .8, ease: 'power2.out', scrollTrigger: { trigger: '.festivities', start: 'top 78%', toggleActions: 'play none none reverse' } })
    const route = root.current.querySelector<HTMLElement>('.festivities__route')
    if (route) {
      gsap.fromTo('.festivities__route-progress', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.festivities__timeline', start: 'top 72%', end: 'bottom 68%', scrub: .7 } })
      gsap.fromTo('.festivities__car', { y: 0 }, { y: () => Math.max(0, route.offsetHeight - 54), ease: 'none', scrollTrigger: { trigger: '.festivities__timeline', start: 'top 72%', end: 'bottom 68%', scrub: .7, invalidateOnRefresh: true } })
    }
    gsap.utils.toArray<HTMLElement>('.event-scroll', root.current).forEach(card => {
      const revealArt = card.querySelector<HTMLElement>('.event-scroll__reveal')
      const lowerRoller = card.querySelector<HTMLElement>('.event-scroll__bottom-roller')
      if (!revealArt || !lowerRoller) return
      const reveal = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 82%', end: 'bottom 45%', scrub: .35, invalidateOnRefresh: true } })
      reveal.fromTo(revealArt, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1, ease: 'none' })
        .fromTo(lowerRoller, { y: () => -revealArt.offsetHeight + lowerRoller.offsetHeight / 2, autoAlpha: .6 }, { y: 0, autoAlpha: 1, duration: 1, ease: 'none' }, 0)
        .from(card.querySelectorAll('.event-scroll__eyebrow, h3, .event-scroll__ornament, .event-scroll__when, .event-scroll__where'), { y: 13, autoAlpha: 0, stagger: .04, duration: .22, ease: 'power2.out' }, .12)
    })
    gsap.to('.mandala-scroll--left', { rotation: 900, ease: 'none', scrollTrigger: { trigger: '.celebration-section', start: 'top bottom', end: 'bottom top', scrub: .35 } })
    gsap.to('.mandala-scroll--right', { rotation: -900, ease: 'none', scrollTrigger: { trigger: '.celebration-section', start: 'top bottom', end: 'bottom top', scrub: .35 } })
    gsap.to('.gallery .mandala-scroll--left', { rotation: 900, ease: 'none', scrollTrigger: { trigger: '.gallery', start: 'top bottom', end: 'bottom top', scrub: .35 } })
    gsap.to('.gallery .mandala-scroll--right', { rotation: -900, ease: 'none', scrollTrigger: { trigger: '.gallery', start: 'top bottom', end: 'bottom top', scrub: .35 } })
    gsap.from('.details-card', { y: 48, opacity: 0, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: '.details', start: 'top 75%', toggleActions: 'play none none reverse' } })
  }, { scope: root, dependencies: [reducedMotion], revertOnUpdate: true })

  return <div className="site" ref={root}>
    <a className="sr-only focus-link" href="#details">Skip to celebration details</a>
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-sky"/><div className="hero-palace" role="img" aria-label="Stylized view of Jaipur's Hawa Mahal"/>
        <img className="hero-clouds" src="/assets/hero/clouds.webp" alt=""/>
        <div className="hero-couple-window"><img className="hero-couple" src="/assets/hero/couple-back.png" alt="Stylized couple looking toward Hawa Mahal"/></div>
        <img className="hero-railing" src="/assets/hero/gallery-railing.png" alt=""/>
        <img className="hero-arch" src="/assets/hero/carved-arch.png" alt=""/>
        <div className="hero-content"><GaneshMark className="ganesh-mark"/><h1 id="hero-title"><span className="hero-name">Jai</span><span className="hero-amp">&</span><span className="hero-name">Yogita</span></h1></div>
        <div className="scroll-invite" aria-hidden="true">Scroll to enter <span>↓</span></div>
      </section>

      <section className="celebration-section" aria-labelledby="invitation-title">
        <Mandala side="right"/><Mandala side="left"/>
        <div className="celebration-inner">
          <div className="invitation-copy"><AuspiciousMark/><h2 id="invitation-title">Together with<br/>their families</h2><p>request the honour of your presence<br className="desktop-break"/> to celebrate the joining of two families.</p><Ornament className="copy-ornament"/></div>
          <div className="countdown-block"><div className="countdown-heading"><span/>Counting the moments<span/></div><div className="countdown-grid" role="timer" aria-label={`${time[0]} days, ${time[1]} hours, ${time[2]} minutes and ${time[3]} seconds until the celebration`}>
            {['Days','Hours','Minutes','Seconds'].map((label,i) => <div className="countdown-niche" key={label}><CounterIcon index={i}/><SlotNumber value={time[i]}/><span className="countdown-niche__line"/><small>{label}</small></div>)}
          </div></div>
          <div className="save-date"><h2>Save the date</h2><p>Scratch the card below to reveal it</p><ScratchReveal reducedMotion={reducedMotion}/></div>
        </div>
      </section>

      <RoyalCouple/>

      <Gallery/>

      <Festivities/>

      <section className="details" id="details" aria-labelledby="details-title"><div className="details-card">
        <GaneshMark className="details-ganesh"/><p className="details-family" lang="hi">मोठ्या परिवार</p><p className="eyebrow">Invites you to celebrate</p><h2 id="details-title">Jai <em>&</em> Yogita</h2><Ornament className="details-ornament"/>
        <div className="details-date"><span>Saturday</span><strong>21 November 2026</strong></div><div className="details-divider"/><p className="details-label">Blessings & dinner</p><p className="details-time">From 7:00 PM</p><div className="details-divider"/><p className="details-label">At</p><h3>N. R. Paradise</h3><p className="details-address">Sitawali Phatak, Benad Road<br/>Jaipur, Rajasthan</p><a className="directions" href={mapsUrl} target="_blank" rel="noopener noreferrer">Get directions <span aria-hidden="true">↗</span></a>
      </div><footer>Jai & Yogita <span>✦</span> 21.11.2026</footer></section>
    </main>
    {!reducedMotion && <FlowerFall/>}
  </div>
}
