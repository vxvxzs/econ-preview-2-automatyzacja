/**
 * Shared GSAP / ScrollTrigger utilities for Econ Fotowoltaika
 */

/** Default ScrollTrigger settings used across all sections */
export const ST_DEFAULTS = {
  start: 'top 85%',
  end: 'bottom 20%',
  toggleActions: 'play none none reverse' as const,
}

/**
 * Split every word in an element into an individual <span class="word-span">
 * wrapped in an overflow:hidden container so we can clip/reveal per word.
 *
 * Returns the array of created word spans.
 */
export function splitWords(el: HTMLElement): HTMLSpanElement[] {
  const text = el.textContent ?? ''
  // Split preserving whitespace
  const words = text.split(/(\s+)/)
  el.textContent = ''

  const spans: HTMLSpanElement[] = []

  words.forEach((token) => {
    if (/^\s+$/.test(token)) {
      // Pure whitespace — keep it as a text node
      el.appendChild(document.createTextNode(token))
    } else {
      const wrap = document.createElement('span')
      wrap.className = 'word-wrap'
      const span = document.createElement('span')
      span.className = 'word-span'
      span.textContent = token
      wrap.appendChild(span)
      el.appendChild(wrap)
      spans.push(span)
    }
  })

  return spans
}
