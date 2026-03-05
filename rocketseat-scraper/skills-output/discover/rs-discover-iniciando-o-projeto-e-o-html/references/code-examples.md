# Code Examples: Estrutura Inicial de um Projeto HTML

## 1. Boilerplate completo gerado pelo Emmet (com ajuste pt-BR)

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
  </body>
</html>
```

**Passo a passo:**
1. Criar arquivo `index.html` (icone de novo arquivo no VS Code)
2. Digitar `!` dentro do arquivo
3. Pressionar Enter (Emmet autocompleta)
4. Trocar `lang="en"` para `lang="pt-BR"`
5. Salvar (Ctrl+S / Cmd+S)

## 2. Primeira linha: DOCTYPE

```html
<!DOCTYPE html>
```

Declara que o documento e HTML5. Sem isso, navegadores podem entrar em "quirks mode" e renderizar de forma imprevisivel.

## 3. Elemento raiz com atributo lang

```html
<!-- Padrao gerado pelo Emmet (ingles) -->
<html lang="en">

<!-- Correcao para portugues brasileiro -->
<html lang="pt-BR">
```

Variacoes de lang para outros idiomas:
```html
<html lang="es">     <!-- Espanhol -->
<html lang="fr">     <!-- Frances -->
<html lang="de">     <!-- Alemao -->
<html lang="ja">     <!-- Japones -->
```

## 4. Meta tags do head explicadas uma a uma

### Charset
```html
<!-- Permite caracteres especiais: ã, ç, é, ñ -->
<meta charset="UTF-8" />
```

### Compatibilidade IE
```html
<!-- Forca IE a usar modo mais recente -->
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
```

### Viewport (responsividade)
```html
<!-- Adapta a pagina ao tamanho do dispositivo -->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

Variacoes de viewport:
```html
<!-- Bloquear zoom do usuario (nao recomendado por acessibilidade) -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />

<!-- Zoom maximo de 3x -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3.0" />
```

### Title
```html
<!-- Aparece na aba do navegador — unica tag visivel do head -->
<title>Meu Primeiro Site</title>
```

## 5. Exemplo de codigo sem identacao vs com identacao

### Sem identacao (dificil de ler):
```html
<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8" /><meta http-equiv="X-UA-Compatible" content="IE=edge" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Document</title></head><body><h1>Titulo</h1><p>Paragrafo</p></body></html>
```

### Com identacao (Prettier aplicado):
```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <h1>Titulo</h1>
    <p>Paragrafo</p>
  </body>
</html>
```

## 6. Hierarquia pai-filho demonstrada

```html
<html>              <!-- Root Element (pai de tudo) -->
  <head>            <!-- Filho de html, pai das metas -->
    <meta />        <!-- Filho de head -->
    <title></title> <!-- Filho de head -->
  </head>
  <body>            <!-- Filho de html, irmao de head -->
    <h1></h1>       <!-- Filho de body -->
    <p></p>         <!-- Filho de body, irmao de h1 -->
  </body>
</html>
```

**Terminologia equivalente:**
- `html` e **parent** de `head` e `body`
- `head` e `body` sao **children** de `html`
- `head` e `body` sao **siblings** (irmaos)
- Cada elemento e um **node** (no) na arvore DOM