# Code Examples: Estrutura Inicial e Variáveis do CSS

## 1. Estrutura completa do index.html

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="styles/index.css">
  <title>Estrelas do Amanhã</title>
</head>
<body>

</body>
</html>
```

## 2. styles/index.css

```css
@import url("global.css");
```

## 3. styles/global.css completo

```css
:root {
  --font-family: "Poppins", sans-serif;

  /* Font shorthand: weight size/line-height family */
  --text: 400 1rem/1.5 var(--font-family);
  --text-sm: 400 0.875rem/1.4 var(--font-family);

  /* Text colors */
  --text-primary: #292524;
  --text-secondary: #57564E;
  --text-tertiary: #8F8881;
  --text-highlight: #E43A12;

  /* Surface colors */
  --surface-primary: #FFFFFF;
  --surface-secondary: #FEE7D6;

  /* Stroke/border colors */
  --stroke-default: #D6D3D1;
  --stroke-highlight: #F3541C;

  /* Semantic colors */
  --semantic-error: #DC2626;
}
```

## 4. Tabela de conversão px → rem

| Pixels | Cálculo | REM |
|--------|---------|-----|
| 2px | 2/16 | 0.125rem |
| 4px | 4/16 | 0.25rem |
| 8px | 8/16 | 0.5rem |
| 12px | 12/16 | 0.75rem |
| 14px | 14/16 | 0.875rem |
| 16px | 16/16 | 1rem |
| 18px | 18/16 | 1.125rem |
| 20px | 20/16 | 1.25rem |
| 24px | 24/16 | 1.5rem |
| 32px | 32/16 | 2rem |
| 48px | 48/16 | 3rem |
| 64px | 64/16 | 4rem |

## 5. Demonstração REM vs EM vs PX

```css
/* ERRADO: ignora acessibilidade */
html {
  font-size: 16px; /* Fixo, ignora preferência do usuário */
}

/* CORRETO: respeita acessibilidade */
html {
  font-size: 100%; /* 100% do que o navegador/usuário definiu */
}

/* Ou simplesmente não defina font-size no html/root — o padrão já é 100% */
```

```css
/* EM: relativo ao pai */
.parent {
  font-size: 2rem; /* 32px se root = 16px */
}
.parent .child {
  font-size: 1em; /* 32px! Porque 1em = tamanho do pai */
}

/* REM: sempre relativo ao root */
.parent {
  font-size: 2rem; /* 32px se root = 16px */
}
.parent .child {
  font-size: 1rem; /* 16px! Sempre busca no root */
}
```

## 6. Uso das variáveis em componentes

```css
/* Aplicando as variáveis definidas */
body {
  font: var(--text);
  color: var(--text-primary);
  background-color: var(--surface-primary);
}

/* Texto secundário */
.subtitle {
  color: var(--text-secondary);
  font: var(--text-sm);
}

/* Texto de destaque */
.highlight {
  color: var(--text-highlight);
}

/* Bordas */
.input {
  border: 1px solid var(--stroke-default);
}
.input:focus {
  border-color: var(--stroke-highlight);
}

/* Erro */
.error-message {
  color: var(--semantic-error);
  font: var(--text-sm);
}
```

## 7. Teste rápido de CSS (técnica do instrutor)

```css
/* Para verificar se o CSS está sendo carregado corretamente */
body {
  background-color: #1a1a1a; /* Cor bem escura, fácil de notar */
}
/* Após confirmar, remova imediatamente */
```

## 8. Variações: adicionando cores extras conforme necessário

```css
:root {
  /* ... variáveis existentes ... */

  /* Adicionadas quando necessário (mencionadas no style guide) */
  --surface-disabled: #E7E5E4;
  --stroke-disabled: #A8A29E;
}
```