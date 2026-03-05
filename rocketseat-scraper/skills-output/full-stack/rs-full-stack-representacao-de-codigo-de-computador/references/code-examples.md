# Code Examples: Representacao de Codigo de Computador em HTML

## Exemplo 1: Tag `<code>` inline — diferenca visual

```html
<p>Texto normal aqui</p>
<p><code>Texto dentro de code aqui</code></p>
```

**Resultado:** O texto dentro de `<code>` aparece em fonte monospace, visualmente diferente do paragrafo normal.

## Exemplo 2: `<pre>` preservando whitespace

```html
<pre><code>Texto    com     espacos    extras

E quebra de linha tambem</code></pre>
```

**Resultado:** Todos os espacos multiplos e quebras de linha sao preservados exatamente como escritos no source.

### Variacao — sem `<pre>`:

```html
<code>Texto    com     espacos    extras

E quebra de linha tambem</code>
```

**Resultado:** Browser colapsa tudo em: `Texto com espacos extras E quebra de linha tambem`

## Exemplo 3: Exibindo HTML como texto (o problema)

### Tentativa errada:

```html
<pre><code>
  <pre>
    <code>Exemplo</code>
  </pre>
</code></pre>
```

**Resultado:** O browser interpreta as tags internas como HTML real. A estrutura quebra.

### Solucao com entities:

```html
<pre><code>
  &lt;pre&gt;
    &lt;code&gt;Exemplo&lt;/code&gt;
  &lt;/pre&gt;
</code></pre>
```

**Resultado:** O browser exibe literalmente `<pre><code>Exemplo</code></pre>` como texto.

## Exemplo 4: Escapando apenas `<` (funciona, mas incompleto)

```html
<pre><code>
  &lt;pre>
    &lt;code>Exemplo&lt;/code>
  &lt;/pre>
</code></pre>
```

**Resultado:** Funciona na maioria dos browsers porque `>` sem `<` correspondente e tratado como texto. Porem, **nao e boa pratica**.

## Exemplo 5: Exibindo um comentario HTML como texto

```html
<pre><code>&lt;!-- Este e um comentario HTML --&gt;</code></pre>
```

**Resultado:** Exibe `<!-- Este e um comentario HTML -->` como texto visivel.

## Exemplo 6: Codigo JavaScript dentro de `<pre><code>`

```html
<pre><code>function calcularTotal(items) {
  return items
    .filter(item =&gt; item.ativo)
    .reduce((total, item) =&gt; total + item.preco, 0)
}</code></pre>
```

**Nota:** Em JavaScript puro sem tags HTML, os `>` em arrow functions nao precisam ser escapados. Mas se quiser consistencia total, pode usar `&gt;`.

## Exemplo 7: Bloco completo — HTML com atributos

```html
<pre><code>&lt;div class="container"&gt;
  &lt;h1&gt;Titulo&lt;/h1&gt;
  &lt;p style="color: red"&gt;Paragrafo&lt;/p&gt;
&lt;/div&gt;</code></pre>
```

**Resultado:** Exibe o HTML formatado com indentacao preservada, todas as tags visiveis como texto.

## Tabela de referencia rapida — entities mais usadas em blocos de codigo

| Voce quer exibir | Escreva no HTML |
|-----------------|-----------------|
| `<div>` | `&lt;div&gt;` |
| `<!-- comment -->` | `&lt;!-- comment --&gt;` |
| `<img src="x" />` | `&lt;img src="x" /&gt;` |
| `a && b` | `a &amp;&amp; b` |
| `&copy;` (literal) | `&amp;copy;` |