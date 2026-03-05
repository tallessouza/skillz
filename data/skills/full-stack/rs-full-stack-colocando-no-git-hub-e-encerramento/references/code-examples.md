# Code Examples: Layout Shift por Bordas

## Exemplo 1: Input com layout shift (problema original)

### Antes — causa shift

```css
/* O input tem borda de 1px normalmente */
input {
  border: 1px solid #ccc;
}

/* No focus, o browser adiciona outline que pode ter tamanho diferente,
   ou o dev muda a borda para 2px */
input:focus {
  border: 2px solid #1a73e8;
  outline: none;
}
```

**Problema:** O elemento cresce 2px (1px topo + 1px base), empurrando tudo abaixo.

### Depois — sem shift

```css
input {
  border: 2px solid transparent;
}

input:focus {
  border-color: #1a73e8;
}
```

**Solução:** Os 2px já estão reservados. Apenas a cor muda.

## Exemplo 2: Drop area com borda dashed

### Antes — causa shift

```css
.drop-area {
  border: none;
  outline: 2px dashed #ccc;
}

.drop-area:hover {
  border: 2px dashed #1a73e8;
  outline: none;
}
```

**Problema:** `border: none` → `border: 2px` adiciona 4px ao total vertical.

### Depois — sem shift

```css
.drop-area {
  border: 2px dashed transparent;
}

.drop-area:hover {
  border-color: #1a73e8;
  outline-width: 0;
}
```

## Exemplo 3: Otimização — só trocar a cor no focus

O instrutor mostra que quando o estado base já define `solid` e `2px`, o `:focus` só precisa da cor:

```css
/* Base completa */
input {
  border: 2px solid transparent;
}

/* Focus minimal — só o que muda */
input:focus {
  border-color: #1a73e8;
  /* Não precisa repetir "2px solid" */
}
```

## Exemplo 4: Textarea (mesma técnica)

```css
textarea {
  border: 2px solid transparent;
  resize: vertical;
}

textarea:focus {
  border-color: #1a73e8;
}
```

## Exemplo 5: Select

```css
select {
  border: 2px solid transparent;
}

select:focus {
  border-color: #1a73e8;
}
```

## Exemplo 6: Combinando com outline para acessibilidade

Se quiser manter um outline visível para acessibilidade além da borda:

```css
input {
  border: 2px solid transparent;
}

input:focus {
  border-color: #1a73e8;
  outline: 2px solid rgba(26, 115, 232, 0.3);
  outline-offset: 2px;
}
```

O outline adicional não causa shift porque outline nunca ocupa espaço no layout.

## Padrão completo para formulário

```css
/* Todos os campos interativos */
input,
textarea,
select {
  border: 2px solid transparent;
}

input:focus,
textarea:focus,
select:focus {
  border-color: #1a73e8;
}

/* Drop area */
.drop-area {
  border: 2px dashed transparent;
}

.drop-area:hover {
  border-color: #1a73e8;
  outline-width: 0;
}
```

## Commit message do instrutor

```
corrige layout shift, movimento do layout por causa das bordas
```

Padrão: descreve O QUE corrigiu e POR QUE (causa raiz).