# Deep Explanation: Async Thunks no Redux Toolkit

## Por que reducers nao podem ser assincronos

O Redux exige que reducers sejam funcoes puras — sem side effects, sem promises, sem chamadas HTTP. Isso garante previsibilidade: dado o mesmo state e a mesma action, o resultado e sempre o mesmo. Isso facilita testes, debugging com time-travel, e raciocinio sobre o codigo.

O Thunk e a solucao historica para esse problema. Ele existe desde a mesma epoca do Redux original e foi incorporado no Redux Toolkit como padrao.

## O que e um Thunk

Um Thunk continua sendo uma Action — assim como Play, Start, Next. A diferenca e que ele e assincrono. Ele aparece no Redux DevTools da mesma forma que qualquer outra action.

O `createAsyncThunk` aceita dois parametros:
1. **Uma string** — o nome da action (ex: `"player/load"`)
2. **Uma funcao async** — o codigo assincrono que sera executado

## As tres actions automaticas

Todo `createAsyncThunk` gera automaticamente tres actions:

1. **pending** — disparada no momento em que o thunk e chamado, antes da promise resolver. Serve para mostrar loading na tela.
2. **fulfilled** — disparada quando a promise resolve com sucesso. O `action.payload` contem o que foi retornado da funcao async.
3. **rejected** — disparada quando a promise falha.

Essas actions aparecem no Redux DevTools com o padrao: `player/load/pending`, `player/load/fulfilled`, `player/load/rejected`.

## Por que extraReducers e nao reducers

Os `reducers` dentro de `createSlice` definem actions que pertencem aquele slice. O `extraReducers` permite que o slice ouca actions vindas de fora — de outros slices ou de async thunks.

O instrutor enfatiza: extraReducers e uma forma de fazer com que um reducer ouca disparos de acoes de outros locais. Isso e fundamental para a arquitetura de thunks.

## O problema do TypeScript com useDispatch

O `useDispatch` padrao do React Redux nao conhece o tipo de dispatch que inclui thunks. O Redux por padrao nao entende que um thunk e uma action valida. Por isso, e necessario criar um `useAppDispatch` tipado:

```typescript
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
```

Isso resolve o erro `is not assignable to parameter of type 'AnyAction'` que aparece quando se tenta fazer `dispatch(loadCourse())` com o `useDispatch` padrao.

A recomendacao e substituir TODOS os `useDispatch` do projeto por `useAppDispatch` para consistencia — mesmo que em alguns lugares nao faca diferenca funcional, a tipagem fica correta.

## O Redux Thunk por baixo dos panos

O `createAsyncThunk` usa internamente a biblioteca `redux-thunk`, que e bem antiga (mesma epoca do Redux). O Redux Toolkit ja inclui essa dependencia automaticamente.

## Naming do Thunk

O instrutor inicialmente nomeou o thunk como `"start"`, mas depois renomeou para `"player/load"` para manter organizacao. O padrao recomendado e `"nomeDoSlice/acao"`, que e o mesmo padrao que o Redux Toolkit usa internamente para as actions dos reducers.