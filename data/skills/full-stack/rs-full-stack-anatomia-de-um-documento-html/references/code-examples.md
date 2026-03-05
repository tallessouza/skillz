# Code Examples: Anatomia de um Documento HTML

## Exemplo 1: Estrutura minima valida

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Aprendendo HTML</title>
</head>
<body>
</body>
</html>
```

Este e o minimo absoluto para um documento HTML valido e funcional.

## Exemplo 2: Boilerplate gerado pelo VS Code (atalho `!`)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>

</body>
</html>
```

**Ajustes necessarios apos gerar:**
- Mudar `lang="en"` para `lang="pt-BR"` (se pagina em portugues)
- Mudar `<title>Document</title>` para o nome real da pagina
- A meta `http-equiv="X-UA-Compatible"` pode ser removida (legado do Internet Explorer)

## Exemplo 3: Pagina com conteudo basico

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog da Skillz</title>
</head>
<body>
  <h1>Bem vindo ao Blog</h1>
  <p>Aqui voce aprende sobre desenvolvimento web.</p>
</body>
</html>
```

## Exemplo 4: Demonstrando o efeito do charset

**Sem charset (pode causar problemas):**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <title>Meu Site</title>
</head>
<body>
  <p>Programação é incrível!</p>
  <!-- "ã" e "í" podem aparecer como símbolos estranhos -->
</body>
</html>
```

**Com charset UTF-8 (correto):**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Meu Site</title>
</head>
<body>
  <p>Programação é incrível!</p>
  <!-- Acentos renderizam corretamente -->
</body>
</html>
```

## Exemplo 5: Title dinamico por pagina

```html
<!-- Pagina inicial -->
<title>Blog da Skillz</title>

<!-- Pagina de post especifico -->
<title>Tudo sobre HTML - Skillz</title>

<!-- Pagina de contato -->
<title>Contato - Skillz</title>
```

O title muda conforme a pagina que o usuario esta visitando. Cada arquivo HTML tem seu proprio title.

## Exemplo 6: Variacoes do atributo lang

```html
<!-- Portugues Brasil -->
<html lang="pt-BR">

<!-- Portugues Portugal -->
<html lang="pt-PT">

<!-- Ingles -->
<html lang="en">

<!-- Espanhol -->
<html lang="es">
```