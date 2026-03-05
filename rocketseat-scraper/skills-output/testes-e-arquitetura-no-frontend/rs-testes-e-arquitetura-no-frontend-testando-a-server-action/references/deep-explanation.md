# Deep Explanation: Testando Server Actions

## Por que mockar no nivel do modulo?

O instrutor destaca que server actions importam dependencias pesadas como Prisma (acesso ao banco) e use cases (logica de negocio). O `jest.mock()` no nivel do modulo intercepta o `import` antes que o codigo execute, substituindo a dependencia real por um objeto controlavel.

Para o Prisma, basta retornar um objeto vazio (`{ prisma: {} }`) porque o Prisma so e usado dentro do use case, e o use case ja esta mocado. O mock do Prisma existe apenas para evitar o erro de importacao (`TextEncoder is not defined` e outros erros de ambiente Node vs Edge).

## A cadeia de mocks

A arquitetura limpa cria uma cadeia: Action → Use Case → Repository → Prisma. Ao testar a action, voce so precisa mockar o use case (camada imediatamente abaixo). O mock do Prisma e necessario apenas porque o Jest tenta resolver todas as importacoes transitivas.

```
searchPromptAction
  └── SearchPromptUseCase.execute  ← MOCK AQUI
        └── PrismaRepository       ← mock vazio so pra import
              └── Prisma Client    ← nunca chega aqui
```

## Por que mockReset e nao mockClear?

O instrutor usa `mockReset()` no `beforeEach`. A diferenca:
- `mockClear()` — limpa chamadas e instancias, mas mantem implementacao
- `mockReset()` — limpa tudo, incluindo implementacao e valores de retorno

`mockReset` e mais seguro porque garante que nenhum teste herda comportamento de outro. Cada teste configura seu proprio `mockResolvedValue` ou `mockRejectedValue`.

## O pattern do mockImplementation com execute

```typescript
jest.mock('@/core/use-cases/search-prompt-use-case', () => ({
  SearchPromptUseCase: jest.fn().mockImplementation(() => ({
    execute: mockedSearchExecute
  }))
}))
```

Isso simula a instanciacao da classe. Quando o codigo faz `new SearchPromptUseCase()`, o Jest retorna um objeto com `execute` apontando para o mock controlavel. Isso permite que cada teste defina o comportamento do `execute` independentemente.

## Os 5 cenarios essenciais

O instrutor identifica 5 cenarios que cobrem o comportamento completo:

1. **Sucesso com termo nao vazio** — caminho feliz padrao
2. **Sucesso com termo vazio (lista tudo)** — comportamento de fallback
3. **Erro generico** — tratamento de excecao
4. **Trim de espacos** — sanitizacao de input
5. **Ausencia da query** — FormData sem o campo `q`

Essa cobertura garante que a action se comporta corretamente em todos os cenarios realistas de uso.

## Verificacao de falso positivo

No final, o instrutor muda propositalmente um valor esperado para confirmar que o teste realmente falha. Isso e uma pratica importante: sempre verifique que seu teste consegue falhar, senao ele pode estar passando por razoes erradas (falso positivo).

## FormData nos testes

Server actions do Next.js recebem `FormData` como parametro. Nos testes, voce instancia `new FormData()` e usa `.append()` para simular o envio do formulario. O primeiro parametro da action e o estado anterior (pattern de `useFormState`), entao voce passa `{ success: true }` como valor inicial.