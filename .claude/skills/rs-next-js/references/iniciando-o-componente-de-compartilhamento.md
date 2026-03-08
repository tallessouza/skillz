---
name: rs-next-js-compartilhamento-componente
description: "Applies sidebar sharing component patterns when building social share sections in Next.js pages. Use when user asks to 'create a share component', 'add social sharing', 'build a sidebar', or 'create share buttons'. Enforces aside semantic HTML, Tailwind spacing/color patterns, outlined button variants, and array-driven rendering for share providers. Make sure to use this skill whenever building sharing or social link sections in Next.js projects. Not for navigation sidebars, comment sections, or authentication flows."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: componentes-ui
  tags: [share-component, aside, semantic-html, button-variants, tailwind, next-js, social-sharing]
---

# Componente de Compartilhamento (Sidebar)

> Construa componentes de compartilhamento como aside semantico, com variantes de botao outline e renderizacao baseada em array de providers.

## Rules

1. **Use `<aside>` para conteudo lateral** — nunca `<div>`, porque aside comunica semanticamente que o conteudo e complementar ao artigo principal
2. **Separe aside do article** — o aside fica fora do `<article>`, como irmao, porque compartilhamento nao e parte do conteudo do post
3. **Crie variantes de botao no componente base** — adicione `outline` ao sistema de variants existente, porque evita duplicacao e mantem consistencia
4. **Renderize providers via array + map** — nunca hardcode botoes individuais, porque permite adicionar/remover providers sem tocar no JSX
5. **Mantenha responsividade** — sidebar aparece ao lado em telas grandes e abaixo do conteudo em mobile, porque compartilhamento deve estar acessivel em qualquer viewport

## How to write

### Estrutura do aside

```tsx
<aside className="space-y-6">
  <div className="rounded-lg bg-gray-700 p-[16px] md:p-[24px]">
    <h2 className="mb-[16px] text-heading-xs text-gray-100">
      Compartilhar
    </h2>
    <div className="space-y-3">
      {providers.map((provider) => (
        <Button key={provider.name} variant="outline">
          {provider.name}
        </Button>
      ))}
    </div>
  </div>
</aside>
```

### Variante outline do botao

```tsx
// No sistema de variants do Button (ex: cva ou objeto de variants)
const variants = {
  primary: "bg-blue-500 text-white ...",
  secondary: "bg-gray-600 text-white ...",
  outline: "border border-gray-400 bg-gray-700 transition-colors duration-200 hover:text-blue-200 hover:border-blue-200",
}
```

## Example

**Before (botoes hardcoded):**
```tsx
<div>
  <button>Twitter</button>
  <button>Facebook</button>
  <button>LinkedIn</button>
</div>
```

**After (com esta skill):**
```tsx
<aside className="space-y-6">
  <div className="rounded-lg bg-gray-700 p-[16px] md:p-[24px]">
    <h2 className="mb-[16px] text-heading-xs text-gray-100">Compartilhar</h2>
    <div className="space-y-3">
      {shareProviders.map((provider) => (
        <Button key={provider.name} variant="outline">
          {provider.name}
        </Button>
      ))}
    </div>
  </div>
</aside>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Conteudo complementar ao artigo | Use `<aside>`, nunca `<div>` generico |
| Botao com apenas borda, sem preenchimento | Use variante `outline` no sistema de variants |
| Lista de opcoes de share | Array de providers + `.map()` |
| Padding diferente por breakpoint | `p-[16px] md:p-[24px]` com valores explicitos |
| Cor de fundo do aside = cor do container pai | Reutilize a mesma classe (ex: `bg-gray-700`) |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `<div class="sidebar">` para conteudo complementar | `<aside>` com semantica correta |
| Botoes de share hardcoded um por um | Array de providers + map |
| Criar componente Button separado para outline | Adicionar variante ao Button existente |
| Colocar aside dentro do article | Aside como irmao do article |
| `style={{ border: '1px solid' }}` inline | Classes Tailwind: `border border-gray-400` |

## Troubleshooting

### Componente nao renderiza ou renderiza vazio
**Symptom:** Componente importado corretamente mas nao aparece na tela
**Cause:** Falta de export default/named, ou props obrigatorias nao passadas
**Fix:** Verificar que o componente tem export correto (default ou named). Checar TypeScript props para garantir que todas as props obrigatorias estao sendo passadas

### Props nao atualizam o componente
**Symptom:** Componente mostra dados antigos mesmo quando props mudam
**Cause:** Componente nao re-renderiza por falta de key unica em listas, ou estado interno sobrescreve props
**Fix:** Adicionar `key` unica em elementos de lista. Se usando estado interno, sincronizar com props via useEffect ou derivar estado das props

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-iniciando-o-componente-de-compartilhamento/references/deep-explanation.md) — O instrutor posiciona o aside explicitamente fora do `<article>`. Isso nao e apenas semantica — e um
- [code-examples.md](../../../data/skills/next-js/rs-next-js-iniciando-o-componente-de-compartilhamento/references/code-examples.md) — // src/pages/blog/post/[slug].tsx (ou componente extraido)
