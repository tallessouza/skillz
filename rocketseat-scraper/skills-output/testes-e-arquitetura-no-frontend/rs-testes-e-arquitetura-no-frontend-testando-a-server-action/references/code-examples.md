# Code Examples: Testando Server Actions

## Estrutura de arquivos

```
src/
  app/
    actions/
      prompt-actions.ts        # Server action real
tests/
  app/
    actions/
      prompt-actions.spec.ts   # Teste espelhando a estrutura
```

## Arquivo de teste completo

```typescript
// tests/app/actions/prompt-actions.spec.ts

import { searchPromptAction } from '@/app/actions/prompt-actions'

const mockedSearchExecute = jest.fn()

// Mock do Prisma — evita erro de importacao transitiva
jest.mock('@/lib/prisma', () => ({
  prisma: {}
}))

// Mock do use case — controla o comportamento do execute
jest.mock('@/core/use-cases/search-prompt-use-case', () => ({
  SearchPromptUseCase: jest.fn().mockImplementation(() => ({
    execute: mockedSearchExecute
  }))
}))

describe('Server Actions', () => {
  describe('Search', () => {
    beforeEach(() => {
      mockedSearchExecute.mockReset()
    })

    it('deve retornar sucesso com termo de busca nao vazio', async () => {
      const input = [{ id: '1', title: 'AI title', content: 'content' }]
      mockedSearchExecute.mockResolvedValue(input)

      const formData = new FormData()
      formData.append('q', 'AI')

      const result = await searchPromptAction({ success: true }, formData)

      expect(result.success).toBeDefined()
      expect(result.prompts).toEqual(input)
    })

    it('deve retornar sucesso e listar todos os prompts quando termo vazio', async () => {
      const input = [
        { id: '1', title: 'first', content: 'content01' },
        { id: '2', title: 'second', content: 'content02' }
      ]
      mockedSearchExecute.mockResolvedValue(input)

      const formData = new FormData()
      formData.append('q', '')

      const result = await searchPromptAction({ success: true }, formData)

      expect(result.success).toBeDefined()
      expect(result.prompts).toEqual(input)
    })

    it('deve retornar erro generico quando falhar ao buscar', async () => {
      const error = new Error('any')
      mockedSearchExecute.mockRejectedValue(error)

      const formData = new FormData()
      formData.append('q', 'test')

      const result = await searchPromptAction({ success: true }, formData)

      expect(result.success).toBe(false)
      expect(result.prompts).toBeUndefined()
      expect(result.message).toBe('Error on search prompts')
    })

    it('deve aparar espacos do termo antes de executar', async () => {
      const input = [{ id: '1', title: 'title01', content: 'content01' }]
      mockedSearchExecute.mockResolvedValue(input)

      const formData = new FormData()
      formData.append('q', '  title01  ')

      const result = await searchPromptAction({ success: true }, formData)

      expect(result.success).toBe(true)
      expect(result.prompts).toEqual(input)
      expect(mockedSearchExecute).toHaveBeenCalledWith('title01')
    })

    it('deve tratar ausencia da query como termo vazio', async () => {
      const input = [
        { id: '1', title: 'first title', content: 'content01' },
        { id: '2', title: 'second title', content: 'content02' }
      ]
      mockedSearchExecute.mockResolvedValue(input)

      const formData = new FormData()
      // Nao faz append — simula ausencia do campo q

      const result = await searchPromptAction({ success: true }, formData)

      expect(result.success).toBe(true)
      expect(result.prompts).toEqual(input)
      expect(mockedSearchExecute).toHaveBeenCalledWith('')
    })
  })
})
```

## Server action sendo testada (referencia)

```typescript
// src/app/actions/prompt-actions.ts
'use server'

import { SearchPromptUseCase } from '@/core/use-cases/search-prompt-use-case'

export async function searchPromptAction(
  prevState: { success: boolean },
  formData: FormData
) {
  try {
    const query = (formData.get('q') as string || '').trim()
    const useCase = new SearchPromptUseCase()
    const prompts = await useCase.execute(query)

    return { success: true, prompts }
  } catch {
    return {
      success: false,
      prompts: undefined,
      message: 'Error on search prompts'
    }
  }
}
```

## Variacao: testando outra server action no mesmo arquivo

```typescript
describe('Server Actions', () => {
  describe('Search', () => {
    // ... testes de search acima
  })

  describe('Create', () => {
    beforeEach(() => {
      mockedCreateExecute.mockReset()
    })

    it('deve criar prompt com sucesso', async () => {
      const created = { id: '1', title: 'New', content: 'Content' }
      mockedCreateExecute.mockResolvedValue(created)

      const formData = new FormData()
      formData.append('title', 'New')
      formData.append('content', 'Content')

      const result = await createPromptAction({ success: true }, formData)

      expect(result.success).toBe(true)
      expect(result.prompt).toEqual(created)
    })
  })
})
```

## Comando para rodar os testes

```bash
npx jest --watch
# ou apenas o arquivo especifico
npx jest tests/app/actions/prompt-actions.spec.ts
```