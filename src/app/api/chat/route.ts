import { streamText } from 'ai'
import { getModel } from '@/lib/ai/provider-registry'
import { searchSimilarChunks, buildRagContext } from '@/lib/ai/rag'
import { db } from '@/lib/db'
import { agents, conversations, messages } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { messages: chatMessages, agentId, conversationId } = await req.json()

  const [agent] = await db.select().from(agents)
    .where(and(eq(agents.id, agentId), eq(agents.userId, user.id)))

  if (!agent) {
    return new Response('Agent not found', { status: 404 })
  }

  // Ensure conversation exists
  let convId = conversationId
  if (!convId) {
    const firstUserMessage = chatMessages.find((m: { role: string }) => m.role === 'user')
    const title = firstUserMessage?.content?.slice(0, 100) ?? 'Nova conversa'

    const [conv] = await db.insert(conversations).values({
      agentId: agent.id,
      userId: user.id,
      title,
    }).returning()
    convId = conv.id
  }

  // Save user message
  const lastMessage = chatMessages[chatMessages.length - 1]
  if (lastMessage?.role === 'user') {
    await db.insert(messages).values({
      conversationId: convId,
      role: 'user',
      content: lastMessage.content,
    })
  }

  // RAG: search for relevant context
  const lastUserMessage = chatMessages[chatMessages.length - 1]?.content ?? ''
  console.log('[RAG] Searching for:', lastUserMessage.slice(0, 100))
  const relevantChunks = await searchSimilarChunks(agent.id, lastUserMessage).catch((err) => {
    console.log('[RAG] Search error:', err.message)
    return []
  })
  console.log('[RAG] Found chunks:', relevantChunks.length, relevantChunks.map(c => ({ score: c.score.toFixed(3), preview: c.content.slice(0, 50) })))
  const ragContext = buildRagContext(relevantChunks)
  console.log('[RAG] Context injected:', ragContext ? `${ragContext.length} chars` : 'none')

  const model = getModel(agent.provider, agent.model)

  const result = streamText({
    model,
    system: agent.systemPrompt + ragContext,
    messages: chatMessages,
    temperature: agent.temperature,
    maxTokens: agent.maxTokens,
    onFinish: async ({ text }) => {
      await db.insert(messages).values({
        conversationId: convId,
        role: 'assistant',
        content: text,
      })
      await db.update(conversations)
        .set({ updatedAt: new Date() })
        .where(eq(conversations.id, convId))
    },
  })

  return result.toDataStreamResponse({
    headers: { 'X-Conversation-Id': convId },
  })
}
