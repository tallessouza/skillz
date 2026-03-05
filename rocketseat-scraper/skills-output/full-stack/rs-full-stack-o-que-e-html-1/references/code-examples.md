# Code Examples: O que é HTML

## Exemplo do instrutor: tag de link (hipertexto)

O instrutor mostrou especificamente uma tag de link como exemplo de hipertexto:

```html
<!-- Uma tag de link — o exemplo fundamental de hipertexto -->
<a href="https://outra-pagina.com">Clique aqui para ir a outro lugar</a>
```

**Anatomia:**
- `<a>` — tag de abertura (anchor/âncora)
- `href="..."` — atributo que define o destino do link
- `Clique aqui...` — texto visível ao usuário
- `</a>` — tag de fechamento

Quando clicado, abre outra página. **Isto é hipertexto em ação** — texto que vai além de si mesmo.

## Tags fundamentais que demonstram marcação

### Estrutura básica de um documento HTML

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Minha Página</title>
  </head>
  <body>
    <h1>Título principal</h1>
    <p>Um parágrafo de texto.</p>
    <a href="https://exemplo.com">Um link</a>
    <img src="foto.jpg" alt="Uma imagem">
  </body>
</html>
```

Cada tag **marca** o conteúdo com significado:
- `<h1>` — "isto é um título de nível 1"
- `<p>` — "isto é um parágrafo"
- `<a>` — "isto é um link" (hipertexto)
- `<img>` — "isto é uma imagem" (elemento multimídia)

### Tags com e sem texto

```html
<!-- Tag COM texto dentro -->
<p>Este parágrafo contém texto.</p>

<!-- Tag SEM texto (auto-fechada) -->
<img src="foto.jpg" alt="Descrição da imagem">
<br>
<hr>
```

O instrutor mencionou que tags "podem ter ou não texto" — estes exemplos demonstram ambos os casos.

### Tags com atributos

```html
<!-- Atributos modificam o comportamento da tag -->
<a href="https://destino.com" target="_blank">Abre em nova aba</a>
<img src="imagem.png" alt="Texto alternativo" width="300">
<input type="text" placeholder="Digite aqui">
```

O instrutor destacou que tags "geralmente vão ter ali alguns atributos" — atributos são pares chave-valor que configuram como a tag se comporta.

## O que HTML NÃO faz (comparação)

```html
<!-- HTML: marca conteúdo (CORRETO) -->
<p>Preço: R$ 49,90</p>

<!-- Isto NÃO é possível em HTML (seria programação): -->
<!-- if (preco > 100) { mostrar desconto } -->
<!-- let total = preco * quantidade -->
<!-- for (item in carrinho) { mostrar item } -->
```

Para lógica, você precisa de JavaScript. Para estilo visual, CSS. HTML apenas estrutura e marca o conteúdo.