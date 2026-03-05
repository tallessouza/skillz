'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Youtube, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

type SourceType = 'youtube' | 'file'

export function KnowledgeForm({ agentId }: { agentId: string }) {
  const router = useRouter()
  const [type, setType] = useState<SourceType>('youtube')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    formData.set('agentId', agentId)
    formData.set('type', type)

    try {
      const res = await fetch('/api/knowledge/ingest', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao processar')
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setType('youtube')}
          className={cn(
            'flex items-center gap-2 rounded-md border px-3 py-2 text-sm',
            type === 'youtube' && 'bg-primary text-primary-foreground',
          )}
        >
          <Youtube className="h-4 w-4" />
          YouTube
        </button>
        <button
          type="button"
          onClick={() => setType('file')}
          className={cn(
            'flex items-center gap-2 rounded-md border px-3 py-2 text-sm',
            type === 'file' && 'bg-primary text-primary-foreground',
          )}
        >
          <FileText className="h-4 w-4" />
          Arquivo
        </button>
      </div>

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">Nome</label>
        <input
          id="name"
          name="name"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          placeholder="Nome da fonte"
        />
      </div>

      {type === 'youtube' && (
        <div className="space-y-2">
          <label htmlFor="sourceUrl" className="text-sm font-medium">URL do YouTube</label>
          <input
            id="sourceUrl"
            name="sourceUrl"
            type="url"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="https://youtube.com/watch?v=..."
            required
          />
        </div>
      )}

      {type === 'file' && (
        <div className="space-y-2">
          <label htmlFor="file" className="text-sm font-medium">Arquivo (PDF, TXT, MD)</label>
          <input
            id="file"
            name="file"
            type="file"
            accept=".pdf,.txt,.md,.csv"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
          />
        </div>
      )}

      {error && (
        <div className="text-red-600 text-sm p-3 rounded-md bg-red-50">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        <Upload className="h-4 w-4" />
        {loading ? 'Processando...' : 'Adicionar'}
      </button>
    </form>
  )
}
