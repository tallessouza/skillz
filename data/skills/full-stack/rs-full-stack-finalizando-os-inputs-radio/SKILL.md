---
name: rs-full-stack-finalizando-inputs-radio
description: "Applies HTML radio input group patterns with CSS grid auto-fit layout when building form sections with multiple selectable options. Use when user asks to 'create radio buttons', 'build a selection grid', 'make a sport selector', 'form with image options', or any grouped radio input UI. Ensures correct name/id/label linking, grid responsive layout with auto-fit, and semantic wrapper structure. Make sure to use this skill whenever creating radio button groups with visual cards or image-based selections. Not for checkbox groups, dropdown selects, or CSS grid theory without form context."
---

# Radio Inputs com Grid Responsivo

> Agrupe radio inputs em wrappers semanticos com name compartilhado, IDs unicos e grid auto-fit para layout responsivo automatico.

## Rules

1. **Compartilhe o atributo `name`** — todos os radios do mesmo grupo usam o mesmo `name` (ex: `name="esporte"`), porque isso garante que apenas um seja selecionado por vez
2. **ID unico por radio** — cada input tem `id` igual ao valor que representa (ex: `id="futebol"`), porque o label precisa do `for` correto para ser clicavel
3. **Label linkado via `for`** — todo `<label for="id">` aponta para o radio correspondente, porque clique no label deve ativar o input
4. **Use wrapper semantico por grupo** — envolva o grupo em um container (ex: `radial-wrapper`) e cada opcao em um inner (ex: `radial-inner`), porque facilita estilizacao com grid
5. **Grid auto-fit para responsividade** — use `grid-template-columns: repeat(auto-fit, minmax(7.5rem, 1fr))` no wrapper, porque o grid redistribui colunas automaticamente conforme o espaco disponivel
6. **Copie com cuidado** — ao duplicar blocos de radio, verifique que copiou apenas o elemento correto sem tags extras, porque uma div a mais quebra o layout inteiro

## How to write

### Estrutura do grupo de radios

```html
<div class="input-wrapper">
  <label>Em qual esporte voce gostaria de inscrever seu filho?</label>
  <div class="radial-wrapper">
    <div class="radial-inner">
      <div class="radial-image">
        <img src="./assets/icons/futebol.svg" alt="Icone de futebol">
      </div>
      <input type="radio" name="esporte" id="futebol">
      <label for="futebol">Futebol</label>
    </div>
    <!-- mais radial-inners aqui -->
  </div>
</div>
```

### CSS do grid responsivo

```css
.radial-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(7.5rem, 1fr));
  gap: 1rem;
}
```

## Example

**Before (radios soltos sem estrutura):**
```html
<input type="radio" name="esporte"> Futebol
<input type="radio" name="esporte"> Basquete
<input type="radio" name="esporte"> Natacao
```

**After (com wrappers, imagens e grid):**
```html
<div class="radial-wrapper">
  <div class="radial-inner">
    <div class="radial-image">
      <img src="./assets/icons/futebol.svg" alt="Icone de futebol">
    </div>
    <input type="radio" name="esporte" id="futebol">
    <label for="futebol">Futebol</label>
  </div>
  <div class="radial-inner">
    <div class="radial-image">
      <img src="./assets/icons/basquete.svg" alt="Icone de basquete">
    </div>
    <input type="radio" name="esporte" id="basquete">
    <label for="basquete">Basquete</label>
  </div>
  <div class="radial-inner">
    <div class="radial-image">
      <img src="./assets/icons/swimming.svg" alt="Icone de natacao">
    </div>
    <input type="radio" name="esporte" id="natacao">
    <label for="natacao">Natacao</label>
  </div>
</div>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Grupo de opcoes mutuamente exclusivas | Use radio com `name` compartilhado |
| Opcoes com representacao visual | Adicione `radial-image` com icone/imagem |
| Numero variavel de opcoes | Use grid auto-fit — colunas se ajustam sozinhas |
| Label do grupo (nao de opcao) | Use label sem `for` — apenas texto descritivo |
| Duplicando blocos de radio | Confira que copiou apenas o `radial-inner`, sem divs extras |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `name` diferente em cada radio do grupo | Mesmo `name` para todos do grupo |
| `<label>` sem `for` em opcao individual | `<label for="id-do-radio">` |
| Radios sem wrapper de grupo | Envolva em `radial-wrapper` com grid |
| Layout fixo com colunas hardcoded | `auto-fit` + `minmax()` para responsividade |
| Copiar bloco inteiro com div pai junto | Copiar apenas o `radial-inner` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre grid auto-fit, erros comuns de copia e estrutura semantica
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes