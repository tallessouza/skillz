const CHUNK_SIZE = 500 // approximate tokens
const CHUNK_OVERLAP = 50

export function chunkText(text: string, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP): string[] {
  const words = text.split(/\s+/)
  const chunks: string[] = []

  let i = 0
  while (i < words.length) {
    const chunk = words.slice(i, i + chunkSize).join(' ')
    if (chunk.trim()) {
      chunks.push(chunk.trim())
    }
    i += chunkSize - overlap
  }

  return chunks
}

export function estimateTokenCount(text: string): number {
  return Math.ceil(text.split(/\s+/).length * 1.3)
}
