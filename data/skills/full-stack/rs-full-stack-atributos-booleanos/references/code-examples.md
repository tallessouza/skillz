# Code Examples: Atributos Booleanos em HTML

## Exemplo basico do instrutor

O instrutor demonstrou com um titulo que usa `hidden`:

```html
<!-- Elemento visivel normalmente -->
<h1>Titulo visivel</h1>

<!-- Elemento escondido com booleano -->
<h1 hidden>Titulo escondido</h1>

<!-- Sintaxe redundante — funciona igual -->
<h1 hidden="hidden">Titulo escondido tambem</h1>
```

## Formularios com multiplos booleanos

```html
<form novalidate>
  <label>
    Nome
    <input type="text" required autofocus>
  </label>

  <label>
    Email
    <input type="email" required>
  </label>

  <label>
    Senha
    <input type="password" required>
  </label>

  <label>
    <input type="checkbox" checked> Lembrar de mim
  </label>

  <label>
    Observacoes
    <textarea readonly>Campo somente leitura</textarea>
  </label>

  <button type="submit">Enviar</button>
  <button type="reset" disabled>Resetar</button>
</form>
```

## Midia com booleanos

```html
<!-- Video que inicia automatico, em loop, sem som -->
<video autoplay loop muted>
  <source src="background.mp4" type="video/mp4">
</video>

<!-- Audio com controles visiveis -->
<audio controls>
  <source src="musica.mp3" type="audio/mpeg">
</audio>
```

## Details/Summary com `open`

```html
<!-- Fechado por padrao -->
<details>
  <summary>Clique para ver mais</summary>
  <p>Conteudo escondido ate clicar.</p>
</details>

<!-- Aberto por padrao com booleano -->
<details open>
  <summary>Ja esta aberto</summary>
  <p>Conteudo visivel desde o inicio.</p>
</details>
```

## Scripts com defer e async

```html
<!-- Executa apos parsing do HTML -->
<script src="app.js" defer></script>

<!-- Executa assim que baixar (nao espera parsing) -->
<script src="analytics.js" async></script>
```

## Manipulacao via JavaScript

```javascript
const botao = document.querySelector('button');
const paragrafo = document.querySelector('p');

// Desabilitar botao
botao.disabled = true;

// Esconder paragrafo
paragrafo.hidden = true;

// Reativar botao
botao.disabled = false;

// Mostrar paragrafo
paragrafo.hidden = false;

// Verificar estado
if (botao.disabled) {
  console.log('Botao esta desabilitado');
}
```

## Comparacao das tres sintaxes validas

```html
<!-- Todas equivalentes — preferir a primeira -->
<input type="text" disabled>
<input type="text" disabled="">
<input type="text" disabled="disabled">

<!-- CUIDADO: isso NAO desabilita (parece que sim, mas nao) -->
<!-- Na verdade DESABILITA porque o atributo esta presente -->
<input type="text" disabled="false">
```