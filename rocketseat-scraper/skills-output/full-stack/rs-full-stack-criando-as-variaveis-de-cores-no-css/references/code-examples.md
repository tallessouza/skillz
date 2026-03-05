# Code Examples: Variáveis de Cores no CSS

## Exemplo completo do global.css da aula

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --brand-color: #E05A1A;
  --brand-color-light: #F4A261;
  --beige-color: #F5F0EB;
  --stroke-color: #E0D5C9;
  --text-color-primary: #1A1A1A;
  --text-color-secondary: #6B6B6B;
  --color-secondary: #2A9D8F;
}

body {
  color: var(--text-color-primary);
  background-color: var(--beige-color);
}
```

## Variação: organização por grupo

```css
:root {
  /* Brand */
  --brand-color: #E05A1A;
  --brand-color-light: #F4A261;

  /* Text */
  --text-color-primary: #1A1A1A;
  --text-color-secondary: #6B6B6B;

  /* Surface */
  --beige-color: #F5F0EB;
  --stroke-color: #E0D5C9;

  /* Accent */
  --color-secondary: #2A9D8F;
}
```

## Variação: usando as variáveis em componentes

```css
.header {
  background-color: var(--brand-color);
  color: var(--beige-color);
}

.card {
  border: 1px solid var(--stroke-color);
  background-color: var(--beige-color);
}

.card__title {
  color: var(--text-color-primary);
}

.card__description {
  color: var(--text-color-secondary);
}

.button--primary {
  background-color: var(--brand-color);
  color: var(--beige-color);
}

.button--secondary {
  background-color: var(--color-secondary);
  color: var(--beige-color);
}

.link {
  color: var(--brand-color-light);
}

.divider {
  border-top: 1px solid var(--stroke-color);
}
```

## Variação: fallback values

```css
/* var() aceita segundo argumento como fallback */
body {
  color: var(--text-color-primary, #1A1A1A);
  background-color: var(--beige-color, #F5F0EB);
}
```

## Workflow de duas passadas (como o instrutor fez)

### Passada 1: esqueleto

```css
:root {
  --brand-color: ;
  --brand-color-light: ;
  --beige-color: ;
  --stroke-color: ;
  --text-color-primary: ;
  --text-color-secondary: ;
  --color-secondary: ;
}
```

### Passada 2: preencher valores

```css
:root {
  --brand-color: #E05A1A;
  --brand-color-light: #F4A261;
  --beige-color: #F5F0EB;
  --stroke-color: #E0D5C9;
  --text-color-primary: #1A1A1A;
  --text-color-secondary: #6B6B6B;
  --color-secondary: #2A9D8F;
}
```

## Caso de especificidade: reset não aplicou

```css
/* O reset com * não removeu margin do h1 */
* {
  margin: 0; /* especificidade: 0,0,0 */
}

/* User-agent stylesheet do navegador: */
/* h1 { margin: 0.67em 0; }  — especificidade: 0,0,1 */

/* Solução: aplicar diretamente na tag */
h1 {
  margin: 0; /* especificidade: 0,0,1 — agora sim sobrepõe */
}
```