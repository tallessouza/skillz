# Code Examples: Ajustes de Light Mode

## Exemplo completo: Botao com modos

### Variaveis raiz (modo escuro como default)

```css
:root {
  --text-color: rgba(255, 255, 255, 1);
  --stroke-color: rgba(255, 255, 255, 0.5);
  --surface-color: rgba(0, 0, 0, 0.1);
  --surface-color-hover: rgba(0, 0, 0, 0.5);
  --highlight-color: rgba(255, 255, 255, 0.15);
}
```

### Variaveis light mode (inversao)

```css
.light-mode {
  --text-color: rgba(0, 0, 0, 1);
  --stroke-color: rgba(0, 0, 0, 0.5);
  --surface-color: rgba(255, 255, 255, 0.1);
  --surface-color-hover: rgba(255, 255, 255, 0.9);
  --highlight-color: rgba(0, 0, 0, 0.15);
}
```

### Componente botao consumindo variaveis

```css
.button {
  border: 1px solid var(--stroke-color);
  background-color: var(--surface-color);
  color: var(--text-color);
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.button:hover {
  background-color: var(--surface-color-hover);
}
```

### Social links com highlight

```css
.social-link {
  color: var(--text-color);
  text-decoration: none;
  transition: color 0.2s;
}

.social-link:hover {
  color: var(--highlight-color);
}
```

## Variacao: usando prefers-color-scheme

```css
:root {
  --stroke-color: rgba(255, 255, 255, 0.5);
  --surface-color: rgba(0, 0, 0, 0.1);
  --surface-color-hover: rgba(0, 0, 0, 0.5);
}

@media (prefers-color-scheme: light) {
  :root {
    --stroke-color: rgba(0, 0, 0, 0.5);
    --surface-color: rgba(255, 255, 255, 0.1);
    --surface-color-hover: rgba(255, 255, 255, 0.9);
  }
}
```

## Variacao: usando data-attribute

```css
[data-theme="dark"] {
  --stroke-color: rgba(255, 255, 255, 0.5);
  --surface-color: rgba(0, 0, 0, 0.1);
}

[data-theme="light"] {
  --stroke-color: rgba(0, 0, 0, 0.5);
  --surface-color: rgba(255, 255, 255, 0.1);
}
```

## Processo de conversao passo a passo

### Passo 1: Identificar cor hardcoded
```css
/* ANTES */
.button {
  border: 1px solid rgba(255, 255, 255, 0.5);
}
```

### Passo 2: Criar variavel com nome do design
```css
:root {
  --stroke-color: rgba(255, 255, 255, 0.5);
}
```

### Passo 3: Criar variante light
```css
.light-mode {
  --stroke-color: rgba(0, 0, 0, 0.5);
}
```

### Passo 4: Substituir no componente
```css
.button {
  border: 1px solid var(--stroke-color);
}
```

### Passo 5: Testar alternando modos e verificar hover separadamente