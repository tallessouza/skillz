---
name: rs-next-js-eslint-prettier-lefthook
description: "Applies ESLint, Prettier, and Lefthook configuration when setting up a Next.js project or configuring code quality tools. Use when user asks to 'setup linting', 'configure prettier', 'add git hooks', 'setup lefthook', 'configure eslint', or 'setup code quality'. Ensures pre-commit and pre-push hooks enforce formatting and type checking. Make sure to use this skill whenever setting up a new Next.js project's code quality pipeline. Not for runtime configuration, deployment, or CI/CD pipeline setup."
---

# Configurando ESLint, Prettier e Lefthook

> Configure Prettier para formatacao, ESLint para boas praticas, e Lefthook para barrar codigo quebrado antes de commit/push.

## Rules

1. **Prettier e formatacao, ESLint e qualidade** — Prettier cuida da aparencia (aspas, tabs, largura de linha), ESLint analisa logica e boas praticas, porque misturar responsabilidades causa conflitos entre as ferramentas
2. **Instale eslint-config-prettier e eslint-plugin-prettier** — esses pacotes fazem ESLint e Prettier trabalharem juntos sem conflito, porque sem eles as regras se contradizem
3. **Lefthook no pre-commit e pre-push** — pre-commit roda formatting check, pre-push roda typecheck, porque cada momento barra um tipo diferente de erro
4. **Execute `pnpx lefthook install` apos configurar** — sem esse comando os git hooks nao sao registrados, porque o Lefthook precisa instalar os hooks no `.git/hooks/`
5. **Crie `.vscode/settings.json` no projeto** — sobrescreve configuracoes individuais dos devs, porque garante que todo o time usa o mesmo padrao de formatacao
6. **Next.js ja inclui ESLint** — nao reinstale, apenas estenda a configuracao existente, porque o `create-next-app` ja adiciona eslint como dependencia

## How to write

### Instalacao de dependencias

```bash
pnpm add -D prettier eslint-config-prettier eslint-plugin-prettier lefthook
```

### .prettierrc

```json
{
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 80
}
```

### lefthook.yml

```yaml
pre-commit:
  commands:
    check:
      run: pnpm format

pre-push:
  commands:
    validate:
      run: pnpm validate:typecheck
```

### Scripts no package.json

```json
{
  "scripts": {
    "format": "prettier --check .",
    "validate:typecheck": "tsc --noEmit"
  }
}
```

### .vscode/settings.json (padrao do time)

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

## Example

**Before (sem ferramentas configuradas):**
```
- Dev A usa aspas duplas, Dev B usa aspas simples
- Codigo com erro de tipagem sobe pro repositorio
- Cada dev tem formatacao diferente no VS Code
- git push envia codigo quebrado sem nenhuma barreira
```

**After (com Prettier + ESLint + Lefthook):**
```
- Prettier forca aspas simples em todo o projeto
- ESLint aponta erros de boas praticas no save
- .vscode/settings.json garante padrao uniforme
- pre-commit barra formatting incorreto
- pre-push barra erros de tipagem (tsc --noEmit)
- Codigo quebrado nunca chega ao repositorio
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto Next.js novo | Nao reinstale ESLint, apenas adicione prettier e lefthook |
| Time com VS Code | Sempre crie `.vscode/settings.json` no repo |
| Projeto com testes | Adicione script de test no pre-push do lefthook |
| Ja usa Husky | Lefthook substitui Husky — remova um antes de adicionar o outro |
| Prettier conflita com ESLint | Instale `eslint-config-prettier` para desativar regras conflitantes |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Instalar ESLint em projeto Next.js (ja vem) | Apenas estender com plugins |
| Configurar git hooks manualmente em `.git/hooks/` | Usar Lefthook para gerenciar hooks declarativamente |
| Rodar typecheck no pre-commit | Rodar typecheck no pre-push (e rapido no pre-commit) |
| Esquecer `pnpx lefthook install` | Sempre executar apos criar `lefthook.yml` |
| Cada dev configurar VS Code individualmente | Criar `.vscode/settings.json` no repositorio |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-configurando-es-lint-prettier-e-lefthook/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-configurando-es-lint-prettier-e-lefthook/references/code-examples.md)
