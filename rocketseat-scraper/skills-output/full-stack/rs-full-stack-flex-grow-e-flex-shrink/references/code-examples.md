# Code Examples: Flex Grow e Flex Shrink

## Exemplo 1: Flex-grow básico — distribuição igual

```css
.container {
  display: flex;
}

.item {
  flex-grow: 1;
}
```

Todos os itens crescem igualmente para preencher o espaço vazio. Se o container tem 600px de espaço livre e 6 itens com `flex-grow: 1`, cada um recebe 100px extras.

## Exemplo 2: Flex-grow com destaque

```css
.item {
  flex-grow: 1;
}

.item:nth-child(6) {
  flex-grow: 2;
}
```

O item 6 recebe 2 porções do espaço livre. Se há 7 porções no total (5×1 + 1×2), cada porção = espaço_livre / 7. O item 6 recebe 2/7 do espaço.

### Variação: destaque com 3 porções

```css
.item:nth-child(6) {
  flex-grow: 3;
}
```

Agora são 8 porções totais (5×1 + 1×3). O item 6 recebe 3/8 do espaço livre — visivelmente maior que os demais.

## Exemplo 3: Flex-shrink desativado (transbordo)

```css
.item {
  flex-basis: 120px;
  flex-shrink: 0;
}
```

Cada item mantém exatamente 120px. Se 6 itens × 120px = 720px e o container tem 500px, os itens transbordam e a página ganha rolagem horizontal.

## Exemplo 4: Flex-shrink proporcional

```css
/* Todos encolhem com proporção 0.5 */
.item {
  flex-basis: 120px;
  flex-shrink: 0.5;
}

/* Item 2 encolhe com proporção 1 — encolhe mais que os outros */
.item:nth-child(2) {
  flex-shrink: 1;
}
```

O item 2 fica visivelmente menor porque encolhe o dobro (1 vs 0.5) em relação aos demais.

### Variação: shrink 2 vs shrink 1

```css
.item {
  flex-basis: 120px;
  flex-shrink: 2; /* maioria encolhe bastante */
}

.item:nth-child(2) {
  flex-shrink: 1; /* encolhe menos — fica maior que os outros */
}
```

Aqui os outros itens encolhem 2× enquanto o item 2 encolhe 1× — visualmente, o item 2 é maior.

## Exemplo 5: Bug de stretch com inversão de eixo

### Código problemático

```css
.container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: 400px;
}

.item {
  width: 20px; /* BLOQUEIA stretch na horizontal */
}
```

O stretch deveria esticar os itens horizontalmente (eixo transversal em column), mas `width: 20px` impede.

### Código corrigido com flex-basis

```css
.container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: 400px;
}

.item {
  flex-basis: 20px; /* define tamanho no eixo principal (vertical) */
  /* stretch funciona normalmente na horizontal */
}
```

### Código corrigido com flex-grow

```css
.container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: 400px;
}

.item {
  flex-grow: 1; /* distribui espaço vertical */
  /* sem width fixa — stretch funciona */
}
```

## Exemplo 6: Cenário real — layout de cards

```css
.card-container {
  display: flex;
  gap: 16px;
}

/* Todos os cards crescem igualmente */
.card {
  flex-grow: 1;
  flex-basis: 200px; /* tamanho mínimo desejado */
  /* flex-shrink: 1 (padrão) — encolhem se necessário */
}

/* Card principal recebe mais espaço */
.card-featured {
  flex-grow: 2;
}

/* Sidebar não encolhe */
.card-sidebar {
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 300px; /* sempre 300px */
}
```

## Exemplo 7: Shorthand flex

```css
/* flex: grow shrink basis */
.item { flex: 1 1 120px; }       /* cresce 1, encolhe 1, base 120px */
.item-fixo { flex: 0 0 120px; }  /* não cresce, não encolhe, 120px fixo */
.item-destaque { flex: 2 1 0; }  /* cresce 2 porções, encolhe normal */
```