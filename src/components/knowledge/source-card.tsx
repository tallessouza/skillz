import { Youtube, FileText, Table } from 'lucide-react'
import type { InferSelectModel } from 'drizzle-orm'
import type { knowledgeBases } from '@/lib/db/schema'

type KnowledgeBase = InferSelectModel<typeof knowledgeBases>

const typeIcons: Record<string, typeof Youtube> = {
  youtube: Youtube,
  file: FileText,
  sheets: Table,
}

export function SourceCard({ kb }: { kb: KnowledgeBase }) {
  const Icon = typeIcons[kb.type] ?? FileText

  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <div className="rounded-md bg-muted p-2">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{kb.name}</p>
        <p className="text-xs text-muted-foreground">
          {kb.type} • {kb.createdAt.toLocaleDateString('pt-BR')}
        </p>
      </div>
    </div>
  )
}
