# Deep Explanation: Variaveis Ambiente no Bun

## Por que o Bun nao precisa de dotenv

Diferente do Node.js (que so ganhou suporte experimental a .env no v20+), o Bun le arquivos de variáveis ambiente de forma automatizada em qualquer comando executado. Isso significa que `bun run`, `bun test`, ou qualquer script vai automaticamente carregar:

- `.env`
- `.env.local`
- `.env.development` / `.env.production` (conforme NODE_ENV)

O instrutor demonstra isso criando um `.env.local` com `DATABASE_URL` e rodando `bun drizzle-kit studio` — o valor ja esta disponivel em `process.env.DATABASE_URL` sem nenhuma configuracao adicional.

## A filosofia do env.ts

O instrutor enfatiza: "isso eu faco em todos os projetos". O padrao de criar um arquivo `env.ts` com validacao Zod nao eh especifico de Bun — eh uma boa pratica universal. A ideia:

1. **Fail fast** — se uma variavel esta faltando ou mal formatada, o app falha na inicializacao, nao em runtime
2. **Tipagem** — o objeto `env` exportado tem tipos corretos inferidos do schema Zod
3. **Single source of truth** — todo o codigo importa de `env.ts`, nunca acessa `process.env` diretamente

### O detalhe do `.min(1)`

O instrutor usa `z.string().url().min(1)` especificamente para evitar que alguem coloque uma string vazia. Sem o `min(1)`, uma variavel definida como `DATABASE_URL=` passaria na validacao de string mas falharia na conexao com o banco.

## Chalk para feedback visual

O instrutor adiciona chalk como dependencia de desenvolvimento para dar feedback colorido em scripts de CLI (como migrations). Isso eh descrito como "perfumaria" — nao essencial, mas melhora a DX:

```typescript
import chalk from 'chalk'
// apos rodar migrations:
console.log(chalk.greenBright('Migrations applied successfully'))
```

O chalk oferece cores de texto (`chalk.green()`) e cores de fundo (`chalk.bgGreen()`). Os metodos `Bright` como `greenBright` dao um tom mais claro.

## Ordem de prioridade dos .env no Bun

O Bun segue uma ordem de prioridade similar ao Next.js:
1. Variaveis de ambiente do sistema (maior prioridade)
2. `.env.local`
3. `.env.{NODE_ENV}` (ex: `.env.production`)
4. `.env`

Isso significa que `.env.local` sobrescreve `.env`, e variaveis do sistema sobrescrevem tudo.