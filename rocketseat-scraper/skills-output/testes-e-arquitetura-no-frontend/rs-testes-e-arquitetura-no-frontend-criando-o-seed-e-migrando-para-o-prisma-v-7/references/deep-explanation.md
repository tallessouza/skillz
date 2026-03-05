# Deep Explanation: Prisma v7 Migration e Seed

## Por que o Prisma reescreveu o Client em TypeScript?

O Prisma v7 nao foi apenas uma atualizacao de funcionalidades — foi uma **reescrita completa do core do client**. O client deixou de ser baseado em Rust e passou a ser 100% TypeScript. Tres motivos principais:

1. **Barreira de contribuicao** — O client em Rust dificultava contribuicoes da comunidade JavaScript/TypeScript. Poucos desenvolvedores web dominam Rust o suficiente para contribuir.

2. **Performance de comunicacao** — Embora Rust seja muito rapido, o bridge entre Rust e JavaScript introduzia overhead. A comunicacao entre os dois runtimes consumia tempo que anulava parte do ganho de performance do Rust.

3. **Compatibilidade com runtimes** — Runtimes como Deno e Cloudflare Workers tinham dificuldades com o binario Rust. Com TypeScript puro, a compatibilidade e nativa.

## Requisitos minimos importantes

- **Node.js**: Minimo 20.19, recomendado 22+
- **TypeScript**: Versao atualizada (target ES2023+)
- **package.json**: Precisa de `"type": "module"` para ESM

## O padrao do Adapter

No Prisma v6, o client se conectava diretamente ao banco. No v7, voce configura explicitamente um adapter:

```
Pool (pg) → Adapter (@prisma/adapter-pg) → PrismaClient
```

Isso separa responsabilidades: o Prisma cuida do ORM, o adapter cuida da conexao. Isso permite trocar o driver de banco sem mudar o codigo do Prisma.

## prisma.config.ts como hub de configuracao

Antes, tudo ficava no schema.prisma. Agora, o prisma.config.ts centraliza:
- Onde esta o schema
- Onde ficam as migrations
- Como executar o seed
- A URL do banco (via dotenv)

Isso e mais flexivel porque TypeScript permite logica condicional, imports dinamicos, e validacao em tempo de build.

## FakerJS para seeds e testes

O FakerJS (`@faker-js/faker`) gera dados realistas: nomes, frases, paragrafos, emails, datas, etc. Isso e valioso nao so para seeds mas tambem para testes end-to-end, onde dados realistas ajudam a identificar bugs que strings como "test123" nao revelam.

O padrao do seed: limpar a base primeiro (`deleteMany`), depois popular com quantidade configuravel via env (`SEED_COUNT`).