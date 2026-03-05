import { notFound } from 'next/navigation'
import { getAgent } from '../../actions'
import { ChatPanel } from '@/components/chat/chat-panel'

export default async function ChatPage({
  params,
}: {
  params: Promise<{ agentId: string }>
}) {
  const { agentId } = await params
  const agent = await getAgent(agentId)

  if (!agent) {
    notFound()
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)]">
      <div className="border-b pb-3 mb-4">
        <h2 className="text-lg font-bold">{agent.name}</h2>
        <p className="text-sm text-muted-foreground">{agent.provider}/{agent.model}</p>
      </div>
      <ChatPanel agentId={agent.id} />
    </div>
  )
}
