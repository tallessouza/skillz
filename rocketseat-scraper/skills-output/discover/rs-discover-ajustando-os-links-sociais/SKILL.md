---
name: rs-discover-ajustando-links-sociais
description: "Applies social link hover circle effect patterns when styling icon links with CSS. Use when user asks to 'style social icons', 'add hover effect to links', 'create circle icon buttons', 'style social media links', or 'add transition to icons'. Enforces padding-based circle technique with border-radius 50%, smooth transitions, and flexbox centering. Make sure to use this skill whenever creating social link sections with hover states. Not for general button styling, navigation menus, or non-icon link patterns."
---

# Ajustando Links Sociais com Hover Circular

> Links sociais usam padding + border-radius 50% no estado normal (sem background visivel) e revelam o circulo colorido no hover com transicao suave.

## Rules

1. **Envolva cada icone em uma tag `<a>`** — com `href` correto e `target="_blank"`, porque o usuario deve ser levado a uma nova aba sem sair da pagina atual
2. **Coloque border-radius no estado normal, nao no hover** — porque a transicao do background sem border-radius cria um quadrado temporario feio durante a animacao
3. **Use padding no `<a>` para criar o espaco do circulo** — o padding define o tamanho da bolinha, tipicamente 16px
4. **Use `display: flex` + `align-items: center` + `justify-content: center` no `<a>`** — porque garante alinhamento perfeito do icone no centro do circulo
5. **Aplique `transition` no estado normal, nao no hover** — para que a transicao funcione tanto na entrada quanto na saida do mouse
6. **O gap entre icones pode ser desnecessario se o padding ja cria o espacamento** — avalie visualmente se o padding dos links ja fornece espaco suficiente entre eles

## How to write

### HTML: Links sociais com target blank

```html
<div class="social-links">
  <a href="https://github.com/usuario" target="_blank">
    <img src="icon-github.svg" alt="GitHub">
  </a>
  <a href="https://instagram.com/usuario" target="_blank">
    <img src="icon-instagram.svg" alt="Instagram">
  </a>
  <a href="https://linkedin.com/in/usuario" target="_blank">
    <img src="icon-linkedin.svg" alt="LinkedIn">
  </a>
</div>
```

### CSS: Circulo com hover suave

```css
.social-links a {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border-radius: 50%;
  transition: background 0.2s;
}

.social-links a:hover {
  background: #2B2B2B; /* cor do design */
}
```

## Example

**Before (border-radius so no hover — bug visual):**

```css
.social-links a:hover {
  background: #2B2B2B;
  padding: 16px;
  border-radius: 50%;
}
```

Resultado: ao tirar o mouse, border-radius some instantaneamente mas background leva 0.2s para sumir, criando um quadrado temporario.

**After (border-radius no estado normal):**

```css
.social-links a {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border-radius: 50%;
  transition: background 0.2s;
}

.social-links a:hover {
  background: #2B2B2B;
}
```

Resultado: circulo aparece e desaparece suavemente, sem artefatos visuais.

## Heuristics

| Situation | Do |
|-----------|-----|
| Icones desalinhados dentro do circulo | Adicione `display: flex` + `align-items: center` + `justify-content: center` no `<a>` |
| Espacamento entre icones irregular | Remova `gap` e deixe o `padding` dos links criar o espaco naturalmente |
| Transicao cria quadrado temporario | Mova `border-radius: 50%` para o estado normal (fora do `:hover`) |
| Link social deve abrir nova aba | Use `target="_blank"` no `<a>` |
| Tamanho do circulo no hover | Ajuste o valor do `padding` (16px e um bom ponto de partida) |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `border-radius` apenas no `:hover` | `border-radius: 50%` no estado normal do `<a>` |
| `transition` dentro do `:hover` | `transition` no seletor base do elemento |
| `<img>` sem `<a>` envolvendo | `<a href="..." target="_blank"><img></a>` |
| `gap` + `padding` duplicando espacamento | Avalie se apenas `padding` no `<a>` ja resolve |
| Icone sem flexbox de centralizacao | `display: flex; align-items: center; justify-content: center` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre transicoes, border-radius e alinhamento
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes