# Deep Explanation: Criando Primeiro Teste com Vitest

## Por que nao usar o Test Runner nativo do Node?

O Node 18 introduziu uma API propria de testes (Test Runner), mas na epoca da aula estava totalmente experimental. O instrutor destaca dois motivos para nao usar:

1. **Pode mudar bastante** — APIs experimentais nao tem garantia de estabilidade
2. **Funcionalidades limitadas** — vai demorar muito para ter tudo que frameworks como Jest/Vitest oferecem (mocks, coverage, watch mode, etc.)

O ponto mais importante: a sintaxe do Jest/Vitest e **universal no ecossistema JavaScript**. O mesmo `test()`, `expect()`, `describe()` funciona em projetos React, React Native, Vue, Angular, Node. Aprender essa sintaxe uma vez serve para qualquer contexto.

## Por que Vitest e nao Jest?

O instrutor e claro: Jest e uma "ferramenta incrivel" e funciona muito bem. A razao para escolher Vitest e **pragmatica, nao ideologica**:

### O problema do TypeScript no Jest

Quando voce escreve testes em TypeScript com Jest, precisa:
1. Instalar Jest
2. Instalar `@types/jest`
3. Instalar `ts-jest` ou `babel-jest` + preset TypeScript
4. Configurar `jest.config.ts` com o transformer
5. Lidar com lentidao do Babel na conversao TS → JS

### A solucao do Vitest

Vitest usa **ESBuild** por baixo dos panos — a mesma ferramenta que:
- O **TSX** usa (que o curso ja instalou para rodar a aplicacao)
- O **Vite.js** usa (ferramenta de build para frontend)

ESBuild se descreve como "an Extremely Fast Bundler for the Web". Na pratica, isso significa que a conversao TypeScript → JavaScript acontece **automaticamente e muito rapido**.

O instrutor demonstra a velocidade: ao salvar o arquivo, o Vitest reroda os testes quase instantaneamente.

### Compatibilidade total

O ponto crucial que o instrutor enfatiza: **Vitest e totalmente compativel com Jest**. O codigo e identico. Se voce sabe escrever testes com um, sabe com o outro. A diferenca esta apenas no que acontece "por tras dos panos" (velocidade, suporte nativo a TS/ESM/JSX).

## As 3 partes de um teste

O instrutor define um modelo mental claro para a anatomia de qualquer teste:

1. **Enunciado** — o primeiro argumento do `test()`, a string que descreve o que esta sendo testado. Exemplo: `'usuario consegue criar uma nova transacao'`

2. **Operacao** — o codigo dentro do callback que executa a acao. Exemplo: fazer uma chamada HTTP para criar uma transacao.

3. **Validacao** — os `expect()` que verificam se a operacao produziu o resultado esperado. Exemplo: `expect(response.statusCode).toEqual(201)`

O instrutor demonstra isso criando um teste simples onde hardcoda o status code como 201, mostra que passa, depois muda para 500 e mostra que falha — provando que a validacao funciona.

## Convencoes de arquivo

- Pasta `test/` na raiz do projeto
- Extensao `.spec.ts` (preferencia do instrutor) ou `.test.ts`
- O instrutor enfatiza: "literalmente e questao de gosto", nao muda funcionalidade

## Watch mode

O Vitest roda em watch mode por padrao. O instrutor mostra:
- Ao salvar o arquivo, os testes reexecutam automaticamente
- Pressionar `a` reroda todos os testes
- A velocidade e notavel ("olha o quao rapido isso aqui e")

## Script no package.json

O instrutor adiciona `"test": "vitest"` no package.json para nao precisar digitar `npx vitest` toda vez. Depois pode rodar com `npm test` ou `npm run test`.

## Contexto do Vitest

O Vitest foi criado no ecossistema do Evan Yu (criador do Vue e do Vite). O instrutor nao tem certeza se Evan Yu criou diretamente ou se e sponsor, mas destaca que o Vitest faz parte do mesmo ecossistema que o Vite.js, compartilhando a mesma base tecnologica (ESBuild).

O termo "framework de testes" e usado intencionalmente: nao e so uma biblioteca de assertions. Um framework de testes traz "tudo o que a gente precisa dentro do ecossistema de testes" — runner, assertions, mocks, coverage, watch mode, etc.