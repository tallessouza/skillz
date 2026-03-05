---
name: rs-full-stack-criando-botoes-formulario
description: "Applies HTML form button patterns and CSS button styling when creating form actions. Use when user asks to 'create form buttons', 'add submit button', 'style buttons', 'create action buttons', or 'build form actions'. Enforces button type attributes, unset-first CSS strategy, hover/focus states, and layout with flexbox. Make sure to use this skill whenever building form buttons or action bars. Not for icon buttons, floating action buttons, or button component libraries."
---

# Botões de Formulário

> Botões de ação em formulários usam tipos explícitos, CSS reset com `all: unset`, e estados interativos completos (hover + focus).

## Rules

1. **Defina `type` explicitamente em todos os botões** — `type="button"` para ações secundárias, `type="submit"` para envio, porque o padrão é `submit` e botões sem tipo podem enviar o formulário acidentalmente
2. **Use `all: unset` como primeira declaração** — remove todos os estilos padrão do navegador, porque garante consistência cross-browser partindo do zero
3. **Sempre inclua `cursor: pointer`** — dá feedback visual de que o elemento é clicável, porque melhora a intuição de interação
4. **Sempre defina estados `:hover` e `:focus`** — focus é essencial para navegação por teclado (Tab), porque acessibilidade não é opcional
5. **Use classes semânticas `btn-primary` e `btn-secondary`** — separa hierarquia visual da estrutura HTML, porque permite reutilização consistente
6. **Agrupe botões em um wrapper com flexbox** — `actions-wrapper` com `display: flex` e `gap`, porque mantém espaçamento consistente e permite alinhamento com `margin-left: auto`

## How to write

### Estrutura HTML dos botões

```html
<div class="actions-wrapper">
  <button class="btn btn-secondary" type="button">Salvar respostas</button>
  <button class="btn btn-primary" type="submit">Fazer matrícula</button>
</div>
```

### CSS base com all: unset

```css
button {
  all: unset;
  font-weight: 500;
  color: var(--text-highlight);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
}
```

### Botão primário com hover/focus

```css
.btn-primary {
  color: white;
  background-color: #5033c3; /* brand-dark */
}

.btn-primary:hover,
.btn-primary:focus {
  background-color: #6842ff; /* brand-mid */
}
```

### Layout do wrapper

```css
.actions-wrapper {
  margin-top: 3rem;
  display: flex;
  gap: 16px;
}

.btn-secondary {
  margin-left: auto;
  border: 1px solid var(--text-highlight);
}
```

## Example

**Before (botões sem estilo e sem tipos):**
```html
<form>
  <!-- campos -->
  <button>Salvar</button>
  <button>Enviar</button>
</form>
```

**After (com tipos, classes e wrapper):**
```html
<form>
  <!-- campos -->
  <div class="actions-wrapper">
    <button class="btn btn-secondary" type="button">Salvar respostas</button>
    <button class="btn btn-primary" type="submit">Fazer matrícula</button>
  </div>
</form>
```

## Heuristics

| Situação | Faça |
|----------|------|
| Botão não envia formulário | `type="button"` explícito |
| Botão envia formulário | `type="submit"` (mesmo sendo padrão, explicite) |
| Dois botões lado a lado | Flexbox wrapper com gap |
| Botão secundário à direita | `margin-left: auto` no secundário |
| Estilizando botões do zero | `all: unset` primeiro, depois adicione estilos |
| Campos `required` no form | Deixe o browser validar antes do submit |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `<button>Enviar</button>` sem type | `<button type="submit">Enviar</button>` |
| Botões soltos sem wrapper | `<div class="actions-wrapper">` agrupando |
| Estilos direto no botão sem reset | `all: unset` antes de qualquer estilo |
| Apenas `:hover` sem `:focus` | `:hover, :focus` juntos sempre |
| `float: right` para alinhar botão | `margin-left: auto` com flexbox |
| Cor hardcoded repetida sem variável | Variável CSS se usar mais de uma vez |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre tipos de botão, all: unset, e acessibilidade
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-criando-os-botoes-do-formulario/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-criando-os-botoes-do-formulario/references/code-examples.md)
