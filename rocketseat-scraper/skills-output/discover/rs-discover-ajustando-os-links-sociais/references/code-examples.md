# Code Examples: Ajustando Links Sociais com Hover Circular

## Exemplo completo da aula

### HTML

```html
<div class="social-links">
  <a href="https://github.com/MikeBrito" target="_blank">
    <img src="icon-github.svg" alt="GitHub">
  </a>
  <a href="https://instagram.com/MikeBrito" target="_blank">
    <img src="icon-instagram.svg" alt="Instagram">
  </a>
  <a href="https://youtube.com/MikeBrito" target="_blank">
    <img src="icon-youtube.svg" alt="YouTube">
  </a>
  <a href="https://linkedin.com/in/MikeBrito" target="_blank">
    <img src="icon-linkedin.svg" alt="LinkedIn">
  </a>
</div>
```

### CSS — Estado normal (base)

```css
.social-links a {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border-radius: 50%;
  transition: background 0.2s;
}
```

### CSS — Estado hover

```css
.social-links a:hover {
  background: #2B2B2B;
}
```

## Evolucao passo a passo (como o instrutor construiu)

### Passo 1: Apenas background no hover

```css
.social-links a:hover {
  background: #2B2B2B;
}
```

Resultado: fundo aparece, mas e um retangulo.

### Passo 2: Adicionando padding

```css
.social-links a:hover {
  background: #2B2B2B;
  padding: 16px;
}
```

Resultado: caixinha maior, mas ainda quadrada e desalinhada.

### Passo 3: Border-radius no hover (ERRO)

```css
.social-links a:hover {
  background: #2B2B2B;
  padding: 16px;
  border-radius: 50%;
}
```

Resultado: circulo ao passar mouse, mas quadrado temporario ao sair (bug visual).

### Passo 4: Movendo propriedades para o estado normal (CORRETO)

```css
.social-links a {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border-radius: 50%;
  transition: background 0.2s;
}

.social-links a:hover {
  background: #2B2B2B;
}
```

Resultado: transicao suave e limpa, sem artefatos.

## Variacoes

### Com duracao de transicao diferente

```css
/* Mais rapida */
.social-links a {
  transition: background 0.15s;
}

/* Mais suave */
.social-links a {
  transition: background 0.3s ease;
}
```

### Com cor de fundo diferente (tema claro)

```css
.social-links a:hover {
  background: #E0E0E0;
}
```

### Com escala adicional no hover

```css
.social-links a {
  padding: 16px;
  border-radius: 50%;
  transition: background 0.2s, transform 0.2s;
}

.social-links a:hover {
  background: #2B2B2B;
  transform: scale(1.1);
}
```

### Container com flexbox e gap (quando necessario)

```css
.social-links {
  display: flex;
  align-items: center;
  gap: 8px; /* gap menor porque padding ja da espaco */
}
```

### Usando SVG inline em vez de img

```html
<a href="https://github.com/usuario" target="_blank">
  <svg width="24" height="24" viewBox="0 0 24 24">
    <!-- path do icone -->
  </svg>
</a>
```

```css
.social-links a svg {
  fill: #FFFFFF;
  transition: fill 0.2s;
}

.social-links a:hover svg {
  fill: #00FF00;
}
```