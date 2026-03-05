# Deep Explanation: Criando Store do Redux

## Por que Redux Toolkit e nao Redux puro?

O instrutor enfatiza que antigamente se usava o `react-redux` diretamente, que era "muito mais complexo de trabalhar". O Redux Toolkit foi criado como a forma recomendada oficial, simplificando drasticamente a configuracao. A documentacao oficial do Redux hoje aponta diretamente para o Toolkit.

## O conceito de Slices (fatias)

O instrutor usa a analogia de "pedacinhos de estado". Num e-commerce, voce teria:
- Um slice para o carrinho
- Um slice para autenticacao
- Um slice para favoritos

Isso evita ter "muita coisa no lugar so". Cada `createSlice` produz um pedaco isolado do estado global com seu proprio nome, initialState e reducers.

## Redux e agnostico de UI

Ponto importante: o Redux Toolkit pode ser usado com Angular, Vue, ou qualquer framework. Por isso existe a separacao:
- `@reduxjs/toolkit` — core do Redux (agnostico)
- `react-redux` — binding especifico para React

O `react-redux` fornece o Provider (que usa Context API por baixo dos panos) e hooks como `useSelector`.

## Provider e Context API

O instrutor explica que "o Redux, por baixo dos panos, continua utilizando a Context API do React". O Provider do react-redux funciona exatamente como um Context Provider — compartilha os dados do store com todos os componentes filhos.

O instrutor renomeia o Provider para `ReduxProvider` para ficar "mais semantico" e distinguir de outros providers que possam existir.

## useSelector — leitura seletiva

O `useSelector` recebe uma funcao onde o parametro e todo o store do Redux. Voce pode retornar o store inteiro (`state`) ou selecionar apenas um slice (`state.todo`). O instrutor demonstra que retornar o store inteiro traz um objeto com todas as chaves dos slices, e selecionar `state.todo` traz apenas o array de todos.

A chave do objeto no store corresponde exatamente a chave passada no `reducer` do `configureStore`:
```typescript
reducer: {
  todo: todoSlice.reducer,  // acessado como state.todo
  // chuachua: todoSlice.reducer  // acessado como state.chuachua
}
```

## Estrutura do projeto

O instrutor cria o projeto com Vite + TypeScript, limpa arquivos desnecessarios (assets, CSS, SVGs), e organiza:
- `src/store/index.ts` — configureStore
- `src/components/TodoList.tsx` — lista que le do estado
- `src/components/AddTodo.tsx` — formulario para adicionar

Os dois componentes sao separados propositalmente para demonstrar que, com Redux, componentes independentes podem compartilhar estado.