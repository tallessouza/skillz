# Deep Explanation: Configurando ESLint e Prettier no NestJS

## Por que o `no-useless-constructor` quebra no NestJS

No NestJS, o padrao de injecao de dependencia (DI) usa construtores que recebem servicos como parametros:

```typescript
constructor(private readonly appService: AppService) {}
```

O corpo do construtor esta vazio — o TypeScript automaticamente cria a propriedade `this.appService` pelo modificador `private`. O ESLint, analisando o JavaScript resultante (ou o padrao da regra), ve um construtor que "nao faz nada" e reclama. Mas esse construtor e essencial para o DI do NestJS funcionar.

A solucao e desabilitar apenas essa regra especifica, nao o ESLint inteiro. O instrutor inicialmente tentou desabilitar `no-new` antes de perceber que a regra correta era `no-useless-constructor`.

## Rocketseat ESLint Config

O pacote `@rocketseat/eslint-config` fornece presets prontos:
- `@rocketseat/eslint-config/node` — para projetos Node.js/backend
- `@rocketseat/eslint-config/react` — para projetos React
- `@rocketseat/eslint-config/next` — para projetos Next.js

Isso abstrai dezenas de regras e plugins em um unico `extends`, reduzindo configuracao manual.

## Por que ignorar `dist/`

O NestJS compila TypeScript para JavaScript na pasta `dist/`. Esses arquivos gerados:
- Nao seguem as mesmas convencoes do codigo fonte
- Sao regenerados a cada build
- Nao devem ser editados manualmente

Sem o `.eslintignore`, o ESLint reporta erros nesses arquivos gerados, poluindo a lista de problemas no VSCode e no terminal.

## Fix-on-save vs CLI

O instrutor mostra duas abordagens complementares:
1. **Fix-on-save no VSCode** — corrige automaticamente ao salvar cada arquivo (Ctrl+S)
2. **CLI com `pnpm run lint`** — corrige todos os arquivos de uma vez, util para CI/CD ou correcao em massa

O script `lint` do NestJS ja vem com a flag `--fix` configurada no `package.json`.