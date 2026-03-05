# Deep Explanation: Path Aliases e Vitest Globals

## Por que path aliases importam

O instrutor destaca que em projetos com estrutura de pastas simples, caminhos relativos parecem aceitaveis. Mas conforme o projeto cresce (e em DDD a estrutura cresce muito), os imports relativos se tornam ingerenciaveis: `../../../domain/entities/answer.ts`. O alias `@/` resolve isso de forma definitiva.

### Como funciona o mapeamento

No `tsconfig.json`:
- `baseUrl: "."` — define a raiz do projeto como ponto de partida para resolucao
- `paths: { "@/*": ["./src/*"] }` — tudo que comecar com `@/` sera resolvido a partir de `./src/`

Isso e uma feature **do TypeScript**, nao do runtime. O TypeScript resolve os tipos, mas o bundler/runner precisa de um plugin para resolver em tempo de execucao.

## Por que o Vitest precisa de plugin separado

O Vitest usa Vite internamente, e o Vite tem seu proprio sistema de resolucao de modulos. Ele **nao le automaticamente** os paths do tsconfig. Por isso e necessario instalar `vite-tsconfig-paths` — um plugin que faz a ponte entre a configuracao do TypeScript e o resolver do Vite.

Sem esse plugin, o TypeScript vai validar os tipos corretamente com `@/`, mas ao rodar os testes, o Vitest vai falhar com "module not found".

## Vitest globals — eliminando imports repetitivos

Por padrao, o Vitest exige import explicito de cada funcao: `import { expect, test, describe, it, beforeEach } from 'vitest'`. Isso e seguro mas verboso.

Com `globals: true` no `vite.config.ts`, todas essas funcoes ficam disponiveis globalmente — similar ao comportamento do Jest.

O passo que muitos esquecem: **adicionar `"vitest/globals"` em `types` no tsconfig**. Sem isso, o TypeScript nao sabe que essas funcoes existem no escopo global e marca erro. O runtime funciona, mas o editor mostra erros vermelhos.

## Ordem de configuracao

1. Instalar dependencia: `npm i -D vite-tsconfig-paths`
2. Criar/editar `vite.config.ts` com plugin e globals
3. Editar `tsconfig.json` com baseUrl, paths e types
4. Remover imports relativos e imports do vitest dos testes
5. Rodar testes para validar