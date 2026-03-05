# Code Examples: Atributo ID no HTML

## Exemplo basico do instrutor

```html
<!-- O instrutor demonstra uma div com id -->
<div id="um-nome">Conteudo aqui</div>
```

O id `um-nome` identifica unicamente essa div. Pode ser acessado via CSS (`#um-nome`) ou JavaScript (`getElementById('um-nome')`).

## Nomes compostos com traco

```html
<!-- Separacao correta com traco -->
<div id="nome-1">Primeiro elemento</div>
<div id="nome-2">Segundo elemento</div>
```

O instrutor mostra que para separar palavras ou adicionar numeracao, usa-se traco. Nunca espaco.

## Erros que o instrutor alerta

### Numero no inicio (evitar)

```html
<!-- ERRADO: comeca com numero -->
<div id="1nome">...</div>

<!-- CORRETO: numero no final -->
<div id="nome-1">...</div>
```

### Caracteres especiais (evitar)

```html
<!-- ERRADO: caracteres especiais -->
<div id="nome@principal">...</div>
<div id="seção-hero">...</div>

<!-- CORRETO: apenas letras, numeros e tracos -->
<div id="nome-principal">...</div>
<div id="secao-hero">...</div>
```

### Id duplicado (proibido)

```html
<!-- ERRADO: mesmo id repetido -->
<div id="card">Card 1</div>
<div id="card">Card 2</div>

<!-- CORRETO: ids unicos -->
<div id="card-destaque">Card 1</div>
<div id="card-info">Card 2</div>
```

### Espaco no id (proibido)

```html
<!-- ERRADO: espaco separa palavras -->
<div id="meu nome">...</div>

<!-- CORRETO: traco une palavras -->
<div id="meu-nome">...</div>
```

## Uso pratico com CSS

```html
<div id="header-principal">Meu Site</div>

<style>
  #header-principal {
    background-color: #333;
    color: white;
    padding: 20px;
  }
</style>
```

## Uso pratico com JavaScript

```html
<div id="contador-visitas">0</div>

<script>
  const contador = document.getElementById('contador-visitas');
  contador.textContent = '42';
</script>
```

## Uso como ancora de navegacao

```html
<nav>
  <a href="#sobre">Sobre</a>
  <a href="#contato">Contato</a>
</nav>

<section id="sobre">
  <h2>Sobre Nos</h2>
  <p>...</p>
</section>

<section id="contato">
  <h2>Contato</h2>
  <p>...</p>
</section>
```

## Variacoes de nomes descritivos

```html
<!-- Pagina de e-commerce -->
<header id="cabecalho-loja"></header>
<main id="vitrine-produtos"></main>
<aside id="filtros-busca"></aside>
<footer id="rodape-loja"></footer>

<!-- Pagina de blog -->
<article id="post-principal"></article>
<aside id="barra-lateral"></aside>
<section id="comentarios-post"></section>
```