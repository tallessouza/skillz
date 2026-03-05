'use server'

import { db } from '@/lib/db'
import { agents, profiles } from '@/lib/db/schema'
import { createClient } from '@/lib/supabase/server'
import { eq, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const agentSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  systemPrompt: z.string().min(1).max(10000),
  provider: z.enum(['openai', 'anthropic', 'google']),
  model: z.string().min(1),
  temperature: z.coerce.number().min(0).max(2),
  maxTokens: z.coerce.number().int().min(1).max(128000),
})

async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Ensure profile exists
  const existing = await db.select().from(profiles).where(eq(profiles.id, user.id))
  if (existing.length === 0) {
    await db.insert(profiles).values({
      id: user.id,
      email: user.email!,
      name: user.email?.split('@')[0] ?? null,
    })
  }

  return user
}

export async function createAgent(formData: FormData) {
  const user = await getUser()

  const data = agentSchema.parse({
    name: formData.get('name'),
    description: formData.get('description'),
    systemPrompt: formData.get('systemPrompt'),
    provider: formData.get('provider'),
    model: formData.get('model'),
    temperature: formData.get('temperature'),
    maxTokens: formData.get('maxTokens'),
  })

  const [agent] = await db.insert(agents).values({
    ...data,
    userId: user.id,
  }).returning()

  redirect(`/agents/${agent.id}`)
}

export async function updateAgent(agentId: string, formData: FormData) {
  const user = await getUser()

  const data = agentSchema.parse({
    name: formData.get('name'),
    description: formData.get('description'),
    systemPrompt: formData.get('systemPrompt'),
    provider: formData.get('provider'),
    model: formData.get('model'),
    temperature: formData.get('temperature'),
    maxTokens: formData.get('maxTokens'),
  })

  await db.update(agents)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(agents.id, agentId), eq(agents.userId, user.id)))

  revalidatePath(`/agents/${agentId}`)
  revalidatePath('/agents')
}

export async function deleteAgent(agentId: string) {
  const user = await getUser()

  await db.delete(agents)
    .where(and(eq(agents.id, agentId), eq(agents.userId, user.id)))

  revalidatePath('/agents')
  redirect('/agents')
}

export async function getAgents() {
  const user = await getUser()
  return db.select().from(agents).where(eq(agents.userId, user.id))
}

export async function getAgent(agentId: string) {
  const user = await getUser()
  const [agent] = await db.select().from(agents)
    .where(and(eq(agents.id, agentId), eq(agents.userId, user.id)))
  return agent ?? null
}
