# Code Examples: CSS Box Model

## Exemplo 1: Estrutura HTML da aula

```html
<header>
  <h1>Título</h1>
  <p>
    <span>Informação</span>
    <span>Extra</span>
  </p>
</header>
```

## Exemplo 2: Adicionando borders para visualizar caixas

```css
header {
  border: 1px solid red;
}

h1 {
  border: 1px solid green;
}

p {
  border: 1px solid purple;
}

span {
  border: 1px solid pink;
}
```

Resultado: cada elemento fica visivel como uma caixa. O `header` envolve tudo, `h1` e `p` ficam um embaixo do outro (block), e os `span` ficam lado a lado (inline).

## Exemplo 3: Aplicando propriedades do Box Model

```css
/* Altura explicita */
h1 {
  height: 60px;
  border: 1px solid green;
}

/* Padding — preenchimento interno */
header {
  padding: 60px;
  border: 1px solid red;
}

/* Margin — espaco externo */
p {
  margin: 20px;
  border: 1px solid purple;
}
```

## Exemplo 4: Mudando display de block para inline

```css
/* h1 padrao e block — ocupa linha inteira */
/* Ao mudar para inline, encolhe para o tamanho do texto */
h1 {
  display: inline;
  border: 1px solid green;
}

/* p tambem muda para inline — sobe para o lado do h1 */
p {
  display: inline;
  border: 1px solid purple;
}
```

## Exemplo 5: Mudando display de inline para block

```css
/* span padrao e inline — fica ao lado do irmao */
/* Ao mudar para block, ocupa linha inteira e quebra linha */
span {
  display: block;
  border: 1px solid pink;
}
```

## Exemplo 6: div vs span (mencionado no final)

```html
<!-- span: inline, sem quebra de linha -->
<p>
  <span>Info</span>
  <span>Extra</span>
</p>

<!-- div: block, quebra linha automaticamente -->
<p>
  <div>Info</div>
  <div>Extra</div>
</p>
```

## Variacoes praticas

### Padding por lado

```css
.element {
  padding-top: 10px;
  padding-right: 20px;
  padding-bottom: 10px;
  padding-left: 20px;
  /* Shorthand equivalente: */
  padding: 10px 20px;
}
```

### Margin por lado

```css
.element {
  margin-top: 0;
  margin-right: auto;  /* centraliza horizontalmente em block */
  margin-bottom: 16px;
  margin-left: auto;
  /* Shorthand: */
  margin: 0 auto 16px auto;
}
```

### Debug visual — tecnica para entender layouts

```css
/* Adicione temporariamente para ver todas as caixas */
* {
  outline: 1px solid red;
}
```

Usar `outline` ao inves de `border` e melhor para debug porque outline nao afeta o tamanho do elemento nem o layout.

### Combinando display com spacing

```css
/* inline-block: combina inline (lado a lado) com block (aceita width/height) */
.tag {
  display: inline-block;
  padding: 4px 12px;
  margin: 4px;
  border: 1px solid #333;
  border-radius: 4px;
}
```