# Deep Explanation: Delete Use Case Pattern

## Por que verificar existencia antes de deletar?

O instrutor enfatiza que antes de executar qualquer delecao, voce deve buscar o registro com `findById`. Isso garante que:

1. **Erro explicito** — Se o prompt nao existe, o usuario recebe "Prompt not found" em vez de um erro generico do banco de dados ou uma operacao silenciosa que nao faz nada.
2. **Consistencia com outros use cases** — O pattern de "buscar primeiro, agir depois" e consistente com Update, onde voce tambem precisa verificar existencia.

## Evolucao incremental da interface

O instrutor mostra que a interface `PromptRepository` nao tinha o metodo `delete` inicialmente. Ele adiciona conforme a necessidade surge — nao antecipa metodos que nao serao usados. Isso segue o principio ISP (Interface Segregation) na pratica: a interface cresce organicamente com os use cases.

Ao adicionar `delete(id: string): Promise<void>` na interface, o TypeScript imediatamente reclama em todas as implementacoes concretas (ex: `PrismaPromptRepository`), forcando a implementacao.

## Mock Factory Pattern

O instrutor cria uma funcao `makeRepository` que:

```typescript
const makeRepository = (overrides?: Partial<PromptRepository>): PromptRepository => {
  const base = {
    delete: jest.fn(async () => {}),
    findById: jest.fn(),
  }
  return { ...base, ...overrides } as PromptRepository
}
```

**Por que usar Partial?** Porque cada teste pode sobrescrever apenas os metodos que importam para aquele cenario. No teste de sucesso, `findById` retorna um prompt valido. No teste de falha, `findById` retorna `null`.

O spread `{ ...base, ...overrides }` permite que o override substitua o comportamento padrao. O instrutor inicialmente esqueceu o spread e o teste falhou porque `findById` nao retornava o prompt esperado — demonstrando a importancia de testar incrementalmente.

## Dois cenarios obrigatorios

O use case tem exatamente dois branches (if/else), entao precisa de exatamente dois testes:

1. **Sucesso:** `findById` retorna prompt → `delete` e chamado → result e `undefined`
2. **Falha:** `findById` retorna `null` → `throw new Error('Prompt not found')` → `expect(...).rejects.toThrow('Prompt not found')`

O instrutor roda `coverage` para confirmar 100% de cobertura no use case.

## Teste do Repository Prisma

Alem do use case, o instrutor tambem testa a implementacao concreta `PrismaPromptRepository.delete`. O teste verifica que `prisma.prompt.delete` e chamado com `{ where: { id } }` correto. Isso garante que a camada de infraestrutura traduz corretamente a chamada para o Prisma.

## Convencao de nomenclatura em testes

O instrutor nota uma inconsistencia: alguns testes usam "deveria" (portugues) e outros "should" (ingles). Ele comenta que em projetos reais voce deve escolher um idioma e manter consistencia. Em ingles, o padrao e `it('should delete prompt when it exists')`. A escolha nao importa tanto quanto a consistencia.