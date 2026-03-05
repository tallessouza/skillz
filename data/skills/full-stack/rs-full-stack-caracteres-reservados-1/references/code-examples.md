# Code Examples: Caracteres Reservados no HTML

## Exemplo 1: Exibindo uma tag simples

```html
<!-- ERRADO: browser interpreta como tag -->
<p>Use a tag <p> para criar paragrafos.</p>

<!-- CORRETO: entidades escapadas -->
<p>Use a tag &lt;p&gt; para criar paragrafos.</p>

<!-- MELHOR: com tag code para semantica -->
<p>Use a tag <code>&lt;p&gt;</code> para criar paragrafos.</p>
```

**Resultado visual do correto:** Use a tag `<p>` para criar paragrafos.

## Exemplo 2: Exibindo entidades como texto literal

```html
<!-- ERRADO: &gt; e convertido para > -->
<p>Use &gt; no seu codigo.</p>
<!-- Resultado: Use > no seu codigo. -->

<!-- CORRETO: escape o & para mostrar a entidade -->
<p>Use <code>&amp;gt;</code> no seu codigo.</p>
<!-- Resultado: Use &gt; no seu codigo. -->
```

## Exemplo 3: Documentacao de referencia de entidades

```html
<h2>Entidades HTML Essenciais</h2>
<ul>
  <li><code>&amp;lt;</code> → sinal de menor (<code>&lt;</code>)</li>
  <li><code>&amp;gt;</code> → sinal de maior (<code>&gt;</code>)</li>
  <li><code>&amp;amp;</code> → e-comercial (<code>&amp;</code>)</li>
</ul>
```

## Exemplo 4: Quando NAO precisa escapar

```html
<!-- Funciona sem escape (< nao esta no formato de tag) -->
<p>Se x < 10 e y > 5, execute o calculo.</p>

<!-- Tambem funciona (> sozinho nunca e problema) -->
<p>O resultado foi > 100.</p>

<!-- MAS ISSO QUEBRA (formato de tag: < + letra sem espaco) -->
<p>A tag <div> e usada para containers.</p>

<!-- CORRETO -->
<p>A tag <code>&lt;div&gt;</code> e usada para containers.</p>
```

## Exemplo 5: Bloco de codigo com `<pre><code>`

```html
<pre><code>
&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;title&gt;Minha Pagina&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;p&gt;Ola mundo!&lt;/p&gt;
  &lt;/body&gt;
&lt;/html&gt;
</code></pre>
```

## Exemplo 6: Escape em cadeia (caso avancado)

```html
<!-- Quero mostrar na tela: &amp;gt; -->
<!-- Preciso escapar DOIS niveis -->
<p><code>&amp;amp;gt;</code></p>
<!-- Browser processa: &amp;amp; → &amp; + gt; → &amp;gt; -->
```

## Tabela de referencia rapida

```html
<!--
| Quero exibir | Escrevo no HTML |
|--------------|-----------------|
| <            | &lt;            |
| >            | &gt;            |
| &            | &amp;           |
| "            | &quot;          |
| '            | &apos;          |
| <p>          | &lt;p&gt;       |
| &lt;         | &amp;lt;        |
| &amp;        | &amp;amp;       |
-->
```