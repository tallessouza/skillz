import { createOpenAI } from '@ai-sdk/openai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import type { LanguageModelV1 } from 'ai'

const providers = {
  openai: () => createOpenAI({ apiKey: process.env.OPENAI_API_KEY }),
  anthropic: () => createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY }),
  google: () => createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY }),
}

export function getModel(provider: string, model: string): LanguageModelV1 {
  const createProvider = providers[provider as keyof typeof providers]
  if (!createProvider) {
    throw new Error(`Unknown provider: ${provider}`)
  }
  return createProvider()(model) as LanguageModelV1
}
