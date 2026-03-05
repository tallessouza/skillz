import { AgentForm } from '@/components/agents/agent-form'
import { createAgent } from '../actions'

export default function NewAgentPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Novo agente</h2>
      <AgentForm action={createAgent} />
    </div>
  )
}
