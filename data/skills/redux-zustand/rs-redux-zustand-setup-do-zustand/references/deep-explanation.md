# Deep Explanation: Setup do Zustand

## Por que Zustand substitui o Redux

O instrutor destaca que o Redux, apesar de famoso e presente em projetos mais antigos, e muito verboso. Para usa-lo, voce precisa aprender: Thunks (funcoes assincronas), Reducers, Actions, arquitetura Flux, Slices. Sao muitos conceitos novos, especialmente para quem esta construindo uma aplicacao do zero.

Zustand surgiu como alternativa direta — inclusive a documentacao oficial foca em como migrar do Redux para o Zustand.

## Zustand vs Redux — diferencas arquiteturais

### Estado global compartilhado
Ambos seguem o mesmo conceito: um estado global compartilhado entre toda a aplicacao. Isso os diferencia de solucoes como Context API ou Jotai, que trabalham com estados locais menores.

### Sem Context Provider
Uma vantagem critica do Zustand: **nao precisa de wrapper com Context Provider**. O Redux exige um `<Provider store={store}>` envolvendo a aplicacao. Zustand nao usa a Context API do React, o que evita renderizacoes desnecessarias.

### Signals por baixo dos panos
O instrutor explica que Zustand usa internamente uma estrategia chamada **signals**. A diferenca conceitual:
- **PubSub (Redux):** o componente fica "ouvindo" (observando) mudancas na variavel
- **Signals (Zustand):** a variavel "avisa" o componente quando mudou — caminho inverso

Isso significa que, ao inves do componente ficar observando se precisa re-renderizar, o Zustand consegue avisar diretamente o componente que ele precisa renderizar. Resultado: mais performance.

## A API create() — analogia com useState

O instrutor faz uma analogia direta:
- `set` = como o `setState` do React (atualiza o estado)
- `get` = como acessar o valor do estado (no React voce acessa direto pela variavel, no Zustand precisa chamar `get()`)

A funcao passada para `create()` recebe `(set, get)` e retorna o objeto com estado inicial + acoes.

## Tipagem com Generics

O `create` aceita um generic `create<T>()` onde T define o formato do estado. O instrutor comenta que nao gosta do nome `T` porque acha generico demais, mas explica que esse T e passado internamente para o `StateCreator` e define a tipagem de todo o retorno.

Ao tipar, o TypeScript ja mostra erros se o retorno nao bater com a interface — validacao em tempo de desenvolvimento.

## Estrategia de migracao

O instrutor recomenda uma abordagem incremental:
1. Nao deletar a pasta `store/` do Redux
2. Criar uma nova pasta `zustand-store/`
3. Migrar aos poucos, reaproveitando interfaces e logica

Isso permite comparar as duas implementacoes e entender as diferencas lado a lado.

## Acoes sem Flux

No Redux: `dispatch(play([moduleIndex, lessonIndex]))` — precisa de action creators, payload, dispatch.

No Zustand: `play(moduleIndex, lessonIndex)` — chamada direta de funcao. Os parametros sao recebidos diretamente, sem wrapper de payload. Isso elimina todo o boilerplate do pattern Flux.