# Code Examples: Estrutura Aside/Main e Imagens Responsivas

## HTML completo da aula

### Estrutura do main (botao voltar + titulo)

```html
<main class="main-container">
  <div class="back">
    <img src="./assets/icons/arrow-left-02.svg" alt="Ícone de voltar">
    <span>Voltar</span>
  </div>
  <h1>Formulário de matrícula</h1>
  <p>Preencha os dados abaixo para matricular seu filho...</p>
</main>
```

### Estrutura do aside

```html
<aside class="aside-container">
  <header>
    <img src="./assets/logo.svg" alt="Logo Estrelas do Amanhã">
    <h2>Cada conta, <span>o aprendizado</span></h2>
    <p>Inscreva seu filho na melhor escola da região</p>
  </header>
  <img src="./assets/illustration.svg" alt="Ilustração de uma professora com crianças prestando atenção">
</aside>
```

## CSS completo da aula

### Global (global.css)

```css
body {
  font-family: var(--text);
  color: var(--text-secondary);
}

h1, h2 {
  color: var(--text-primary);
}

img {
  max-width: 100%;
  height: auto;
}
```

### Layout (layout.css)

```css
/* Botao voltar */
.main-container .back {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

/* Titulo do formulario */
.main-container h1 {
  font-weight: 600;
  font-size: 1.5rem;
  line-height: 1.25;
  font-family: var(--text);
  margin-bottom: 0.5rem;
}

/* Heading do aside */
.aside-container h2 {
  font-weight: 600;
  font-size: 2.5rem;
  line-height: 1.25;
  margin-bottom: 0.5rem;
}

/* Destaque colorido no h2 */
.aside-container h2 span {
  color: var(--text-highlight);
}

/* Ilustracao — filho direto do aside */
.aside-container > img {
  width: 100%;
  margin-top: 2rem;
}
```

## Emmet shortcuts usados na aula

O instrutor demonstra a velocidade do Emmet para criar estruturas HTML:

```
div.back>img+span
```
Gera:
```html
<div class="back">
  <img src="" alt="">
  <span></span>
</div>
```

```
header>img+h2+p
```
Gera:
```html
<header>
  <img src="" alt="">
  <h2></h2>
  <p></p>
</header>
```

## Variacoes: aplicando os mesmos padroes

### Variacao 1: Card com imagem responsiva

```html
<article class="card">
  <header>
    <img src="./assets/avatar.jpg" alt="Foto do aluno João">
    <h3>João Silva</h3>
  </header>
  <img src="./assets/certificate.png" alt="Certificado de conclusão">
</article>
```

```css
/* Nao precisa de max-width — ja esta no global */
.card > img {
  width: 100%;
  margin-top: 1rem;
  border-radius: 0.5rem;
}
```

### Variacao 2: Hierarquia de cores com mais niveis

```css
body {
  color: var(--text-secondary);    /* cinza medio — texto geral */
}

h1, h2, h3 {
  color: var(--text-primary);      /* escuro — headings */
}

a {
  color: var(--text-highlight);    /* cor destaque — links */
}

.muted {
  color: var(--text-tertiary);     /* cinza claro — texto auxiliar */
}
```

### Variacao 3: Seletor filho direto em lista com icones

```html
<nav class="sidebar">
  <img src="./assets/logo.svg" alt="Logo">
  <ul>
    <li>
      <img src="./assets/icons/home.svg" alt="">
      <span>Home</span>
    </li>
  </ul>
</nav>
```

```css
/* Apenas o logo, nao os icones dentro dos li */
.sidebar > img {
  width: 120px;
  margin-bottom: 2rem;
}
```