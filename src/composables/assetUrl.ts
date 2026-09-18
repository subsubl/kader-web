/** Prefix local assets for GitHub project Pages, but leave remote URLs alone. */
export function assetUrl(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path
  let base = '/'
  try {
    // Available during component render on both server (prerender) and client
    base = useRuntimeConfig().app.baseURL || '/'
  } catch {
    // Called outside Nuxt context (e.g. plain module evaluation) — assume root
    base = '/'
  }
  if (base !== '/' && path.startsWith(base)) return path
  return `${base.replace(/\/$/, '')}${path}`
}
export function useStaticAsset(path: string) { return assetUrl(path) }
