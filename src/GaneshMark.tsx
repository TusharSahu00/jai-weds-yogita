import { useId } from 'react'
import { ganeshPath } from './ganeshPath'
const iconWidth = 841
const iconHeight = 1145

export function GaneshMark({ className = '' }: { className?: string }) {
  const maskId = `ganesh-fill-${useId().replace(/:/g, '')}`

  return (
    <svg className={className} viewBox={`0 0 ${iconWidth} ${iconHeight}`} aria-hidden="true" focusable="false">
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={iconWidth} height={iconHeight}>
          <rect data-fill="top" x="0" y="0" width={iconWidth} height="0" fill="white" />
          <rect data-fill="bottom" x="0" y={iconHeight} width={iconWidth} height="0" fill="white" />
          <rect data-fill="left" x="0" y="0" width="0" height={iconHeight} fill="white" />
          <rect data-fill="right" x={iconWidth} y="0" width="0" height={iconHeight} fill="white" />
        </mask>
      </defs>
      <path d={ganeshPath} fill="currentColor" fillRule="evenodd" mask={`url(#${maskId})`} />
    </svg>
  )
}
