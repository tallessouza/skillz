# Code Examples: Box Model

## Exemplo base da aula (valores do instrutor)

```css
.box {
  /* Content */
  width: 300px;
  height: 160px;

  /* Padding: 50px top/bottom, 20px left/right */
  padding: 50px 20px;

  /* Border */
  border: 5px solid #333;

  /* Margin: 50px top, 30px right, 50px bottom, 30px left */
  margin: 50px 30px;
}
```

Tamanho total renderizado (content-box padrao):
- Largura: 30 + 5 + 20 + 300 + 20 + 5 + 30 = **410px**
- Altura: 50 + 5 + 50 + 160 + 50 + 5 + 50 = **370px**

## Com border-box (mesmo visual, calculo previsivel)

```css
.box {
  box-sizing: border-box;
  width: 350px;  /* inclui padding + border */
  height: 270px; /* inclui padding + border */
  padding: 50px 20px;
  border: 5px solid #333;
  margin: 50px 30px;
}
```

Agora width = content + padding + border = 350px exatos.

## Reset global recomendado

```css
/* Colocar no inicio de todo projeto */
*, *::before, *::after {
  box-sizing: border-box;
}
```

## Padding — variacoes de sintaxe

```css
/* 1 valor: todos os lados iguais */
.card { padding: 20px; }

/* 2 valores: vertical | horizontal */
.card { padding: 16px 24px; }

/* 3 valores: top | horizontal | bottom */
.card { padding: 16px 24px 32px; }

/* 4 valores: top | right | bottom | left (sentido horario) */
.card { padding: 16px 24px 32px 12px; }

/* Propriedades individuais */
.card {
  padding-top: 16px;
  padding-right: 24px;
  padding-bottom: 32px;
  padding-left: 12px;
}
```

## Margin — variacoes de sintaxe

```css
/* Mesma logica do padding */
.section { margin: 20px; }
.section { margin: 20px 0; }
.section { margin: 20px auto; } /* auto centraliza horizontalmente */

/* Propriedades individuais */
.section {
  margin-top: 20px;
  margin-bottom: 40px;
}
```

## Border — variacoes

```css
/* Shorthand: grossura estilo cor */
.box { border: 2px solid #000; }
.box { border: 1px dashed #ccc; }
.box { border: 3px dotted red; }

/* Apenas um lado */
.box { border-bottom: 2px solid #000; }

/* Sem borda */
.box { border: none; }
```

## Visualizando caixas no DevTools

```css
/* Hack temporario pra debug — adiciona borda em TUDO */
* {
  outline: 1px solid red;
}
```

Usar `outline` em vez de `border` porque outline **nao afeta o Box Model** (nao adiciona tamanho).

## Exemplo pratico: card com espacamento

```html
<div class="card">
  <h2>Titulo</h2>
  <p>Descricao do card com texto explicativo.</p>
</div>
```

```css
*, *::before, *::after {
  box-sizing: border-box;
}

.card {
  width: 320px;
  padding: 24px;
  border: 1px solid #e0e0e0;
  margin: 16px;
  border-radius: 8px;
}

.card h2 {
  margin: 0 0 12px 0; /* remove margin default, adiciona apenas embaixo */
}

.card p {
  margin: 0; /* remove margin default do paragrafo */
}
```

## Margin collapsing na pratica

```html
<p class="first">Primeiro paragrafo</p>
<p class="second">Segundo paragrafo</p>
```

```css
.first { margin-bottom: 30px; }
.second { margin-top: 20px; }

/* Espaco entre eles = 30px (maior vence), NAO 50px */
```