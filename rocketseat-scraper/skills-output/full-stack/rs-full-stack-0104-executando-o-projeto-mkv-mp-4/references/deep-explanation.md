# Deep Explanation: Executando o Projeto Express + TypeScript

## Por que separar app.ts de server.ts?

O instrutor enfatiza "só para a gente ir acostumando mais a separar o app do server". Essa separação não é cosmética — é arquitetural:

1. **Testabilidade** — Ao importar `app` em testes, você pode fazer `supertest(app)` sem iniciar um servidor real na porta. Se `app.listen()` estivesse no mesmo arquivo, cada teste iniciaria um servidor, causando conflitos de porta.

2. **Responsabilidade única** — `app.ts` responde "o que minha aplicação faz?" (middlewares, rotas, configuração Express). `server.ts` responde "como minha aplicação roda?" (porta, host, protocolo).

3. **Flexibilidade de deploy** — Em serverless (Vercel, Lambda), você exporta o `app` sem nunca chamar `listen()`. O runtime gerencia a porta.

## tsconfig.json — O que cada opção faz

### target: "ES2022"
Define qual versão do JavaScript o TypeScript vai gerar. ES2022 inclui top-level await, `.at()`, error cause — features modernas que Node.js 18+ suporta nativamente.

### lib: ["ES2023"]
Define quais type definitions estão disponíveis. ES2023 inclui `Array.findLast()`, `Array.findLastIndex()` e outros métodos recentes.

### paths: { "@/*": ["./src/*"] }
Path aliases — o instrutor explica: "colocou arroba, mostra tudo o que tem dentro dessa pasta". Em vez de:
```typescript
import { app } from "../../src/app"
```
Você escreve:
```typescript
import { app } from "@/app"
```
Isso funciona porque `tsx` resolve os paths automaticamente. Em produção com `tsc`, você precisaria de `tsconfig-paths` ou outro resolver.

### module: "Node16"
Usa o sistema de módulos do Node.js 16+, que suporta tanto ESM quanto CommonJS com resolução correta de `.js` extensions.

### esModuleInterop: true
Permite `import express from "express"` em vez de `import * as express from "express"`. Necessário porque Express usa `module.exports`, não `export default`.

### forceConsistentCasingInFileNames: true
Previne bugs em Linux/macOS vs Windows. Se você importar `"@/App"` mas o arquivo é `app.ts`, o TypeScript vai reclamar. Sem isso, funciona no Windows (case-insensitive) mas quebra no Linux (case-sensitive).

### strict: true
Ativa todas as verificações de tipo estritas: `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, etc. O instrutor coloca sem hesitar — é o padrão recomendado.

### skipLibCheck: true
O instrutor explica: "para não ficar olhando isso dos pacotes". Pula a verificação de tipos nos `.d.ts` de `node_modules`. Acelera a compilação significativamente sem perder segurança no seu código.

## express.json() — Por que como primeiro middleware

O instrutor usa `app.use(express.json())` logo após criar a instância. Esse middleware parseia o body de requisições com `Content-Type: application/json`. Sem ele, `req.body` é `undefined` em qualquer rota POST/PUT/PATCH.

Deve vir antes das rotas porque middlewares Express executam em ordem de registro.

## res.send() vs res.json()

O instrutor usa `res.send("Hello World")` para o teste inicial e menciona: "nem é com o ponto JSON, né? Com send mesmo, porque aí ele meio que manda formatado aqui pelo navegador."

- `res.send()` — detecta o tipo do argumento e seta Content-Type automaticamente. String → `text/html`. Buffer → `application/octet-stream`.
- `res.json()` — sempre seta `application/json` e faz `JSON.stringify()`. Use para respostas de API.

Para endpoints reais da API, sempre use `res.json()`.

## tsx watch — Hot reload sem build

O instrutor configura `"dev": "tsx watch src/server.ts"`. O `tsx` é um executor TypeScript que:
1. Não gera arquivos `.js` — executa TypeScript diretamente via esbuild
2. Resolve path aliases do tsconfig automaticamente
3. Com `watch`, reinicia o processo ao detectar mudanças em qualquer arquivo importado

O instrutor demonstra isso ao vivo: muda "Hello World" para "Hello node.js", salva, e o servidor reinicia sozinho. "Ele já reiniciou aqui para gente porque a gente tá usando aquela flag de Watch."

## Definir "main" no package.json

O instrutor adiciona `"main": "src/server.ts"` ao package.json: "só pra gente dizer quem é, qual é, né, o nosso arquivo principal, só pra ficar consistente aqui." Embora não afete a execução com tsx (que usa o script dev), documenta o entrypoint do projeto para outros desenvolvedores e ferramentas.