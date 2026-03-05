# Code Examples: Funções Matemáticas CSS

## 1. calc() — Aritmética básica

### Soma com unidades mistas
```css
/* Largura = 20% do pai + 4rem fixo */
.element {
  width: calc(20% + 4rem);
}
```

### Subtração para compensar header fixo
```css
.main-content {
  height: calc(100vh - 80px);
}
```

### Multiplicação (número puro obrigatório)
```css
/* ✅ Correto: porcentagem * número */
.column {
  width: calc(20% * 4);
}

/* ✅ Correto: unidade * número */
.spacing {
  padding: calc(1rem * 2);
}

/* ❌ Errado: unidade * unidade */
.broken {
  width: calc(20px * 4px); /* INVÁLIDO */
}
```

### Divisão (divisor numérico puro)
```css
/* ✅ Correto */
.half {
  width: calc(100% / 3);
}

/* ❌ Errado */
.broken {
  width: calc(100px / 2px); /* INVÁLIDO */
}
```

### Combinação complexa do instrutor
```css
.element {
  width: calc(30px + 1rem);
}
```

---

## 2. min() — Menor entre N valores

### Exemplo básico do instrutor
```css
/* Compara 100%, 50px e 1rem — usa o menor */
.element {
  width: min(100%, 50px, 1rem);
}
```

### Comparação de viewport units
```css
.element {
  height: min(90vh, 100%);
}
```

### Com calc() aninhado
```css
.element {
  width: min(calc(50% + 2vh), 10vh);
}
```

### Caso prático: container responsivo
```css
.card {
  width: min(100%, 400px);
  /* Nunca ultrapassa 400px, mas encolhe em telas menores */
}
```

---

## 3. max() — Maior entre N valores

### Exemplo do instrutor
```css
.element {
  height: max(90vh, 100%);
  /* 90vh é maior que 100%? Usa 90vh */
}
```

### Combinando min() dentro de max()
```css
.element {
  height: max(calc(50% + 2vh), 10vh, min(90vh, 100px));
}
```

### Caso prático: garantir tamanho mínimo
```css
.button {
  width: max(200px, 30%);
  /* Nunca menor que 200px, mas cresce com o container */
}
```

---

## 4. clamp() — Tipografia responsiva

### Primeiro exemplo do instrutor
```css
.text {
  font-size: clamp(1rem, 10vw, 2rem);
  /* min: 1rem (16px) | ideal: 10vw | max: 2rem (32px) */
}
```

### Exemplo refinado do instrutor
```css
.text {
  font-size: clamp(1rem, 7vw, 4rem);
  /* min: 1rem | ideal: 7vw | max: 4rem */
}
```

### Variações para diferentes hierarquias tipográficas
```css
h1 {
  font-size: clamp(2rem, 5vw, 4rem);
}

h2 {
  font-size: clamp(1.5rem, 4vw, 3rem);
}

p {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
}
```

### clamp() para espaçamento
```css
.section {
  padding: clamp(1rem, 5vw, 4rem);
  gap: clamp(0.5rem, 2vw, 2rem);
}
```

### clamp() para largura de container
```css
.container {
  width: clamp(320px, 90vw, 1200px);
  margin-inline: auto;
}
```

---

## 5. Aninhamento de funções

### max() com min() e calc() combinados
```css
.complex-layout {
  width: max(
    calc(50% + 2vh),
    10vh,
    min(90vh, 100px)
  );
}
```

### clamp() com calc() no valor ideal
```css
h1 {
  /* Ideal combina base + proporção do viewport */
  font-size: clamp(1.5rem, calc(1rem + 3vw), 4rem);
}
```

---

## 6. Tabela de compatibilidade de operações

| Operação | Exemplo válido | Exemplo inválido | Por quê |
|----------|---------------|-------------------|---------|
| Soma | `10px + 2rem` | — | Qualquer unidade aceita |
| Subtração | `100% - 80px` | — | Qualquer unidade aceita |
| Multiplicação | `20% * 4` | `20px * 4px` | Precisa de número puro |
| Divisão | `100px / 2` | `100px / 2px` | Divisor deve ser número puro |