import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { knowledgeBases, agents } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { ingestDocument } from '@/lib/ai/rag'
import { extractYoutubeTranscript } from '@/lib/knowledge/youtube'
import { parseFile } from '@/lib/knowledge/file-parser'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const agentId = formData.get('agentId') as string
  const type = formData.get('type') as string
  const name = formData.get('name') as string

  // Verify agent ownership
  const [agent] = await db.select().from(agents)
    .where(and(eq(agents.id, agentId), eq(agents.userId, user.id)))

  if (!agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
  }

  try {
    let title: string
    let content: string
    let sourceUrl: string | null = null

    if (type === 'youtube') {
      const url = formData.get('sourceUrl') as string
      sourceUrl = url
      const result = await extractYoutubeTranscript(url)
      title = result.title
      content = result.content
    } else if (type === 'file') {
      const file = formData.get('file') as File
      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 })
      }
      const buffer = Buffer.from(await file.arrayBuffer())
      const result = await parseFile(buffer, file.name)
      title = result.title
      content = result.content
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    if (!content || content.length < 10) {
      return NextResponse.json({ error: 'Could not extract content from source' }, { status: 422 })
    }

    // Create knowledge base
    const [kb] = await db.insert(knowledgeBases).values({
      agentId,
      name: name || title,
      type,
      sourceUrl,
    }).returning()

    // Ingest document with embeddings
    const doc = await ingestDocument(kb.id, title, content)

    return NextResponse.json({ knowledgeBase: kb, document: doc })
  } catch (err) {
    console.error('[Ingest Error]', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
