# Code Examples: Títulos e Parágrafos HTML

## Exemplo 1: Página "Sobre Mim" (do instrutor)

Este é o exemplo construído passo a passo durante a aula:

```html
<h1>Sobre Mim</h1>
<p>Texto introdutório sobre quem eu sou.</p>

<h2>Trabalho</h2>
<p>Texto descrevendo meu trabalho e experiência profissional.</p>

<h3>Carga Horária</h3>
<p>Detalhes sobre carga horária de trabalho.</p>

<h2>Estilo de Vida</h2>
<p>Texto sobre meu estilo de vida e hobbies.</p>
```

### Passo a passo da construção

1. Primeiro o instrutor mostrou texto desorganizado (sem tags)
2. Adicionou `<h1>Sobre Mim</h1>` — definiu o tópico principal
3. Envolveu o primeiro bloco de texto em `<p>` — criou o parágrafo
4. Adicionou `<h2>Trabalho</h2>` — nova seção
5. Adicionou `<h3>Carga Horária</h3>` — subseção dentro de Trabalho
6. Adicionou `<h2>Estilo de Vida</h2>` — nova seção (irmã de Trabalho)

## Exemplo 2: Variação — Blog post

```html
<h1>Como Aprender HTML em 2024</h1>
<p>HTML é a base de toda página web. Neste artigo, vou compartilhar dicas práticas.</p>

<h2>Por Onde Começar</h2>
<p>Comece entendendo que HTML é uma linguagem de marcação, não de programação.</p>

<h2>Tags Essenciais</h2>
<p>As primeiras tags que você deve dominar são headings e parágrafos.</p>

<h3>Headings</h3>
<p>Use H1 para o título principal e H2-H6 para subtítulos.</p>

<h3>Parágrafos</h3>
<p>Use a tag p para envolver cada bloco de texto.</p>

<h2>Próximos Passos</h2>
<p>Depois de dominar a estrutura básica, avance para listas e links.</p>
```

## Exemplo 3: Variação — Página de produto

```html
<h1>Notebook Pro X500</h1>
<p>O notebook mais potente da linha Pro, ideal para desenvolvedores.</p>

<h2>Especificações</h2>
<p>Conheça os detalhes técnicos do Pro X500.</p>

<h3>Processador</h3>
<p>Equipado com chip de última geração, 12 núcleos.</p>

<h3>Memória</h3>
<p>32GB de RAM DDR5 para multitarefas pesadas.</p>

<h2>Avaliações</h2>
<p>Veja o que nossos clientes dizem sobre o produto.</p>
```

## Anti-exemplo: Texto sem estrutura

```html
<!-- ERRADO: texto solto sem semântica -->
Notebook Pro X500
O notebook mais potente da linha Pro.
Especificações
Processador de última geração.
Memória 32GB.
```

O navegador renderiza tudo em uma linha contínua, sem hierarquia ou separação visual.

## Os 6 níveis de heading

```html
<h1>Heading 1 — Tópico principal (um por página)</h1>
<h2>Heading 2 — Seção</h2>
<h3>Heading 3 — Subseção</h3>
<h4>Heading 4 — Sub-subseção</h4>
<h5>Heading 5 — Raro, hierarquia profunda</h5>
<h6>Heading 6 — Muito raro</h6>
```

Na prática, a maioria das páginas usa apenas H1, H2 e H3. H4-H6 são para documentos muito extensos ou especificações técnicas.