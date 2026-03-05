# Code Examples: Fluxo HTML — Block vs Inline

## Exemplo 1: Paragrafos (Block) — Da aula

O exemplo principal do instrutor mostra dois paragrafos:

```html
<p>Primeiro texto</p>
<p>Segundo texto</p>
```

**Resultado visual:**
```
┌──────────────────────────────────────┐
│ Primeiro texto                       │  ← ocupa toda a largura
├──────────────────────────────────────┤
│ Segundo texto                        │  ← empilha abaixo
└──────────────────────────────────────┘
```

O `<p>` e block: ocupa 100% da largura do container e empurra o proximo elemento para baixo.

## Exemplo 2: Links (Inline) — Da aula

```html
<a href="#">Link 1</a>
<a href="#">Outro link</a>
```

**Resultado visual:**
```
┌────────┐ ┌────────────┐
│ Link 1 │ │ Outro link │  ← lado a lado, com espaco entre eles
└────────┘ └────────────┘
```

Mesmo escritos em linhas separadas no codigo, renderizam lado a lado. O espaco entre eles vem do whitespace no codigo-fonte.

## Exemplo 3: Misturando block e inline

```html
<p>Este paragrafo contem um <a href="#">link</a> no meio do texto.</p>
<p>Segundo paragrafo.</p>
```

**Resultado visual:**
```
┌──────────────────────────────────────────────────────┐
│ Este paragrafo contem um [link] no meio do texto.    │  ← block com inline dentro
├──────────────────────────────────────────────────────┤
│ Segundo paragrafo.                                   │  ← proximo block abaixo
└──────────────────────────────────────────────────────┘
```

O `<a>` (inline) flui dentro do texto do `<p>` (block). O proximo `<p>` empilha abaixo.

## Exemplo 4: Multiplos inline elements

```html
<a href="/home">Home</a>
<a href="/about">Sobre</a>
<a href="/contact">Contato</a>
<span>|</span>
<strong>Menu principal</strong>
```

**Resultado visual:**
```
[Home] [Sobre] [Contato] | Menu principal
```

Todos inline, todos lado a lado na mesma linha.

## Exemplo 5: Forcando block em inline

```html
<!-- Para empilhar links verticalmente sem CSS: -->
<div><a href="/home">Home</a></div>
<div><a href="/about">Sobre</a></div>
<div><a href="/contact">Contato</a></div>
```

**Resultado visual:**
```
[Home]
[Sobre]
[Contato]
```

Cada `<div>` (block) empilha verticalmente, e o `<a>` (inline) fica dentro.

## Exemplo 6: O "bug" do espaco entre inline elements

```html
<!-- Com espaco no codigo: -->
<a href="#">Link 1</a>
<a href="#">Link 2</a>

<!-- Sem espaco no codigo: -->
<a href="#">Link 1</a><a href="#">Link 2</a>
```

**Resultado visual:**
```
Com espaco:  [Link 1] [Link 2]    ← espaco visivel entre eles
Sem espaco:  [Link 1][Link 2]     ← colados
```

O whitespace entre tags inline no codigo-fonte e renderizado como um espaco. Isso nao e um bug, e o comportamento padrao.

## Exemplo 7: Headings (block) vs spans (inline)

```html
<h1>Titulo</h1>
<h2>Subtitulo</h2>
<span>Texto 1</span>
<span>Texto 2</span>
```

**Resultado visual:**
```
┌──────────────────────────────────────┐
│ Titulo                               │  ← h1 block
├──────────────────────────────────────┤
│ Subtitulo                            │  ← h2 block
├──────────────────────────────────────┤
│ Texto 1 Texto 2                      │  ← spans inline, lado a lado
└──────────────────────────────────────┘
```

## Exemplo 8: Navegacao real aplicando o conceito

```html
<nav>
  <a href="/">Home</a>
  <a href="/products">Produtos</a>
  <a href="/about">Sobre</a>
  <a href="/contact">Contato</a>
</nav>
```

**Resultado visual (sem CSS):**
```
[Home] [Produtos] [Sobre] [Contato]   ← inline, lado a lado naturalmente
```

A tag `<nav>` e block (ocupa toda a largura), mas os `<a>` dentro dela sao inline e fluem horizontalmente. Uma navegacao basica funciona sem nenhum CSS.