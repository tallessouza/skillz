# Deep Explanation: Criando Reducer do Player

## Por que selectors granulares importam

O instrutor faz uma comparacao direta entre Redux e Context API que e fundamental:

**Context API:** Quando qualquer dado do contexto muda, TODOS os componentes que consomem aquele contexto re-renderizam. Nao importa se o componente usa apenas um campo — ele re-renderiza ao mudar qualquer campo.

**Redux com selectors:** O componente so re-renderiza se a informacao ESPECIFICA que o selector retorna mudar. Isso e o diferencial de performance do Redux.

O instrutor enfatiza: "A gente nao pegar e retornar todo o estado e nem fazer desestruturacao aqui. A gente pegar e buscar exatamente qual informacao do estado a gente quer."

### Padroes de selector por contexto

Quando voce precisa de mais de uma informacao, crie selectors separados:

```typescript
const modules = useAppSelector(state => {
  return state.player.course.modules
})

const outraInfo = useAppSelector(state => {
  return state.player.outroCampo
})
```

Desestruture FORA do selector, nunca dentro. Cada `useAppSelector` rastreia independentemente suas mudancas.

## Organizacao de pastas

O instrutor organiza assim:
```
store/
├── index.ts          # configureStore + combineReducers
└── slices/
    └── player.ts     # createSlice + export reducer
```

A pasta `slices` agrupa todas as "fatias" do estado. Cada slice e um arquivo separado com seu proprio dominio.

## Estrutura do initialState como resposta de API

O instrutor modela o `initialState` como se fosse uma resposta real de API:
- Cada modulo tem `id`, `title`, `lessons[]`
- Cada lesson tem `id` (igual ao id do video do YouTube), `title`, `duration`
- Isso facilita a substituicao futura por dados reais de uma API

O `id` da lesson sendo o mesmo do video do YouTube e uma decisao pratica: o componente de video pode usar diretamente o id para carregar o player.

## Selector com indice para dados aninhados

Quando voce esta dentro de um componente que representa UM modulo especifico, use o indice:

```typescript
const lessons = useAppSelector(state => 
  state.player.course.modules[moduleIndex].lessons
)
```

Isso garante que o componente so re-renderiza quando as lessons DAQUELE modulo especifico mudam.

## Reducers vazios no inicio

O instrutor deixa `reducers: {}` propositalmente vazio no inicio. Isso e intencional — primeiro voce configura o estado e a leitura, depois adiciona as actions. Nao tente criar todas as actions de uma vez.