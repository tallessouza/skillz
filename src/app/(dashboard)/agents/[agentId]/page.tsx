import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MessageSquare, Database, Trash2 } from 'lucide-react'
import { AgentForm } from '@/components/agents/agent-form'
import { getAgent, updateAgent, deleteAgent } from '../actions'

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ agentId: string }>
}) {
  const { agentId } = await params
  const agent = await getAgent(agentId)

  if (!agent) {
    notFound()
  }

  const updateAction = updateAgent.bind(null, agentId)
  const deleteAction = deleteAgent.bind(null, agentId)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{agent.name}</h2>
        <div className="flex items-center gap-2">
          <Link
            href={`/agents/${agentId}/chat`}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <MessageSquare className="h-4 w-4" />
            Chat
          </Link>
          <Link
            href={`/agents/${agentId}/knowledge`}
            className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            <Database className="h-4 w-4" />
            Knowledge
          </Link>
          <form action={deleteAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </button>
          </form>
        </div>
      </div>

      <AgentForm agent={agent} action={updateAction} />
    </div>
  )
}
