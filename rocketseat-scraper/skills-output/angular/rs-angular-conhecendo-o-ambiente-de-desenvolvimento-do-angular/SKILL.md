---
name: rs-angular-ambiente-desenvolvimento
description: "Guides Angular development environment setup and toolchain understanding. Use when user asks to 'setup Angular', 'start Angular project', 'install Angular', 'configure Angular environment', or 'what tools do I need for Angular'. Explains Node.js, NPM, Angular CLI, VSCode extensions, and the build pipeline. Make sure to use this skill whenever setting up a new Angular project or explaining the Angular toolchain. Not for React, Vue, or other framework setups."
---

# Ambiente de Desenvolvimento Angular

> Configure e compreenda cada ferramenta do toolchain Angular antes de escrever codigo.

## Prerequisites

- **Node.js** (v18+) — executor de JavaScript fora do navegador, serve a aplicacao local
- **NPM** — gerenciador de dependencias (vem com o Node)
- **Angular CLI** (`@angular/cli`) — cria projetos, serve, builda
- **VSCode** — editor com extensoes Angular
- **Navegador moderno** — consume o output final (JS/CSS/HTML puro)

## Mental Model: A Analogia do Bolo

| Conceito | No Angular |
|----------|-----------|
| Ingredientes | Source code Angular (TypeScript, templates, SCSS) |
| Confeiteiro | Angular CLI + bibliotecas (`@angular/*`) — converte e unifica |
| Cozinha | Node.js — executa o CLI, cria servidor local |
| Loja/Vitrine | `ng serve` em `localhost:4200` |
| Consumidor | Navegador — so entende JS/CSS/HTML puro |

## Key Insight: O Navegador Nao Entende Angular

O navegador nao compreende `@Component`, `@Directive`, `@Pipe`, interpolacao, property binding, nem TypeScript. Todo codigo Angular passa por um build que converte para JavaScript, CSS e HTML puro. Quem faz isso e o Angular CLI (`ng serve` em dev, `ng build` para producao).

## Steps

### Step 1: Instalar Node.js
```bash
# Verificar instalacao
node --version  # v18+ requerido
npm --version
```

### Step 2: Instalar Angular CLI
```bash
npm install -g @angular/cli
# Ou usar sem instalar globalmente:
npx @angular/cli new meu-projeto
```

### Step 3: Criar e servir projeto
```bash
ng new meu-projeto
cd meu-projeto
ng serve
# Acesse localhost:4200
```

### Step 4: Extensoes VSCode recomendadas
| Extensao | Funcao |
|----------|--------|
| **Angular Language Service** | Verificacao de tipos em templates, autocomplete, deteccao de erros |
| **Angular Generator** | Gera componentes, pipes, services rapidamente (use manual primeiro para fixar sintaxe) |
| **Material Icon Theme** | Icones visuais por tipo de arquivo |

## Arquivos gerenciados pelo NPM

| Arquivo | Funcao |
|---------|--------|
| `package.json` | Lista dependencias e scripts |
| `package-lock.json` | Trava versoes exatas |
| `node_modules/` | Dependencias instaladas (nao commitar) |

## Angular CLI — Comandos essenciais

| Comando | O que faz |
|---------|-----------|
| `ng new` | Cria novo projeto |
| `ng serve` | Serve em `localhost:4200` com hot reload |
| `ng build` | Gera `dist/` com JS/CSS/HTML puro para deploy |
| `ng generate component` | Cria componente com arquivos |

## Heuristics

| Situacao | Faca |
|----------|------|
| Primeiro projeto Angular | Instale Node, NPM, Angular CLI nessa ordem |
| Quer aprender a sintaxe | Crie componentes manualmente antes de usar Angular Generator |
| Versao do Angular CLI no NPM | Indica a versao atual do framework |
| Erro ao servir | Verifique `node --version` (18+) e `ng version` |

## Anti-patterns

| Nao faca | Faca |
|----------|------|
| Achar que navegador entende TypeScript | Lembre: navegador so entende JS/CSS/HTML puro |
| Achar que SCSS e CSS nativo | SCSS e compilado para CSS puro pelo build |
| Pular `ng serve` e abrir HTML direto | Sempre sirva via `ng serve` — precisa do Node |
| Instalar Angular CLI localmente por projeto | Instale globalmente ou use `npx` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
