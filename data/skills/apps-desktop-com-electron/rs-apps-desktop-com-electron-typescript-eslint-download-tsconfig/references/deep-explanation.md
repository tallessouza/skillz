# Deep Explanation: TypeScript & ESLint para Electron + Vite

## Por que um unico tsconfig?

O template padrao do electron-vite traz 3 arquivos de configuracao TypeScript:
- `tsconfig.json` (global/base)
- `tsconfig.node.json` (para main e preload)
- `tsconfig.web.json` (para renderer)

O Diego explica que essa separacao **nao traz vantagens reais** quando voce nao esta usando o binario do TSC para fazer o build. No electron-vite, quem faz o build e o Vite (via esbuild), entao o tsconfig serve apenas para o editor (IntelliSense, checagem de tipos).

O problema pratico: quando voce importa algo de um arquivo em `main/` para `preload/`, ou referencia tipos entre camadas, os tsconfigs separados podem nao conseguir resolver essas importacoes cruzadas. Isso gera erros no editor que nao existem em runtime.

## Path aliases: quando usar e quando nao usar

A analogia do Diego e simples: imagine uma estrutura profunda como `components/sidebar/navigation/index.tsx` que precisa importar de `lib/api`. Com importacao relativa, voce precisa contar os `../` — fragil e propenso a erro.

Com alias `@renderer/src/lib/api`, a importacao e absoluta desde a raiz. Se voce mover o arquivo `index.tsx` para outro lugar, a importacao continua funcionando.

**Mas** — e o Diego enfatiza isso — se o arquivo que voce quer importar esta na mesma pasta, usar alias e overengineering. `./styles` e mais claro que `@renderer/src/components/sidebar/navigation/styles`.

A regra pratica: **alias para distancia, relativo para proximidade.**

## ESLint minimalista: a filosofia

O Diego remove manualmente todas as dependencias de ESLint que vem com o template:
- `@typescript-eslint/*`
- `eslint-config-prettier`
- `eslint-plugin-prettier`
- `eslint-plugin-react`
- `prettier`

E substitui por um unico pacote: `@skillz/eslint-config`.

A razao: "Eu nao gosto de um ESLint muito complexo que voce salva o arquivo e ele muda o arquivo todo, voce nem sabe mais como e que e o arquivo."

Essa configuracao da Skillz inclui regras para React (hooks, etc) mas sem ser invasiva.

## O problema do ESLint em pastas de build

Ao rodar `npm run lint`, o ESLint tentava verificar arquivos dentro de `out/` e `build/` — que sao arquivos compilados/empacotados. Isso gerava erros como `Window is not defined` porque o contexto do Node nao tem `window`.

A solucao e o `.eslintignore` com as pastas `out` e `build`.

## Nota sobre versao do TypeScript

O Diego menciona um warning sobre "version of TypeScript which is not officially supported" — isso acontece quando a versao do TS no projeto e mais recente que a suportada oficialmente pelo `@typescript-eslint`. Ele diz que isso nao e um problema real, apenas um aviso de compatibilidade que sera resolvido quando o plugin atualizar.