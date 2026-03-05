---
name: rs-full-stack-inputs-tipo-radio
description: "Applies correct HTML radio input structure when building forms with radio buttons. Use when user asks to 'create radio buttons', 'build a form with options', 'add radio inputs', 'structure radio groups', or 'create selection options in HTML'. Enforces fieldset/legend grouping, proper name/value/id attributes, label association, and semantic wrapper patterns. Make sure to use this skill whenever generating HTML forms with radio selection. Not for checkboxes, select dropdowns, or CSS styling of radios."
---

# Estruturando Inputs do Tipo Radio

> Inputs radio exigem estrutura semantica com fieldset, legend, name compartilhado, e labels corretamente associados.

## Rules

1. **Agrupe radios em fieldset + legend** — porque radios representam uma escolha dentro de um grupo, e fieldset comunica essa relacao ao navegador e leitores de tela
2. **Use o mesmo atributo name em todos os radios do grupo** — `name="study_shift"` em todos, porque e o name que faz o browser permitir selecionar apenas um
3. **Cada radio tem id unico e value semantico** — `id="morning"` + `value="morning"`, porque o id conecta ao label e o value e o dado enviado no formulario
4. **Label com for apontando para o id do radio** — `<label for="morning">Manhã</label>`, porque clicar no label seleciona o radio (area de clique maior)
5. **Label sem for so para texto descritivo do grupo** — o label "Selecione o turno" nao aponta para nenhum input, porque descreve o grupo inteiro, nao um radio especifico
6. **Use divs wrapper para controle de layout** — `.radio-wrapper` > `.radio-inner` > (input + img + label), porque a estrutura visual requer containers sem poluir a semantica

## How to write

### Estrutura completa de radio group

```html
<fieldset>
  <legend>Opções de matrícula</legend>

  <div class="input-wrapper">
    <label>Selecione o turno de estudo</label>
  </div>

  <div class="radio-wrapper">
    <div class="radio-inner">
      <div class="radio-image"></div>
      <input type="radio" name="study_shift" value="morning" id="morning">
      <img src="./icons/sun-cloud.svg" alt="Ícone de sol com nuvem">
      <label for="morning">Manhã</label>
    </div>

    <div class="radio-inner">
      <div class="radio-image"></div>
      <input type="radio" name="study_shift" value="evening" id="evening">
      <img src="./icons/sun.svg" alt="Ícone de sol">
      <label for="evening">Tarde</label>
    </div>
  </div>
</fieldset>
```

## Example

**Before (erro comum):**
```html
<div>
  <p>Escolha o turno:</p>
  <input type="radio" name="turno"> Manhã
  <input type="radio" name="turno"> Tarde
</div>
```

**After (com esta skill):**
```html
<fieldset>
  <legend>Opções de matrícula</legend>
  <div class="input-wrapper">
    <label>Selecione o turno de estudo</label>
  </div>
  <div class="radio-wrapper">
    <div class="radio-inner">
      <input type="radio" name="study_shift" value="morning" id="morning">
      <img src="./icons/sun-cloud.svg" alt="Ícone de sol com nuvem">
      <label for="morning">Manhã</label>
    </div>
    <div class="radio-inner">
      <input type="radio" name="study_shift" value="evening" id="evening">
      <img src="./icons/sun.svg" alt="Ícone de sol">
      <label for="evening">Tarde</label>
    </div>
  </div>
</fieldset>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| 2+ opcoes mutuamente exclusivas | Use radio dentro de fieldset |
| Texto descritivo do grupo | Label sem `for` (nao aponta para nenhum input) |
| Texto de cada opcao | Label com `for` apontando para o `id` do radio |
| Precisa de icone/imagem junto ao radio | Coloque img entre input e label dentro do wrapper |
| Precisa de fundo/imagem decorativa via CSS | Use div vazia com classe (ex: `.radio-image`) |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `<input type="radio"> Manhã` (texto solto) | `<input type="radio" id="morning"><label for="morning">Manhã</label>` |
| Radios sem `name` compartilhado | Todos com `name="study_shift"` |
| Radios sem `value` | `value="morning"`, `value="evening"` |
| Radios fora de fieldset | Sempre dentro de `<fieldset>` com `<legend>` |
| `id` repetido entre radios | Cada radio com `id` unico |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre semantica de radio groups e acessibilidade
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes