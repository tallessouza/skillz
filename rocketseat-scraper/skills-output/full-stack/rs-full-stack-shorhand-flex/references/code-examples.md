# Code Examples: Shorthand Flex

## Exemplo 1: Keywords em acao

```html
<div class="container">
  <div class="item item-initial">Initial</div>
  <div class="item item-auto">Auto</div>
  <div class="item item-none">None</div>
</div>
```

```css
.container {
  display: flex;
  gap: 8px;
  width: 600px;
  border: 2px solid #333;
}

.item-initial {
  flex: initial;
  /* Resultado: nao cresce, encolhe se necessario, tamanho pelo conteudo */
}

.item-auto {
  flex: auto;
  /* Resultado: cresce para preencher, encolhe se necessario */
}

.item-none {
  flex: none;
  /* Resultado: tamanho fixo, nunca muda */
}
```

## Exemplo 2: Um valor numerico vs unidade

```css
/* Numerico: grow=1, shrink=1, basis=0 */
.equal-distribution {
  flex: 1;
}

/* Unidade: grow=1, shrink=1, basis=120px */
.with-base-size {
  flex: 120px;
}

/* Porcentagem: grow=1, shrink=1, basis=10% */
.percentage-base {
  flex: 10%;
}
```

### Diferenca visual:
- `flex: 1` em 3 items → cada um ocupa 33.3% (ignora conteudo)
- `flex: 120px` em 3 items dentro de container 600px → cada um parte de 120px, espaco restante (240px) distribuido igualmente

## Exemplo 3: Dois valores — numerico vs unidade no segundo

```css
/* Grow + Shrink (segundo e numerico) */
.grow-no-shrink {
  flex: 1 0;
  /* grow=1, shrink=0, basis=0 */
  /* Cresce, mas nunca encolhe abaixo de 0 */
}

/* Grow + Basis (segundo tem unidade) */
.grow-with-base {
  flex: 1 200px;
  /* grow=1, shrink=1, basis=200px */
  /* Parte de 200px e cresce para preencher */
}

/* Sem grow + Basis percentual */
.fixed-percentage {
  flex: 0 10%;
  /* grow=0, shrink=1, basis=10% */
  /* Ocupa 10% do container, pode encolher */
}
```

## Exemplo 4: Tres valores — controle total

```css
/* Cresce, nao encolhe, base grande (ultrapassa container) */
.overflow-item {
  flex: 1 0 200%;
  /* Item comeca com 200% do container */
  /* Grow permite crescer mais, shrink=0 impede encolher */
}

/* Cresce, encolhe, basis auto */
.flexible-item {
  flex: 1 1 auto;
  /* Mesmo que flex: auto */
}

/* Cresce, encolhe, basis zero */
.equal-item {
  flex: 1 1 0;
  /* Mesmo que flex: 1 */
}
```

## Exemplo 5: Caso pratico — layout de cards

```css
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

/* Card que ocupa no minimo 300px, cresce para preencher */
.card {
  flex: 1 1 300px;
  /* grow=1: preenche espaco disponivel */
  /* shrink=1: encolhe se necessario */
  /* basis=300px: tamanho minimo desejado */
}

/* Sidebar fixa */
.sidebar {
  flex: none;
  width: 250px;
  /* Nunca cresce, nunca encolhe, sempre 250px */
}

/* Conteudo principal que preenche o resto */
.main-content {
  flex: 1;
  /* grow=1, basis=0: ocupa todo espaco restante */
}
```

## Tabela de referencia rapida

| Shorthand | Grow | Shrink | Basis | Caso de uso |
|-----------|------|--------|-------|-------------|
| `flex: initial` | 0 | 1 | auto | Comportamento padrao |
| `flex: auto` | 1 | 1 | auto | Item totalmente flexivel |
| `flex: none` | 0 | 0 | 0 | Item rigido |
| `flex: 1` | 1 | 1 | 0 | Distribuicao igual |
| `flex: 2` | 2 | 1 | 0 | Dobro do espaco |
| `flex: 100px` | 1 | 1 | 100px | Base fixa, flexivel |
| `flex: 1 0` | 1 | 0 | 0 | Cresce, nunca encolhe |
| `flex: 1 200px` | 1 | 1 | 200px | Base + crescimento |
| `flex: 1 0 200px` | 1 | 0 | 200px | Cresce, nao encolhe, base |
| `flex: 0 0 auto` | 0 | 0 | auto | Mesmo que none com auto |