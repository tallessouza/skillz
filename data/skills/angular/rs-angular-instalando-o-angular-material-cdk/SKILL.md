---
name: rs-angular-instalando-angular-material-cdk
description: "Applies Angular CDK installation pattern when user asks to 'install Angular Material', 'add drag and drop', 'add dialog modal', 'setup CDK', or 'add Angular Material partially'. Installs only @angular/cdk instead of full Angular Material when project needs specific primitives (drag-drop, dialog) without pre-built themes. Make sure to use this skill whenever adding Angular Material features to a custom-styled project. Not for full Angular Material theming setup or component library integration."
---

# Instalando o Angular Material CDK

> Quando o projeto tem layout proprio, instale apenas o CDK em vez do Angular Material completo.

## Prerequisitos

- Projeto Angular existente com `package.json`
- Node.js e npm configurados

## Decisao: CDK vs Angular Material completo

| Cenario | Instalar |
|---------|----------|
| Projeto com design system proprio, precisa apenas de primitivos (drag-drop, dialog, overlay) | `@angular/cdk` |
| Projeto que aceita componentes pre-estilizados com temas Material | `@angular/material` via `ng add` |

## Steps

### Step 1: Instalar o CDK com versao fixa

```bash
npm install @angular/cdk@19.2.11
```

Fixar a versao evita quebras de compatibilidade, porque APIs do CDK mudam entre majors.

### Step 2: Verificar instalacao

Confirmar no `package.json` que `@angular/cdk` aparece em `dependencies` com a versao correta.

### Step 3: Importar modulos conforme necessidade

```typescript
// Apenas quando for usar drag and drop:
import { DragDropModule } from '@angular/cdk/drag-drop';

// Apenas quando for usar dialog/modal:
import { DialogModule } from '@angular/cdk/dialog';
```

Nao importe tudo de uma vez. Importe o modulo especifico quando for implementar a funcionalidade.

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| `ng add @angular/material` quando so precisa de drag-drop e dialog | `npm install @angular/cdk@versao` |
| Instalar sem fixar versao (`npm install @angular/cdk`) | Sempre especificar versao: `@angular/cdk@19.2.11` |
| Importar todos os modulos CDK no app.module | Importar apenas o modulo necessario no componente que usa |

## Verificacao

- `@angular/cdk` aparece em `dependencies` no `package.json`
- A versao bate com a usada no curso (19.2.11)
- Nenhum tema Material foi adicionado ao `angular.json`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
