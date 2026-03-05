import { db } from '@/lib/db'
import { conversations, agents } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { MessageSquare } from 'lucide-react'

export default async function ConversationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const convs = await db.select({
    id: conversations.id,
    title: conversations.title,
    updatedAt: conversations.updatedAt,
    agentName: agents.name,
    agentId: agents.id,
  })
    .from(conversations)
    .innerJoin(agents, eq(conversations.agentId, agents.id))
    .where(eq(conversations.userId, user.id))
    .orderBy(desc(conversations.updatedAt))

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Conversas</h2>

      {convs.length === 0 ? (
        <p className="text-muted-foreground">Nenhuma conversa ainda. Comece um chat com um agente.</p>
      ) : (
        <div className="space-y-2">
          {convs.map((conv) => (
            <Link
              key={conv.id}
              href={`/agents/${conv.agentId}/chat`}
              className="flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors"
            >
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{conv.title}</p>
                <p className="text-xs text-muted-foreground">
                  {conv.agentName} • {conv.updatedAt.toLocaleDateString('pt-BR')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
