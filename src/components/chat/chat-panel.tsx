'use client'

import { useChat } from 'ai/react'
import { useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { MessageBubble } from './message-bubble'

export function ChatPanel({ agentId }: { agentId: string }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: { agentId },
  })

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages])

  return (
    <>
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            <p>Envie uma mensagem para começar.</p>
          </div>
        )}
        {messages.map((m) => (
          <MessageBubble key={m.id} role={m.role} content={m.content} />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-4 border-t">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Digite sua mensagem..."
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="rounded-md bg-primary p-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </>
  )
}
