# Code Examples: Introdução ao CSS

## Exemplo 1: Background do body (da aula)

O instrutor demonstrou ao vivo:

```css
body {
  background: red;
}
```

**O que acontece:** O fundo de toda a página fica vermelho. O seletor `body` seleciona o elemento raiz visível do documento HTML.

## Exemplo 2: Comentário desativando uma linha (da aula)

```css
body {
  background: red;
  /* color: green; */
}
```

**O que acontece:** Apenas o background vermelho é aplicado. A cor do texto verde é completamente ignorada pelo navegador.

## Exemplo 3: Comentário multi-linha (da aula)

```css
/*
  Exemplo abaixo de uma declaração.
  Seletor seguido de par de chaves
  e assim vai...
*/
body {
  background: red;
}
```

## Exemplo 4: Background preto (do slide)

```css
body {
  background: black;
}
```

**Contexto:** Usado no slide inicial para explicar a anatomia da declaração CSS.

## Variações adicionais

### Múltiplas propriedades no mesmo seletor

```css
body {
  background: black;
  color: white;
  font-size: 16px;
  font-family: Arial, sans-serif;
}
```

### Diferentes seletores de tags

```css
h1 {
  color: blue;
}

p {
  color: gray;
  font-size: 14px;
}

a {
  color: red;
}
```

### Comentário como documentação de estudo

```css
/* Seletor: seleciona a tag <body> do HTML */
/* Propriedade: background muda o fundo */
/* Valor: red é uma cor nomeada do CSS */
body {
  background: red;
}
```

### Testando propriedades com comentários

```css
body {
  background: red;
  /* background: blue; */
  /* background: green; */
}
```

**Uso:** Comentar/descomentar linhas para testar diferentes valores rapidamente sem apagar código.