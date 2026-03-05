# Code Examples: O que é CSS

## Exemplo básico do instrutor — Background color

O instrutor mostrou visualmente a estrutura de uma declaração CSS:

```css
/* Propriedade: valor; — a unidade fundamental */
background-color: #ff0000;
```

## Empilhamento em cascata — O princípio central

```css
/* Cada linha adiciona um estilo — isso é a cascata */
background-color: #3498db;
color: white;
font-size: 18px;
padding: 20px;
margin: 10px;
```

## Exemplo completo: Arquivo .css básico

```css
/* styles.css — arquivo dedicado para estilos */

/* Estilos para o body */
body {
  background-color: #f0f0f0;
  color: #333333;
  font-family: Arial, sans-serif;
}

/* Estilos para títulos */
h1 {
  color: #2c3e50;
  font-size: 32px;
}

/* Estilos para parágrafos */
p {
  font-size: 16px;
  line-height: 1.5;
}
```

## Demonstrando a cascata na prática

```css
/* Primeiro estilo define azul */
p {
  color: blue;
}

/* Segundo estilo sobrescreve para vermelho — cascata em ação */
p {
  color: red;
}
/* Resultado: parágrafos ficam vermelhos, porque o último vence */
```

## As três categorias que o instrutor mencionou

### Cores
```css
.elemento {
  color: white;
  background-color: #3498db;
  border-color: rgba(0, 0, 0, 0.1);
}
```

### Posicionamentos
```css
.elemento {
  position: relative;
  top: 10px;
  margin: 20px;
  padding: 15px;
  display: flex;
}
```

### Animações
```css
.elemento {
  transition: background-color 0.3s ease;
  animation: fadeIn 1s forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

## Linkando CSS ao HTML

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Arquivo .css separado — como o instrutor mencionou -->
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>Minha Página</h1>
  <p>Estilizada com CSS!</p>
</body>
</html>
```