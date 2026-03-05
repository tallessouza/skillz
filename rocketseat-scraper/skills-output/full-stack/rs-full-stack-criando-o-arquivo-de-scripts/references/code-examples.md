# Code Examples: Conectando JavaScript ao HTML

## Exemplo básico (da aula)

### HTML (`index.html`)
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Projeto Refund</title>
  <link rel="stylesheet" href="./styles.css">
</head>
<body>
  <!-- conteúdo da página -->

  <script src="./script.js"></script>
</body>
</html>
```

### JavaScript (`script.js`)
```javascript
// Teste de conexão (remover após validar)
console.log("javascript connected")
```

## Variação: múltiplos scripts

Quando o projeto cresce, pode haver mais de um arquivo JS. A ordem importa — arquivos carregam sequencialmente:

```html
<body>
  <!-- conteúdo -->

  <script src="./utils.js"></script>
  <script src="./script.js"></script>
</body>
```

`utils.js` carrega primeiro, então `script.js` pode usar funções definidas em `utils.js`.

## Variação: script em subpasta

```
projeto/
├── index.html
└── js/
    └── script.js
```

```html
<script src="./js/script.js"></script>
```

## Variação: com atributo defer (alternativa moderna)

Para projetos mais avançados, `defer` permite colocar o script no `<head>` sem bloquear o parsing:

```html
<head>
  <script src="./script.js" defer></script>
</head>
```

Com `defer`, o script só executa após o DOM estar completo, mesmo estando no `<head>`. O instrutor usa a abordagem antes do `</body>` que é a forma clássica e mais visual para iniciantes.

## Teste de conexão — passo a passo

```javascript
// 1. Adicione no script.js
console.log("javascript connected")

// 2. Abra o navegador com o HTML
// 3. Botão direito → Inspecionar → aba Console
// 4. Confirme que aparece "javascript connected"
// 5. Volte ao script.js e REMOVA o console.log
// 6. Salve e confirme que sumiu do console (refresh)
```