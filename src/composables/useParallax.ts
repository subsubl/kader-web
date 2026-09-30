// src/composables/useParallax.ts
// Scroll-driven parallax for image bands.
//
// Each band is a window of fixed height; the inner element is TALLER than that
// window and is translated in proportion to how far the band has travelled
// through the viewport, so the image drifts against the scroll and reads as
// depth.
//
// INVARIANT (keep these in agreement):
//   inner height  = band height + 2 * OVERSIZE_PX
//   |travel|      <= OVERSIZE_PX                 (so no edge is ever revealed)
//   travel        = progress * OVERSIZE,  progress in [-1, 1]
// OVERSIZE_PX is exported to the component as an inline style, so the CSS and
// the JS can never drift apart.
//
// Implementation notes:
//  - Transform-only, so it stays on the compositor. One rAF per frame.
//  - Bands outside the viewport are skipped.
//  - Honours prefers-reduced-motion: nothing is written and the CSS ignores the
//    transform entirely.

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

/**
 * Extra image height per side, as a fraction of the band height. The travel
 * amplitude is derived from this same number, so the image can never slide far
 * enough to expose an edge. Must stay <= 0.5 so the total inner height is at
 * most twice the band.
 *
 * 0.38 gives roughly 200px of travel on a 522px band, which reads clearly
 * without the image looking like it is sliding away.
 */
const OVERSIZE = 0.38

type Registration = { el: HTMLElement }

export function useParallax() {
  if (typeof window === 'undefined') {
    // SSR/prerender: no scrolling, but the component still needs the oversize.
    return {
      register: (_el: unknown) => {},
      unregister: (_el: unknown) => {},
      update: () => {},
      travel: OVERSIZE,
      oversize: OVERSIZE
    }
  }

  const registry = new Map<Element, Registration>()
  let frame = 0

  const isReduced = () =>
    typeof matchMedia === 'function' && matchMedia(REDUCED_MOTION).matches

  const paint = () => {
    frame = 0
    if (isReduced()) return
    const vh = window.innerHeight || 1
    for (const reg of registry.values()) {
      const el = reg.el
      if (!el.isConnected) continue
      // el is the INNER element, so its rect is the tall one. The band window
      // is its offsetParent; both the travel and the oversize are fractions of
      // the BAND height, so measure that.
      const band = (el.offsetParent as HTMLElement | null) ?? el
      const rect = el.getBoundingClientRect()
      if (rect.bottom < -vh * 0.5 || rect.top > vh * 1.5) continue

      const bandRect = band.getBoundingClientRect()
      const bandH = bandRect.height || rect.height

      // progress: 0 when the band centre sits at the viewport centre, reaching
      // -1 (band fully above) / +1 (band fully below) as it leaves the screen.
      const centre = bandRect.top + bandH / 2
      const span = vh / 2 + bandH / 2
      const progress = Math.max(-1, Math.min(1, (centre - vh / 2) / span))

      // The image lags the scroll: a band below centre moves its image up.
      // Amplitude is a fraction of OVERSIZE of the band height, and the CSS
      // gives the inner element exactly 2 * OVERSIZE of extra height, so the
      // image can never slide far enough to expose an edge.
      const travel = -progress * bandH * OVERSIZE
      el.style.setProperty('--parallax-y', `${travel.toFixed(1)}px`)
    }
  }

  const schedule = () => {
    if (frame) return
    frame = requestAnimationFrame(paint)
  }

  const register = (el: unknown) => {
    if (!el || typeof el !== 'object') return
    const node = el as HTMLElement
    registry.set(node, { el: node })
    node.style.setProperty('--parallax-y', '0px')
    schedule()
  }

  const unregister = (el: unknown) => {
    if (el && typeof el === 'object') registry.delete(el as Element)
  }

  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule, { passive: true })

  return { register, unregister, update: schedule, travel: OVERSIZE, oversize: OVERSIZE }
}