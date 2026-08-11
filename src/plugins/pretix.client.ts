// Client plugin — injects the Pretix widget loader script once per page load.
// The <pretix-widget> custom element (rendered by <PretixWidget> components later in the page)
// is upgraded by this script, enabling on-page cart/checkout + QR tickets.
// Docs: https://docs.pretix.eu/en/latest/user/events/widget.html

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const pretixUrl = (config.public.pretixUrl as string || 'https://pretix.eu').replace(/\/$/, '')

  if (typeof document !== 'undefined') {
    // The widget script is asset-versioned; load it exactly once.
    const existing = document.querySelector('script[data-pretix-widget]')
    if (!existing) {
      const script = document.createElement('script')
      script.dataset.pretixWidget = 'true'
      script.type = 'text/javascript'
      script.src = `${pretixUrl}/widget/v2.en.js`
      script.async = true
      script.crossOrigin = 'anonymous'
      document.head.appendChild(script)
    }
  }
})