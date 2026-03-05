# Code Examples: Criando Listas em HTML

## Exemplo 1: Lista de links da aula (exato do instrutor)

```html
<ul>
  <li><a href="#">Inscrever-se no NLW</a></li>
  <li><a href="#">Baixar meu e-book</a></li>
  <li><a href="https://github.com/user">Ver meu portfólio</a></li>
  <li><a href="https://rocketseat.com.br/explorer" target="_blank">Conheça o Explorer</a></li>
</ul>
```

O instrutor cria quatro itens. Os dois primeiros usam `href="#"` (placeholder). O terceiro aponta para o GitHub. O quarto aponta para o Explorer da Rocketseat com `target="_blank"`.

## Exemplo 2: Adicionando target="_blank" em todos os links externos

```html
<ul>
  <li><a href="#">Inscrever-se no NLW</a></li>
  <li><a href="#">Baixar meu e-book</a></li>
  <li><a href="https://github.com/user" target="_blank">Ver meu portfólio</a></li>
  <li><a href="https://rocketseat.com.br/explorer" target="_blank">Conheça o Explorer</a></li>
</ul>
```

Todos os links que apontam para URLs externas (https://...) recebem `target="_blank"`. Links placeholder (#) nao precisam.

## Exemplo 3: Lista ordenada (comparacao)

```html
<!-- Lista NAO ordenada (pontos) -->
<ul>
  <li>Item A</li>
  <li>Item B</li>
  <li>Item C</li>
</ul>

<!-- Lista ordenada (numeros 1, 2, 3) -->
<ol>
  <li>Primeiro passo</li>
  <li>Segundo passo</li>
  <li>Terceiro passo</li>
</ol>
```

## Exemplo 4: Links sociais (variacao pratica)

```html
<ul>
  <li><a href="https://github.com/usuario" target="_blank">GitHub</a></li>
  <li><a href="https://linkedin.com/in/usuario" target="_blank">LinkedIn</a></li>
  <li><a href="https://twitter.com/usuario" target="_blank">Twitter</a></li>
  <li><a href="mailto:usuario@email.com">E-mail</a></li>
</ul>
```

Todos os links de redes sociais sao externos, entao recebem `target="_blank"`. O mailto nao precisa porque abre o cliente de email, nao navega para fora.

## Exemplo 5: Placeholder durante desenvolvimento

```html
<!-- Durante desenvolvimento: todos os links com # -->
<ul>
  <li><a href="#">Link 1 (TODO: adicionar URL)</a></li>
  <li><a href="#">Link 2 (TODO: adicionar URL)</a></li>
  <li><a href="#">Link 3 (TODO: adicionar URL)</a></li>
</ul>

<!-- Versao final: URLs reais -->
<ul>
  <li><a href="https://site.com/inscricao" target="_blank">Inscrever-se</a></li>
  <li><a href="https://site.com/ebook" target="_blank">Baixar e-book</a></li>
  <li><a href="https://site.com/portfolio" target="_blank">Ver portfólio</a></li>
</ul>
```