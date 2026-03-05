import Link from 'next/link'
import { Bot, MessageSquare, Database } from 'lucide-react'
import type { InferSelectModel } from 'drizzle-orm'
import type { agents } from '@/lib/db/schema'

type Agent = InferSelectModel<typeof agents>

export function AgentCard({ agent }: { agent: Agent }) {
  return (
    <Link
      href={`/agents/${agent.id}`}
      className="block rounded-lg border p-4 hover:bg-accent transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-md bg-primary/10 p-2">
          <Bot className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{agent.name}</h3>
          {agent.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {agent.description}
            </p>
          )}
          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            <span>{agent.provider}/{agent.model}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
