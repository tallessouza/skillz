# Code Examples: Hiperlink HTML

## Exemplo 1: Link externo basico

```html
<a href="https://rocketseat.com.br">Conheca a Rocketseat</a>
```

Comportamento: ao clicar, a pagina atual e substituida pelo site da Rocketseat.

## Exemplo 2: Link externo com nova aba

```html
<a href="https://rocketseat.com.br" target="_blank">Visite a Rocketseat</a>
```

Comportamento: abre o site em uma nova aba, mantendo a pagina atual aberta.

## Exemplo 3: Fragmento (navegacao interna)

```html
<a href="#trabalhos">Trabalhos</a>

<!-- Conteudo extenso aqui... -->
<br><br><br><br><br><br><br><br><br><br>

<p id="trabalhos">
  Lorem ipsum dolor sit amet...
</p>
```

Comportamento: ao clicar em "Trabalhos", a pagina faz scroll ate o elemento com `id="trabalhos"`. So funciona visualmente se ha conteudo suficiente entre o link e o alvo para que o scroll seja perceptivel.

## Exemplo 4: Link envolvendo outras tags

```html
<a href="https://rocketseat.com.br" target="_blank">
  <img src="logo.png" alt="Logo Rocketseat">
  <span>Conheca a Rocketseat</span>
</a>
```

Todo o bloco (imagem + texto) se torna clicavel.

## Exemplo 5: Menu de navegacao com fragmentos

```html
<nav>
  <a href="#sobre">Sobre</a>
  <a href="#servicos">Servicos</a>
  <a href="#contato">Contato</a>
</nav>

<section id="sobre">
  <h2>Sobre Nos</h2>
  <p>Descricao da empresa...</p>
</section>

<section id="servicos">
  <h2>Servicos</h2>
  <p>Lista de servicos...</p>
</section>

<section id="contato">
  <h2>Contato</h2>
  <p>Formulario de contato...</p>
</section>
```

## Exemplo 6: Combinando URL externa com fragmento

```html
<a href="https://developer.mozilla.org/pt-BR/docs/Web/HTML#referencia" target="_blank">
  Ver referencia HTML no MDN
</a>
```

Navega para o site externo E faz scroll ate o fragmento `#referencia` naquela pagina.

## Variacoes de href

```html
<!-- URL absoluta -->
<a href="https://exemplo.com/pagina">Link absoluto</a>

<!-- URL relativa -->
<a href="/sobre">Pagina sobre (mesmo site)</a>

<!-- Fragmento puro -->
<a href="#topo">Voltar ao topo</a>

<!-- Email -->
<a href="mailto:contato@exemplo.com">Enviar email</a>

<!-- Telefone -->
<a href="tel:+5511999999999">Ligar</a>
```