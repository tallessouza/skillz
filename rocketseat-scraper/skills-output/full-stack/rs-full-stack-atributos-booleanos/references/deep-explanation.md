# Deep Explanation: Atributos Booleanos em HTML

## O que o instrutor ensinou

Atributos booleanos sao a forma mais simples de atributos HTML. Diferente de atributos como `class="container"` ou `href="url"`, booleanos nao precisam de valor. A presenca do atributo significa **verdadeiro**, a ausencia significa **falso**.

## Por que nao precisam de valor

O HTML spec define que para atributos booleanos:
- Presenca do atributo = true
- Ausencia do atributo = false
- Qualquer valor atribuido (inclusive string vazia) = true

Isso significa que `hidden="false"` **ainda esconde o elemento**, porque o parser HTML ve que o atributo `hidden` esta presente e interpreta como verdadeiro, independente do valor.

## O atributo `hidden`

O instrutor usou `hidden` como exemplo principal. Este atributo indica que o elemento **nao e mais relevante para a pagina**. O navegador aplica `display: none` ao elemento.

Diferenca importante:
- `hidden` = semanticamente irrelevante (o conteudo nao pertence ao contexto atual)
- `display: none` via CSS = visualmente escondido (mas pode ser semanticamente relevante)
- `visibility: hidden` = invisivel mas ocupa espaco

## Sintaxe redundante: `hidden="hidden"`

O instrutor explicou que voce vai encontrar codigo onde o booleano aparece com valor repetido: `hidden="hidden"`. Isso e valido pela spec HTML. Algumas ferramentas e frameworks geram essa sintaxe (especialmente XHTML, que exigia valores para todos os atributos).

A spec HTML5 permite tres formas:
1. `hidden` (preferida — limpa e concisa)
2. `hidden=""` (valida — string vazia)
3. `hidden="hidden"` (valida — valor igual ao nome)

Todas significam a mesma coisa: o atributo esta presente, logo e verdadeiro.

## Lista completa de atributos booleanos comuns

| Atributo | Elemento | Efeito |
|----------|----------|--------|
| `hidden` | Qualquer | Remove da renderizacao |
| `disabled` | input, button, select, textarea, fieldset | Desabilita interacao |
| `required` | input, select, textarea | Exige preenchimento |
| `checked` | input[checkbox/radio] | Marca como selecionado |
| `readonly` | input, textarea | Impede edicao |
| `autofocus` | input, button, select, textarea | Foco automatico ao carregar |
| `autoplay` | audio, video | Inicia reproducao automatica |
| `loop` | audio, video | Repete continuamente |
| `muted` | audio, video | Inicia sem som |
| `novalidate` | form | Desativa validacao nativa |
| `open` | details, dialog | Inicia aberto/visivel |
| `defer` | script | Adia execucao |
| `async` | script | Execucao assincrona |

## Armadilha classica com JavaScript

Em JavaScript, manipule booleanos com `setAttribute`/`removeAttribute` ou propriedades diretas:

```javascript
// CORRETO — ativar
element.hidden = true;
element.setAttribute('hidden', '');

// CORRETO — desativar
element.hidden = false;
element.removeAttribute('hidden');

// ERRADO — nao faz o que parece
element.setAttribute('hidden', 'false'); // AINDA esconde!
```