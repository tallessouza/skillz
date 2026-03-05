# Code Examples: Atributos HTML

## Exemplo 1: Tag img com atributos autocompletados

Quando voce digita `img` e pressiona Enter no VS Code, o editor gera:

```html
<img src="" alt="">
```

Dois atributos ja inseridos:
- `src` — caminho/URL da imagem
- `alt` — texto alternativo descrevendo a imagem

Preenchendo:

```html
<img src="fotos/perfil.jpg" alt="Foto de perfil do usuario">
```

## Exemplo 2: Tag a (link) com href

```html
<a href="https://rocketseat.com.br">Rocketseat</a>
```

O editor autocompleta o `href` ao criar a tag `<a>`.

## Exemplo 3: Omissao de aspas — o problema

```html
<!-- Parece funcionar -->
<a href=https://exemplo.com>Link</a>

<!-- Mas ao adicionar title, quebra -->
<a href=https://exemplo.com title=Meu Site>Link</a>
<!-- O navegador pode interpretar "https://exemplo.com title=Meu" como valor de href -->
```

Correcao:

```html
<a href="https://exemplo.com" title="Meu Site">Link</a>
```

## Exemplo 4: Aspas simples — o problema do apostrofo

```html
<!-- Aspas simples -->
<a href='https://exemplo.com' title='It isn't good'>Link</a>
```

O que o navegador ve:
- `title` comeca em `'It isn`
- `'t good'` e interpretado como outro atributo ou lixo

Syntax highlighting do editor mostra as cores erradas a partir do apostrofo.

Correcao:

```html
<a href="https://exemplo.com" title="It isn't good">Link</a>
```

## Exemplo 5: Multiplos atributos com espacamento correto

```html
<!-- Correto: cada atributo separado por espaco -->
<img src="logo.png" alt="Logo da empresa" width="200" height="100">

<!-- Errado: sem espaco entre atributos -->
<img src="logo.png"alt="Logo da empresa"width="200"height="100">
```

## Exemplo 6: Atributos globais vs especificos

```html
<!-- Atributos globais funcionam em qualquer tag -->
<p id="intro" class="destaque" title="Paragrafo introdutorio">Texto</p>
<img id="hero" class="banner" src="hero.jpg" alt="Banner principal">

<!-- src e alt sao especificos de img -->
<!-- href e especifico de a -->
<a id="link-principal" href="https://exemplo.com">Link</a>
```