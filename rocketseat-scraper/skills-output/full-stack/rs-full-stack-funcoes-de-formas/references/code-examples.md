# Code Examples: CSS Clip-Path — Funcoes de Formas

## 1. Circulo basico (exemplo da aula)

O instrutor comeca aplicando um circulo simples em um quadrado com borda:

```css
.box {
  width: 200px;
  height: 200px;
  background: coral;
  border: 3px solid black;
  clip-path: circle(50%);
}
```

**Resultado:** O quadrado vira circulo. A borda nos cantos desaparece porque foi recortada.

## 2. Circulo com posicao customizada

```css
/* Circulo menor, deslocado para canto superior direito */
.notification-badge {
  clip-path: circle(30% at 80% 20%);
}
```

## 3. Poligono — Triangulo

```css
.triangle {
  width: 200px;
  height: 200px;
  background: #3498db;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}
```

**Pontos:** topo-centro, inferior-esquerdo, inferior-direito.

## 4. Poligono — Seta para direita

```css
.arrow-right {
  width: 300px;
  height: 100px;
  background: #2ecc71;
  clip-path: polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%);
}
```

## 5. Poligono — Diagonal cut (hero section)

```css
/* Corte diagonal no rodape da hero section */
.hero {
  width: 100%;
  height: 400px;
  background: url('hero.jpg') center/cover;
  clip-path: polygon(0 0, 100% 0, 100% 80%, 0 100%);
}
```

## 6. Poligono — Forma de estrela (gerador visual)

```css
/* Gerado por CSS clip-path maker */
.star {
  width: 200px;
  height: 200px;
  background: gold;
  clip-path: polygon(
    50% 0%,
    61% 35%,
    98% 35%,
    68% 57%,
    79% 91%,
    50% 70%,
    21% 91%,
    32% 57%,
    2% 35%,
    39% 35%
  );
}
```

## 7. Poligono — Balao de mensagem

```css
.speech-bubble {
  width: 250px;
  height: 150px;
  background: #ecf0f1;
  clip-path: polygon(
    0% 0%,
    100% 0%,
    100% 75%,
    25% 75%,
    15% 100%,
    20% 75%,
    0% 75%
  );
}
```

## 8. Com imagem de fundo

```css
/* O instrutor recomenda combinar clip-path com background-image */
.profile-card {
  width: 300px;
  height: 300px;
  background-image: url('profile.jpg');
  background-size: cover;
  background-position: center;
  clip-path: circle(45%);
}
```

## 9. Sombra visivel com clip-path

```css
/* box-shadow NAO funciona com clip-path */
.card-wrapper {
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.card {
  clip-path: polygon(0% 0%, 100% 0%, 100% 80%, 0% 100%);
  background: white;
}
```

## 10. Transicao animada

```css
.shape {
  width: 200px;
  height: 200px;
  background: #e74c3c;
  clip-path: circle(50%);
  transition: clip-path 0.5s ease;
}

.shape:hover {
  clip-path: circle(30%);
}
```

## 11. Animacao entre poligonos (mesmo numero de pontos)

```css
.morph {
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); /* losango */
  transition: clip-path 0.6s ease;
}

.morph:hover {
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%); /* quadrado */
}
/* Ambos tem 4 pontos — a transicao funciona suavemente */
```

## 12. Inset (recorte retangular)

```css
/* Recorta 10% de cada lado, com cantos arredondados */
.inset-example {
  clip-path: inset(10% round 15px);
}
```

## Ferramenta recomendada pelo instrutor

Buscar "CSS clip-path maker" ou "clippy CSS" no Google. O primeiro resultado geralmente e o [Clippy](https://bennettfeely.com/clippy/) — ferramenta visual onde voce:
1. Escolhe uma forma base
2. Arrasta os pontos para ajustar
3. Copia o CSS `clip-path: polygon(...)` gerado