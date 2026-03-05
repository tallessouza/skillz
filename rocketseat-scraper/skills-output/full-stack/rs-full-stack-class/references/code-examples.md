# Code Examples: Atributo Class no HTML

## Exemplo base da aula

```html
<!-- Dois produtos com classe compartilhada -->
<div class="produto">Tenis</div>
<div class="produto">Camiseta</div>
```

Ambos os elementos podem ser selecionados juntos via `.produto`.

## Multiplas classes

```html
<!-- Produto + sub-categoria -->
<div class="produto calcado">Tenis</div>
<div class="produto camisa">Camiseta</div>
```

Aqui, `produto` e compartilhada. `calcado` e `camisa` sao especificas.

## Variacoes praticas

### Lista de produtos com categorias
```html
<div class="produto calcado destaque">Tenis Nike</div>
<div class="produto calcado">Sandalia Havaianas</div>
<div class="produto camisa">Camiseta Polo</div>
<div class="produto camisa promocao">Regata Basica</div>
```

Selecoes possiveis:
- `.produto` → 4 elementos
- `.calcado` → 2 elementos
- `.camisa` → 2 elementos
- `.destaque` → 1 elemento
- `.promocao` → 1 elemento
- `.produto.calcado` → 2 elementos

### Navegacao com classes
```html
<nav class="navegacao principal">
  <a class="link ativo" href="/">Home</a>
  <a class="link" href="/sobre">Sobre</a>
  <a class="link" href="/contato">Contato</a>
</nav>
```

### Cards de conteudo
```html
<article class="card">
  <h2 class="card-titulo">Artigo 1</h2>
  <p class="card-texto">Conteudo aqui</p>
</article>

<article class="card destaque">
  <h2 class="card-titulo">Artigo Especial</h2>
  <p class="card-texto">Conteudo em destaque</p>
</article>
```

## O que NAO fazer

```html
<!-- ERRADO: caractere especial -->
<div class="promoção">Oferta</div>

<!-- ERRADO: nome generico -->
<div class="div1">Tenis</div>

<!-- ERRADO: espaco intencional como parte do nome (impossivel) -->
<!-- "produto calcado" SEMPRE sera duas classes separadas -->
<div class="produto calcado">Tenis</div>

<!-- CORRETO: hifen para nomes compostos -->
<div class="produto-destaque">Tenis</div>
```

## Conexao futura com CSS

```css
/* Selecionar todos os produtos */
.produto {
  border: 1px solid #ccc;
  padding: 16px;
}

/* Selecionar apenas calcados */
.calcado {
  color: blue;
}

/* Selecionar produto QUE TAMBEM e calcado */
.produto.calcado {
  font-weight: bold;
}
```

## Conexao futura com JavaScript

```javascript
// Selecionar todos os produtos
const produtos = document.querySelectorAll('.produto')
// Retorna NodeList com 2 elementos

// Selecionar apenas calcados
const calcados = document.querySelectorAll('.calcado')
// Retorna NodeList com 1 elemento

// Selecionar camisas
const camisas = document.querySelectorAll('.camisa')
// Retorna NodeList com 1 elemento
```