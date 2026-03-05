# Code Examples: Adicionando JavaScript a Projetos HTML/CSS

## Exemplo 1: Estrutura basica de conexao

### HTML existente (recebido pronto)
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="style.css">
  <title>Projeto</title>
</head>
<body>
  <header>
    <h1>Meu Projeto</h1>
    <button class="menu-toggle">☰</button>
  </header>
  <nav class="sidebar hidden">
    <ul>
      <li><a href="#home">Home</a></li>
      <li><a href="#about">Sobre</a></li>
      <li><a href="#contact">Contato</a></li>
    </ul>
  </nav>
  <main class="content">
    <p>Conteudo principal aqui.</p>
  </main>

  <script src="./main.js"></script>
</body>
</html>
```

### JavaScript adicionado (o que voce desenvolve)
```javascript
// 1. Selecionar elementos que ja existem no HTML
const menuToggle = document.querySelector('.menu-toggle')
const sidebar = document.querySelector('.sidebar')

// 2. Adicionar comportamento via eventos
menuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('hidden')
})

// 3. Funcionalidades adicionais sem modificar HTML
const links = document.querySelectorAll('.sidebar a')

links.forEach((link) => {
  link.addEventListener('click', () => {
    sidebar.classList.add('hidden')
  })
})
```

## Exemplo 2: Padrao de desenvolvimento incremental

### Passo 1 — Identificar pontos de interacao no HTML
```javascript
// Antes de escrever codigo, mapeie o que precisa de JS
// - Botao de toggle do menu → click handler
// - Links da sidebar → click handler para fechar
// - Formulario de contato → submit handler (futuro)
```

### Passo 2 — Implementar uma funcionalidade por vez
```javascript
// PRIMEIRO: so o toggle
const menuToggle = document.querySelector('.menu-toggle')
const sidebar = document.querySelector('.sidebar')

menuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('hidden')
})
// TESTE AQUI antes de continuar
```

### Passo 3 — Adicionar a proxima
```javascript
// DEPOIS: fechar ao clicar em link
const links = document.querySelectorAll('.sidebar a')

links.forEach((link) => {
  link.addEventListener('click', () => {
    sidebar.classList.add('hidden')
  })
})
// TESTE NOVAMENTE
```

## Exemplo 3: Reutilizando classes CSS existentes

```css
/* CSS ja existente — NAO MODIFIQUE */
.hidden {
  display: none;
}

.active {
  background-color: #007bff;
  color: white;
}
```

```javascript
// JavaScript usa as classes que ja existem no CSS
function toggleVisibility(element) {
  element.classList.toggle('hidden')
}

function setActive(element) {
  element.classList.add('active')
}

// Nao crie novas classes se as existentes resolvem o problema
```

## Variacao: Quando precisar adicionar algo ao HTML

```javascript
// Se o HTML nao tem um ID/classe necessario,
// adicione via JavaScript em vez de editar o HTML
const paragraphs = document.querySelectorAll('main p')

paragraphs.forEach((paragraph, index) => {
  paragraph.dataset.index = index // adiciona data-attribute via JS
})
```