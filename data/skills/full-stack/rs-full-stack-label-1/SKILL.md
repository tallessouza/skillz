---
name: rs-full-stack-label-1
description: "Enforces proper HTML label-input association for accessibility in forms. Use when user asks to 'create a form', 'add an input', 'build a login page', 'make a form accessible', or any HTML form generation task. Applies rules: every input must have an associated label, use for/id pairing or wrap input inside label, never rely on placeholder for accessibility, hide labels via CSS not by removing them. Make sure to use this skill whenever generating HTML forms, even if the user doesn't mention accessibility. Not for CSS styling, JavaScript validation, or backend form processing."
---

# Label e Acessibilidade em Formulários HTML

> Todo input em um formulário deve ter um label associado, porque leitores de tela não leem placeholders.

## Rules

1. **Sempre associe um label a cada input** — leitores de tela ignoram o atributo `placeholder`, então sem label o campo fica invisível para usuários de tecnologias assistivas
2. **Use `for`/`id` como padrão** — `<label for="x">` + `<input id="x">` é a forma mais explícita e legível de associação
3. **Alternativa: envolva o input dentro do label** — dispensa `for` e `id`, útil quando quer menos atributos no markup
4. **Nunca remova o label do HTML** — se o design não mostra o label, esconda via CSS (`visually-hidden`), mas mantenha no DOM para acessibilidade
5. **Placeholder não substitui label** — placeholder é decorativo, não semântico; leitores de tela não o anunciam como nome do campo

## How to write

### Padrão: for/id (preferido)

```html
<label for="nome">Nome</label>
<input type="text" id="nome" name="nome" placeholder="Coloque seu nome">
```

### Alternativa: input dentro do label

```html
<label>
  Nome
  <input type="text" name="nome" placeholder="Coloque seu nome">
</label>
```

### Label visualmente oculto (design sem label visível)

```html
<label for="nome" class="visually-hidden">Nome</label>
<input type="text" id="nome" name="nome" placeholder="Coloque seu nome">
```

```css
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

## Example

**Before (inacessível):**

```html
<input type="text" name="nome" placeholder="Coloque seu nome">
```

**After (acessível):**

```html
<label for="nome">Nome</label>
<input type="text" id="nome" name="nome" placeholder="Coloque seu nome">
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Formulário com campos visíveis | `<label for="id">` + `<input id="id">` |
| Design sem texto de label visível | Label com classe `visually-hidden` no CSS |
| Campo simples sem necessidade de ID | Envolver input dentro do label |
| Placeholder presente | Manter o label mesmo assim — placeholder é complemento, não substituto |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<input placeholder="Nome">` sem label | `<label for="nome">Nome</label><input id="nome" placeholder="Nome">` |
| Remover label do HTML para limpar visual | Esconder label com CSS (`visually-hidden`) |
| Confiar que placeholder basta para acessibilidade | Sempre ter label associado ao input |
| `<label>Nome</label><input>` sem for/id | `<label for="nome">Nome</label><input id="nome">` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre acessibilidade de labels e leitores de tela
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações