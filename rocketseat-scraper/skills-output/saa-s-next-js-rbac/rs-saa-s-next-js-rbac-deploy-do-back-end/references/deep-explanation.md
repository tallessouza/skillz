# Deep Explanation: Deploy do Back-end no Render

## Por que trocar SERVER_PORT por PORT

O Render seta automaticamente duas variaveis de ambiente para aplicacoes Node.js:
- `NODE_ENV=production`
- `NODE_MODULES_CACHE=true`

Alem disso, para **todos os runtimes**, ele seta a variavel `PORT` com a porta padrao do servico. O Render e quem decide em qual porta o servico roda internamente. Se voce usar uma variavel customizada como `SERVER_PORT`, o Render nao vai populá-la, e sua aplicacao vai tentar rodar numa porta diferente da que o Render espera.

## Por que usar tsup e nao tsc

O `tsc` (TypeScript Compiler) apenas transpila TypeScript para JavaScript, mas nao faz bundling. Isso significa que imports de pacotes internos do monorepo (como `@saas/auth` ou `@saas/env`) continuam como imports externos, e o Node nao consegue resolver esses paths no ambiente de producao.

O `tsup` usa o esbuild por baixo dos panos, o que permite:
- Bundling rapido
- Opcao `noExternal` para incluir pacotes internos no bundle final
- Source maps para debugging em producao (error tracking mostra codigo original, nao minificado)

## A armadilha do noExternal

Quando voce tem um monorepo com pacotes internos (ex: `packages/auth`, `packages/env`), esses pacotes sao resolvidos pelo workspace do pnpm em desenvolvimento. Porem, no build de producao, o Node puro nao entende esses imports. A opcao `noExternal` do tsup resolve isso compilando o codigo desses pacotes diretamente no bundle.

Sem `noExternal`, voce vera erros como:
```
Error: Cannot find module '@saas/env'
```

## Source maps em producao

O instrutor recomenda manter `sourcemap: true` no tsup. Motivo: o tsup minifica o codigo por padrao. Sem source maps, quando ocorre um erro em producao, os logs e ferramentas de error tracking mostram codigo minificado ilegivel. Com source maps, voce ve o codigo original que causou o erro.

## Ordem do start command

A ordem importa:
1. `prisma migrate deploy` — aplica migrations pendentes no banco
2. `prisma generate` — gera o Prisma Client (a pasta em `node_modules/.prisma`)
3. `node dist/http/server.js` — inicia o servidor

O `migrate deploy` nao roda o `generate` automaticamente (diferente do que o instrutor inicialmente pensou), entao ambos sao necessarios.

## Build filters no monorepo

Sem build filters, qualquer push no repositorio (mesmo mudancas apenas no frontend) triggera um novo deploy do backend. Isso desperdiça build minutes e causa downtime desnecessario. O filter `apps/web/**` como ignored path garante que apenas mudancas relevantes ao backend causem rebuild.

## Host 0.0.0.0

Por padrao, frameworks como Fastify bindam em `127.0.0.1` (localhost). No Render, o health check tenta acessar a porta de fora do container. Se o servidor so escuta em `127.0.0.1`, o Render nunca detecta que a porta esta ativa e o deploy fica em loop ate falhar. Usar `0.0.0.0` faz o servidor escutar em todas as interfaces de rede.

## Variaveis de ambiente compartilhadas front/back

O instrutor menciona uma armadilha: quando front e back compartilham o mesmo schema de validacao de env (ex: um unico `packages/env`), todas as variaveis precisam estar setadas em ambos os ambientes de deploy, mesmo que uma variavel so seja usada por um deles. O instrutor sugere que idealmente o schema deveria ser separado entre `server` e `client`.

## Regiao do deploy

O instrutor enfatiza que o backend DEVE estar na mesma regiao que o banco de dados. No caso, o banco (Neon) estava em US East (Ohio), entao o Render tambem foi configurado para US East 2 (Ohio), em vez do padrao Oregon (US West). Isso minimiza latencia nas queries.