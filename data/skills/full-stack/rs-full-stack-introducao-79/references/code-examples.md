# Code Examples: Cores Distintas com HSL e Variáveis CSS

## Exemplo 1: Setup completo da aula

### HTML
```html
<div class="container">
  <div class="item" style="--hue: 0">1</div>
  <div class="item" style="--hue: 100">2</div>
  <div class="item" style="--hue: 200">3</div>
  <div class="item" style="--hue: 300">4</div>
</div>
```

### CSS (inline na aula, depois movido para arquivo)
```css
.container {
  border: 1px dashed black;
}

.item {
  border: 1px solid red;
  text-align: center;
  background-color: hsl(var(--hue), 100%, 70%);
}
```

## Exemplo 2: Variação com mais itens (6 elementos)

```html
<div class="container">
  <div class="item" style="--hue: 0">1</div>
  <div class="item" style="--hue: 60">2</div>
  <div class="item" style="--hue: 120">3</div>
  <div class="item" style="--hue: 180">4</div>
  <div class="item" style="--hue: 240">5</div>
  <div class="item" style="--hue: 300">6</div>
</div>
```

Divide 360° por 6 = 60° entre cada cor. Resultado: vermelho, amarelo, verde, ciano, azul, magenta.

## Exemplo 3: Variação tema escuro

```css
.item {
  background-color: hsl(var(--hue), 80%, 40%);
  color: white;
}
```

Reduzir lightness para 40% e saturação para 80% cria cores mais sóbrias para temas escuros.

## Exemplo 4: Variação pastel

```css
.item {
  background-color: hsl(var(--hue), 60%, 85%);
}
```

Alta luminosidade (85%) + saturação moderada (60%) = tons pastel suaves.

## Exemplo 5: Gerando hues dinamicamente com JavaScript

```javascript
const items = document.querySelectorAll('.item');
const step = 360 / items.length;

items.forEach((item, index) => {
  item.style.setProperty('--hue', step * index);
});
```

Útil quando o número de itens é dinâmico.

## Exemplo 6: Sem variáveis CSS (abordagem da aula antes de refatorar)

O instrutor começou assim, com hue direto no style:
```html
<div class="item" style="--hue: 0">1</div>
```

A evolução foi usar `--hue` como custom property no `style` attribute de cada elemento, mantendo o CSS genérico e limpo.

## Progressão da aula

1. Criou container com borda dashed
2. Criou items com borda sólida vermelha
3. Adicionou `text-align: center`
4. Introduziu `hsl()` com valores fixos
5. Mostrou a roda de hue no DevTools
6. Extraiu hue para variável CSS `--hue`
7. Aplicou hues distintos (0, 100, 200, 300) em cada item
8. Removeu bordas dos items (cores já distinguem)