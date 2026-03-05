---
name: rs-angular-estrutura-inline-componente
description: "Applies Angular inline component structure rules when user asks to 'create a component', 'generate angular component', 'inline template', 'inline style', or 'small component'. Enforces when to use templateUrl vs template, styleUrls vs styles, and the --inline-style/--inline-template flags. Make sure to use this skill whenever generating or reviewing Angular components. Not for React, Vue, or non-Angular component creation."
---

# Estrutura Inline do Componente Angular

> Componentes Angular podem ter template e styles inline no TypeScript, mas padronize sempre a forma separada — inline so existe para voce conhecer, nao para usar no dia a dia.

## Rules

1. **Prefira sempre arquivos separados** — HTML, CSS e TypeScript em arquivos distintos, porque e o padrao do ecossistema Angular e facilita manutencao em aplicacoes grandes
2. **Nunca misture inline e separado no mesmo projeto** — padronize um unico estilo para todos os componentes, porque inconsistencia dificulta navegacao e onboarding
3. **Inline perde autocomplete de HTML e CSS** — o editor nao reconhece contexto dentro de strings TypeScript, porque o language server nao processa templates em propriedades string
4. **Use `template` e `styles` para inline** — diferente de `templateUrl` e `styleUrls` que referenciam arquivos externos
5. **Componentes grandes nunca devem ser inline** — muito template, muita logica e muitos estilos em um arquivo so e impossivel de manter
6. **Ao gerar inline via CLI, use as duas flags juntas** — `--inline-style --inline-template`, porque usar apenas uma cria inconsistencia

## How to write

### Componente padrao (RECOMENDADO)

```typescript
@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent { }
```

### Componente inline (apenas para conhecimento)

```typescript
@Component({
  selector: 'app-button-flat',
  template: `<button class="btn btn-flat">Limpar filtro</button>`,
  styles: [`
    .btn { /* estilos base */ }
    .btn-flat { /* estilos especificos */ }
  `]
})
export class ButtonFlatComponent { }
```

### Geracao via CLI

```bash
# Padrao (RECOMENDADO) — gera .html, .css, .ts, .spec.ts
ng generate component button

# Inline — gera apenas .ts e .spec.ts
ng generate component button-flat --inline-style --inline-template
```

## Example

**Before (mistura de padroes no projeto):**
```
src/app/
├── header/
│   ├── header.component.html    # separado
│   ├── header.component.css
│   └── header.component.ts
├── button/
│   └── button.component.ts      # inline
├── card/
│   ├── card.component.html      # separado
│   ├── card.component.css
│   └── card.component.ts
```

**After (padrao unico — todos separados):**
```
src/app/
├── header/
│   ├── header.component.html
│   ├── header.component.css
│   └── header.component.ts
├── button/
│   ├── button.component.html
│   ├── button.component.css
│   └── button.component.ts
├── card/
│   ├── card.component.html
│   ├── card.component.css
│   └── card.component.ts
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto novo | Padronize tudo separado desde o inicio |
| Componente com 1 linha de template | Ainda assim, mantenha separado por consistencia |
| Precisou de inline em um teste rapido | OK para prototipo, mas migre antes de commitar |
| Projeto legado com inline | Padronize gradualmente, nao misture mais |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|-----------|
| Metade dos componentes inline, metade separados | Padronize todos separados |
| Componente grande com `template:` inline | Use `templateUrl:` com arquivo separado |
| Apenas `--inline-template` sem `--inline-style` | Use as duas flags juntas ou nenhuma |
| CSS duplicado entre componente inline e separado | Extraia estilos compartilhados para um arquivo comum |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
