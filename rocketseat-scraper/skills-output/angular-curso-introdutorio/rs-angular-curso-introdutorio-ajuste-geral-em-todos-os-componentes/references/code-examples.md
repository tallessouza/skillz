# Code Examples: Ajuste Fino de CSS em Componentes Angular

## Navbar — CSS completo apos ajustes

```css
/* navbar.component.css */

/* Padding do container principal */
.navbar {
  padding-left: 12px;   /* Figma: 24px, menos 12px de margem interna do filho */
  padding-right: 28px;  /* Figma: 48px, menos 20px de margens internas */
}

/* Links da navbar */
.nav-link {
  font-weight: 600;
  padding: 6px !important; /* Sobrescreve Bootstrap que aplica 8px */
}

/* Items da navbar */
.nav-item {
  cursor: pointer;
  margin-left: 18px !important; /* Bootstrap forca 16px, design pede ~18px */
}

/* Icones dentro dos nav-items */
.nav-item i {
  font-size: 20px; /* Design: 20x20, padrao Bootstrap Icons: 16x16 */
}
```

## Formulario — CSS dos grupos de input

```css
/* certificado-form.component.css */

.custom-input-group {
  margin-bottom: 20px !important; /* Design: 20px entre grupos, padrao era 16px */
}
```

## Botoes — Font-weight

```css
/* button-primary.component.css */
.custom-button {
  font-weight: 600;
}

/* button-secondary.component.css */
.custom-button {
  font-weight: 600;
}
```

## Processo de inspecao passo a passo

### 1. Medir no Figma
```
Distancia desejada: 24px (lado esquerdo da navbar)
```

### 2. Inspecionar no DevTools
```
Container padding-left: 32px
Filho margin-left: 12px
Total visual: 32 + 12 = 44px (errado, deveria ser 24px)
```

### 3. Calcular valor correto
```
Valor correto do container: 24 - 12 = 12px
```

### 4. Aplicar e verificar
```css
.navbar {
  padding-left: 12px;
}
/* DevTools agora mostra: 12 + 12 = 24px total ✓ */
```

## Padroes de !important em Angular + Bootstrap

```css
/* QUANDO usar !important: Bootstrap sobrescreve seu CSS */
.nav-link {
  padding: 6px !important;     /* Bootstrap .nav-link tem padding proprio */
}
.nav-item {
  margin-left: 18px !important; /* Bootstrap .nav-item forca margin */
}
.custom-input-group {
  margin-bottom: 20px !important; /* Bootstrap form groups tem margin */
}

/* QUANDO NAO usar !important: CSS proprio sem conflito */
.nav-item i {
  font-size: 20px;  /* Nenhum conflito, nao precisa de !important */
}
.custom-button {
  font-weight: 600; /* Nenhum conflito com Bootstrap */
}
```