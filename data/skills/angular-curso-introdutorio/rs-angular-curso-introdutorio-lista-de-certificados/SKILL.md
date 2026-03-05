---
name: rs-angular-intro-lista-certificados
description: "Applies Angular component reuse patterns when building list layouts. Use when user asks to 'create a list', 'display items', 'reuse component in a list', or 'build a certificate list' in Angular. Enforces max-width container pattern, width 100% for child components, and comment-based state toggling during development. Make sure to use this skill whenever building list views that repeat a component. Not for form creation, routing, or service logic."
---

# Lista de Certificados — Layout com Reuso de Componentes

> Ao construir listas em Angular, reaproveite componentes existentes dentro de containers com largura controlada.

## Rules

1. **Crie um container dedicado para a lista** — use uma `div` com classe propria (ex: `list-certificates`), porque separa responsabilidade de layout do conteudo
2. **Aplique `max-width` no container da lista** — mesmo valor do card principal (ex: `672px`), porque mantem consistencia visual entre estados da pagina
3. **Use `width: 100%` no container** — para que os itens filhos ocupem todo o espaco disponivel dentro do max-width, porque sem isso o componente fica "espremido"
4. **Comente o estado vazio enquanto nao ha logica dinamica** — use `Ctrl+;` para comentar blocos HTML, porque permite focar no layout sem quebrar o codigo existente
5. **Duplique o componente para simular a lista** — antes de ter dados dinamicos, repita o seletor do componente para validar o layout com multiplos itens
6. **Reaproveite componentes ja criados** — nunca recrie markup que ja existe como componente, porque reuso e rapido e mantem consistencia

## How to write

### Container da lista

```typescript
// No template do componente pai
<div class="list-certificates">
  <app-item-certificado></app-item-certificado>
  <app-item-certificado></app-item-certificado>
</div>
```

### CSS do container

```css
.list-certificates {
  max-width: 672px;
  width: 100%;
}
```

### Comentar estado vazio durante desenvolvimento

```html
<!-- Estado vazio comentado enquanto focamos no layout da lista -->
<!-- <div class="custom-card">
  <p>Nenhum certificado encontrado</p>
</div> -->

<div class="list-certificates">
  <app-item-certificado></app-item-certificado>
</div>
```

## Example

**Before (componente espremido sem width):**

```css
.list-certificates {
  max-width: 672px;
}
```

**After (com width 100% para ocupar o espaco):**

```css
.list-certificates {
  max-width: 672px;
  width: 100%;
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa exibir lista de itens | Crie container com max-width + width 100%, chame o componente de item |
| Ainda nao tem dados dinamicos | Comente o estado vazio, duplique o componente para simular |
| Layout precisa ser responsivo | max-width garante limite, width 100% garante fluides |
| Componente de item ja existe | Reutilize com o seletor, nunca copie o HTML interno |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Copiar HTML do item direto no pai | `<app-item-certificado>` (reusar componente) |
| Lista sem container proprio | `<div class="list-certificates">` com estilo dedicado |
| `max-width` sem `width: 100%` | Ambos juntos para layout responsivo |
| Implementar logica dinamica antes do layout | Comentar estado vazio, focar no layout primeiro |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
