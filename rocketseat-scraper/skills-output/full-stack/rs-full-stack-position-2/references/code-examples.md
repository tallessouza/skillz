# Code Examples: CSS Position

## Setup HTML usado na aula

```html
<p>Texto de exemplo acima das divs</p>

<section>
  <div></div>  <!-- preta -->
  <div></div>  <!-- preta -->
  <div class="position"></div>  <!-- vermelha - a que manipulamos -->
  <div></div>  <!-- preta -->
</section>

<p>Para ver o efeito de posicionamento sticky, aplique position sticky
e arraste a barra de rolagem desse container.</p>
```

## CSS base

```css
div {
  background: black;
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
}

.position {
  background: red;
}
```

## Position: Relative

### Basico — sem offset, nada muda
```css
.position {
  position: relative;
  /* Elemento mantem normal flow, nenhum deslocamento visual */
}
```

### Com offset — deslocamento visual
```css
.position {
  position: relative;
  top: 20px;
  left: 20px;
  /* Elemento se desloca 20px pra baixo e 20px pra direita */
  /* Espaco original continua ocupado */
}
```

### Com z-index negativo — abaixo dos irmaos
```css
.position {
  position: relative;
  top: 20px;
  left: 20px;
  z-index: -1;
  /* Elemento fica visualmente abaixo dos irmaos */
}
```

## Position: Absolute

### Sem containing block proximo — relativo a pagina
```css
.position {
  position: absolute;
  bottom: 20px;
  right: 20px;
  /* Vai para o canto inferior direito da PAGINA */
}
```

### Com containing block proximo — relativo ao pai
```css
section {
  position: relative;
  border: 1px solid white; /* para visualizar */
}

.position {
  position: absolute;
  top: 20px;
  left: 20px;
  /* Posiciona dentro da section */
}
```

### Variacoes de posicionamento dentro do pai
```css
/* Canto superior esquerdo */
.position { position: absolute; top: 20px; left: 20px; }

/* Canto superior direito */
.position { position: absolute; top: 20px; right: 20px; }

/* Canto inferior esquerdo */
.position { position: absolute; bottom: 20px; left: 20px; }

/* Canto inferior direito */
.position { position: absolute; bottom: 20px; right: 20px; }
```

## Position: Fixed

### Fixo na tela — ignora containing block proximo
```css
section {
  position: relative; /* nao importa para fixed */
}

.position {
  position: fixed;
  top: 20px;
  left: 20px;
  /* Fixo no viewport, nao se move com scroll */
}
```

### Padrao botao de acao flutuante
```css
.position {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 10;
  /* Exemplo: botao scroll-to-top ou chat widget */
}
```

## Position: Sticky

### Basico — sem offset, nao ativa
```css
.position {
  position: sticky;
  /* Sem top/bottom, o sticky nao tem ponto de ativacao */
}
```

### Com top — gruda ao atingir offset
```css
.position {
  position: sticky;
  top: 20px;
  /* Ao rolar, quando chegar a 20px do topo, gruda */
}
```

### Sticky dentro de container com scroll
```css
section {
  overflow: scroll;
  height: 300px;
}

.position {
  position: sticky;
  top: 0;
  /* Gruda no topo do container com scroll, nao do body */
}
```

### Sticky no body (sem overflow no pai)
```css
section {
  /* Sem overflow, sem height fixa */
}

.position {
  position: sticky;
  top: 20px;
  /* Gruda relativo ao body (mecanismo de scroll mais proximo) */
}
```

## Inset — shorthand para offsets

### Um valor (todos os lados)
```css
.position {
  position: absolute;
  inset: 0;
  /* Equivale a: top: 0; right: 0; bottom: 0; left: 0 */
}
```

### Dois valores (vertical | horizontal)
```css
.position {
  position: absolute;
  inset: 10px 20px;
  /* top/bottom: 10px, left/right: 20px */
}
```

### Tres valores (top | horizontal | bottom)
```css
.position {
  position: absolute;
  inset: 10px 20px 30px;
  /* top: 10px, left/right: 20px, bottom: 30px */
}
```

### Quatro valores (sentido horario)
```css
.position {
  position: absolute;
  inset: 10px 40px 60px 100px;
  /* top: 10px, right: 40px, bottom: 60px, left: 100px */
}
```

## Padrao: Modal overlay completo

```css
.parent {
  position: relative;
}

.overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background: red;
  opacity: 0.2;
  /* Cobre todo o containing block com overlay semi-transparente */
}
```

## Resumo dos comportamentos

```
static:   normal flow | sem offset | sem z-index
relative: normal flow | offset relativo a si | cria stacking context
absolute: quebra flow | offset relativo ao containing block | cria stacking context
fixed:    quebra flow | offset relativo ao viewport | cria stacking context
sticky:   normal flow | gruda no offset ao scroll | cria stacking context
```