import { embed } from 'ai'
import { openai } from '@ai-sdk/openai'
import { db } from '@/lib/db'
import { documentChunks, documents, knowledgeBases } from '@/lib/db/schema'
import { eq, sql, and, inArray } from 'drizzle-orm'
import { chunkText, estimateTokenCount } from '@/lib/knowledge/chunker'

const embeddingModel = openai.embedding('text-embedding-3-small')

export async function generateEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: embeddingModel,
    value: text,
  })
  return embedding
}

export async function ingestDocument(
  knowledgeBaseId: string,
  title: string,
  content: string,
) {
  const tokenCount = estimateTokenCount(content)

  const [doc] = await db.insert(documents).values({
    knowledgeBaseId,
    title,
    content,
    tokenCount,
  }).returning()

  const chunks = chunkText(content)

  for (let i = 0; i < chunks.length; i++) {
    const embedding = await generateEmbedding(chunks[i])

    await db.insert(documentChunks).values({
      documentId: doc.id,
      content: chunks[i],
      embedding,
      chunkIndex: i,
    })
  }

  return doc
}

export async function searchSimilarChunks(
  agentId: string,
  query: string,
  topK = 5,
): Promise<{ content: string; score: number }[]> {
  const queryEmbedding = await generateEmbedding(query)

  const kbs = await db.select({ id: knowledgeBases.id })
    .from(knowledgeBases)
    .where(eq(knowledgeBases.agentId, agentId))

  if (kbs.length === 0) return []

  const kbIds = kbs.map((kb) => kb.id)

  const results = await db
    .select({
      content: documentChunks.content,
      score: sql<number>`1 - (${documentChunks.embedding} <=> ${JSON.stringify(queryEmbedding)}::vector)`,
    })
    .from(documentChunks)
    .innerJoin(documents, eq(documentChunks.documentId, documents.id))
    .where(inArray(documents.knowledgeBaseId, kbIds))
    .orderBy(sql`${documentChunks.embedding} <=> ${JSON.stringify(queryEmbedding)}::vector`)
    .limit(topK)

  return results
}

export function buildRagContext(chunks: { content: string; score: number }[]): string {
  if (chunks.length === 0) return ''

  const context = chunks
    .filter((c) => c.score > 0.3)
    .map((c) => c.content)
    .join('\n\n---\n\n')

  if (!context) return ''

  return `\n\nRelevant context from knowledge base:\n\n${context}`
}
