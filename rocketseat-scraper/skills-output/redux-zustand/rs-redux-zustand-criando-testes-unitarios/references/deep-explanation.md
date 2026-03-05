# Deep Explanation: Testes Unitarios para Reducers Redux

## Por que testar reducers e tao simples

O instrutor enfatiza que testar reducers com Redux e "muito facil" porque reducers seguem o pattern de funcao pura: recebem estado + acao, retornam novo estado. Nao ha side effects, nao ha necessidade de montar componentes, nao ha DOM. E a mesma ideia do `useReducer` do React — qualquer funcionalidade que usa o pattern Reducer funciona assim.

## Vitest vs Jest

O instrutor escolheu Vitest especificamente porque:
- Criado pelo mesmo time do Vite
- Usa esbuild internamente (mesmo bundler do Vite)
- Nao precisa configurar nada para TypeScript — Jest exigiria configuracao extra para entender TS
- Segue a mesma API do Jest — `describe`, `it`, `expect` funcionam igual, so mudam os imports

A unica diferenca pratica: imports vem de `vitest` ao inves de `@jest/globals`.

## O truque do `getInitialState()`

O instrutor mostra que `playerSlice.getInitialState()` retorna exatamente o estado definido em `initialState` na slice. Isso e util para o primeiro teste, mas ele logo percebe que usar o initial state real e "um pouco confuso" para testes mais complexos.

A solucao: criar um `exampleState` simplificado com apenas os dados necessarios (2 modulos, 2 aulas cada). Isso torna os testes legiveis e independentes da estrutura real dos dados.

## Estrategia de cobertura dos branches

O instrutor testa o `next` action sistematicamente:
1. **Caso basico (play):** Verifica que play seta os indices corretos
2. **Proxima aula no mesmo modulo:** currentModule=0, lesson=0 → next → lesson=1
3. **Pular para proximo modulo:** currentModule=0, lesson=1 (ultima) → next → module=1, lesson=0
4. **Sem proxima aula:** currentModule=1, lesson=1 (ultima de tudo) → next → nada muda

Essa progressao cobre todos os branches da logica `next`.

## O warning do combineReducers

Ao rodar os testes, aparece um warning: "reducer provided for key player store does not have a valid reducer, make sure argument pass to combineReducers..." O instrutor diz explicitamente: "isso aqui nao e um problema, a gente nao precisa se preocupar." Isso acontece porque o teste importa a slice isoladamente sem o store completo configurado, mas nao afeta os testes unitarios.

## Extensao do arquivo: .spec vs .test

O instrutor prefere `.spec.ts` mas menciona que `.test.ts` tambem funciona — o Vitest entende ambas as extensoes. Escolha uma e mantenha consistencia.

## Scripts no package.json

Dois scripts uteis:
- `"test": "vitest run"` — roda uma vez e sai
- `"test:watch": "vitest"` — fica observando mudancas (modo watch e o default do vitest sem flags)

## Insight da Redux DevTools

O instrutor mostra um truque interessante: a extensao Redux DevTools gera testes automaticamente. Voce pode interagir com a UI, e na aba "Test" da extensao, ela gera um esqueleto de teste baseado nas acoes que foram disparadas. Isso serve como ponto de partida, mas precisa de ajustes.