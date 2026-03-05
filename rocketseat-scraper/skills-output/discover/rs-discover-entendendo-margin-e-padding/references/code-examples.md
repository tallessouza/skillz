# Code Examples: Margin e Padding

## Exemplo 1 — Profile card com padding uniforme

Extraido diretamente da aula. O card `.profile` precisa de 24px de espaco interno em todos os lados.

```css
/* Figma mostra pad: 24 em todos os lados */
.profile {
  padding: 24px;
}
```

Equivalente expandido (nao recomendado):
```css
.profile {
  padding-top: 24px;
  padding-right: 24px;
  padding-bottom: 24px;
  padding-left: 24px;
}
```

## Exemplo 2 — Texto com margin-top

O paragrafo dentro do card precisa de 8px de espaco acima.

```css
/* Figma mostra 8px de espaco superior */
p {
  margin-top: 8px;
}
```

Quando apenas um lado precisa de espaco, use a propriedade individual — e mais claro que `margin: 8px 0 0 0`.

## Exemplo 3 — Container com espacamento superior

O container precisa de 56px de espaco no topo. Duas abordagens validas:

```css
/* Abordagem 1: padding-top (espaco interno) */
.container {
  padding-top: 56px;
}

/* Abordagem 2: margin-top (espaco externo) */
.container {
  margin-top: 56px;
}
```

## Exemplo 4 — Shorthand progressivo do container

Evolucao mostrada na aula, de expandido para shorthand:

```css
/* Passo 1: Tudo separado */
.container {
  margin-top: 56px;
  margin-right: auto;
  margin-bottom: auto;
  margin-left: auto;
}

/* Passo 2: Shorthand com 3 valores */
.container {
  margin: 56px auto 0;
}
```

## Exemplo 5 — Debug com bordas

Tecnica ensinada para iniciantes:

```css
/* Adicione temporariamente para visualizar a caixa */
.profile {
  padding: 24px;
  border: 1px solid red; /* REMOVER depois de entender */
}
```

## Variacoes praticas

### Card com padding assimetrico

```css
.card {
  /* 32px em cima/embaixo, 16px nas laterais */
  padding: 32px 16px;
}
```

### Centralizacao horizontal com margin auto

```css
.wrapper {
  max-width: 1200px;
  /* 0 em cima/embaixo, auto centraliza horizontalmente */
  margin: 0 auto;
}
```

### Espacamento entre itens de lista

```css
.list-item {
  /* Apenas embaixo, para separar do proximo item */
  margin-bottom: 12px;
}

/* Ultimo item nao precisa de espaco embaixo */
.list-item:last-child {
  margin-bottom: 0;
}
```

### Reset de margin padrao do navegador

```css
/* Navegadores adicionam margin padrao em h1, p, ul, etc */
h1, h2, p, ul {
  margin: 0;
}
```