# Code Examples: Estrutura de Arquivos JS + HTML

## Exemplo 1: Estrutura minima completa

### index.html
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aulas de JavaScript</title>
</head>
<body>
  <script src="scripts.js"></script>
</body>
</html>
```

### scripts.js
```javascript
console.log("Hello World")
```

## Exemplo 2: Testando a conexao com multiplas mensagens

```javascript
console.log("Hello World")
console.log("JS conectado com o HTML")
```

O instrutor adiciona a segunda mensagem para confirmar que mudancas no JS refletem no navegador apos recarregar (ou automaticamente com Live Server).

## Exemplo 3: Testando com nome personalizado

```javascript
console.log("Rodrigo")
console.log("Rodrigo Gonçalves")
```

O instrutor troca a mensagem para seu nome e sobrenome para demonstrar o hot-reload do Live Server — ao salvar, a mudanca aparece instantaneamente no console.

## Variacoes de path no src

### Mesmo nivel (usado na aula)
```html
<script src="scripts.js"></script>
```

### Com prefixo relativo explicito (equivalente)
```html
<script src="./scripts.js"></script>
```

### JS em subpasta
```html
<script src="js/scripts.js"></script>
```

### JS um nivel acima
```html
<script src="../scripts.js"></script>
```

## Estrutura de organizacao por aula (dica do instrutor)

```
Classroom/
├── index.html
├── scripts.js                          # Arquivo de trabalho atual
├── aula-4-conectando-html-js.js        # Backup da aula 4
├── aula-5-variaveis.js                 # Backup da aula 5
└── aula-6-tipos-de-dados.js            # Backup da aula 6
```

Cada arquivo de backup e uma copia do `scripts.js` feita ao final de cada aula, renomeada com numero e tema.