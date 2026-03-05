# Code Examples: Estrutura de Aulas

## Arquivo HTML completo (como mostrado na aula)

O instrutor mostra o conteudo do `index.html`:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aulas de JavaScript</title>
</head>
<body>
  <h1>Aulas de JavaScript</h1>
  <script src="script.js"></script>
</body>
</html>
```

Pontos importantes:
- O `<script>` esta no final do `<body>`, garantindo que o DOM carrega antes do script
- O titulo e simples: "Aulas de JavaScript"
- Nao ha CSS, frameworks, ou dependencias externas

## Arquivo JavaScript (ponto de partida)

```javascript
// script.js — vazio no inicio de cada aula
```

## Teste de verificacao do setup

Para confirmar que tudo funciona:

```javascript
// script.js
console.log("Setup funcionando!")
```

Resultado esperado no Console do DevTools: `Setup funcionando!`

## Variacao: Nomeacao da pasta

O instrutor usa `classroom/` mas diz "voce pode usar o nome que voce quiser". Alternativas comuns:
- `aulas/`
- `pratica-js/`
- `javascript-intermediario/`

O nome da pasta nao afeta o funcionamento — o importante e que `index.html` e `script.js` estejam na mesma pasta.