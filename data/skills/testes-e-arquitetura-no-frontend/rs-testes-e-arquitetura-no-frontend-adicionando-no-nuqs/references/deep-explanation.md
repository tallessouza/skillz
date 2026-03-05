# Deep Explanation: Integração e Testes com nuqs

## Por que usar nuqs?

O instrutor explica que nuqs (pronunciado "nukes") é uma biblioteca que gerencia search params no React de forma declarativa. A motivação principal não é complexidade do projeto em si — ele deixa claro que "nesse caso, no projeto aqui, a gente não precisaria dela" — mas sim ensinar o padrão porque:

1. **Elimina boilerplate**: Sem nuqs, você precisa criar `URLSearchParams` manualmente, manipular a string, e usar `router.push`. Com nuqs, `setQuery('valor')` faz tudo.
2. **Compatibilidade ampla**: Funciona com React, Next.js, Remix, React Router DOM.
3. **O verdadeiro valor didático**: Mostrar como adaptar testes quando se introduz uma lib que usa hooks customizados.

## O problema real: testes quebram ao trocar libs

O insight mais valioso da aula é o processo de adaptação dos testes. Quando você substitui `useSearchParams` por `useQueryState`:

1. Os mocks antigos (de `next/navigation`) deixam de ser relevantes
2. O novo hook (`useQueryState`) precisa de seu próprio mock
3. A documentação do nuqs tem exemplos de teste, mas **não cobrem o cenário de atualização em tempo real** que o projeto precisa

O instrutor explica: "os exemplos dele aqui não casam muito com o nosso cenário de teste ali, que é aquela atualização em tempo real. Então eu tive que fazer uma pequena adaptação."

## A adaptação do mock

A solução é criar um `useState` real do React **dentro do mock**, para que quando o componente chame `setQuery`, o estado realmente mude e o componente re-renderize:

```typescript
vi.mock('nuqs', () => {
  const { useState } = require('react')
  return {
    useQueryState: (key: string) => {
      const [value, setValue] = useState(mockSearchParams.get(key) ?? '')
      const setQuery = vi.fn((nextValue: string) => {
        setValue(nextValue)
      })
      return [value, setQuery] as const
    },
  }
})
```

Isso é um padrão transferível: sempre que você mockar um hook que gerencia estado, considere usar `useState` real dentro do mock para preservar reatividade.

## Adapter como provider

Desde nuqs v2, é obrigatório envolver a aplicação com um adapter (que é um Context Provider). O adapter correto depende do framework:

- `nuqs/adapters/next/app` — App Router
- `nuqs/adapters/next/pages` — Pages Router
- Outros adapters para Remix, React Router, etc.

## Typecheck como rede de segurança

No final da aula, o instrutor roda `npm run typecheck` e descobre um erro de tipo que não havia aparecido nos testes. Isso reforça que:

- Testes passando não significa código correto
- TypeScript pega incompatibilidades de tipo que testes de comportamento não cobrem
- Sempre rodar typecheck após integrar uma nova lib

## Documentação do nuqs

O instrutor recomenda fortemente ler a documentação do nuqs, destacando:

- Uso com arrays (`useQueryStates`)
- Testing section com exemplos de mock
- `withNuqsTestingAdapter` para testes de custom hooks
- Configurações necessárias para Jest/Vitest