# Code Examples: Pseudo-classes e Pseudo-elements

## Setup base usado na aula

```html
<section>
  <div>1</div>
  <div class="nao">2</div>
  <div>3</div>
</section>
```

```css
div {
  width: 40px;
  height: 40px;
  border: 1px solid black;
  text-align: center;
  line-height: 250%;
  margin-top: 4px;
}
```

## Exemplo 1: :hover (interacao)

```css
div:hover {
  background-color: lightcoral;
}
```
Resultado: ao passar o mouse sobre qualquer div, o fundo muda para lightcoral.

## Exemplo 2: :not() (funcional)

```css
div:not(.nao) {
  background-color: lightblue;
}
```
Resultado: todas as divs EXCETO a que tem classe "nao" recebem fundo azul claro.

## Exemplo 3: :has() (funcional — novidade CSS)

```css
section:has(div:hover) {
  border: 2px solid red;
}
```
Resultado: quando qualquer div dentro da section recebe hover, a section inteira ganha borda vermelha. A estilizacao sobe do filho para o pai — antes impossivel sem JS.

## Exemplo 4: :nth-child() (estrutural)

```css
div:nth-child(2) {
  background-color: lightblue;
}
```

Com a estrutura original (3 divs), seleciona a segunda div. Mas se a estrutura mudar:

```html
<section>
  <div>1</div>
  <span>X</span>
  <div class="nao">2</div>
  <div>3</div>
</section>
```

Agora `div:nth-child(2)` nao seleciona nada, porque o filho 2 e um `<span>`. Para pegar a div "nao", seria `div:nth-child(3)`.

## Exemplo 5: ::first-letter

```css
div::first-letter {
  font-size: 40px;
}
```
Resultado: a primeira letra de cada div fica com 40px.

## Exemplo 6: ::before com conteudo textual

```css
div::before {
  content: "A";
  text-decoration: underline;
}
```
Resultado: um "A" sublinhado aparece antes do conteudo de cada div.

## Exemplo 7: ::before como elemento decorativo

```css
div {
  position: relative;
}

div::before {
  content: "";
  display: block;
  width: 100%;
  height: 2px;
  background-color: red;
  position: absolute;
  top: 0;
  left: 0;
}
```
Resultado: uma linha vermelha de 2px no topo de cada div, posicionada absolutamente.

## Exemplo 8: ::after

```css
div::after {
  content: "a";
}
```
Resultado: um "a" aparece apos o conteudo de cada div. Funciona igual ao `::before`, mas posicionado depois.

## Variacoes praticas

### Hover com transicao suave
```css
div {
  transition: background-color 0.3s ease;
}
div:hover {
  background-color: lightcoral;
}
```

### :not() com multiplos seletores
```css
div:not(.inactive):not(.hidden) {
  display: block;
}
```

### :has() para formularios
```css
/* Label fica verde quando o input dentro dela e valido */
label:has(input:valid) {
  color: green;
}

/* Fieldset destaca quando qualquer input tem foco */
fieldset:has(input:focus) {
  border-color: blue;
}
```

### :nth-child() com formulas
```css
/* Filhos pares */
div:nth-child(even) { background: #f0f0f0; }

/* Filhos impares */
div:nth-child(odd) { background: #e0e0e0; }

/* A cada 3 filhos */
div:nth-child(3n) { background: lightblue; }
```

### ::before/::after para icones decorativos
```css
.link::before {
  content: "→ ";
  color: red;
}

.required::after {
  content: " *";
  color: red;
  font-weight: bold;
}
```

### :root para variaveis CSS
```css
:root {
  --cor-primaria: #3498db;
  --cor-hover: lightcoral;
  --espacamento: 8px;
}

div:hover {
  background-color: var(--cor-hover);
}
```