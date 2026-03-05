# Code Examples: Instalando e Executando o Webpack

## Exemplo 1: Estrutura inicial do projeto

### index.html (antes do Webpack)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <!-- Sem script — o empacotador vai resolver -->
</body>
</html>
```

### Versao com script manual (funciona, mas NAO recomendada com bundler)

```html
<script type="module" src="js/index.js"></script>
```

O instrutor mostra que isso funciona com ES Modules nativos, mas remove o script para deixar o empacotador cuidar da importacao.

## Exemplo 2: Modulo components.js

```javascript
// src/js/components.js
export function title(title) {
  const element = document.createElement("h1")
  element.textContent = title
  document.body.appendChild(element)
}
```

### Variacoes do mesmo padrao

```javascript
// Exportando multiplos componentes
export function title(text) {
  const element = document.createElement("h1")
  element.textContent = text
  document.body.appendChild(element)
}

export function paragraph(text) {
  const element = document.createElement("p")
  element.textContent = text
  document.body.appendChild(element)
}

export function button(label, onClick) {
  const element = document.createElement("button")
  element.textContent = label
  element.addEventListener("click", onClick)
  document.body.appendChild(element)
}
```

## Exemplo 3: Entry point index.js

```javascript
// src/js/index.js
import { title } from "./components.js"

title("Hello World")
```

### Variacao com multiplos imports

```javascript
import { title, paragraph, button } from "./components.js"

title("Minha Aplicacao")
paragraph("Bem-vindo ao projeto com Webpack")
button("Clique aqui", () => alert("Funcionou!"))
```

## Exemplo 4: package.json com script de build

```json
{
  "name": "meu-projeto",
  "version": "1.0.0",
  "scripts": {
    "build": "webpack ./src/js/index.js"
  },
  "devDependencies": {
    "webpack": "^5.x.x",
    "webpack-cli": "^5.x.x"
  }
}
```

## Exemplo 5: Comando de instalacao

```bash
# Instalacao conforme documentacao oficial
npm install webpack webpack-cli --save-dev

# Equivalente com flag curta
npm i -D webpack webpack-cli
```

## Exemplo 6: Output gerado (dist/main.js)

O Webpack gera codigo minificado em `dist/main.js`. O conteudo e ilegivel mas funcional:

```javascript
// Exemplo simplificado do que o Webpack gera
(()=>{"use strict";const e=document.createElement("h1");e.textContent="Hello World",document.body.appendChild(e)})();
```

Observacoes:
- Todos os modulos foram combinados em um unico arquivo
- O codigo foi minificado (sem espacos, nomes curtos)
- As importacoes foram resolvidas estaticamente
- O resultado e um IIFE (Immediately Invoked Function Expression)