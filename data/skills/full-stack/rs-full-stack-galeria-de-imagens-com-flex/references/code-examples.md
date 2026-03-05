# Code Examples: Galeria de Imagens com Flexbox

## Exemplo completo da aula

### HTML (index.html)

```html
<main class="container">
  <img src="./assets/images/foto-1.png" alt="" />
  <img src="./assets/images/foto-2.png" alt="" />
  <img src="./assets/images/foto-3.png" alt="" />
  <img src="./assets/images/foto-4.png" alt="" />
  <img src="./assets/images/foto-5.png" alt="" />
  <img src="./assets/images/foto-6.png" alt="" />
  <img src="./assets/images/foto-7.png" alt="" />
  <img src="./assets/images/foto-8.png" alt="" />
  <img src="./assets/images/foto-9.png" alt="" />
</main>
```

### CSS (main.css)

```css
main {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding-block: 24px;
}

main img {
  width: 286px;
  height: 286px;
  object-fit: cover;
}
```

### Import no CSS principal (styles.css)

```css
@import "main.css";
```

## Variacao: galeria responsiva com tamanhos flexiveis

```css
main {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding-block: 24px;
}

main img {
  flex: 1 1 280px; /* crece, encolhe, base de 280px */
  max-width: 350px;
  height: 286px;
  object-fit: cover;
}
```

## Variacao: galeria com border-radius

```css
main img {
  width: 286px;
  height: 286px;
  object-fit: cover;
  border-radius: 8px;
}
```

## Variacao: galeria centralizada

```css
main {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding-block: 24px;
  justify-content: center;
}
```

## Progressao do layout (como o instrutor demonstrou)

### Passo 1: Apenas flex (imagens numa unica linha, extrapolando)

```css
main {
  display: flex;
}
```

### Passo 2: Adicionando wrap (imagens quebram linha, mas ficam grandes)

```css
main {
  display: flex;
  flex-wrap: wrap;
}
```

### Passo 3: Definindo tamanho fixo (imagens uniformes)

```css
main {
  display: flex;
  flex-wrap: wrap;
}

main img {
  width: 286px;
  height: 286px;
  object-fit: cover;
}
```

### Passo 4: Adicionando gap e padding (espacamento final)

```css
main {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding-block: 24px;
}

main img {
  width: 286px;
  height: 286px;
  object-fit: cover;
}
```