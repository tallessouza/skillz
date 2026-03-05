# Code Examples: Estrutura de Aulas

## Template base — index.html

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Classroom</title>
</head>
<body>
  <script src="scripts.js"></script>
</body>
</html>
```

**Por que o `<script>` fica no final do `<body>`?** Para garantir que qualquer elemento HTML (se houver) ja foi carregado antes do JavaScript executar.

## Template base — scripts.js

```javascript
// Comece aqui
```

Arquivo intencionalmente vazio. Todo conteudo e adicionado durante a aula.

## Exemplo de uso tipico durante uma aula

```javascript
// Testando console.log
console.log("Hello, JavaScript!")
console.log(42)
console.log(true)
console.log([1, 2, 3])
console.log({ name: "Skillz" })
```

## Variacao: organizacao por aula com pastas duplicadas

```
lessons/
├── aula-01-variaveis/
│   ├── index.html
│   └── scripts.js
├── aula-02-tipos/
│   ├── index.html
│   └── scripts.js
├── aula-03-funcoes/
│   ├── index.html
│   └── scripts.js
└── aula-04-objetos/
    ├── index.html
    └── scripts.js
```

Cada pasta e uma copia independente com o codigo daquela aula preservado.

## Instalacao do Live Server no VS Code

1. Abrir VS Code
2. Ctrl+Shift+X (abrir Extensions)
3. Buscar "Live Server"
4. Instalar a extensao de Ritwick Dey
5. Botao direito em `index.html` → "Open with Live Server"

## Verificacao rapida

Para confirmar que o setup funciona:

```javascript
// scripts.js
console.log("Setup funcionando!")
```

Salvar o arquivo. Se "Setup funcionando!" aparecer no console do navegador, o ambiente esta pronto.