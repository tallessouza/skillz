import pdf from 'pdf-parse'

export async function parseFile(buffer: Buffer, filename: string): Promise<{ title: string; content: string }> {
  const ext = filename.split('.').pop()?.toLowerCase()

  switch (ext) {
    case 'pdf':
      return parsePdf(buffer, filename)
    case 'txt':
    case 'md':
    case 'csv':
      return {
        title: filename,
        content: buffer.toString('utf-8'),
      }
    default:
      throw new Error(`Unsupported file type: ${ext}`)
  }
}

async function parsePdf(buffer: Buffer, filename: string): Promise<{ title: string; content: string }> {
  const data = await pdf(buffer)
  return {
    title: filename,
    content: data.text,
  }
}
