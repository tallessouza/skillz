---
name: rs-full-stack-link-para-sign-up
description: "Enforces Tailwind CSS link styling patterns when creating navigation links, call-to-action anchors, or interactive text elements. Use when user asks to 'create a link', 'add navigation', 'style an anchor tag', 'add hover effects to text', or 'build a signup/login link'. Applies Tailwind utility classes for typography, spacing, color, hover states, and transitions. Make sure to use this skill whenever styling anchor elements or interactive text with Tailwind. Not for button components, form inputs, or non-Tailwind CSS approaches."
---

# Link Estilizado com Tailwind CSS

> Estilize links com classes utilitárias do Tailwind combinando tipografia, espaçamento, cor e transições de hover numa única linha declarativa.

## Rules

1. **Use classes de tipografia para definir hierarquia visual** — `text-sm`, `font-semibold`, porque o tamanho e peso comunicam a importância do link na página
2. **Defina cor base e cor de hover separadamente** — `text-gray-100` + `hover:text-green-800`, porque feedback visual no hover indica interatividade
3. **Aplique transição com easing** — `transition ease-linear`, porque mudanças abruptas de cor parecem quebradas ao usuário
4. **Use margin-top e margin-bottom para espaçamento contextual** — `mt-10 mb-4`, porque o link precisa de respiro visual em relação aos elementos adjacentes
5. **Centralize texto de links standalone** — `text-center`, porque links de navegação secundária (como "Criar conta") são elementos de apoio e devem estar centralizados

## How to write

### Link de navegação secundária (signup/login)

```tsx
<a
  href="/signup"
  className="text-sm font-semibold text-gray-100 mt-10 mb-4 text-center hover:text-green-800 transition ease-linear"
>
  Criar conta
</a>
```

### Composição das classes

```
text-sm          → tamanho pequeno (texto secundário)
font-semibold    → peso semi-negrito (destaque sem exagero)
text-gray-100    → cor base clara (contraste em fundo escuro)
mt-10            → margin-top generosa (separação do botão acima)
mb-4             → margin-bottom menor (respiro inferior)
text-center      → centralização horizontal
hover:text-green-800 → cor de hover (feedback de interação)
transition       → habilita animação CSS
ease-linear      → curva de animação linear (início e fim suavizados)
```

## Example

**Before (link sem estilização):**

```tsx
<a href="/signup">Criar conta</a>
```

**After (com Tailwind aplicado):**

```tsx
<a
  href="/signup"
  className="text-sm font-semibold text-gray-100 mt-10 mb-4 text-center hover:text-green-800 transition ease-linear"
>
  Criar conta
</a>
```

## Heuristics

| Situação | Faça |
|----------|------|
| Link secundário abaixo de botão principal | `text-sm font-semibold` com margin-top generosa |
| Link em fundo escuro | `text-gray-100` ou `text-gray-200` para contraste |
| Qualquer mudança de cor no hover | Adicione `transition` para suavizar |
| Link standalone (não inline em texto) | `text-center` + margins verticais |
| Rota ainda não existe | Deixe o `href` pronto mesmo assim — evita retrabalho |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `<a style="color: gray">` | `<a className="text-gray-100">` |
| Hover sem transition | `hover:text-green-800 transition ease-linear` |
| Link colado no botão sem espaçamento | `mt-10 mb-4` para separação visual |
| `className="link"` com CSS custom | Classes utilitárias do Tailwind diretamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre composição de classes e escolha de easing
- [code-examples.md](references/code-examples.md) — Variações de links estilizados com Tailwind