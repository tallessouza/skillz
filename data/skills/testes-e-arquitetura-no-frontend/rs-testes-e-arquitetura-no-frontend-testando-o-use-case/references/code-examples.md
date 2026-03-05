# Code Examples: Testando Use Cases com Fakes e Spies

## Estrutura completa do arquivo de teste

```typescript
// src/core/application/prompts/search-prompt-use-case.spec.ts

import { SearchPromptUseCase } from './search-prompt-use-case'
import { PromptRepository } from './prompt-repository'
import { Prompt } from './prompt'

const input: Prompt[] = [
  {
    id: '1',
    title: 'title01',
    content: 'content01',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'title02',
    content: 'content02',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const repository: PromptRepository = {
  findMany: async () => input,
  searchMany: async (term: string) =>
    input.filter(
      (prompt) =>
        prompt.title.toLowerCase().includes(term.toLowerCase()) ||
        prompt.content.toLowerCase().includes(term.toLowerCase())
    ),
}

describe('SearchPromptUseCase', () => {
  it('deve retornar todos os prompts quando o termo for vazio', async () => {
    const useCase = new SearchPromptUseCase(repository)
    const results = await useCase.execute('')
    expect(results).toHaveLength(2)
  })

  it('deve filtrar a lista de prompts pelo termo pesquisado', async () => {
    const useCase = new SearchPromptUseCase(repository)
    const query = 'title01'
    const results = await useCase.execute(query)
    expect(results).toHaveLength(1)
    expect(results[0].id).toBe('1')
  })

  it('deve aplicar trim em termo com espacos em branco e retornar toda a lista', async () => {
    const findMany = jest.fn().mockResolvedValue(input)
    const searchMany = jest.fn().mockResolvedValue([])

    const repositoryWithSpies: PromptRepository = {
      ...repository,
      findMany,
      searchMany,
    }

    const useCase = new SearchPromptUseCase(repositoryWithSpies)
    const query = '   '
    const results = await useCase.execute(query)

    expect(results).toHaveLength(2)
    expect(findMany).toHaveBeenCalledTimes(1)
    expect(searchMany).not.toHaveBeenCalled()
  })

  it('deve buscar termo com espacos em branco tratando com trim', async () => {
    const firstElement = input.slice(0, 1)

    const findMany = jest.fn().mockResolvedValue(input)
    const searchMany = jest.fn().mockResolvedValue(firstElement)

    const repositoryWithSpies: PromptRepository = {
      ...repository,
      findMany,
      searchMany,
    }

    const useCase = new SearchPromptUseCase(repositoryWithSpies)
    const query = '  title02  '
    const results = await useCase.execute(query)

    expect(results).toMatchObject(firstElement)
    expect(searchMany).toHaveBeenCalledWith(query.trim())
    expect(findMany).not.toHaveBeenCalled()
  })

  it('deve lidar com termo undefined e retornar lista completa', async () => {
    const findMany = jest.fn().mockResolvedValue(input)
    const searchMany = jest.fn().mockResolvedValue([])

    const repositoryWithSpies: PromptRepository = {
      ...repository,
      findMany,
      searchMany,
    }

    const useCase = new SearchPromptUseCase(repositoryWithSpies)
    const query = undefined
    const results = await useCase.execute(query as unknown as string)

    expect(results).toMatchObject(input)
    expect(findMany).toHaveBeenCalledTimes(1)
    expect(searchMany).not.toHaveBeenCalled()
  })
})
```

## Anatomia de cada teste

### Teste 1: Termo vazio — usa fake puro

```typescript
// Nenhum spy necessario — apenas valida o resultado
const useCase = new SearchPromptUseCase(repository) // fake
const results = await useCase.execute('')
expect(results).toHaveLength(2)

// Validacao de falso positivo: comentar um item do input
// Se o teste continuar passando com 1 item, esta quebrado
```

### Teste 2: Filtragem por termo — usa fake com logica real

```typescript
// O fake de searchMany tem logica de filter real
const results = await useCase.execute('title01')
expect(results).toHaveLength(1)
expect(results[0].id).toBe('1')

// Validacao: mudar para 'title03' (inexistente) deve retornar 0
```

### Teste 3: Trim em espacos — usa spies para verificar fluxo

```typescript
// Objetivo: confirmar que o use case chama findMany (nao searchMany)
// quando o termo, apos trim, fica vazio
const findMany = jest.fn().mockResolvedValue(input)
const searchMany = jest.fn().mockResolvedValue([])

await useCase.execute('   ') // espacos que viram string vazia apos trim

expect(findMany).toHaveBeenCalledTimes(1)    // DEVE ser chamado
expect(searchMany).not.toHaveBeenCalled()     // NAO deve ser chamado
```

### Teste 4: Trim com termo valido — verifica argumento do spy

```typescript
// Objetivo: confirmar que searchMany recebe o termo JA com trim aplicado
const query = '  title02  '
await useCase.execute(query)

expect(searchMany).toHaveBeenCalledWith('title02') // query.trim()
expect(findMany).not.toHaveBeenCalled()
```

### Teste 5: Undefined — cast de tipo para testar runtime

```typescript
// TypeScript nao permite undefined, mas runtime pode receber
const query = undefined
const results = await useCase.execute(query as unknown as string)

// Use case deve tratar undefined como vazio e chamar findMany
expect(findMany).toHaveBeenCalledTimes(1)
expect(searchMany).not.toHaveBeenCalled()
```

## Comparacao: Fake vs Mock vs Stub

```typescript
// FAKE — objeto com logica simplificada (PREFERIDO)
const fakeRepo: PromptRepository = {
  findMany: async () => data,
  searchMany: async (term) => data.filter(/* logica real simplificada */),
}

// MOCK — jest.fn() com verificacao de chamadas
const mockFindMany = jest.fn().mockResolvedValue(data)
// Depois: expect(mockFindMany).toHaveBeenCalledWith(args)

// STUB — retorna valor fixo sem logica
const stubRepo: PromptRepository = {
  findMany: async () => [],        // sempre retorna vazio
  searchMany: async () => [data[0]], // sempre retorna o primeiro
}
```

## Comando para rodar testes em watch mode

```bash
pnpm test --watch
```