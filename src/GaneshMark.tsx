export function GaneshMark({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 235" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="4.3" strokeLinecap="round" strokeLinejoin="round">
        <path data-draw d="M94 22c-5-8-2-18 5-18 8 0 7 9 3 15-8 13-2 25 10 24 8-1 12-9 9-16" />
        <path data-draw d="M101 49c15-1 28-5 41-13M104 58c15 1 30-4 43-13M108 67c15 1 29-4 40-13" />
        <path data-draw d="M77 57c-13-13-28-13-37 0-8 12-6 27 4 39 8 10 14 20 12 32-2 13-10 22-22 22-13 0-21-10-21-23 0-12 8-20 18-20 12 0 19 10 17 22" />
        <path data-draw d="M74 70c-4 13-1 25 9 36 8 9 13 18 12 31" />
        <path data-draw d="M147 81c6-15 20-19 31-12 11 8 10 22 1 32-8 9-21 12-24 28" />
        <path data-draw d="M132 68c8 16 7 35 0 50-5 11-14 19-24 27-10 8-15 17-15 29 0 15 11 26 25 26 13 0 23-9 24-22 1-11-7-20-18-20-9 0-15 6-15 14" />
        <path data-draw d="M103 113c-8 2-15 8-19 17M111 121c5 3 8 7 8 13" strokeWidth="3.1" />
        <path data-draw d="M91 112c9-9 21-8 30 1-7 8-18 10-30-1Z" strokeWidth="2.7" />
        <path data-draw d="M93 137l-11 6m16-2-10 7M88 150c5 12 13 17 24 17" />
        <path data-draw d="M77 150c-7 20-5 43 9 55M47 158c-9-7-22-7-31 1-10 9-9 23 3 29 10 6 20 1 24-7M145 143c12-11 27-9 33 3 5 11-1 21-10 24" />
        <path data-draw d="M16 186c20 6 33 14 48 23 13 8 25 9 37 7 17-3 26-4 42-4 17 0 30-9 40-20M100 214c-8 2-12 10-8 17 5 9 18 6 20-2" />
        <path data-draw d="M161 133c8 17 18 18 26 5" />
      </g>
      <g fill="currentColor">
        <circle cx="105" cy="113" r="2.3" /><circle cx="161" cy="131" r="3.5" />
        {Array.from({ length: 8 }, (_, i) => <circle key={`l${i}`} cx={50 + Math.sin(i * .68) * 10} cy={64 + i * 6.7} r="1.7" />)}
        {Array.from({ length: 8 }, (_, i) => <circle key={`r${i}`} cx={168 + Math.sin(i * .7) * 7} cy={76 + i * 5.6} r="1.5" />)}
        {Array.from({ length: 8 }, (_, i) => <circle key={`b${i}`} cx={105 + i * 4.6} cy={188 + Math.sin(i * .68) * 4} r="1.5" />)}
      </g>
    </svg>
  )
}
