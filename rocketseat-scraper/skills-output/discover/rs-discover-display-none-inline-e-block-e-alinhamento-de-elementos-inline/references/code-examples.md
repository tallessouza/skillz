# Code Examples: Display none, inline, block e Alinhamento

## 1. Display none — removendo elemento da tela

```css
.container {
  display: none; /* elemento desaparece completamente */
}
```

## 2. Display block padrão — div ocupa largura total

```html
<div class="container">
  Conteúdo aqui
</div>
```

```css
/* Sem width definido, block estica para largura total */
.container {
  /* display: block é o padrão de div */
  background: lightblue;
}
```

O div vai de ponta a ponta do pai.

## 3. Block com largura fixa

```css
.container {
  width: 600px;
  /* Ainda é block — força quebra de linha, mas não estica */
}
```

## 4. Elementos inline lado a lado

```html
<img src="avatar.png" alt="Avatar">
<a href="#">Link</a>
```

Ambos são inline por padrão. Ficam na mesma linha, um ao lado do outro.

## 5. Forçando inline para block

```html
<img src="avatar.png" alt="Avatar">
<a href="#">Link</a>
```

```css
a {
  display: block;
  /* Agora o link ocupa linha toda, imagem fica acima */
}
```

## 6. Problema: margin auto em img (inline)

```css
/* NÃO FUNCIONA — img é inline */
img {
  margin: auto;
}
```

## 7. Solução A: converter img para block

```css
img {
  display: block;
  margin: 0 auto;
}
```

## 8. Solução B: text-align no pai

```css
.profile {
  text-align: center; /* centraliza todos os filhos inline */
}
```

```html
<div class="profile">
  <img src="avatar.png" alt="Avatar">
</div>
```

## 9. text-align com diferentes valores

```css
.profile {
  text-align: center; /* centralizado */
  text-align: right;  /* direita */
  text-align: left;   /* esquerda (padrão) */
}
```

## 10. text-align NÃO funciona em block

```css
.profile {
  text-align: center;
}

.container {
  display: block;
  width: 600px;
  /* NÃO será centralizado pelo text-align do pai */
  /* Use margin: 0 auto em vez disso */
}
```

## 11. inline-block — comportamento híbrido

```css
img {
  display: inline-block;
  /* Fica em linha, mas aceita width/height/margin vertical */
  /* Porém margin: auto ainda pode não centralizar */
}
```

## Variações práticas

### Centralizar grupo de ícones (inline)

```html
<div class="social">
  <a href="#"><img src="github.svg"></a>
  <a href="#"><img src="linkedin.svg"></a>
  <a href="#"><img src="twitter.svg"></a>
</div>
```

```css
.social {
  text-align: center; /* todos os links/imgs ficam centralizados */
}
```

### Centralizar card (block)

```html
<div class="card">
  <h2>Título</h2>
  <p>Conteúdo</p>
</div>
```

```css
.card {
  width: 400px;
  margin: 0 auto; /* centraliza o card block */
}
```

### Esconder elemento condicionalmente

```css
.menu {
  display: block;
}

.menu.hidden {
  display: none; /* remove completamente */
}
```