# Code Examples: Seletores CSS

## Setup HTML base

```html
<p>Lorem ipsum dolor sit amet</p>
<p id="text" class="pink" title="descricao">Outro paragrafo</p>
```

## Seletor de tipo

```css
/* Aplica para TODOS os <p> da pagina */
p {
  color: red;
}
```

Resultado: ambos paragrafos ficam vermelhos.

## Seletor de id

```css
/* Aplica apenas para o elemento com id="text" */
#text {
  color: red;
}
```

Resultado: apenas o segundo paragrafo fica vermelho.

## Seletor de classe

```css
/* Aplica para todos com class="pink" */
.pink {
  color: pink;
}
```

Resultado: apenas elementos com a classe `pink` recebem a cor.

### Variacao: adicionando classe a multiplos elementos

```html
<p class="pink">Paragrafo 1</p>
<p class="pink">Paragrafo 2</p>
<p>Paragrafo 3 — sem classe, sem estilo</p>
```

```css
.pink {
  color: pink;
}
```

Resultado: paragrafos 1 e 2 ficam rosa. Paragrafo 3 nao.

## Seletor de atributo

### Por presenca
```css
/* Todos que tiverem title, independente do valor */
[title] {
  color: orange;
}
```

### Por valor exato
```css
/* Apenas quem tiver title exatamente igual */
[title="descricao"] {
  color: orange;
}
```

### Formas alternativas (pouco usadas)

```css
/* Equivalente a .pink — mas ninguem escreve assim */
[class="pink"] {
  color: pink;
}

/* Equivalente a #text — mas ninguem escreve assim */
[id="text"] {
  color: red;
}
```

O instrutor mostra que tecnicamente funcionam, mas na pratica usa-se `.` e `#`.

## Seletor universal

```css
/* Aplica para TODOS os elementos da pagina */
* {
  color: violet;
}
```

## Resumo visual de sintaxe

| Seletor | Sintaxe | Escopo |
|---------|---------|--------|
| Tipo | `p` | Todos `<p>` |
| ID | `#nome` | Um unico elemento |
| Classe | `.nome` | Todos com aquela classe |
| Atributo (presenca) | `[attr]` | Todos com o atributo |
| Atributo (valor) | `[attr="val"]` | Todos com atributo = valor |
| Universal | `*` | Todos os elementos |