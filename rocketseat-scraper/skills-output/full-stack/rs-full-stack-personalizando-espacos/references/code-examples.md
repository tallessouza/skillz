# Code Examples: Personalizando Espacos CSS

## Contexto HTML da pagina de receita

```html
<main>
  <section class="about">
    <h1>Titulo da Receita</h1>
    <p>Primeiro paragrafo de descricao.</p>
    <p>Segundo paragrafo com mais detalhes.</p>
  </section>

  <section class="ingredients">
    <h2>Ingredientes</h2>
    <ul>
      <li>Ingrediente 1</li>
      <li>Ingrediente 2</li>
    </ul>
  </section>

  <section class="instructions">
    <h2>Modo de Preparo</h2>
    <ul>
      <li>Passo 1</li>
      <li>Passo 2</li>
    </ul>
  </section>
</main>
```

## CSS completo da aula (ordem exata)

```css
/* 1. Reset universal — SEMPRE primeiro */
* {
  margin: 0;
  padding: 0;
}

/* 2. Variaveis (ja existia do root) */
:root {
  --color-background: #f0f0f0;
  /* outras variaveis... */
}

/* 3. Padding do container principal */
main {
  padding: 24px;
}

/* 4. Titulos com margem inferior e line-height */
h1, h2 {
  margin-bottom: 4px;
  line-height: 150%;
}

/* 5. Paragrafos adjacentes */
p + p {
  margin-top: 12px;
}

/* 6. Secoes adjacentes */
section + section {
  margin-top: 24px;
}

/* 7. Recuo da lista */
ul {
  padding-left: 24px;
}
```

## Evolucao do line-height (tentativas do instrutor)

### Tentativa 1: no :root (NAO funcionou para headings)

```css
:root {
  line-height: 150%;
}
```

### Tentativa 2: no body (NAO funcionou para headings)

```css
body {
  line-height: 150%;
}
```

### Solucao final: direto nos elementos

```css
h1, h2 {
  line-height: 150%;
}
```

## Processo iterativo do padding-left da ul

```css
/* Tentativa 1: pouco recuo */
ul {
  padding-left: 12px;
}

/* Tentativa 2: dobrou, ficou adequado */
ul {
  padding-left: 24px;
}
```

## Variacao: aplicando o mesmo padrao em outro projeto

```css
/* Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box; /* bonus comum */
}

/* Container */
.container {
  padding: 32px;
  max-width: 800px;
  margin: 0 auto;
}

/* Irmaos adjacentes */
.card + .card {
  margin-top: 16px;
}

article + article {
  margin-top: 24px;
}

/* Headings */
h1, h2, h3 {
  margin-bottom: 8px;
  line-height: 140%;
}

/* Paragrafos */
p + p {
  margin-top: 12px;
}
```

## Atalho util mencionado na aula

Para toggle de comentario no VS Code:
- **Mac:** `Cmd + /`
- **Windows/Linux:** `Ctrl + /`

Util para comparar rapidamente com/sem um estilo aplicado.