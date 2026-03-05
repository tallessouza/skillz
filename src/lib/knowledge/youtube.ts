import { execFile } from 'child_process'
import { promisify } from 'util'
import { readFile, unlink } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'

const exec = promisify(execFile)

export async function extractYoutubeTranscript(url: string): Promise<{ title: string; content: string }> {
  const videoId = extractVideoId(url)
  if (!videoId) {
    throw new Error('Invalid YouTube URL')
  }

  const outPath = join(tmpdir(), `yt-${videoId}`)

  // Extract subtitles using yt-dlp (ignore exit code — partial success is OK)
  let vttContent = ''

  for (const lang of ['pt', 'en']) {
    try {
      await exec('yt-dlp', [
        '--write-auto-sub',
        '--sub-lang', lang,
        '--sub-format', 'vtt',
        '--skip-download',
        '-o', outPath,
        url,
      ], { timeout: 30000 })
    } catch {
      // yt-dlp may exit non-zero but still write the file
    }

    const vttPath = `${outPath}.${lang}.vtt`
    try {
      vttContent = await readFile(vttPath, 'utf-8')
      await unlink(vttPath).catch(() => {})
      if (vttContent.length > 100) break
    } catch {
      continue
    }
  }

  if (!vttContent) {
    throw new Error('No subtitles found for this video')
  }

  const content = parseVtt(vttContent)

  // Get video title
  let title = `YouTube: ${videoId}`
  try {
    const { stdout } = await exec('yt-dlp', [
      '--print', '%(title)s',
      '--skip-download',
      url,
    ], { timeout: 15000 })
    title = stdout.trim() || title
  } catch {
    // keep default title
  }

  return { title, content }
}

function parseVtt(vtt: string): string {
  const lines = vtt.split('\n')
  const textLines: string[] = []
  const seen = new Set<string>()

  for (const line of lines) {
    // Skip headers, timestamps, and empty lines
    if (
      line.startsWith('WEBVTT') ||
      line.startsWith('Kind:') ||
      line.startsWith('Language:') ||
      line.includes('-->') ||
      line.trim() === '' ||
      line.startsWith('NOTE')
    ) {
      continue
    }

    // Remove VTT tags like <00:00:04.480><c> etc
    const clean = line
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim()

    if (clean && !seen.has(clean)) {
      seen.add(clean)
      textLines.push(clean)
    }
  }

  return textLines.join(' ')
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\s]+)/,
    /(?:youtu\.be\/)([^?\s]+)/,
    /(?:youtube\.com\/embed\/)([^?\s]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }

  return null
}
