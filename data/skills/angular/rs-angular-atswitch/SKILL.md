---
name: rs-angular-atswitch
description: "Applies Angular @switch control flow syntax when writing Angular templates with conditional rendering based on property values. Use when user asks to 'create a component with switch', 'render based on role', 'show different content by value', 'use @switch in Angular', or 'conditional template rendering'. Enforces modern @switch syntax over legacy ngSwitch directive, with componentization guidance. Make sure to use this skill whenever generating Angular templates that need multi-value conditional rendering. Not for @if/@else conditionals, @for loops, or non-Angular frameworks."
---

# Angular @switch — Control Flow no Template

> Use `@switch` para renderizar blocos de HTML condicionalmente baseado em valores discretos de uma propriedade, sempre preferindo a sintaxe moderna sobre `ngSwitch`.

## Rules

1. **Use `@switch` em vez de `ngSwitch`** — a sintaxe moderna é mais legível e não requer importação de diretivas, porque é built-in no template engine do Angular 17+
2. **Use `@case` para cada valor possível** — cada valor discreto da propriedade recebe seu próprio bloco, porque mantém a lógica explícita e rastreável
3. **Sempre inclua `@default`** — cubra o caso fallback, porque valores inesperados não devem quebrar a UI
4. **Prefira `@switch` quando há valores discretos definidos** — se a propriedade tem 2-5 valores possíveis e bem definidos, `@switch` é melhor que múltiplos `@if`, porque comunica a intenção de "seleção entre opções"
5. **Não use `@switch` para muitos casos** — se tem mais de 5-6 cases, considere componentizar ou usar um map/dicionário, porque o template vira um monstro difícil de manter
6. **Componentize quando a lógica cresce** — se o template já tem `@switch` + `@if` + `@for`, separe em componentes menores, porque facilita manutenção e leitura

## How to write

### Estrutura básica do @switch

```typescript
// No component.ts — defina o tipo e a propriedade
type UserRole = 'admin' | 'editor' | 'viewer';

@Component({ ... })
export class SwitchComponent {
  userRole: UserRole = 'admin';

  setRole(role: UserRole) {
    this.userRole = role;
  }
}
```

```html
<!-- No template — @switch com @case e @default -->
@switch (userRole) {
  @case ('admin') {
    <p>Painel do Administrador</p>
  }
  @case ('editor') {
    <p>Painel do Editor</p>
  }
  @default {
    <p>Visualização padrão</p>
  }
}
```

## Example

**Before (sintaxe legada com ngSwitch):**
```html
<div [ngSwitch]="userRole">
  <p *ngSwitchCase="'admin'">Painel do Admin</p>
  <p *ngSwitchCase="'editor'">Painel do Editor</p>
  <p *ngSwitchDefault>Visualização padrão</p>
</div>
```

```typescript
// Requer importação da diretiva
imports: [CommonModule] // ou [NgSwitch, NgSwitchCase, NgSwitchDefault]
```

**After (sintaxe moderna com @switch):**
```html
@switch (userRole) {
  @case ('admin') {
    <p>Painel do Admin</p>
  }
  @case ('editor') {
    <p>Painel do Editor</p>
  }
  @default {
    <p>Visualização padrão</p>
  }
}
```

```typescript
// Nenhuma importação necessária — built-in no template
```

## Heuristics

| Situação | Ação |
|----------|------|
| Propriedade com 2-5 valores discretos (roles, status, tipos) | Use `@switch` |
| Condição booleana simples (true/false) | Use `@if/@else`, não `@switch` |
| Template com `@switch` + `@if` + `@for` aninhados | Componentize — separe em componentes menores |
| Mais de 5-6 cases | Considere dicionário de componentes ou map |
| Projeto legado com `ngSwitch` | Migre para `@switch` se Angular 17+ |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `<div [ngSwitch]="prop">` | `@switch (prop) { ... }` |
| `*ngSwitchCase="'value'"` | `@case ('value') { ... }` |
| `*ngSwitchDefault` | `@default { ... }` |
| `@switch` sem `@default` | Sempre inclua `@default` |
| `@switch` com 8+ cases no mesmo template | Componentize ou use estratégia de mapeamento |
| `imports: [NgSwitch]` para sintaxe nova | Nenhuma importação necessária |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
