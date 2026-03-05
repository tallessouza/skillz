# Code Examples: CSS Margin

## Setup do instrutor

### HTML usado na aula
```html
<!-- Elemento block -->
<div class="margem">Bloco</div>

<!-- Elemento inline -->
<span class="margem">Inline</span>
```

### CSS base para visualizacao
```css
.margem {
  border: 1px solid red; /* para visualizar os limites do elemento */
}
```

## Exemplo 1: Margin em todos os lados (1 valor)

```css
.margem {
  margin: 30px;
  /* Aplica 30px em top, right, bottom, left */
}
```

Resultado: espaco uniforme de 30px ao redor do elemento.

## Exemplo 2: Margin apenas em um lado

```css
.margem {
  margin-top: 30px;
  /* Apenas espaco superior */
  /* ATENCAO: nao funciona em elementos inline! */
}
```

```css
.margem {
  margin-left: 60px;
  /* Funciona tanto em block quanto em inline */
}
```

## Exemplo 3: Shorthand com 2 valores

```css
.margem {
  margin: 30px 10px;
  /* 30px = vertical (top e bottom) */
  /* 10px = horizontal (left e right) */
}
```

## Exemplo 4: Shorthand com 3 valores

```css
.margem {
  margin: 30px 10px 80px;
  /* 30px = top */
  /* 10px = left e right */
  /* 80px = bottom */
}
```

## Exemplo 5: Shorthand com 4 valores (sentido relogio)

```css
.margem {
  margin: 30px 10px 80px 4rem;
  /* 30px = top */
  /* 10px = right */
  /* 80px = bottom */
  /* 4rem = left */
}
```

## Exemplo 6: margin auto para centralizar

```css
.margem {
  width: 50%;
  margin: auto;
  /* Centraliza horizontalmente */
  /* NAO centraliza verticalmente */
  /* NAO funciona em elementos inline */
  /* NAO funciona sem width definido */
}
```

Variacao mais comum:
```css
.margem {
  width: 50%;
  margin: 0 auto;
  /* 0 = sem margin vertical */
  /* auto = centraliza horizontal */
}
```

## Exemplo 7: Margin Collapsing

### HTML
```html
<div class="margem">Bloco 1</div>
<div class="margem">Bloco 2</div>
```

### CSS
```css
.margem {
  margin: 30px;
  border: 1px solid red;
}
```

### Resultado
- Espaco entre os dois blocos: **30px** (nao 60px)
- O margin-bottom do Bloco 1 (30px) "colapsa" com o margin-top do Bloco 2 (30px)
- Prevalece o maior valor (neste caso, ambos sao 30px)

### Tentativa de correcao manual
```css
.margem {
  margin: 60px 30px 30px 30px;
  /* Forca 60px no top para compensar o collapsing */
  /* Mas agora o top de AMBOS os blocos e 60px */
}
```

## Exemplo 8: Comportamento inline vs block

```css
/* Funciona em block, NAO funciona em inline */
.margem {
  margin-top: 30px;    /* block: sim, inline: NAO */
  margin-bottom: 30px; /* block: sim, inline: NAO */
  width: 50%;          /* block: sim, inline: NAO */
  margin: auto;        /* block: sim (com width), inline: NAO */
}

/* Funciona em AMBOS */
.margem {
  margin-left: 60px;   /* block: sim, inline: sim */
  margin-right: 60px;  /* block: sim, inline: sim */
}
```

## Tabela resumo de compatibilidade

| Propriedade | Block | Inline |
|-------------|-------|--------|
| margin-top | Sim | Nao |
| margin-bottom | Sim | Nao |
| margin-left | Sim | Sim |
| margin-right | Sim | Sim |
| margin: auto | Sim (com width) | Nao |
| width | Sim | Nao |

## Dica do instrutor: atalho Emmet

```html
<!-- Digite div.margem e pressione Enter -->
<!-- Resultado: -->
<div class="margem"></div>
```

Emmet cria a estrutura HTML automaticamente a partir de seletores CSS.