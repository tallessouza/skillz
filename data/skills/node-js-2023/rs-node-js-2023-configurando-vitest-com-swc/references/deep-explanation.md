# Deep Explanation: Configurando Vitest com SWC no NestJS

## Por que SWC e nao ESBuild?

O Vitest por padrao usa o ESBuild (via Vite) para compilar TypeScript para JavaScript. O problema e que o ESBuild **nao entende decorators** — que sao a base do NestJS (`@Controller`, `@Injectable`, `@Module`, etc.).

O SWC (Speedy Web Compiler) e uma plataforma feita em Rust que:
- Tem velocidade comparavel ao ESBuild
- **Suporta decorators nativamente**
- E recomendado pela propria documentacao do NestJS

Essa e a razao principal da configuracao: sem SWC, os testes simplesmente nao compilam em projetos NestJS.

## Por que separar configs de teste?

O instrutor enfatiza que testes unitarios e testes e2e tem naturezas diferentes:
- **Unitarios** testam funcoes/classes isoladas
- **E2E** simulam o usuario acessando rotas da aplicacao

Por isso, configs separadas permitem:
- Filtrar quais arquivos cada comando roda (via `include`)
- Ter configuracoes especificas para cada tipo
- Scripts independentes no package.json

A convencao e2e usa extensao `.e2e-spec.ts` para diferenciar de `.spec.ts` (unitarios).

## O problema do target com letra maiuscula

O TypeScript aceita `"target": "ES2022"` normalmente, mas o SWC/Vitest pode ter problemas com a casing. O erro `UNKNOWN VARIANT ES2021` aparece quando o target esta em maiuscula. Solucao simples: sempre usar minuscula (`es2022`).

## NodeTargetMapping — como escolher o target correto

No Wiki do TypeScript no GitHub existe uma tabela chamada NodeTargetMapping que mapeia:
- Node 16 → es2021
- Node 18 → es2022
- Node 20 → es2023

A regra e: use a versao LTS do Node que vai rodar em producao e consulte essa tabela.

## tsconfig paths e vite-tsconfig-paths

O NestJS por padrao gera imports relativos longos como `../../../src/prisma/prisma.service`. Configurando `paths` no tsconfig com `"@/*": ["./src/*"]`, todas as importacoes podem usar `@/prisma/prisma.service`.

O plugin `vite-tsconfig-paths` faz o Vitest entender esses aliases, ja que o Vitest roda sobre o Vite que tem seu proprio sistema de resolucao de modulos.

## globals: true e o types no tsconfig

Quando `globals: true` esta ativo na config do Vitest, funcoes como `describe`, `test`, `expect` ficam disponiveis globalmente sem import. Porem, o TypeScript nao sabe disso e acusa erro de tipo. A solucao e adicionar `"vitest/globals"` no array `types` do tsconfig.

## Por que NestJS usa Jest por padrao mas Vitest e melhor?

O NestJS vem configurado com Jest, mas o Vitest oferece:
- Velocidade superior (ESM nativo, compilacao via SWC/ESBuild)
- Compatibilidade com API do Jest (mesma sintaxe)
- Melhor integracao com ecossistema Vite
- Hot module replacement nos testes (watch mode mais rapido)

A propria documentacao do NestJS tem uma secao dedicada a configurar Vitest como alternativa.