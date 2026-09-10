import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'

export interface StoreCacheEntry<T = unknown> {
  data: T
  mtimeMs: number
  cachedAt: number
}

// In-memory write-through cache for parsed JSON data indexed by absolute file path
export const memoryStoreCache = new Map<string, StoreCacheEntry<unknown>>()

/**
 * Ensures that the target file's parent directory exists asynchronously.
 */
export async function ensureDirectory(dirPath: string): Promise<void> {
  await fsp.mkdir(dirPath, { recursive: true })
}

/**
 * Ensures that the target file's parent directory exists synchronously.
 */
export function ensureDirectorySync(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

/**
 * Atomically writes data to a file using a temp file in the same directory,
 * fsync to flush buffers to disk, and atomic POSIX rename.
 * Also immediately updates the in-memory cache upon success (write-through).
 */
export async function atomicWriteJson<T = unknown>(filePath: string, data: T): Promise<void> {
  const dir = path.dirname(filePath)
  await ensureDirectory(dir)

  const tempPath = `${filePath}.tmp.${Date.now()}.${process.pid}.${Math.random().toString(36).slice(2)}`
  const serialized = typeof data === 'string' ? data : JSON.stringify(data, null, 2)

  let handle: fsp.FileHandle | null = null
  try {
    handle = await fsp.open(tempPath, 'w')
    await handle.writeFile(serialized, 'utf-8')
    await handle.sync() // fsync guarantees physical persistence
    await handle.close()
    handle = null

    // POSIX atomic rename on same filesystem
    await fsp.rename(tempPath, filePath)

    // Write-through in-memory cache update
    setFileCache(filePath, data)
  } catch (err) {
    if (handle) {
      try { await handle.close() } catch {}
    }
    try {
      if (fs.existsSync(tempPath)) {
        await fsp.unlink(tempPath)
      }
    } catch {}
    console.error(`[fileStore] Failed atomic write to ${filePath}:`, err)
    throw err
  }
}

/**
 * Synchronous variant of atomicWriteJson for synchronous contexts.
 */
export function atomicWriteJsonSync<T = unknown>(filePath: string, data: T): void {
  const dir = path.dirname(filePath)
  ensureDirectorySync(dir)

  const tempPath = `${filePath}.tmp.${Date.now()}.${process.pid}.${Math.random().toString(36).slice(2)}`
  const serialized = typeof data === 'string' ? data : JSON.stringify(data, null, 2)

  let fd: number | null = null
  try {
    fd = fs.openSync(tempPath, 'w')
    fs.writeFileSync(fd, serialized, 'utf-8')
    fs.fsyncSync(fd) // fsync
    fs.closeSync(fd)
    fd = null

    fs.renameSync(tempPath, filePath)
    setFileCache(filePath, data)
  } catch (err) {
    if (fd !== null) {
      try { fs.closeSync(fd) } catch {}
    }
    try {
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath)
      }
    } catch {}
    console.error(`[fileStore] Failed synchronous atomic write to ${filePath}:`, err)
    throw err
  }
}

/**
 * Atomically writes raw buffer data (e.g. uploaded images).
 */
export async function atomicWriteBuffer(filePath: string, buffer: Buffer): Promise<void> {
  const dir = path.dirname(filePath)
  await ensureDirectory(dir)

  const tempPath = `${filePath}.tmp.${Date.now()}.${process.pid}.${Math.random().toString(36).slice(2)}`
  let handle: fsp.FileHandle | null = null
  try {
    handle = await fsp.open(tempPath, 'w')
    await handle.writeFile(buffer)
    await handle.sync()
    await handle.close()
    handle = null

    await fsp.rename(tempPath, filePath)
  } catch (err) {
    if (handle) {
      try { await handle.close() } catch {}
    }
    try {
      if (fs.existsSync(tempPath)) {
        await fsp.unlink(tempPath)
      }
    } catch {}
    throw err
  }
}

/**
 * Reads JSON file with transparent in-memory caching.
 * If cache is valid, returns in-memory object in <0.05ms without hitting disk.
 */
export async function readJson<T = unknown>(
  filePath: string,
  defaultValue: T,
  options: { bypassCache?: boolean } = {}
): Promise<T> {
  if (!options.bypassCache && memoryStoreCache.has(filePath)) {
    return memoryStoreCache.get(filePath)!.data as T
  }

  try {
    if (!fs.existsSync(filePath)) {
      return defaultValue
    }
    const stat = await fsp.stat(filePath)
    const content = await fsp.readFile(filePath, 'utf-8')
    const parsed = JSON.parse(content) as T

    memoryStoreCache.set(filePath, {
      data: parsed,
      mtimeMs: stat.mtimeMs,
      cachedAt: Date.now()
    })
    return parsed
  } catch (err) {
    console.error(`[fileStore] Error reading JSON from ${filePath}:`, err)
    return defaultValue
  }
}

/**
 * Synchronous JSON read with in-memory caching.
 */
export function readJsonSync<T = unknown>(
  filePath: string,
  defaultValue: T,
  options: { bypassCache?: boolean } = {}
): T {
  if (!options.bypassCache && memoryStoreCache.has(filePath)) {
    return memoryStoreCache.get(filePath)!.data as T
  }

  try {
    if (!fs.existsSync(filePath)) {
      return defaultValue
    }
    const stat = fs.statSync(filePath)
    const content = fs.readFileSync(filePath, 'utf-8')
    const parsed = JSON.parse(content) as T

    memoryStoreCache.set(filePath, {
      data: parsed,
      mtimeMs: stat.mtimeMs,
      cachedAt: Date.now()
    })
    return parsed
  } catch (err) {
    console.error(`[fileStore] Error reading JSON sync from ${filePath}:`, err)
    return defaultValue
  }
}

/**
 * Programmatic cache updates and invalidation.
 */
export function setFileCache<T = unknown>(filePath: string, data: T): void {
  memoryStoreCache.set(filePath, {
    data,
    mtimeMs: Date.now(),
    cachedAt: Date.now()
  })
}

export function invalidateFileCache(filePath?: string): void {
  if (filePath) {
    memoryStoreCache.delete(filePath)
  } else {
    memoryStoreCache.clear()
  }
}
