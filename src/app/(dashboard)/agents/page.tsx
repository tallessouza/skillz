import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getAgents } from './actions'
import { AgentCard } from '@/components/agents/agent-card'

export default async function AgentsPage() {
  const agentsList = await getAgents()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Agentes</h2>
          <p className="text-muted-foreground mt-1">
            Crie e gerencie seus agentes de IA.
          </p>
        </div>
        <Link
          href="/agents/new"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Novo agente
        </Link>
      </div>

      {agentsList.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>Nenhum agente criado ainda.</p>
          <p className="text-sm mt-1">Clique em &quot;Novo agente&quot; para começar.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agentsList.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}
    </div>
  )
}
