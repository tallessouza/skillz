---
name: rs-angular-cli-global-vs-npx
description: "Applies correct Angular project creation strategy using global CLI install vs npx command. Use when user asks to 'create angular project', 'start angular app', 'ng new', 'setup angular', or 'init angular'. Guides version management, flag usage, and Node.js compatibility. Make sure to use this skill whenever creating or scaffolding Angular projects. Not for Angular component generation, routing setup, or runtime configuration."
---

# Angular CLI Global vs NPX

> Escolha entre instalacao global do Angular CLI e o comando npx com base na necessidade de flexibilidade de versao.

## Rules

1. **Use npx para flexibilidade de versao** — `npx @angular/cli new projeto` nao `npm install -g @angular/cli`, porque npx permite especificar qualquer versao sem desinstalar/reinstalar
2. **Especifique versao quando necessario** — `npx @angular/cli@15 new projeto` nao `npx @angular/cli new projeto`, porque sem versao ele baixa a ultima e pode ser incompativel com seu Node.js
3. **Verifique compatibilidade Node.js antes de criar** — consulte a tabela de version compatibility do Angular, porque versoes incompativeis causam erros silenciosos
4. **Passe flags para evitar prompts interativos** — `--ssr=false --style=scss` no comando de criacao, porque automatiza o setup e garante consistencia
5. **Use nvm para ambientes dinamicos** — alterne versoes do Node.js com nvm ao trabalhar com multiplas versoes Angular, porque desinstalar Node.js manualmente e improdutivo

## Decision framework

| Situacao | Abordagem |
|----------|-----------|
| Trabalha sempre com mesma versao Angular | Global CLI (`npm install -g @angular/cli@20`) |
| Precisa criar projetos em versoes diferentes | npx (`npx @angular/cli@{version} new`) |
| Ambiente de CI/CD | npx com versao pinada |
| Aprendizado/curso | npx (mais flexivel) |

## How to create

### Com npx (recomendado)

```bash
# Ultima versao
npx @angular/cli new meu-projeto

# Versao especifica
npx @angular/cli@15 new meu-projeto

# Com flags de configuracao
npx @angular/cli@20 new meu-projeto --ssr=false --style=scss
```

### Com CLI global

```bash
# Instalar globalmente (ultima versao)
npm install -g @angular/cli

# Instalar versao especifica
npm install -g @angular/cli@19

# Criar projeto
ng new meu-projeto

# Com flags
ng new meu-projeto --ssr=false --style=scss
```

## Example

**Before (troca manual de versao):**
```bash
npm install -g @angular/cli@19
ng new projeto-v19
# Agora precisa da v15...
npm uninstall -g @angular/cli
npm install -g @angular/cli@15
ng new projeto-v15
```

**After (com npx):**
```bash
npx @angular/cli@19 new projeto-v19
npx @angular/cli@15 new projeto-v15
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Erro ao criar projeto com versao antiga | Verificar compatibilidade Node.js na docs do Angular |
| Precisa alternar Node.js frequentemente | Instalar nvm |
| Comando npx lento | Normal — ele baixa temporariamente. Aceitar trade-off |
| Projeto em equipe | Documentar versao exata no README |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `npm install -g @angular/cli` sem especificar versao quando precisa de versao especifica | `npm install -g @angular/cli@19` ou use npx |
| Desinstalar/reinstalar CLI global para cada versao | Use `npx @angular/cli@{version} new` |
| Criar projeto Angular 15 com Node.js 22 | Verifique version compatibility, use nvm para trocar Node |
| Ignorar prompts do `ng new` sem saber o padrao | Passe flags explicitamente: `--ssr=false --style=scss` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
