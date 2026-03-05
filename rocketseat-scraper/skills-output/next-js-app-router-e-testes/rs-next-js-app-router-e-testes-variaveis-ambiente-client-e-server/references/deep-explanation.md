# Deep Explanation: Variaveis Ambiente Client e Server no Next.js

## Por que o Next.js separa variaveis?

O Next.js faz uma distincao fundamental entre codigo que roda no servidor e codigo que roda no browser (Client Components). Variaveis de ambiente sem o prefixo `NEXT_PUBLIC_` sao **intencionalmente removidas** do bundle client-side. Isso e um mecanismo de seguranca: chaves de API, secrets de banco de dados e outras informacoes sensiveis nunca devem chegar ao browser do usuario.

## O problema da validacao unificada

Quando voce cria um unico schema Zod validando todas as variaveis (server + client) e importa esse arquivo em um Client Component, o Zod vai tentar validar variaveis que **nao existem** no contexto client. O `process.env.APP_URL` retorna `undefined` dentro de um Client Component, causando erro de validacao.

A solucao ingenue seria criar ifs ou schemas separados manualmente. Mas o pacote t3-env resolve isso de forma elegante.

## Por que runtimeEnv precisa repetir process.env?

O instrutor destaca um detalhe importante: o Next.js faz **tree-shaking de variaveis de ambiente**. Durante o build, o Next varre o codigo procurando referencias literais a `process.env.NOME_DA_VARIAVEL`. Se nao encontra nenhuma referencia, ele **remove** a variavel do bundle.

O campo `runtimeEnv` no t3-env serve como um "hack" para que o Next.js veja as referencias `process.env.X` e mantenha as variaveis no build. Sem isso, mesmo que a variavel exista no `.env`, ela sera removida pelo processo de otimizacao do Next.

## t3-env: leve e pratico

O pacote `@t3-oss/env-nextjs` e extremamente leve e usa Zod internamente. Como projetos Next.js modernos ja usam Zod para validacao de formularios, APIs, etc., nao ha dependencia adicional significativa.

O t3-env fornece:
- **Separacao explicita** entre variaveis server e client
- **Validacao em tempo de build** — se faltar uma variavel, o build falha com mensagem clara
- **Type-safety** — autocomplete para `env.NOME` no editor
- **Protecao em dev** — se voce tentar acessar `env.APP_URL` em um Client Component, recebe erro imediato

## Fluxo de seguranca

```
.env.local
├── APP_URL=https://app.com          → Apenas Server Components, Route Handlers
├── DATABASE_URL=postgres://...       → Apenas Server Components
├── API_SECRET=sk-123                 → Apenas Server Components
└── NEXT_PUBLIC_API_URL=https://api   → Server + Client Components
```

O prefixo NEXT_PUBLIC_ e a **unica forma** de expor uma variavel para o client-side. Isso e by design do Next.js para prevenir vazamento acidental de dados sensiveis.

## Quando usar cada contexto

**Server (sem prefixo):**
- URLs de banco de dados
- API keys e secrets
- Tokens de servicos externos
- Configuracoes internas do servidor

**Client (com NEXT_PUBLIC_):**
- URL base da API publica
- IDs de analytics (Google Analytics, etc.)
- Feature flags publicas
- Configuracoes de UI que dependem do ambiente