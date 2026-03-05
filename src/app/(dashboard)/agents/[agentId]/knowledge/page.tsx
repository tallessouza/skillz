import { notFound } from 'next/navigation'
import { getAgent } from '../../actions'
import { db } from '@/lib/db'
import { knowledgeBases, documents } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { KnowledgeForm } from '@/components/knowledge/kb-form'
import { SourceCard } from '@/components/knowledge/source-card'

export default async function KnowledgePage({
  params,
}: {
  params: Promise<{ agentId: string }>
}) {
  const { agentId } = await params
  const agent = await getAgent(agentId)

  if (!agent) {
    notFound()
  }

  const kbs = await db.select().from(knowledgeBases)
    .where(eq(knowledgeBases.agentId, agentId))

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Knowledge Base — {agent.name}</h2>
        <p className="text-muted-foreground mt-1">
          Adicione fontes de conhecimento para o agente.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="font-medium mb-4">Adicionar fonte</h3>
          <KnowledgeForm agentId={agentId} />
        </div>

        <div>
          <h3 className="font-medium mb-4">Fontes ({kbs.length})</h3>
          {kbs.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma fonte adicionada.</p>
          ) : (
            <div className="space-y-3">
              {kbs.map((kb) => (
                <SourceCard key={kb.id} kb={kb} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
