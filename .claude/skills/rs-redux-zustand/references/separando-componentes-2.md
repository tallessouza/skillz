---
name: rs-redux-zustand-separando-componentes-2
description: "Enforces React component decomposition patterns when splitting monolithic pages into smaller focused components. Use when user asks to 'separate components', 'break down a page', 'extract component', 'split UI into components', or 'organize React component structure'. Applies one responsibility per component, typed props, meaningful names, and bottom-up extraction. Make sure to use this skill whenever refactoring large JSX into smaller reusable pieces. Not for state management (use criando-store-do-redux), API integration, or styling decisions (use rs-masterizando)."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: redux-zustand
  module: separando-componentes
  tags: [react, components, decomposition, props, refactoring, single-responsibility]
---

# Separando Componentes React

> Decomponha paginas monoliticas em componentes pequenos, cada um com uma unica responsabilidade, recebendo dados via props.

## Rules

1. **Um componente = uma responsabilidade visual** — `Header`, `Video`, `Module`, `Lesson`
2. **Extraia de baixo pra cima** — comece pelas folhas (Lesson), depois intermediarios (Module), depois containers
3. **Nomeie pelo dominio** — `Video` nao `PlayerWrapper`, `Lesson` nao `ListItem`
4. **Props tipadas com apenas o necessario** — passe `title` e `duration`, nao o objeto inteiro
5. **Ajuste indices para exibicao** — `moduleIndex + 1` para o usuario, porque arrays comecam em zero
6. **Cuidado com colisao de nomes** — icone `Video` vs componente `Video`: renomeie ou importe com alias

## Example

**Before (tudo numa pagina):**
```tsx
export function Player() {
  return (<div><header>...</header><ReactPlayer /><aside>modulos inline...</aside></div>)
}
```

**After (componentes separados):**
```tsx
export function Player() {
  return (<div><Header /><Video /><aside><Module moduleIndex={0} /><Module moduleIndex={1} /></aside></div>)
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| JSX se repete 2+ vezes | Extrair como componente |
| Secao com responsabilidade clara | Extrair mesmo sem repeticao |
| Indice exibido ao usuario | Somar 1 antes de renderizar |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Pagina com 200+ linhas JSX | Componentes de 20-50 linhas |
| Props com objeto inteiro | Props primitivas tipadas |
| `Section1`, `Part2` | `Header`, `Module`, `Lesson` |

## Troubleshooting

### Nome do componente colide com import de icone
**Symptom:** Import do icone `Video` do Lucide conflita com componente `Video`.
**Cause:** Ambos tem o mesmo nome no mesmo arquivo.
**Fix:** Encapsule o icone dentro do componente folha (Lesson) e mantenha o componente `Video` no pai.

## Deep reference library

- [deep-explanation.md](../../../data/skills/redux-zustand/rs-redux-zustand-separando-componentes-2/references/deep-explanation.md) — Estrategia bottom-up, colisao de nomes, evolucao de props
- [code-examples.md](../../../data/skills/redux-zustand/rs-redux-zustand-separando-componentes-2/references/code-examples.md) — Header, Video, Module, Lesson, Player final
