# Code Examples: Flex Basis

## Exemplo 1: Básico — flex-basis substitui width

```css
/* Setup do container */
.container {
  display: flex;
  gap: 8px;
}

/* Sem flex-basis (usando width) */
.item-old {
  width: 120px;
  height: 80px;
  background: coral;
}

/* Com flex-basis */
.item-new {
  flex-basis: 120px;
  height: 80px;
  background: coral;
}
```

Resultado visual é idêntico em `flex-direction: row`. A diferença aparece quando o eixo muda.

## Exemplo 2: Inversão de eixo

```css
.container {
  display: flex;
  flex-direction: column;
  height: 400px;
}

.item {
  flex-basis: 120px; /* Agora controla a ALTURA */
  background: coral;
}
```

Se usasse `width: 120px` aqui, controlaria a largura (irrelevante para o eixo column). O flex-basis se adapta automaticamente.

## Exemplo 3: Valor maior que o container

```css
.container {
  display: flex;
  width: 400px; /* Container fixo */
}

.item {
  flex-basis: 220px; /* Deseja 220px */
  /* Mas flex-shrink: 1 (padrão) vai encolher */
  background: coral;
}
```

O item NÃO terá 220px. Terá menos, porque shrink redistribui.

### Removendo a restrição:

```css
.container {
  display: flex;
  /* Sem width fixo — container cresce */
}

.item {
  flex-basis: 220px; /* Agora SIM terá 220px */
  background: coral;
}
```

## Exemplo 4: Porcentagem

```css
.container {
  display: flex;
  width: 800px;
}

.item {
  flex-basis: 10%; /* = 80px (10% de 800px) */
  background: coral;
}

.item-large {
  flex-basis: 120%; /* Deseja mais que o container */
  /* shrink vai reduzir para caber */
  background: lightblue;
}
```

## Exemplo 5: Valor 0 vs auto

```css
.container {
  display: flex;
}

/* auto: usa o width/content como base */
.item-auto {
  flex-basis: auto;
  width: 150px; /* Este valor será usado como base */
}

/* 0: ignora conteúdo, espaço vem só do grow */
.item-zero {
  flex-basis: 0;
  flex-grow: 1; /* Todo espaço vem do grow */
}
```

## Exemplo 6: Combinação prática — layout responsivo

```css
.container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.card {
  flex-basis: 300px; /* Tamanho desejado */
  flex-grow: 1;      /* Cresce para preencher */
  flex-shrink: 1;    /* Encolhe se necessário */
}
```

Cada card deseja 300px, mas cresce/encolhe conforme o espaço disponível. Isso cria um grid responsivo sem media queries.

## Exemplo 7: Shorthand flex (preview)

```css
.item {
  /* flex: grow shrink basis */
  flex: 0 1 120px; /* Não cresce, encolhe, base 120px */
  flex: 1 1 0;     /* Cresce, encolhe, sem base (distribui por grow) */
  flex: 1 0 200px; /* Cresce, não encolhe, base 200px */
}
```

O terceiro valor do shorthand `flex` é o flex-basis. Esta é a forma mais comum de declarar na prática.