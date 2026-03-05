# Code Examples: Alternativas para Executar JavaScript

## console.log basico

```javascript
// Exibir uma mensagem simples
console.log("Hello World")
```

Saida no console:
```
Hello World
```

## console.log com nome

```javascript
// Exibir qualquer texto — basta trocar o conteudo entre aspas
console.log("Rodrigo")
```

Saida no console:
```
Rodrigo
```

## Strings em JavaScript

```javascript
// Texto entre aspas = string
console.log("Isso e uma string")
console.log('Aspas simples tambem funcionam')
console.log(`Template literals com crase tambem`)
```

## Erro comum: digitar comando incompleto

```javascript
// ERRADO — "con" nao e um comando valido
con
// Resultado: ReferenceError: con is not defined

// CORRETO — comando completo
console.log("mensagem")
```

## Multiplas mensagens

```javascript
console.log("Primeira mensagem")
console.log("Segunda mensagem")
console.log("Terceira mensagem")
```

Saida:
```
Primeira mensagem
Segunda mensagem
Terceira mensagem
```

## Fluxo recomendado com VS Code

1. Criar arquivo `index.html`:
```html
<!DOCTYPE html>
<html>
<head>
  <title>Meu JavaScript</title>
</head>
<body>
  <script src="script.js"></script>
</body>
</html>
```

2. Criar arquivo `script.js`:
```javascript
console.log("Hello World")
```

3. Abrir `index.html` no navegador
4. Abrir DevTools (F12) → Console
5. Ver a saida do `console.log`

## Comparacao pratica dos ambientes

### No JS Playground
- Abrir jsplayground.dev
- Digitar no painel esquerdo: `console.log("Hello World")`
- Ver resultado automaticamente no painel direito

### No CodePen
- Abrir codepen.io → Start Coding
- Minimizar paineis HTML e CSS
- Digitar no painel JS: `console.log("Hello World")`
- Abrir console embaixo → ver resultado

### No Console do navegador
- Em qualquer pagina: F12 → Console
- Digitar: `console.log("Hello World")` → Enter
- Ver resultado imediatamente abaixo