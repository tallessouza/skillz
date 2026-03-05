---
name: rs-angular-intro-estilizando-focus-inputs
description: "Applies CSS focus state styling patterns for Angular form inputs with Bootstrap. Use when user asks to 'style input focus', 'customize form fields', 'add focus styles', 'remove Bootstrap shadow', or 'associate label with input'. Covers :focus pseudo-class, :has() selector for parent-aware styling, box-shadow removal, and label-input accessibility via for/id. Make sure to use this skill whenever styling Angular form inputs or fixing Bootstrap focus conflicts. Not for form validation, error messages, or reactive forms logic."
---

# Estilizando Estado Focus dos Inputs

> Ao estilizar inputs em Angular com Bootstrap, customize os estados focus removendo sombras extras e aplicando escopos CSS precisos para evitar efeitos colaterais em labels adjacentes.

## Rules

1. **Remova box-shadow do Bootstrap no focus** — `box-shadow: none` no seletor `:focus`, porque o Bootstrap aplica uma sombra extra que conflita com bordas customizadas do design
2. **Use :has() para estilizar labels de inputs focados** — aplique a cor no label apenas quando o input irmao estiver focado, porque evita afetar labels de outros campos
3. **Escope com classe custom, nunca com tag generica** — use `.custom-input-group` em vez de `div`, porque `div` captura containers pais maiores e aplica estilos em todos os labels filhos
4. **Evite prefixos que colidam com Bootstrap** — nao use `input-group` como classe, porque o Bootstrap ja usa esse nome e vai sobrescrever seus estilos
5. **Associe label e input com for/id** — todo `<label for="x">` deve ter um `<input id="x">` correspondente, porque melhora acessibilidade e permite clicar no label para focar o input
6. **Mantenha form-control do Bootstrap** — nao remova `form-control` para resolver conflitos visuais, porque ele fornece dimensionamento e responsividade uteis

## How to write

### Focus com borda customizada e sem sombra Bootstrap

```css
.custom-input:focus {
  border: 1px solid #4F46E5;
  box-shadow: none;
}
```

### Label que responde ao focus do input irmao (escopo correto)

```css
.custom-input-group:has(input:focus) label {
  color: #4F46E5;
}
```

### Associacao label-input para acessibilidade

```html
<div class="custom-input-group">
  <label for="nome">Nome do Aluno</label>
  <input id="nome" type="text" class="form-control custom-input" />
</div>
```

## Example

**Before (estilo vaza para todos os labels):**

```css
div:has(input:focus) label {
  color: #4F46E5;
}
```

**After (escopo correto por grupo):**

```css
.custom-input-group:has(input:focus) label {
  color: #4F46E5;
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Bootstrap aplica sombra extra no focus | `box-shadow: none` no seletor `:focus` |
| Label deve mudar cor com focus do input | `:has(input:focus) label` com classe custom no wrapper |
| Estilo vaza para labels de outros campos | Trocar seletor `div` por classe especifica como `.custom-input-group` |
| Removeu `form-control` e input perdeu tamanho | Mantenha `form-control`, resolva conflitos com overrides CSS |
| Label clicavel deve focar input | `<label for="id">` + `<input id="id">` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `div:has(input:focus) label` | `.custom-input-group:has(input:focus) label` |
| Remover `form-control` para fix visual | `box-shadow: none` no `:focus` |
| `class="input-group"` (custom) | `class="custom-input-group"` |
| `<label>` sem `for` + `<input>` sem `id` | `<label for="x">` + `<input id="x">` |
| `outline: none` sem alternativa visual | `border` customizada + `box-shadow: none` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
