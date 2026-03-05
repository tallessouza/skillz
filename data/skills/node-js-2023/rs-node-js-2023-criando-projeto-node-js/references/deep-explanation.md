# Deep Explanation: Criando Projeto Node.js

## Por que separar app.ts e server.ts?

O instrutor divide a aplicacao Fastify em dois arquivos deliberadamente. O `app.ts` contem apenas a instancia do Fastify (e futuramente rotas, plugins, middlewares). O `server.ts` contem apenas a logica de inicializacao do servidor HTTP (listen na porta).

Essa separacao e fundamental para o SOLID que sera abordado no curso: quando formos testar a aplicacao, importamos `app.ts` diretamente sem precisar subir um servidor HTTP real. Se tudo estivesse em um unico arquivo, cada teste subiria o servidor na porta, causando conflitos.

## TSX vs ts-node

O instrutor escolhe TSX (e nao ts-node) como ferramenta de desenvolvimento. TSX usa esbuild internamente, o que o torna significativamente mais rapido para transpilacao. O flag `watch` faz com que o TSX observe mudancas nos arquivos e reinicie automaticamente — similar ao nodemon, mas integrado.

## tsup para build de producao

tsup e um bundler baseado em esbuild que converte TypeScript para JavaScript. O instrutor usa `tsup src --out-dir build` que:
1. Pega todo o codigo da pasta `src/`
2. Converte para JavaScript
3. Coloca o resultado na pasta `build/`

Em producao, roda-se `node build/server.js` diretamente — sem overhead de transpilacao em runtime.

## O hack do host 0.0.0.0

O instrutor menciona isso como um "hackzinho super rapido" mas e crucial. Por padrao, o Fastify (e o Node.js) faz bind em `localhost` (127.0.0.1), que so aceita conexoes da mesma maquina. Ao usar `0.0.0.0`, o servidor aceita conexoes de qualquer interface de rede — essencial quando:
- Um frontend em outra porta/dominio precisa acessar a API
- A aplicacao roda dentro de um container Docker
- Outra maquina na rede precisa se conectar

## target es2020 no tsconfig

O padrao do `tsc --init` gera `es2016`. O instrutor altera para `es2020` porque o Node.js moderno (18+) suporta nativamente features do ES2020 como optional chaining, nullish coalescing, BigInt, etc. Converter para uma versao mais antiga gera codigo desnecessariamente verboso e menos performatico.

## Pipeline de scripts

A logica dos tres scripts forma um pipeline claro:

```
Desenvolvimento: tsx watch src/server.ts (TypeScript direto, com hot-reload)
Build:           tsup src --out-dir build (TypeScript → JavaScript)
Producao:        node build/server.js (JavaScript puro, maximo performance)
```