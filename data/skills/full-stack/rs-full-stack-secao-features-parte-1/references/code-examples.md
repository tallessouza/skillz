# Code Examples: Secao Features — Grid Layout Responsivo

## 1. Estrutura HTML completa da secao features

```html
<section id="features">
  <div class="container pylg">
    <div class="cards grid gap-1.5">
      
      <!-- Card 1: simples (icone + texto) -->
      <div class="card pylg pxlg">
        <img src="assets/icons/magic-wand.svg" alt="" />
        <h3>A maior biblioteca</h3>
        <p>IA remove qualquer musica e deixa pronta no passe de magica.</p>
      </div>
      
      <!-- Card 2: com imagem desktop-only -->
      <div class="card pylg pxlg">
        <div>
          <img src="assets/icons/game-controller.svg" alt="" />
          <h3>Experiencia gamificada</h3>
          <p>Texto descritivo do feature.</p>
        </div>
        <img class="desktop-only" src="assets/screen-2.png" alt="" />
      </div>
      
    </div>
  </div>
</section>
```

## 2. cards.css — Estilos base (sempre carregados)

```css
.card {
  background: var(--surface-color);
  border: 1px solid var(--stroke-color);
  border-radius: 1.5rem;
}

.card h3 {
  margin-top: 1rem;
}
```

## 3. Import condicional no index.css

```css
@import url("cards.css");
@import url("features.css") (width >= 80rem);
```

Note: nao usa `@media` — o filtro esta no proprio `@import`. O `features.css` so e aplicado quando `width >= 80rem`.

## 4. features.css — Apenas desktop

```css
#features .cards {
  grid-template-columns: 17.5rem 1fr 1fr 17.5rem;
  grid-template-rows: 25rem 25rem;
  gap: 2rem;
}

#features .cards .card:nth-child(1) {
  grid-column: 1 / 2;
}

#features .cards .card:nth-child(2) {
  grid-column: 2 / 4;
}
```

## 5. Visualizacao do grid (ASCII)

```
Desktop (>= 80rem):

|  17.5rem  |    1fr    |    1fr    |  17.5rem  |
|  linha 1  |  linha 2  |  linha 3  |  linha 4  | linha 5
+-----------+-----------+-----------+-----------+
|  Card 1   |     Card 2 (span 2)  |           |  row 1 (25rem)
+-----------+-----------+-----------+-----------+
|           |           |           |           |  row 2 (25rem)
+-----------+-----------+-----------+-----------+

Mobile:
+---------------------------+
|  Card 1                   |
+---------------------------+
|  Card 2 (sem imagem)      |
+---------------------------+
```

## 6. Variacao: 3 cards na primeira linha

Se precisasse de 3 cards iguais na primeira linha:

```css
#features .cards {
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
```

## 7. Variacao: card com imagem usando grid interno

Para o card 2 no desktop, onde texto e imagem ficam lado a lado:

```css
#features .cards .card:nth-child(2) {
  grid-column: 2 / 4;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
}
```

## 8. Classe utilitaria desktop-only

```css
/* No CSS base (mobile-first) */
.desktop-only {
  display: none;
}

/* No features.css (desktop) ou via import condicional */
.desktop-only {
  display: block;
}
```

## 9. Valores do Figma mapeados para CSS

| Figma (px) | CSS (rem) | Uso |
|------------|-----------|-----|
| 280px | 17.5rem | Largura das colunas laterais |
| 400px | 25rem | Altura de cada linha do grid |
| 32px | 2rem | Gap entre cards |
| 24px | 1.5rem | Border-radius dos cards |
| 16px | 1rem | Margin-top do h3 |