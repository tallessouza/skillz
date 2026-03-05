# Code Examples: Estruturando Seções de Listagem de Conteúdo

## Estrutura completa da seção Weekly (como construída na aula)

```html
<section class="weekly">
  <header class="grid grid-flow-col">
    <h3>Mais Lidas da Semana</h3>
    <a href="#">
      <strong>Ver tudo</strong>
      <span></span>
    </a>
  </header>

  <div class="grid gap-16">
    <figure>
      <span class="content-tag">Veículos</span>
      <img src="assets/images/image-06.jpg" alt="" />
      <p>Chamada da notícia sobre veículos com texto truncado...</p>
    </figure>

    <figure>
      <span class="content-tag">Hologramas</span>
      <img src="assets/images/image-07.jpg" alt="" />
      <p>Chamada da notícia sobre hologramas...</p>
    </figure>

    <figure>
      <span class="content-tag">Realidade Virtual</span>
      <img src="assets/images/image-08.jpg" alt="" />
      <p>Experiên... texto sobre realidade virtual...</p>
    </figure>

    <figure>
      <span class="content-tag">Internet</span>
      <img src="assets/images/image-09.jpg" alt="" />
      <p>Chamada da notícia sobre internet...</p>
    </figure>
  </div>
</section>
```

## Variação: Seção "Trending" com mesma estrutura

```html
<section class="trending">
  <header class="grid grid-flow-col">
    <h3>Em Alta Agora</h3>
    <a href="/trending">
      <strong>Ver tudo</strong>
      <span></span>
    </a>
  </header>

  <div class="grid gap-16">
    <figure>
      <span class="content-tag">Tecnologia</span>
      <img src="assets/images/trending-01.jpg" alt="Nova IA generativa" />
      <p>Nova IA generativa surpreende especialistas...</p>
    </figure>

    <figure>
      <span class="content-tag">Ciência</span>
      <img src="assets/images/trending-02.jpg" alt="Descoberta espacial" />
      <p>Telescópio James Webb revela nova descoberta...</p>
    </figure>
  </div>
</section>
```

## Variação: Seção com grid de 2 colunas

```html
<section class="featured">
  <header class="grid grid-flow-col">
    <h3>Destaques</h3>
    <a href="/featured"><strong>Ver tudo</strong><span></span></a>
  </header>

  <!-- grid-cols-2 para layout em duas colunas -->
  <div class="grid grid-cols-2 gap-16">
    <figure>
      <span class="content-tag">Economia</span>
      <img src="assets/images/feat-01.jpg" alt="" />
      <p>Mercado financeiro reage positivamente...</p>
    </figure>

    <figure>
      <span class="content-tag">Política</span>
      <img src="assets/images/feat-02.jpg" alt="" />
      <p>Novas medidas governamentais entram em vigor...</p>
    </figure>

    <figure>
      <span class="content-tag">Saúde</span>
      <img src="assets/images/feat-03.jpg" alt="" />
      <p>Estudo revela benefícios surpreendentes...</p>
    </figure>

    <figure>
      <span class="content-tag">Esportes</span>
      <img src="assets/images/feat-04.jpg" alt="" />
      <p>Seleção brasileira se prepara para próxima fase...</p>
    </figure>
  </div>
</section>
```

## Passo a passo da construção (como o instrutor fez)

### Passo 1: Criar a section com header
```html
<section class="weekly">
  <header>
    <h3>Mais Lidas da Semana</h3>
    <a href="#"><strong>Ver tudo</strong><span></span></a>
  </header>
</section>
```

### Passo 2: Adicionar classes utilitárias ao header
```html
<header class="grid grid-flow-col">
```

### Passo 3: Criar o container dos cards com grid
```html
<div class="grid gap-16">
  <!-- cards virão aqui -->
</div>
```

### Passo 4: Criar UM figure completo
```html
<figure>
  <span class="content-tag">Veículos</span>
  <img src="assets/images/image-06.jpg" alt="" />
  <p>Texto da chamada...</p>
</figure>
```

### Passo 5: Duplicar e ajustar imagens/textos
- Copiar o figure
- Alterar: número da imagem (06→07→08→09), texto da tag, texto do parágrafo
- Manter a mesma estrutura HTML