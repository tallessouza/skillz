# Code Examples: Finalizando Seção de Destaques

## Estrutura Completa de um Card de Noticia

```html
<figure class="card">
  <img src="hologramas.jpg" alt="Hologramas" />
  <figcaption>
    <span class="content-tag">Tecnologia</span>
    <h3>Hologramas</h3>
    <p class="text-large">Descricao da noticia em ate tres linhas...</p>
  </figcaption>
</figure>
```

## Multiplos Cards na Secao de Destaques

```html
<section class="destaques">
  <figure class="card">
    <img src="hologramas.jpg" alt="Hologramas" />
    <figcaption>
      <span class="content-tag">Tecnologia</span>
      <h3>Hologramas</h3>
    </figcaption>
  </figure>

  <figure class="card">
    <img src="internet.jpg" alt="Internet" />
    <figcaption>
      <span class="content-tag">Internet</span>
      <h3>Internet</h3>
    </figcaption>
  </figure>

  <figure class="card">
    <img src="vestiveis.jpg" alt="Empresa lanca vestiveis" />
    <figcaption>
      <span class="content-tag">Vestiveis</span>
      <h3>Empresa lanca vestiveis</h3>
      <p class="text-large">Como novos dispositivos vestiveis...</p>
    </figcaption>
  </figure>

  <figure class="card">
    <img src="realidade-virtual.jpg" alt="Realidade Virtual" />
    <figcaption>
      <span class="content-tag">Tecnologia</span>
      <h3>Realidade Virtual</h3>
      <p class="text-large">Escolas adotam novo smartphone...</p>
    </figcaption>
  </figure>

  <figure class="card">
    <img src="robos.jpg" alt="Robos domesticos" />
    <figcaption>
      <span class="content-tag">Robotica</span>
      <h3>Robos domesticos</h3>
      <p class="text-large">Novos robos domesticos chegam...</p>
    </figcaption>
  </figure>
</section>
```

## CSS Completo com :has()

```css
/* Padding padrao para todos os figcaptions */
figcaption {
  padding: 24px;
}

/* Quando figcaption contem .text-large, padding menor */
figcaption:has(.text-large) {
  padding: 12px;
}

/* Classe card padrao */
.card {
  border-radius: 8px;
  overflow: hidden;
}

.card img {
  width: 100%;
  object-fit: cover;
}

.content-tag {
  /* Estilo da tag de categoria */
  font-size: 0.75rem;
  text-transform: uppercase;
}
```

## Variacoes do :has()

### Detectar presenca de imagem

```css
/* Card que tem imagem recebe layout diferente */
.card:has(img) {
  display: grid;
  grid-template-rows: auto 1fr;
}
```

### Detectar quantidade de filhos

```css
/* Figcaption com mais de 2 filhos diretos */
figcaption:has(:nth-child(3)) {
  gap: 8px;
}
```

### Detectar tipo de tag de conteudo

```css
/* Se o card tem tag de "Urgente", destaque vermelho */
.card:has(.content-tag--urgent) {
  border-left: 4px solid red;
}
```

## Refatoracao: De div para figure

### Antes (markup generico)

```html
<div class="card">
  <img src="foto.jpg" />
  <div class="card-body">
    <span class="tag">Tech</span>
    <h3>Titulo</h3>
    <p>Texto</p>
  </div>
</div>
```

### Depois (markup semantico)

```html
<figure class="card">
  <img src="foto.jpg" alt="Titulo" />
  <figcaption>
    <span class="content-tag">Tech</span>
    <h3>Titulo</h3>
    <p class="text-large">Texto</p>
  </figcaption>
</figure>
```

### Dica VS Code para refatoracao

1. Selecione `<div class="card-body">` 
2. `Ctrl-D` (ou `Cmd-D`) para selecionar proximas ocorrencias
3. Substitua por `<figcaption>`
4. Repita para as tags de fechamento `</div>` → `</figcaption>`