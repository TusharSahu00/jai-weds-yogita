import { Fragment, useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { GaneshMark } from './GaneshMark'

gsap.registerPlugin(useGSAP, ScrollTrigger)
const weddingTime = new Date('2026-11-21T19:00:00+05:30').getTime()
const venueCoordinates = '26.9881789,75.7408696'
const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(venueCoordinates)}`
const venueMapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(venueCoordinates)}&z=16&output=embed`

function remainingTime() {
  const ms = Math.max(0, weddingTime - Date.now())
  return [Math.floor(ms / 86400000), Math.floor(ms / 3600000) % 24, Math.floor(ms / 60000) % 60, Math.floor(ms / 1000) % 60]
}

function Ornament({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 220 50" fill="none" aria-hidden="true"><path d="M0 25h75m70 0h75M80 25c14-2 20-13 30-23 10 10 16 21 30 23-14 2-20 13-30 23-10-10-16-21-30-23Z" stroke="currentColor" strokeWidth="1.3"/><circle cx="110" cy="25" r="5" fill="currentColor"/></svg>
}

function VenueIcon({ kind }: { kind: 'date' | 'time' | 'place' }) {
  return <svg className="venue-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === 'date' && <><rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M7.5 3v4M16.5 3v4M3.5 9h17M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01"/></>}
    {kind === 'time' && <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></>}
    {kind === 'place' && <><path d="M20 10.2c0 5.1-8 11-8 11s-8-5.9-8-11a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.4"/></>}
  </svg>
}

function PersonIcon() {
  return <svg className="rsvp-field__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 20v-1.4a7 7 0 0 1 14 0V20"/></svg>
}

function RSVPSection() {
  const [attendance, setAttendance] = useState<'yes' | 'no'>('yes')
  const [guestCount, setGuestCount] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [guestName, setGuestName] = useState('')
  const updateCount = (amount: number) => setGuestCount(count => Math.min(20, Math.max(1, count + amount)))

  const submitRSVP = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return <section className="rsvp" id="rsvp" aria-labelledby="rsvp-title">
    <Mandala side="right"/><Mandala side="left"/>
    <header className="rsvp__heading">
      <p>Kindly reply</p>
      <h2 id="rsvp-title">Your presence means so much</h2>
      <Ornament className="rsvp__ornament"/>
      <span>Jai &amp; Yogita · 21 November 2026</span>
    </header>
    <form className="rsvp-card" onSubmit={submitRSVP}>
      <div className="rsvp-card__intro"><span className="rsvp-card__seal" aria-hidden="true">J<span>&amp;</span>Y</span><h3>Will you join us?</h3><p>We would be delighted to celebrate together.</p></div>
      <label className="rsvp-field">
        <span className="rsvp-field__label">Your name</span>
        <span className="rsvp-field__control"><PersonIcon/><input type="text" name="guest-name" autoComplete="name" placeholder="Full name" value={guestName} onChange={event => {setGuestName(event.target.value);setSubmitted(false)}} required /></span>
      </label>
      <fieldset className="rsvp-attendance">
        <legend className="rsvp-field__label">Will you be attending?</legend>
        <label className={`rsvp-choice${attendance === 'yes' ? ' is-selected' : ''}`}>
          <input type="radio" name="attendance" value="yes" checked={attendance === 'yes'} onChange={() => {setAttendance('yes');setSubmitted(false)}}/>
          <span className="rsvp-choice__heart" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none"><path d="M16 27S4 19.5 4 11.5C4 5.7 11.2 3 16 9c4.8-6 12-3.3 12 2.5C28 19.5 16 27 16 27Z"/></svg></span>
          <strong>Joyfully accept</strong><small>We’ll be there</small>
        </label>
        <label className={`rsvp-choice${attendance === 'no' ? ' is-selected' : ''}`}>
          <input type="radio" name="attendance" value="no" checked={attendance === 'no'} onChange={() => {setAttendance('no');setSubmitted(false)}}/>
          <span className="rsvp-choice__heart" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none"><path d="M16 27S4 19.5 4 11.5C4 5.7 11.2 3 16 9c4.8-6 12-3.3 12 2.5C28 19.5 16 27 16 27Z"/><path d="m7 7 18 18"/></svg></span>
          <strong>Regretfully decline</strong><small>With you in spirit</small>
        </label>
      </fieldset>
      <div className={`rsvp-guests${attendance === 'no' ? ' is-disabled' : ''}`}>
        <span className="rsvp-field__label" id="rsvp-guests-label">Number attending</span>
        <div className="rsvp-guests__control">
          <span className="rsvp-guests__people" aria-hidden="true"><PersonIcon/></span>
          <span className="rsvp-guests__text">Including you</span>
          <button type="button" onClick={() => updateCount(-1)} disabled={attendance === 'no' || guestCount <= 1} aria-label="Remove one guest">−</button>
          <output aria-labelledby="rsvp-guests-label">{attendance === 'no' ? '—' : guestCount}</output>
          <button type="button" onClick={() => updateCount(1)} disabled={attendance === 'no' || guestCount >= 20} aria-label="Add one guest">+</button>
        </div>
      </div>
      <label className="rsvp-field rsvp-field--message">
        <span className="rsvp-field__label">A wish for the couple <small>Optional</small></span>
        <textarea name="message" rows={3} maxLength={400} placeholder="Write a note for Jai & Yogita…" onChange={() => setSubmitted(false)}/>
      </label>
      <button className="rsvp-submit" type="submit"><span>{submitted ? 'Reply prepared' : 'Send your reply'}</span><span aria-hidden="true">↗</span></button>
      {submitted && <p className="rsvp-status" role="status">Thank you, {guestName}. This is a preview for now; your reply has not been sent to the family yet.</p>}
    </form>
    <p className="rsvp__footnote">With love, <strong>The Mothya Family</strong></p>
  </section>
}

type Wish = { name: string; message: string; preview?: boolean }

function WishesSection() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [wishes, setWishes] = useState<Wish[]>([])
  const [submitted, setSubmitted] = useState(false)
  const blessings = [
    'May your days be full of laughter, patience, and the quiet joy of choosing each other.',
    'May every new chapter bring shared adventures and a home filled with warmth.',
    'Wishing you a lifetime of little joys, big dreams, and hands held through it all.',
  ]

  const submitWish = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setWishes(current => [{ name: name.trim(), message: message.trim(), preview: true }, ...current])
    setSubmitted(true)
    setName('')
    setMessage('')
  }

  return <section className="wishes" id="wishes" aria-labelledby="wishes-title">
    <Mandala side="right"/><Mandala side="left"/>
    <div className="wishes__inner">
      <header className="wishes__heading">
        <p>Words to keep close</p>
        <h2 id="wishes-title">A wall of blessings</h2>
        <Ornament className="wishes__ornament"/>
        <span>Leave Jai &amp; Yogita a note for the years ahead</span>
      </header>
      <div className="wishes__layout">
        <div className="wishes__wall" aria-label="Wedding blessings">
          <div className="wishes__wall-heading"><span aria-hidden="true">✦</span><p>With love, for the two of you</p><span aria-hidden="true">✦</span></div>
          {wishes.map((wish, index) => <article className="wish-card wish-card--new" key={`${wish.name}-${index}`}>
            <span className="wish-card__number">A note from your guest</span>
            <p>“{wish.message}”</p>
            <footer>— {wish.name} <small>{wish.preview && '· this preview'}</small></footer>
          </article>)}
          {blessings.map((blessing, index) => <article className={`wish-card wish-card--${index + 1}`} key={blessing}>
            <span className="wish-card__number">Blessing {String(index + 1).padStart(2, '0')}</span>
            <p>“{blessing}”</p>
            <footer>For Jai &amp; Yogita <span aria-hidden="true">✧</span></footer>
          </article>)}
        </div>
        <form className="wishes-form" onSubmit={submitWish}>
          <div className="wishes-form__top"><span aria-hidden="true">J <i>&amp;</i> Y</span><p>Leave a blessing</p><small>A few heartfelt words make a keepsake.</small></div>
          <label className="wishes-form__field">
            <span>Your name</span>
            <input value={name} onChange={event => {setName(event.target.value);setSubmitted(false)}} name="wish-name" autoComplete="name" placeholder="How should we sign it?" maxLength={70} required />
          </label>
          <label className="wishes-form__field wishes-form__field--message">
            <span>Your message <small>Up to 400 characters</small></span>
            <textarea value={message} onChange={event => {setMessage(event.target.value);setSubmitted(false)}} name="wish-message" placeholder="Share a memory, a wish, or a few words from the heart…" maxLength={400} rows={5} required />
            <small className="wishes-form__count">{message.length} / 400</small>
          </label>
          <button type="submit" className="wishes-form__submit"><span>Add your wish</span><span aria-hidden="true">✦</span></button>
          {submitted && <p className="wishes-form__status" role="status">Your note has been added to this preview on this device. It hasn’t been shared with the family.</p>}
          <p className="wishes-form__footnote">With warmest thanks <span aria-hidden="true">♡</span></p>
        </form>
      </div>
    </div>
  </section>
}

function ContactAndClosing() {
  return <>
    <section className="day-contact" id="day-contact" aria-labelledby="day-contact-title">
      <Mandala side="left"/>
      <header className="day-contact__heading">
        <p>Here for the little things</p>
        <h2 id="day-contact-title">A helping hand on the day</h2>
        <Ornament className="day-contact__ornament"/>
        <span>Directions, last-minute questions, baraat logistics — all welcome.</span>
      </header>
      <article className="day-contact__card">
        <span className="day-contact__badge" aria-hidden="true">✦</span>
        <div className="day-contact__copy">
          <p className="day-contact__eyebrow">Officially unofficial family help</p>
          <h3>Tushar Sahu</h3>
          <p className="day-contact__role">Dulhe ka chhota bhai <span>·</span> on-call problem solver</p>
          <a className="day-contact__number" href="tel:+918824377743">+91 88243 77743</a>
        </div>
        <div className="day-contact__actions">
          <a className="day-contact__action day-contact__action--call" href="tel:+918824377743" aria-label="Call Tushar Sahu"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 3.8 4.9 3a1.5 1.5 0 0 0-1.8.6c-.8 1.3-1 2.9-.5 4.4 1.7 5.3 6.1 9.7 11.4 11.4 1.5.5 3.1.3 4.4-.5a1.5 1.5 0 0 0 .6-1.8l-.8-2.1a1.5 1.5 0 0 0-1.5-.9l-2.4.2a1.5 1.5 0 0 0-1.3 1.1l-.3 1a14 14 0 0 1-5.5-5.5l1-.3a1.5 1.5 0 0 0 1.1-1.3l.2-2.4A1.5 1.5 0 0 0 8.6 5Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Call</span></a>
          <a className="day-contact__action day-contact__action--whatsapp" href="https://wa.me/918824377743" target="_blank" rel="noopener noreferrer" aria-label="Message Tushar Sahu on WhatsApp"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 11.7a8 8 0 0 1-11.8 7L4 20l1.3-4.1A8 8 0 1 1 20 11.7Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 8.4c.2-.4.5-.4.7-.4h.4c.2 0 .3.1.4.4l.6 1.4c.1.2.1.4 0 .5l-.5.6c-.2.2-.2.3-.1.5.4.7 1 1.3 1.8 1.7.2.1.3.1.5-.1l.7-.8c.2-.2.3-.2.5-.1l1.4.7c.2.1.3.2.3.4 0 .3-.2 1-.6 1.3-.4.4-.9.5-1.4.4a8 8 0 0 1-3.5-1.8 7.8 7.8 0 0 1-2.1-2.9c-.2-.6-.1-1.2.2-1.7Z" fill="currentColor"/></svg><span>WhatsApp</span></a>
        </div>
        <p className="day-contact__aside">For urgent questions, ring. For everything else, a WhatsApp is kinder to the baraat.</p>
      </article>
    </section>
    <footer className="wedding-close">
      <p className="wedding-close__credit">Designed by <a href="tel:+918824377743">Tushar Sahu</a></p>
    </footer>
  </>
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
            <img className="royal-portrait__image" src="/assets/couple/groom-portrait.jpg" alt="Jai in an ivory embroidered sherwani and maroon stole" loading="lazy" decoding="async" />
            <img className="royal-portrait__frame" src="/assets/couple/portrait-frame.svg" alt="" />
          </div>
          <p>The Groom</p><h3>Jai</h3><p className="royal-portrait__nickname"><span>aka</span><strong>Vishal</strong></p>
        </article>
        <span className="royal-couple__amp">Weds</span>
        <article className="royal-portrait royal-portrait--bride">
          <div className="royal-portrait__art">
            <img className="royal-portrait__image" src="/assets/couple/bride-portrait.jpg" alt="Yogita in a maroon embroidered bridal outfit beneath a palace arch" loading="lazy" decoding="async" />
            <img className="royal-portrait__frame" src="/assets/couple/portrait-frame.svg" alt="" />
          </div>
          <p>The Bride</p><h3>Yogita</h3><p className="royal-portrait__nickname"><span>aka</span><strong>Gudiya</strong></p>
        </article>
      </div>
    </div>
  </section>
}

type GallerySlide = { src: string; srcSet?: string; alt: string; title: string }
const galleryPhoto = (name: string, alt: string, title: string): GallerySlide => ({
  src: `/assets/gallery/${name}-900.jpg`,
  srcSet: `/assets/gallery/${name}-900.jpg 900w, /assets/gallery/${name}-1800.jpg 1800w`,
  alt,
  title,
})

const gallerySlides: GallerySlide[] = [
  { src: '/assets/hero/hawa-mahal-trees.webp', alt: 'Hawa Mahal framed by Jaipur trees', title: 'Jaipur' },
  { src: '/assets/hero/couple-back.png', alt: 'Jai and Yogita looking toward the palace', title: 'Jai & Yogita' },
  galleryPhoto('jai-yogita-palace-close', 'Jai and Yogita seated together beside a painted palace wall', 'A Palace Moment'),
  galleryPhoto('jai-yogita-white-arches', 'Jai and Yogita standing beneath white carved arches', 'Marble Arches'),
  galleryPhoto('jai-yogita-together', 'Jai and Yogita sharing a quiet embrace', 'Together'),
  galleryPhoto('jai-yogita-palace-portrait', 'Jai and Yogita posing together in front of a palace wall', 'Palace Stroll'),
  galleryPhoto('jai-yogita-outdoors', 'Jai and Yogita embracing outdoors in the sunshine', 'Open Sky'),
  galleryPhoto('jai-yogita-sitting', 'Jai seated with Yogita beside him in a green garden', 'A Quiet Afternoon'),
  galleryPhoto('jai-yogita-elephant', 'Jai and Yogita seated together on a decorated elephant', 'A Royal Visit'),
  { src: '/assets/couple/groom.webp', alt: 'Portrait of Jai in wedding attire', title: 'Jai' },
  { src: '/assets/couple/bride.webp', alt: 'Portrait of Yogita in wedding attire', title: 'Yogita' },
  { src: '/assets/ring-reveal/end-frame.jpg', alt: 'The couple revealing their wedding rings', title: 'The Rings' },
  { src: '/assets/hawa-mahal.webp', alt: 'The Hawa Mahal in Jaipur', title: 'Hawa Mahal' },
  { src: '/assets/ring-reveal/start-frame.jpg', alt: 'Two hands reaching toward one another', title: 'A Promise' },
]

function Gallery() {
  const slideCount = gallerySlides.length
  const [position, setPosition] = useState(slideCount * 2)
  const [animateRing, setAnimateRing] = useState(true)
  const dragStart = useRef<{x: number; y: number} | null>(null)
  const dragged = useRef(false)
  const active = ((position % slideCount) + slideCount) % slideCount
  const goTo = (target: number) => {
    let difference = (target - active + slideCount) % slideCount
    if (difference > slideCount / 2) difference -= slideCount
    setPosition(current => current + difference)
  }
  const step = (direction: number) => setPosition(current => current + direction)

  useEffect(() => {
    if (position >= slideCount && position < slideCount * 4) return
    // Recenter on an identical copy once a full loop finishes. The image and
    // its neighbors occupy the same positions, so the reset is imperceptible.
    setAnimateRing(false)
    setPosition(current => slideCount * 2 + (((current % slideCount) + slideCount) % slideCount))
    const frame = window.requestAnimationFrame(() => setAnimateRing(true))
    return () => window.cancelAnimationFrame(frame)
  }, [position, slideCount])

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    dragStart.current = {x: event.clientX, y: event.clientY}
    dragged.current = false
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return
    const dx = event.clientX - dragStart.current.x
    const dy = event.clientY - dragStart.current.y
    dragged.current = Math.abs(dx) > 12
    dragStart.current = null
    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.15) step(dx < 0 ? 1 : -1)
  }

  return <section className="gallery" aria-labelledby="gallery-title">
    <Mandala side="right"/><Mandala side="left"/>
    <div className="gallery__inner">
      <header className="gallery__heading">
        <p>Moments to treasure</p>
        <h2 id="gallery-title">Royal Gallery</h2>
        <Ornament className="gallery__ornament" />
      </header>
      <div className="gallery__carousel" role="region" aria-roledescription="carousel" aria-label="Wedding gallery" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => { dragStart.current = null }} onClickCapture={event => {
        if (dragged.current) { event.preventDefault(); event.stopPropagation(); dragged.current = false }
      }}>
        {Array.from({length: slideCount * 5}, (_, physicalIndex) => {
          const slideIndex = physicalIndex % slideCount
          const slide = gallerySlides[slideIndex]
          const offset = physicalIndex - position
          const visible = Math.abs(offset) <= 2
          return <button
            className={`gallery__slide${offset === 0 ? ' is-active' : ''}${animateRing ? '' : ' is-recentering'}`}
            data-position={offset === 0 ? 'current' : Math.abs(offset) === 1 ? 'adjacent' : 'far'}
            type="button"
            key={`${physicalIndex}-${slide.title}`}
            style={{ '--gallery-angle': `${offset * 360 / slideCount}deg`, '--gallery-offset': offset } as CSSProperties}
            aria-label={`${offset === 0 ? 'Current photo' : 'Show photo'}: ${slide.title}`}
            aria-current={offset === 0 ? 'true' : undefined}
            aria-hidden={!visible}
            onClick={() => offset === 0 ? undefined : goTo(slideIndex)}
            tabIndex={offset === 0 ? 0 : -1}
          >
            <span className="gallery__photo">{visible && <img src={slide.src} srcSet={slide.srcSet} sizes={slide.srcSet ? '300px' : undefined} alt={slide.alt} loading={offset === 0 ? 'eager' : 'lazy'} decoding="async" fetchPriority={offset === 0 ? 'high' : 'auto'}/>}<span className="gallery__caption">{slide.title}</span></span>
          </button>
        })}
      </div>
      <nav className="gallery__controls" aria-label="Gallery controls">
        <button className="gallery__arrow" type="button" onClick={() => step(-1)} aria-label="Previous photo"><span aria-hidden="true">‹</span></button>
        <div className="gallery__dots" role="group" aria-label="Choose a photo">
          {gallerySlides.map((slide, index) => <button key={`${slide.title}-${index}`} type="button" className={`gallery__dot${index === active ? ' is-active' : ''}`} onClick={() => goTo(index)} aria-label={`Show ${slide.title}`} aria-current={index === active ? 'true' : undefined}/>) }
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
  date: string
  times: string[]
  place?: string[]
}

const weddingMoments: WeddingMoment[] = [
  { id: 'sangeet', hindi: 'संगीत', title: 'Sangeet', date: '19 NOVEMBER 2026', times: [] },
  { id: 'haldi', hindi: 'हल्दी', title: 'Haldi', date: '19 NOVEMBER 2026', times: [] },
  { id: 'nikasi', hindi: 'निकासी', title: 'Nikasi', date: '21 NOVEMBER 2026', times: ['9:15 AM'], place: ['Family residence'] },
  { id: 'lagan-sagai', hindi: 'लग्न-सगाई', title: 'Lagan–Sagai', date: '21 NOVEMBER 2026', times: ['11:00 AM'] },
  { id: 'baraat', hindi: 'बारात रवानगी', title: 'Baraat Departure', date: '21 NOVEMBER 2026', times: ['6:00 PM'], place: ['Shiv Shakti Enterprises', 'Near Kasturi Bagh', 'Proceeding to N. R. Paradise'] },
  { id: 'wedding', hindi: 'पाणिग्रहण संस्कार', title: 'The Wedding Ceremony', date: '21 NOVEMBER 2026', times: ['At an auspicious time', 'Blessings & dinner from 7:00 PM'], place: ['N. R. Paradise', 'Sitawali Phatak · Benad Road · Jaipur'] },
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
      <p className="festivities__script">19 &amp; 21 November 2026</p>
      <h2 id="festivities-title">Wedding Celebrations</h2>
      <Ornament className="festivities__ornament" />
    </header>
    <div className="festivities__timeline">
      <div className="festivities__route" aria-hidden="true"><span className="festivities__route-line"/><span className="festivities__route-progress"/><div className="festivities__route-garland">{Array.from({length: 23}, (_, index) => <span className="festivities__route-bloom" style={{top: `${((index + 1) * 100) / 24}%`}} key={index}><img src="/assets/hero/marigold-floret.webp" alt=""/></span>)}</div><div className="festivities__flower festivities__flower--start"><img src="/assets/hero/marigold-floret.webp" alt=""/><img src="/assets/hero/rose-petal.webp" alt=""/><img src="/assets/hero/marigold-floret.webp" alt=""/></div><div className="festivities__flower festivities__flower--end"><img src="/assets/hero/marigold-floret.webp" alt=""/><img src="/assets/hero/rose-petal.webp" alt=""/><img src="/assets/hero/marigold-floret.webp" alt=""/></div><div className="festivities__car"><WeddingCar/></div></div>
      {weddingMoments.map((event, index) => <article key={event.id} className={`event-stop event-stop--${index % 2 === 0 ? 'left' : 'right'}`}>
        <EventScroll event={event} index={index + 1}/>
        <div className="event-stop__details"><span>{event.date}</span><div className="event-stop__times">{event.times.map(time => <p key={time}>{time}</p>)}</div></div>
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
    gsap.from('.rsvp__heading > *, .rsvp-card', { y: 28, opacity: 0, stagger: .12, duration: .8, ease: 'power2.out', scrollTrigger: { trigger: '.rsvp', start: 'top 78%', toggleActions: 'play none none reverse' } })
    gsap.from('.wishes__heading > *, .wish-card, .wishes-form', { y: 30, opacity: 0, stagger: .1, duration: .75, ease: 'power2.out', scrollTrigger: { trigger: '.wishes', start: 'top 78%', toggleActions: 'play none none reverse' } })
    gsap.from('.day-contact__heading > *, .day-contact__card', { y: 28, opacity: 0, stagger: .12, duration: .8, ease: 'power2.out', scrollTrigger: { trigger: '.day-contact', start: 'top 78%', toggleActions: 'play none none reverse' } })
    gsap.from('.wedding-close__inner > *', { y: 18, opacity: 0, stagger: .08, duration: .7, ease: 'power2.out', scrollTrigger: { trigger: '.wedding-close', start: 'top 85%', toggleActions: 'play none none reverse' } })
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

      <section className="details" id="details" aria-labelledby="details-title">
        <Mandala side="right"/><Mandala side="left"/>
        <div className="details-card">
          <header className="details-card__heading">
            <GaneshMark className="details-ganesh"/>
            <p className="details-family" lang="hi">मोठ्या परिवार</p>
            <p className="eyebrow">Invite you to celebrate</p>
            <p className="details-kicker">Join us at</p>
            <h2 id="details-title">N. R. Paradise</h2>
            <Ornament className="details-ornament"/>
          </header>
          <div className="details-facts">
            <div className="details-fact"><span className="details-fact__icon"><VenueIcon kind="date"/></span><p><span>Date</span><strong>Saturday, 21 November 2026</strong></p></div>
            <div className="details-fact"><span className="details-fact__icon"><VenueIcon kind="time"/></span><p><span>Blessings &amp; dinner</span><strong>From 7:00 PM</strong></p></div>
            <div className="details-fact"><span className="details-fact__icon"><VenueIcon kind="place"/></span><p><span>Jaipur, Rajasthan</span><strong>Sitawali Phatak, Benad Road</strong></p></div>
          </div>
          <a className="directions" href={mapsUrl} target="_blank" rel="noopener noreferrer">Get directions <span aria-hidden="true">↗</span></a>
          <div className="venue-map" aria-label="Map showing N. R. Paradise in Jhotwara, Jaipur">
            <iframe title="Map to N. R. Paradise, Sitawali Phatak, Benad Road, Jaipur" src={venueMapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            <a className="venue-map__open" href={mapsUrl} target="_blank" rel="noopener noreferrer">Open map <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <footer>Jai <span>✦</span> Yogita <span>✦</span> 21.11.2026</footer>
      </section>

      <RSVPSection/>
      <WishesSection/>
      <ContactAndClosing/>
    </main>
    {!reducedMotion && <FlowerFall/>}
  </div>
}
