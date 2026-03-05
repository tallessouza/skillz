---
name: rs-tailwind-dark-mode
description: "Applies Tailwind CSS dark mode patterns when writing UI components with light/dark theme support. Use when user asks to 'add dark mode', 'create a dark theme', 'style for light and dark', 'toggle theme', or any Tailwind component with theme variants. Enforces dark: prefix usage, proper color contrast pairs, and OS-level theme response. Make sure to use this skill whenever generating Tailwind markup that needs theme awareness. Not for CSS-in-JS theming, styled-components, or non-Tailwind dark mode implementations."
---

# Dark Mode no Tailwind

> Use o prefixo `dark:` para definir estilos alternativos que ativam automaticamente quando o sistema operacional do usuario esta em dark mode.

## Rules

1. **Use o prefixo `dark:` por elemento** — cada elemento que muda no dark mode recebe suas proprias classes `dark:`, porque o Tailwind aplica dark mode por classe, nao globalmente
2. **Defina pares de contraste** — se o fundo claro e `bg-slate-50`, o fundo escuro deve ser `dark:bg-slate-900`, porque sem par explicito o elemento fica ilegivel em um dos temas
3. **Texto acompanha o fundo** — `text-slate-900` no light precisa de `dark:text-slate-100`, porque contraste e acessibilidade dependem da combinacao fundo+texto
4. **Textos secundarios usam tons intermediarios** — paragrafos e textos de apoio usam `dark:text-slate-400` em vez de `dark:text-slate-100`, porque cria hierarquia visual
5. **Botoes precisam de contraste invertido no dark** — se o botao e `bg-sky-500 text-white` no light, no dark pode ser `dark:bg-sky-400 dark:text-sky-950`, porque o contraste que funciona no light nao funciona no dark
6. **O Tailwind responde ao OS por padrao** — nao precisa de JavaScript para tema automatico, porque a estrategia `prefers-color-scheme` ja vem configurada (toggle manual e separado)

## How to write

### Container com dark mode

```html
<div class="bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
  <!-- conteudo herda as cores de texto -->
</div>
```

### Texto secundario

```html
<p class="text-slate-600 dark:text-slate-400">
  Texto de apoio com menor destaque
</p>
```

### Botao com contraste adequado

```html
<button class="bg-sky-500 text-white dark:bg-sky-400 dark:text-sky-950">
  Sign In
</button>
```

## Example

**Before (sem dark mode):**
```html
<div class="bg-slate-50 text-slate-900">
  <h1 class="text-5xl">Titulo</h1>
  <p class="text-slate-600 mt-4">Descricao</p>
  <button class="bg-sky-500 text-white">Sign In</button>
</div>
```

**After (com dark mode):**
```html
<div class="bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
  <h1 class="text-5xl">Titulo</h1>
  <p class="text-slate-600 dark:text-slate-400 mt-4">Descricao</p>
  <button class="bg-sky-500 text-white dark:bg-sky-400 dark:text-sky-950">
    Sign In
  </button>
</div>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Novo componente com Tailwind | Adicione `dark:` para bg e text no container principal |
| Texto primario (titulos) | `dark:text-slate-100` ou `dark:text-white` |
| Texto secundario (paragrafos, labels) | `dark:text-slate-400` — nunca o mesmo tom do primario |
| Botoes com cor de marca | Ajuste bg E text no dark para manter contraste |
| Usuario quer toggle manual | Configurar `darkMode: 'class'` no tailwind.config e controlar via JS |
| Usuario quer tema automatico (OS) | Nao faca nada — e o padrao do Tailwind |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `dark:bg-slate-50` (mesma cor do light) | `dark:bg-slate-900` (inversao real) |
| `dark:text-slate-900` em fundo escuro | `dark:text-slate-100` (contraste adequado) |
| Dark mode so no body/html | `dark:` em cada elemento que precisa mudar |
| JavaScript para tema OS-based | Deixe o Tailwind responder ao `prefers-color-scheme` |
| Mesmo tom para texto primario e secundario no dark | Use `dark:text-slate-100` vs `dark:text-slate-400` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/masterizando/rs-masterizando-o-tailwind-dark-mode-no-tailwind/references/deep-explanation.md)
- [Code examples](../../../data/skills/masterizando/rs-masterizando-o-tailwind-dark-mode-no-tailwind/references/code-examples.md)
