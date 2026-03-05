# Deep Explanation: Salvando a Busca na URL

## Por que hidratar o input a partir da URL?

O instrutor demonstra um cenario real: o usuario digita "prompt" no campo de busca, a URL atualiza com o query parameter, mas ao recarregar a pagina o campo limpa. O filtro continua na URL mas o input nao reflete isso. Isso quebra a experiencia de compartilhamento — se alguem recebe o link filtrado, ve os resultados mas o campo de busca aparece vazio.

A solucao e simples: ao inicializar o estado do componente controlado, ler o valor atual dos search params da URL.

## Componente controlado e o ciclo de dados

O componente ja era controlado (`value={query}` + `onChange={handleQueryChange}`). O problema estava apenas na inicializacao do estado. Antes: `useState('')` — sempre vazio. Depois: `useState(searchParams.get('q') ?? '')` — le da URL.

O instrutor enfatiza que o componente `SidebarContent` controla o input via `value` e `onChange`. Essa e a base: como o componente e controlado, basta mudar o valor inicial do estado.

## useSearchParams vs alternativas

O `useSearchParams` do `next/navigation` e preferido porque:
- Integra com o sistema de roteamento do Next.js
- Funciona corretamente com SSR/SSG
- Retorna um objeto `URLSearchParams` padrao do browser
- Reage a mudancas de URL feitas pelo router

## Estrategia de testes: it.todo()

O instrutor mostra uma tecnica de desenvolvimento interessante: usar `it.todo('descricao')` para mapear casos de teste antes de implementar. Isso aparece no report de testes como pendente, dando visibilidade do que falta. O instrutor menciona que "da aquela sensacao de progresso" — voce vai implementando aos poucos e vendo os todos desaparecerem.

## Mock de next/navigation

Ponto critico: quando voce ja tem um `jest.mock('next/navigation')` com `useRouter`, adicionar `useSearchParams` no mesmo mock e obrigatorio. O mock sobrescreve toda a importacao do modulo. Se voce so mocka `useRouter`, o `useSearchParams` fica `undefined` e todos os testes quebram.

O instrutor mostra exatamente isso acontecendo: ao adicionar `useSearchParams` no componente sem atualizar o mock, todos os 7 testes existentes quebram. A solucao: adicionar `useSearchParams` ao objeto retornado pelo mock, usando uma variavel `let mockSearchParams` que pode ser reatribuida em cada teste.

## Pattern: variavel mutavel para mock

```typescript
let mockSearchParams = new URLSearchParams()

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => mockSearchParams,
}))
```

A variavel `let` permite que cada teste configure seus proprios search params antes de renderizar o componente. O mock captura a referencia da variavel (closure), entao reatribuir `mockSearchParams` antes do `render()` funciona corretamente.