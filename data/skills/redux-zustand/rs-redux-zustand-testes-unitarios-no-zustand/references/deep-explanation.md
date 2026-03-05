# Deep Explanation: Testes Unitarios no Zustand

## Por que getState/setState e nao o hook direto?

O Zustand expoe o store como um hook (`useStore()`), mas hooks so funcionam dentro de componentes React. Fora do React — como em testes unitarios — voce acessa o store atraves de metodos estaticos:

- `store.getState()` — retorna o estado atual (snapshot)
- `store.setState(partial)` — altera o estado diretamente

Isso e uma feature do Zustand, nao um workaround. O store do Zustand e um objeto vanilla JS com uma API de subscricao — o hook e apenas um wrapper para React.

## O problema do estado compartilhado entre testes

O instrutor demonstrou o problema ao vivo: o primeiro teste (`play`) alterou `currentModuleIndex` e `currentLessonIndex` para 1 e 2. Quando o segundo teste (`next`) executou, esses valores ainda estavam 1 e 2 — o estado vazou.

Isso e "altamente ruim" (palavras do instrutor) porque:
- A **ordem dos testes influencia no resultado**
- Rodar um teste isoladamente pode dar resultado diferente de rodar todos juntos
- Testes devem ser **independentes e isolados**

## A solucao: beforeEach com estado inicial capturado

O ponto critico que o instrutor enfatizou:

```typescript
// FORA do beforeEach — executa UMA VEZ quando o modulo carrega
const initialState = store.getState()

// DENTRO do beforeEach — executa ANTES de cada teste
beforeEach(() => {
  store.setState(initialState)
})
```

Se `initialState` estivesse DENTRO do `beforeEach`, ele pegaria o estado JA MODIFICADO pelo teste anterior — derrotando o proposito inteiro do reset.

## Renomear useStore para store

O instrutor mencionou que `useStore.getState()` "fica um nome meio estranho" fora de componentes React. O prefixo `use` e uma convencao React para hooks. Em testes, renomear para `store` e semanticamente correto e melhora a legibilidade.

## Comparacao com testes do Redux

No Redux, os testes usam reducers diretamente — voce passa um estado inicial e uma action, e verifica o estado resultante. E funcional e puro.

No Zustand, o store e mutavel e global. Por isso o isolamento com `beforeEach` e necessario — algo que no Redux nao era problema porque cada teste criava seu proprio estado.

Porem, o instrutor destacou que os testes do Zustand sao "bem mais simples" porque voce nao precisa montar o boilerplate de reducers, actions e initial state.

## Migracao de testes Redux → Zustand

O instrutor seguiu este padrao:
1. Copiar os dados de teste do Redux (ex: objeto `course`)
2. Reescrever usando `store.getState()` para pegar actions
3. Usar `store.setState()` para pre-condicoes
4. Adicionar `beforeEach` para isolamento (que no Redux nao era necessario)
5. Remover conceitos de Redux (reducer, dispatch, action creators)