// src/composables/useParallax.ts
// Scroll-driven parallax for image bands.
//
// Each band registers its inner element; on scroll we compute how far the band
// has travelled through the viewport and translate the inner image by a small
// fraction of that, clamped so the image can never reveal an edge.
//
// Implementation notes:
//  - Uses a CSS custom property (--parallax-y) so the transform stays on the
//    compositor and we never touch layout properties.
//  - Only bands currently near the viewport are updated (cheap intersection
//    gate), and updates are batched into a single rAF callback per frame.
//  - Honours prefers-reduced-motion: the property is left at 0 and the CSS
//    ignores the transform entirely.

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

type Registration = { el: HTMLElement }

export function useParallax() {
  if (typeof window === 'undefined') {
    return { register: (_el: unknown) => {}, unregister: (_el: unknown) => {}, update: () => {} }
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
      const rect = el.getBoundingClientRect()
      // skip bands far outside the viewport
      if (rect.bottom < -vh * 0.5 || rect.top > vh * 1.5) continue
      // -1 (band below viewport) .. +1 (band above viewport)
      const centre = rect.top + rect.height / 2
      const progress = (centre - vh / 2) / (vh / 2 + rect.height / 2)
      // max travel = the 12% oversize on each side
      const travel = Math.max(-1, Math.min(1, progress)) * (rect.height * 0.12)
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

  return { register, unregister, update: schedule }
}
