---
name: rs-angular-intro-error-message-inputs
description: "Applies Angular input error message styling patterns when building form validation UI. Use when user asks to 'create error message', 'style form validation', 'add input error', 'show validation feedback', or 'build form with error states'. Covers error message layout with icon+text, CSS-driven conditional label coloring, and Bootstrap flex alignment. Make sure to use this skill whenever creating form validation UI in Angular projects. Not for reactive forms logic, custom validators, or backend validation."
---

# Criando e Estilizando Mensagens de Erro dos Inputs

> Mensagens de erro sao compostas por icone + texto, alinhados com flex, e a estilizacao do label muda dinamicamente via CSS puro baseado na presenca do erro no DOM.

## Rules

1. **Estruture erro como div > icone + paragrafo** — porque separa semanticamente o icone da mensagem e permite controle individual de estilos
2. **Use flexbox com align-items center** — porque icone e texto precisam ficar alinhados verticalmente, e Bootstrap `d-flex align-items-center` resolve isso sem CSS custom
3. **Remova margem default do paragrafo** — aplique `m-0` do Bootstrap no `<p>`, porque a margem padrao do navegador desalinha o layout
4. **Aplique a cor no container, nao nos filhos** — defina `color` no `.errorMessage` para que tanto icone quanto texto herdem a mesma cor vermelha
5. **Use CSS estrutural para colorir o label em erro** — se `.custom-input-group` contem `.errorMessage`, aplique cor vermelha no label via seletor CSS, porque isso torna a mudanca dinamica sem JavaScript
6. **Mantenha gap de 4px entre icone e texto** — porque e o espacamento definido no design system e garante legibilidade

## How to write

### Estrutura HTML do error message

```html
<div class="custom-input-group">
  <label>Nome completo</label>
  <input type="text" class="form-control" />

  <!-- Error message: renderizar condicionalmente -->
  <div class="errorMessage d-flex align-items-center">
    <i class="ph ph-warning-circle"></i>
    <p class="m-0">Mensagem de erro dinamica</p>
  </div>
</div>
```

### CSS do error message

```css
.errorMessage {
  gap: 4px;
  margin-top: 8px;
  color: #dc3545;
}

.errorMessage p {
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0;
  vertical-align: middle;
}
```

### CSS condicional para label (sem JS)

```css
/* Se errorMessage existe dentro do grupo, label fica vermelho */
.custom-input-group .errorMessage ~ label,
.custom-input-group:has(.errorMessage) label {
  color: #dc3545;
}
```

## Example

**Before (erro sem estilizacao):**

```html
<div>
  <label>Email</label>
  <input type="email" />
  <span>Email invalido</span>
</div>
```

**After (com esta skill aplicada):**

```html
<div class="custom-input-group">
  <label>Email</label>
  <input type="email" class="form-control" />
  <div class="errorMessage d-flex align-items-center">
    <i class="ph ph-warning-circle"></i>
    <p class="m-0">Email invalido</p>
  </div>
</div>
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Input sem erro | Nao renderizar a div `.errorMessage` — CSS remove cor do label automaticamente |
| Input com erro | Renderizar a div `.errorMessage` com `*ngIf` ou `@if` |
| Icone do erro | Usar Phosphor Icons (`ph ph-warning-circle`) com tamanho 16x16 default |
| Multiplos inputs no form | Cada `.custom-input-group` contem seu proprio `.errorMessage` |
| Texto do erro dinamico | Interpolar a mensagem: `{{ errorMessage }}` |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `<span style="color:red">erro</span>` inline | `.errorMessage` com classe e CSS separado |
| Aplicar cor no `<p>` e no `<i>` separadamente | Aplicar `color` no `.errorMessage` container |
| Esquecer `m-0` no paragrafo dentro de flex | Sempre adicionar `m-0` para remover margem default |
| Mudar cor do label via JavaScript/TypeScript | Usar seletor CSS `:has(.errorMessage)` para reagir ao DOM |
| Colocar erro fora do `.custom-input-group` | Manter dentro para que CSS condicional funcione |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
