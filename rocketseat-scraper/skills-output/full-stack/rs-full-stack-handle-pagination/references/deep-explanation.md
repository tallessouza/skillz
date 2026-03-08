# Deep Explanation: handlePagination

## Por que usar setState com callback (prevPage)?

O instrutor usa `setPage(prevPage => ...)` ao invés de `setPage(page + 1)`. Isso não é estilo — é correção técnica.

Quando o React processa múltiplas atualizações de estado em sequência (batching), o valor de `page` capturado na closure pode estar desatualizado. O callback recebe o valor REAL mais recente do estado, garantindo que cada incremento/decremento opere sobre o valor correto.

**Analogia prática:** É como um caixa de banco que confere o saldo ATUAL antes de cada operação, ao invés de usar o saldo que estava no extrato impresso (que pode já ter mudado).

## A lógica de limites com retorno do estado atual

O padrão do instrutor é elegante na sua simplicidade:

```tsx
setPage((prevPage) => {
  if (action === "next" && prevPage < totalOfPages) return prevPage + 1
  if (action === "previews" && prevPage > 1) return prevPage - 1
  return prevPage  // ← este é o segredo
})
```

O `return prevPage` no final cobre TODOS os edge cases:
- Tentou avançar na última página → retorna estado atual
- Tentou voltar na primeira página → retorna estado atual
- Ação inválida → retorna estado atual

Não lança erro, não ignora, simplesmente mantém. O React é inteligente o suficiente para não re-renderizar quando o estado não muda de valor.

## Comparação estrita (===) vs solta (==)

O instrutor enfatiza: "Sempre a gente vai usar o 3 iguais para ser exatamente igual no valor aqui, no conteúdo e no tipo."

- `"1" == 1` → `true` (coerção de tipo)
- `"1" === 1` → `false` (tipo diferente)

Em paginação isso é crítico porque valores podem vir como string de query params ou de inputs.

## Separação de loading vs disabled — insight de UX

O instrutor descobriu um bug durante o desenvolvimento ao vivo: o botão desabilitado no limite da paginação mostrava cursor de loading (`cursor-progress`), porque o componente Button tratava `disabled` e `isLoading` como a mesma coisa.

**O insight:** São estados semânticos completamente diferentes:
- **Loading:** uma operação está em andamento, o botão está temporariamente indisponível
- **Disabled:** o botão está estruturalmente bloqueado (limite de paginação atingido)

O cursor de loading em um botão que simplesmente não tem mais páginas confunde o usuário — ele espera que algo vai carregar, quando na verdade não há nada para carregar.

**Solução:** Separar as classes condicionalmente:
```tsx
isLoading && "cursor-progress"      // carregando algo
disabled && !isLoading && "cursor-not-allowed"  // bloqueado por regra
```

## O poder do className condicional com Tailwind

O instrutor destaca: "Isso que é o legal do className também, a gente está juntando várias classes, olha só que legal."

Com `clsx` ou template literals, composição de classes Tailwind permite expressar estados complexos de forma declarativa. Cada estado (loading, disabled, active) adiciona suas próprias classes sem interferir nas outras.

## Padrão de função única com parâmetro de ação

Ao invés de criar `handleNext()` e `handlePrev()`, o instrutor cria uma única `handlePagination(action)`. Vantagens:
- Centraliza a lógica de limites em um único lugar
- Se a regra de limite mudar, muda em um lugar só
- O componente filho recebe callbacks já configurados: `onNext={() => handlePagination("next")}`

## Total de páginas vem da API

O instrutor nota: "Essa informação de total de páginas ela vai voltar geralmente da API." Nesta aula usa `useState(10)` para simular, mas em produção:
- A API retorna `{ data: [...], totalPages: 10, currentPage: 1 }`
- `setTotalOfPages` é chamado ao receber a resposta
- `page` é controlado localmente e enviado como query param na requisição

## Experiência do usuário iterativa

O instrutor enfatiza: "É muito difícil você prever todos os cenários. Conforme a gente vai desenvolvendo a gente vai vendo os cenários."

O bug do cursor de loading só apareceu quando o botão foi desabilitado no limite da paginação — algo que não era óbvio no design inicial. Isso reforça a importância de testar o componente em todos os estados possíveis durante o desenvolvimento.