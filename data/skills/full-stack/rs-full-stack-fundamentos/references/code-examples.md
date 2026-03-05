# Code Examples: Fundamentos de CSS — Fontes e Textos

## 1. Propriedades de fonte — todas as variacoes

### font-family

```css
/* Com fallback chain (sempre incluir generica no final) */
body {
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
}

/* Fontes serifadas */
.article {
  font-family: 'Georgia', 'Times New Roman', serif;
}

/* Monoespacada (para codigo) */
code {
  font-family: 'Fira Code', 'Courier New', monospace;
}
```

### font-size

```css
/* Usando rem (recomendado) */
h1 { font-size: 2.5rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.5rem; }
p  { font-size: 1rem; }
small { font-size: 0.875rem; }

/* Usando em (relativo ao pai) */
.card-title { font-size: 1.2em; }
```

### font-weight

```css
.light    { font-weight: 300; }
.normal   { font-weight: 400; }  /* normal */
.medium   { font-weight: 500; }
.semibold { font-weight: 600; }
.bold     { font-weight: 700; }  /* bold */
.black    { font-weight: 900; }
```

### font-style

```css
.normal  { font-style: normal; }
.italic  { font-style: italic; }
.oblique { font-style: oblique; }
```

## 2. Propriedades de layout do texto — todas as variacoes

### line-height

```css
/* Valor sem unidade (multiplicador do font-size — RECOMENDADO) */
p { line-height: 1.6; }

/* Valores comuns por contexto */
.heading    { line-height: 1.2; }  /* titulos: mais apertado */
.body-text  { line-height: 1.6; }  /* corpo: confortavel */
.ui-label   { line-height: 1.0; }  /* labels: compacto */
```

### letter-spacing

```css
/* Usando em (escala com font-size) */
.heading     { letter-spacing: -0.02em; }  /* titulos grandes: mais apertado */
.body        { letter-spacing: 0; }         /* corpo: padrao */
.uppercase   { letter-spacing: 0.05em; }    /* caps: mais espacado para legibilidade */
.spaced-out  { letter-spacing: 0.1em; }     /* efeito decorativo */
```

### text-align

```css
.left     { text-align: left; }      /* padrao em LTR */
.center   { text-align: center; }
.right    { text-align: right; }
.justify  { text-align: justify; }   /* como no Word */

/* Para RTL */
.rtl-text {
  direction: rtl;
  text-align: right;
}
```

## 3. Estilizando parte do texto

### Usando span generico

```html
<p>O preco é <span class="price">R$ 49,90</span> por mes.</p>
```

```css
.price {
  font-weight: bold;
  font-size: 1.2em;
  color: #16a34a;
}
```

### Usando tags semanticas com estilo embutido

```html
<p>Este produto e <strong>exclusivo</strong> e esta com <em>desconto especial</em>.</p>
```

```css
/* strong ja vem bold, em ja vem italico */
/* Voce pode sobrescrever se quiser */
strong {
  font-weight: 800;
  color: #dc2626;
}
```

### Combinando multiplas tags

```html
<p>
  Aprenda <strong>CSS</strong> e domine
  <span class="highlight">tipografia</span> como um
  <em>profissional</em>.
</p>
```

```css
.highlight {
  font-weight: bold;
  font-style: italic;
  letter-spacing: 0.02em;
}
```

## 4. Exemplo completo: card com tipografia organizada

```css
.card {
  /* Font properties */
  font-family: 'Inter', sans-serif;
}

.card-title {
  /* Font */
  font-size: 1.5rem;
  font-weight: 700;

  /* Text layout */
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.card-description {
  /* Font */
  font-size: 1rem;
  font-weight: 400;

  /* Text layout */
  line-height: 1.6;
  letter-spacing: 0;
  text-align: left;
}

.card-label {
  /* Font */
  font-size: 0.75rem;
  font-weight: 600;
  font-style: normal;

  /* Text layout */
  line-height: 1;
  letter-spacing: 0.05em;
  text-align: center;
  text-transform: uppercase;
}
```

## 5. Direcionalidade — exemplo RTL

```html
<html dir="ltr" lang="pt-BR">
  <body>
    <p>Texto em portugues, da esquerda para a direita.</p>

    <!-- Secao em arabe -->
    <section dir="rtl" lang="ar">
      <p>نص باللغة العربية، من اليمين إلى اليسار</p>
    </section>
  </body>
</html>
```

```css
[dir="rtl"] {
  text-align: right;
}

[dir="ltr"] {
  text-align: left;
}
```