# Deep Explanation: Aliases de Importação

## Por que aliases existem

O problema central: quando um projeto cresce e tem pastas aninhadas (ex: `src/modules/billing/workers/process/`), importar um arquivo da raiz do `src/` requer navegar varios niveis acima com `../../../../../../`. Isso causa dois problemas:

1. **Legibilidade** — quem faz manutencao nao sabe pra onde `../../../../env` aponta sem contar os niveis mentalmente
2. **Produtividade** — ao digitar manualmente, voce fica contando `../` ate chegar no diretorio certo

## Como funciona tecnicamente

O TypeScript resolve aliases em tempo de compilacao/checagem de tipos. O `baseUrl` define o diretorio raiz a partir do qual os `paths` sao resolvidos.

```json
{
  "baseUrl": ".",
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

Quando o compilador encontra `import { env } from '@/env'`, ele:
1. Ve que o import comeca com `@/`
2. Substitui `@/` por `./src/`
3. Resolve como `./src/env`

O asterisco (`*`) e um wildcard — captura tudo depois do `@/` e substitui no destino.

## VS Code autocomplete

Apos configurar os paths no tsconfig, o VS Code automaticamente sugere arquivos usando o alias `@/`. Ao digitar `@/` e acionar o autocomplete, ele lista todos os arquivos dentro de `src/`.

## Quando NAO usar

O instrutor enfatiza: **nao use alias para tudo**. Se o arquivo esta proximo (mesmo diretorio ou um nivel acima), o caminho relativo e mais curto:

- `./env` e mais curto que `@/env` quando voce ja esta em `src/`
- `../utils` e mais curto que `@/utils` quando voce esta em `src/modules/`

A regra pratica: se voce precisa de 3 ou mais `../`, use o alias.

## Runners e compatibilidade

- **tsx** — le o tsconfig.json automaticamente, os aliases funcionam sem configuracao extra
- **ts-node** — precisa do pacote `tsconfig-paths` registrado
- **Vitest** — precisa de `resolve.alias` no `vite.config.ts`
- **Jest** — precisa de `moduleNameMapper` no `jest.config.ts`

O instrutor menciona que "mais pra frente a gente vai ter que configurar isso pra parte de testes", confirmando que o runner de testes precisa de configuracao separada.

## baseUrl: ponto vs src

O instrutor usa `"baseUrl": "."` (raiz do projeto) em vez de `"baseUrl": "./src"`. Ambos funcionam, mas:
- Com `"."`, os paths precisam incluir `./src/*` explicitamente
- Com `"./src"`, os paths poderiam ser apenas `./*`
- Usar `"."` e mais explicito e evita confusao sobre de onde os paths partem