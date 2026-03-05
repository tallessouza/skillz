# Code Examples: Funções de Transformação CSS

## Setup base usado na aula

```html
<div>1</div>
```

```css
div {
  width: 30px;
  height: 30px;
  border: 1px solid pink;
}
```

## Exemplo 1: TranslateY

```css
/* Mover 50px para baixo */
div {
  transform: translateY(50px);
}
```

```css
/* Mover 10px para cima (valor negativo) */
div {
  transform: translateY(-10px);
}
```

## Exemplo 2: TranslateX

```css
div {
  transform: translateX(100px);
}
```

## Exemplo 3: Translate com dois eixos

```css
/* Primeiro valor = X, segundo = Y */
div {
  transform: translate(200px, 100px);
}
```

## Exemplo 4: Rotate

```css
div {
  transform: rotate(40deg);
}
```

## Exemplo 5: Combinação translate + rotate

```css
/* Ordem: translate primeiro, depois rotate */
div {
  transform: translateX(100px) rotate(40deg);
}
```

O instrutor destaca que inverter a ordem muda o resultado visual.

## Exemplo 6: Scale

```css
/* Dobrar o tamanho */
div {
  transform: scale(2);
}

/* Triplicar o tamanho */
div {
  transform: scale(3);
}
```

## Exemplo 7: Combinação completa

```css
div {
  transform: translate(200px, 100px) rotate(40deg) scale(2);
}
```

## Variações adicionais

### Translate com porcentagem (relativo ao próprio tamanho)

```css
.center-trick {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* centraliza perfeitamente */
}
```

### Scale em um só eixo

```css
.stretch-horizontal {
  transform: scaleX(1.5);
}

.stretch-vertical {
  transform: scaleY(2);
}
```

### Demonstrando diferença de ordem

```css
/* Resultado A: move para direita, depois rotaciona no lugar */
.order-a {
  transform: translateX(200px) rotate(45deg);
}

/* Resultado B: rotaciona (eixos giram), depois "move para direita" do eixo rotacionado = diagonal */
.order-b {
  transform: rotate(45deg) translateX(200px);
}
```

### Combinação com transition para animação suave

```css
.box {
  width: 30px;
  height: 30px;
  border: 1px solid pink;
  transition: transform 0.3s ease;
}

.box:hover {
  transform: translateX(50px) rotate(15deg) scale(1.2);
}
```