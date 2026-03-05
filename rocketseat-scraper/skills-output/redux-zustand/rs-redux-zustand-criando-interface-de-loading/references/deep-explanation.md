# Deep Explanation: Loading State em Redux/Zustand

## Por que pending E fulfilled?

O instrutor destaca um ponto sutil: o `pending` precisa setar `isLoading: true` mesmo que o initial state ja comece como `true`. Isso porque a action de load pode ser chamada mais de uma vez (o usuario pode recarregar o curso). Se voce so confia no initial state, a segunda chamada nao mostraria loading.

## Decisao de inicializar como `true`

O instrutor escolhe `isLoading: true` no initial state porque o dado (curso) e essencial — a tela nao faz sentido sem ele. Isso evita um flash onde a UI renderiza sem dados antes do primeiro pending disparar.

## Impacto nos testes

Ao adicionar `isLoading` ao state, o instrutor nota que os testes precisam ser atualizados. O initial state nos testes precisa incluir `isLoading: false` (ou o valor adequado para o cenario de teste), senao os testes quebram.

## Onde mostrar loading

O instrutor aplica loading em tres areas:

1. **Video player** — spinner centralizado (implementado com Loader do lucide-react + `animate-spin`)
2. **Header** — texto simples "Carregando..." (solucao pragmatica, reconhece que precisaria de designer)
3. **Sidebar** — sugere skeleton screen como desafio

Essa abordagem mostra pragmatismo: nem tudo precisa de UI perfeita de loading. O video player e critico (spinner), o header e funcional (texto), e a sidebar e desafio (skeleton).

## Optional chaining como complemento

O instrutor adiciona `?.` ao acessar `currentLesson` porque durante o loading o dado pode ser `null`. O optional chaining nao substitui o loading state — ele previne erros enquanto o loading state controla a UI.

## Skeleton screens com Tailwind

O instrutor menciona `animate-pulse` do Tailwind como alternativa ao spinner para criar skeleton screens. Isso e util para sidebars e listas onde a estrutura do conteudo e previsivel. Exemplo:

```html
<div className="animate-pulse">
  <div className="h-4 bg-zinc-700 rounded w-3/4 mb-2"></div>
  <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
</div>
```

## Escopo do loading

O instrutor mantem o `isLoading` dentro do slice `player`, nao cria um loading global. Cada feature/slice gerencia seu proprio estado de carregamento. Isso evita que um loading de uma feature afete outra.