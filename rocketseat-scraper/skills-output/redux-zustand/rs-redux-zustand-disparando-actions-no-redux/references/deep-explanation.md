# Deep Explanation: Disparando Actions no Redux

## Anatomia de uma Action

Toda action disparada no Redux segue um padrao que existe desde 2015-2016: um objeto com `type` e `payload`.

- **`type`**: identificador unico no formato `nomeDoSlice/nomeDaAction` (ex: `todo/add`). O Redux Toolkit gera isso automaticamente a partir do `name` do slice e do nome da funcao em `reducers`.
- **`payload`**: os dados enviados pelo componente no momento do dispatch. Pode ser qualquer coisa — string, objeto, array.

```typescript
// Quando voce faz:
dispatch(add({ newTodo: 'Estudar React' }))

// O Redux cria internamente:
{
  type: 'todo/add',
  payload: { newTodo: 'Estudar React' }
}
```

## Por que o state parece estranho no console.log

O instrutor menciona que ao fazer `console.log(state)` no reducer, o navegador mostra um Proxy ao inves do array direto. Isso acontece porque o Redux Toolkit usa **Immer** internamente. O Immer envolve o estado em um Proxy para permitir que voce escreva codigo "mutavel" (`state.push(...)`) que na verdade produz um novo estado imutavel por baixo dos panos.

## Fluxo completo do Redux

O instrutor resume o fluxo:

1. **Store** — estado global, toda aplicacao tem acesso
2. **Slices** — fatias do store separadas por dominio (todo, carrinho, etc.) usando a propriedade `reducers`
3. **Actions** — portas de entrada para alterar estado, definidas dentro dos reducers do slice
4. **useSelector / useAppSelector** — buscar informacoes do estado nos componentes
5. **useDispatch** — disparar acoes que alteram o estado

## A questao da tipagem com TypeScript

O `useSelector` padrao do React Redux retorna `unknown` porque ele nao sabe o formato do seu store. A solucao e:

1. Extrair `RootState` usando `ReturnType<typeof store.getState>` — isso pega o tipo de retorno da funcao `getState`, que reflete automaticamente todas as slices
2. Criar `useAppSelector` tipado com `TypedUseSelectorHook<RootState>` — isso e basicamente o `useSelector` mas com tipagem completa

O instrutor comete um erro ao vivo: primeiro usa `typeof store.getState` (que retorna o tipo da funcao, nao do retorno). Depois corrige para `ReturnType<typeof store.getState>` que retorna o tipo do **retorno** da funcao.

O nome `useAppSelector` (diferente de `useSelector`) evita confusao na hora de importar.

## Por que separar em `slice.actions`

Quando voce faz `export const { add } = todoSlice.actions`, esta exportando apenas a action creator — uma funcao pura que, quando chamada com argumentos, retorna o objeto `{ type, payload }`. O componente nunca precisa saber detalhes internos do slice, apenas importar a action e usar com dispatch.