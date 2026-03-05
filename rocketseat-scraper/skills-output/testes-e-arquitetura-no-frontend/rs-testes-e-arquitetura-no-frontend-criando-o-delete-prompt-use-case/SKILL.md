---
name: rs-testes-arq-fe-delete-use-case
description: "Enforces clean architecture delete use case pattern when writing TypeScript backend code. Use when user asks to 'create a delete use case', 'implement delete functionality', 'add remove feature', or 'write use case with repository pattern'. Applies existence check before deletion, repository interface segregation, and comprehensive test coverage with mock factories. Make sure to use this skill whenever implementing delete operations in clean architecture projects. Not for UI components, API routes, or database migration scripts."
---

# Delete Use Case Pattern

> Toda operacao de delecao verifica existencia antes de executar, usa repository interface, e tem cobertura completa de testes.

## Rules

1. **Sempre verifique existencia antes de deletar** — `findById` antes de `delete`, porque deletar algo inexistente deve lancar erro explicito, nao falhar silenciosamente
2. **Repository interface define o contrato** — adicione `delete(id: string): Promise<void>` na interface antes de implementar, porque o use case depende da abstracao
3. **Use case retorna void** — delecao nao retorna o objeto deletado, porque o chamador ja tem o ID e nao precisa do objeto de volta
4. **Erro semantico com mensagem clara** — `throw new Error('Prompt not found')` nao erro generico, porque facilita debugging e testes
5. **Teste ambos os cenarios** — sucesso (existe e deleta) e falha (nao existe e lanca erro), porque sao os dois branches do use case
6. **Mock factory com overrides** — crie `makeRepository` com `Partial<Repository>` para reutilizar entre testes, porque evita duplicacao de setup

## How to write

### Use Case

```typescript
export class DeletePromptUseCase {
  constructor(private promptRepository: PromptRepository) {}

  async execute(id: string) {
    const prompt = await this.promptRepository.findById(id)
    if (!prompt) {
      throw new Error('Prompt not found')
    }
    await this.promptRepository.delete(id)
  }
}
```

### Repository Interface (adicionar metodo)

```typescript
export interface PromptRepository {
  // ... metodos existentes
  delete(id: string): Promise<void>
}
```

### Repository Prisma (implementacao)

```typescript
async delete(id: string): Promise<void> {
  await this.prisma.prompt.delete({ where: { id } })
}
```

## Example

**Before (sem verificacao de existencia):**
```typescript
async execute(id: string) {
  await this.promptRepository.delete(id)
}
```

**After (com verificacao):**
```typescript
async execute(id: string) {
  const prompt = await this.promptRepository.findById(id)
  if (!prompt) {
    throw new Error('Prompt not found')
  }
  await this.promptRepository.delete(id)
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Use case so precisa de 2 metodos do repo | Mock factory so com esses 2 metodos |
| Delete retorna void | `expect(result).toBeUndefined()` |
| Testar erro de not found | `findById` retorna `null`, `expect(...).rejects.toThrow()` |
| Repository Prisma | Teste unitario verifica args passados ao Prisma client |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `repository.delete(id)` sem checar existencia | `findById(id)` primeiro, depois `delete(id)` |
| `throw new Error('Error')` generico | `throw new Error('Prompt not found')` semantico |
| Mock inline repetido em cada teste | `makeRepository({ overrides })` factory |
| `any` no tipo do mock | `Partial<PromptRepository>` tipado |
| Testar so o caminho feliz | Testar sucesso E erro (not found) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
