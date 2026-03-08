---
name: rs-node-js-2023-busca-academias
description: "Enforces search use case patterns with pagination when building Node.js APIs with SOLID principles. Use when user asks to 'create a search', 'implement search functionality', 'add pagination', 'search use case', or 'list with filter'. Applies rules: generic query parameter over specific field names, repository method naming without field specificity, slice-based pagination with 20-item pages, and comprehensive pagination tests. Make sure to use this skill whenever implementing search/filter/list features in a SOLID Node.js architecture. Not for database query optimization, full-text search engines, or frontend search UI."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: solid-use-cases
  tags: [search, pagination, use-case, repository, solid, query, filtering]
---

# Caso de Uso de Busca com Paginacao

> Ao criar funcionalidades de busca, use parametros genericos e paginacao slice-based, testando sempre o caso basico e o paginado.

## Rules

1. **Use `query` em vez de nomes de campo especificos** — `query` nao `title`, porque o mesmo parametro pode buscar em titulo, descricao ou outros campos no futuro sem quebrar a interface
2. **Nomeie metodos do repositorio sem especificar o campo** — `searchMany` nao `searchManyByTitle`, porque a implementacao pode evoluir para buscar em multiplos campos
3. **Pagine com slices de 20 itens** — `slice((page - 1) * 20, page * 20)`, porque 20 e o padrao consistente do projeto e o slice e determinístico no in-memory repository
4. **Receba page como parametro obrigatorio** — nunca retorne resultados sem paginacao, porque listas sem limite sao um risco de performance
5. **Teste sempre dois cenarios** — busca basica (filtra corretamente) e busca paginada (retorna apenas os itens da pagina correta)

## How to write

### Use Case de busca

```typescript
interface SearchGymsUseCaseRequest {
  query: string
  page: number
}

interface SearchGymsUseCaseResponse {
  gyms: Gym[]
}

export class SearchGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({ query, page }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page)
    return { gyms }
  }
}
```

### Metodo do repositorio (interface)

```typescript
export interface GymsRepository {
  searchMany(query: string, page: number): Promise<Gym[]>
}
```

### Implementacao in-memory

```typescript
async searchMany(query: string, page: number) {
  return this.items
    .filter((item) => item.title.includes(query))
    .slice((page - 1) * 20, page * 20)
}
```

## Example

**Before (parametro especifico e sem paginacao):**
```typescript
class SearchGymsUseCase {
  async execute({ title }: { title: string }) {
    const gyms = await this.gymsRepository.findByTitle(title)
    return { gyms }
  }
}
```

**After (com query generico e paginacao):**
```typescript
class SearchGymsUseCase {
  async execute({ query, page }: { query: string; page: number }) {
    const gyms = await this.gymsRepository.searchMany(query, page)
    return { gyms }
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Busca que hoje e so por titulo | Use `query` generico mesmo assim |
| Metodo retorna lista filtrada | Sempre adicione paginacao |
| Teste de busca | Crie um teste basico + um teste de paginacao com 22 itens |
| Repositorio in-memory | Use `filter` + `slice` para simular paginacao |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `searchManyByTitle(title)` | `searchMany(query, page)` |
| `findByTitle(title: string)` | `searchMany(query: string, page: number)` |
| `return this.items.filter(...)` (sem slice) | `return this.items.filter(...).slice((page-1)*20, page*20)` |
| Testar busca sem testar paginacao | Sempre testar ambos cenarios |

## Troubleshooting

### Use case lanca erro inesperado
**Symptom:** Teste falha com erro nao tratado no use case
**Cause:** Entidade dependente nao foi criada no repositorio in-memory antes de executar
**Fix:** Pre-seed o repositorio com todas as entidades necessarias usando factories antes de chamar `sut.execute()`

### Comparacao de ID falha silenciosamente
**Symptom:** `authorId !== entity.authorId` sempre retorna true mesmo com IDs corretos
**Cause:** `entity.authorId` e um UniqueEntityID, nao uma string
**Fix:** Use `.toString()` na comparacao: `entity.authorId.toString() !== authorId`

## Deep reference library

- [deep-explanation.md](mdc:data/skills/node-js-2023/rs-node-js-2023-caso-de-uso-de-busca-de-academias/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](mdc:data/skills/node-js-2023/rs-node-js-2023-caso-de-uso-de-busca-de-academias/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
