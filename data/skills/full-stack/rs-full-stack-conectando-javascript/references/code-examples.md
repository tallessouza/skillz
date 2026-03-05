# Code Examples: Conectando JavaScript ao HTML

## Exemplo 1: Inline (nao recomendado para logica propria)

```html
<!DOCTYPE html>
<html>
<head>
  <title>Exemplo Inline</title>
</head>
<body>
  <h1>Minha pagina</h1>

  <script>
    console.log("Rodrigo Goncalves")
  </script>
</body>
</html>
```

**Quando voce veria isso:** Scripts de terceiros como Google Analytics, pixels de rastreamento, ou snippets de bibliotecas CDN.

## Exemplo 2: Arquivo externo no head (nao recomendado)

```html
<!DOCTYPE html>
<html>
<head>
  <title>Exemplo no Head</title>
  <script src="script.js"></script>
</head>
<body>
  <h1>Minha pagina</h1>
</body>
</html>
```

**Problema:** Se `script.js` for grande, o usuario ve uma tela branca ate o JS terminar de carregar e executar.

## Exemplo 3: Arquivo externo no final do body (recomendado)

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title>Exemplo Correto</title>
</head>
<body>
  <h1>Minha pagina</h1>
  <p>Todo o conteudo HTML vem primeiro</p>
  <button>Clique aqui</button>

  <!-- Conteudo da pagina ja carregado acima -->
  <script src="script.js"></script>
</body>
</html>
```

**script.js:**
```javascript
console.log("Rodrigo")
```

## Exemplo 4: Multiplos scripts (ordem importa)

```html
<body>
  <h1>Minha App</h1>

  <!-- Dependencias primeiro -->
  <script src="utils.js"></script>
  <!-- Codigo que depende de utils -->
  <script src="app.js"></script>
</body>
```

## Exemplo 5: Mistura aceitavel (terceiros no head, proprio no body)

```html
<head>
  <title>App com Analytics</title>
  <!-- Script de terceiro: OK no head -->
  <script>
    (function(i,s,o,g,r,a,m){/* snippet do analytics */})(window,document,'script','...');
  </script>
</head>
<body>
  <h1>Minha App</h1>

  <!-- Seu codigo: sempre no final do body -->
  <script src="app.js"></script>
</body>
```