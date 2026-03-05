---
name: rs-angular-intro-vscode-extensoes
description: "Applies recommended VS Code extensions setup when configuring an Angular development environment. Use when user asks to 'setup Angular project', 'configure VS Code for Angular', 'install Angular extensions', or 'start Angular development'. Ensures Angular Language Service, EditorConfig, and Snippets are installed. Make sure to use this skill whenever setting up a new Angular workspace or recommending IDE configuration. Not for React, Vue, or non-Angular editor setups."
---

# VS Code + Extensoes para Angular

> Ao configurar um ambiente Angular, instale as extensoes essenciais no VS Code antes de criar o projeto.

## Prerequisites

- Node.js instalado e configurado
- Angular CLI instalado (`ng version` funciona)
- VS Code instalado (download em code.visualstudio.com)

## Extensoes obrigatorias

### 1. Angular Language Service
- **ID:** `Angular.ng-template`
- Autocomplete, erros em templates, navegacao entre componentes
- Sem esta extensao, templates HTML sao tratados como texto puro

### 2. EditorConfig for VS Code
- **ID:** `EditorConfig.EditorConfig`
- Angular CLI gera `.editorconfig` por padrao no template do projeto
- Garante indentacao consistente em todo o projeto
- Sem esta extensao, o arquivo `.editorconfig` e ignorado pelo editor

### 3. Angular Snippets (Angular 17+)
- **ID:** `Mikael.Angular-BeastCode` (ou similar com snippets Angular 17)
- Snippets funcionam para Angular 17, 18 e 19 porque a sintaxe base e compativel
- Sugere estruturas de componentes, services, pipes automaticamente

## Extensao opcional

### Material Icon Theme
- **ID:** `PKief.material-icon-theme`
- Adiciona icones visuais por tipo de arquivo (`.component.ts`, `.service.ts`, `.module.ts`)
- Facilita identificacao rapida de arquivos em projetos Angular que tem muitos arquivos com nomes similares

## Verificacao

```bash
# Verificar extensoes instaladas
code --list-extensions | grep -i angular
code --list-extensions | grep -i editorconfig
```

Resultado esperado:
```
Angular.ng-template
EditorConfig.EditorConfig
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Novo projeto Angular | Instalar as 3 extensoes obrigatorias antes de `ng new` |
| Versao do Angular > snippets | Snippets de versao anterior funcionam, porque sintaxe e retrocompativel |
| Time com multiplos editores | EditorConfig e essencial para consistencia de indentacao |
| Projeto legado Angular | Mesmas extensoes se aplicam |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
