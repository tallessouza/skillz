# Deep Explanation: Setup Express + TypeScript

## Por que fixar versoes?

O instrutor fixa cada versao explicitamente (`express@4.19.2`, `typescript@5.5.4`, etc.). A razao e pedagogica e pratica: em um curso, se cada aluno instala uma versao diferente, os bugs sao diferentes. Em producao, o mesmo principio se aplica — versoes flutuantes causam "funciona na minha maquina".

## tsconfig.json — Propriedade por propriedade

### `target: "es2022"`
Define o JavaScript de saida. ES2022 inclui top-level await, class fields, e `.at()` em arrays. E o sweet spot atual: moderno o suficiente sem precisar de polyfills, compativel com Node 18+.

### `lib: ["es2023"]`
Define quais APIs o TypeScript conhece. ES2023 adiciona `Array.findLast()`, `Array.findLastIndex()`, etc. Pode ser mais recente que o target porque o Node ja implementa essas APIs.

### `paths: { "@/*": ["./src/*"] }`
Path aliases permitem `import { something } from "@/utils/helper"` ao inves de `import { something } from "../../utils/helper"`. Elimina imports relativos frageis que quebram ao mover arquivos.

### `module: "node16"`
Resolucao de modulos do Node 16+. Suporta tanto ESM quanto CJS. E a opcao recomendada para projetos Node modernos.

### `esModuleInterop: true`
Permite `import express from "express"` ao inves de `import * as express from "express"`. Necessario porque Express exporta como CommonJS e sem essa flag o import default nao funciona.

### `forceConsistentCasingInFileNames: true`
No macOS/Windows, `User.ts` e `user.ts` sao o mesmo arquivo. No Linux (producao), nao sao. Essa flag previne bugs que so aparecem em deploy.

### `strict: true`
Ativa todas as verificacoes estritas: `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, etc. O instrutor nao negocia isso — strict e sempre true.

### `skipLibCheck: true`
Pula verificacao de tipos em arquivos `.d.ts` de node_modules. Acelera a compilacao significativamente sem perda de seguranca no seu codigo.

## Por que tsx e nao ts-node?

O instrutor usa `tsx` (TypeScript Execute) ao inves de `ts-node`. tsx e mais rapido porque usa esbuild internamente. A flag `watch` recarrega automaticamente ao salvar, substituindo nodemon + ts-node.

## O truque do package.json

O instrutor destaca um problema real: se voce esta editando package.json manualmente e roda `npm install` em outro terminal, o npm sobrescreve o arquivo. Sua edicao se perde. A regra e simples: feche package.json antes de instalar qualquer coisa.

## express.json() — Por que logo no setup?

`app.use(express.json())` e adicionado imediatamente porque sem ele, qualquer rota POST/PUT recebe `req.body` como `undefined`. E o erro mais comum de iniciantes em Express e o instrutor previne logo na configuracao inicial.

## Separacao dev vs prod nas dependencias

- `dependencies`: Express (vai pra producao)
- `devDependencies` (`-D`): TypeScript, @types/*, tsx (so desenvolvimento)

Isso importa porque em producao voce roda `npm install --production` (ou `npm ci --omit=dev`) e essas dependencias nao sao instaladas, reduzindo o tamanho da imagem Docker.