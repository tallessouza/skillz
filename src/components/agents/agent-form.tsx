'use client'

import { useRef } from 'react'
import type { InferSelectModel } from 'drizzle-orm'
import type { agents } from '@/lib/db/schema'

type Agent = InferSelectModel<typeof agents>

const MODELS: Record<string, { label: string; models: { value: string; label: string }[] }> = {
  openai: {
    label: 'OpenAI',
    models: [
      { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
      { value: 'gpt-4o', label: 'GPT-4o' },
      { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    ],
  },
  anthropic: {
    label: 'Anthropic',
    models: [
      { value: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6' },
      { value: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5' },
      { value: 'claude-opus-4-6', label: 'Claude Opus 4.6' },
    ],
  },
  google: {
    label: 'Google',
    models: [
      { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
      { value: 'gemini-2.0-pro', label: 'Gemini 2.0 Pro' },
    ],
  },
}

interface AgentFormProps {
  agent?: Agent | null
  action: (formData: FormData) => Promise<void>
}

export function AgentForm({ agent, action }: AgentFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const defaultProvider = agent?.provider ?? 'openai'

  return (
    <form ref={formRef} action={action} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">Nome</label>
        <input
          id="name"
          name="name"
          defaultValue={agent?.name}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">Descrição</label>
        <input
          id="description"
          name="description"
          defaultValue={agent?.description ?? ''}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="systemPrompt" className="text-sm font-medium">System Prompt</label>
        <textarea
          id="systemPrompt"
          name="systemPrompt"
          defaultValue={agent?.systemPrompt}
          rows={6}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="provider" className="text-sm font-medium">Provider</label>
          <select
            id="provider"
            name="provider"
            defaultValue={defaultProvider}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {Object.entries(MODELS).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="model" className="text-sm font-medium">Modelo</label>
          <select
            id="model"
            name="model"
            defaultValue={agent?.model ?? 'gpt-4o-mini'}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {Object.entries(MODELS).flatMap(([, { models }]) =>
              models.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              )),
            )}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="temperature" className="text-sm font-medium">Temperatura</label>
          <input
            id="temperature"
            name="temperature"
            type="number"
            step="0.1"
            min="0"
            max="2"
            defaultValue={agent?.temperature ?? 0.7}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="maxTokens" className="text-sm font-medium">Max Tokens</label>
          <input
            id="maxTokens"
            name="maxTokens"
            type="number"
            min="1"
            max="128000"
            defaultValue={agent?.maxTokens ?? 2048}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        {agent ? 'Salvar' : 'Criar agente'}
      </button>
    </form>
  )
}
