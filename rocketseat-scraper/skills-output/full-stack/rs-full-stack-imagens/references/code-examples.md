# Code Examples: Imagens no HTML

## Exemplo 1: Tag img basica (do transcript)

```html
<!-- O Emmet gera automaticamente src e alt ao digitar img + Enter -->
<img src="" alt="">
```

O editor (VS Code com Emmet) gera a tag com os dois atributos fundamentais: `src` e `alt`.

## Exemplo 2: Imagem externa com Unsplash

```html
<img
  src="https://source.unsplash.com/random"
  alt="Imagem aleatoria do banco Unsplash"
>
```

O instrutor usa este servico para demonstrar imagens externas via URL. O Unsplash retorna uma foto aleatoria livre de direitos.

## Exemplo 3: Apenas width (recomendado)

```html
<img
  src="https://source.unsplash.com/random"
  alt="Foto de paisagem natural"
  width="200"
>
```

Define 200 pixels de largura. A altura e calculada automaticamente mantendo a proporcao.

## Exemplo 4: Apenas height

```html
<img
  src="https://source.unsplash.com/random"
  alt="Foto de paisagem natural"
  height="200"
>
```

Define 200 pixels de altura. A largura e calculada automaticamente.

## Exemplo 5: Width + height (cuidado!)

```html
<!-- PROBLEMA: se as dimensoes nao correspondem ao aspect ratio, a imagem distorce -->
<img
  src="https://source.unsplash.com/random"
  alt="Foto de paisagem natural"
  width="200"
  height="200"
>
```

O instrutor demonstra que isso "estica" a imagem quando as proporcoes nao batem. So use ambos quando souber as dimensoes exatas.

## Exemplo 6: Width + height corretos (quando voce sabe)

```html
<!-- OK: logo tem dimensoes conhecidas de 200x80 -->
<img src="logo.png" alt="Logo da Rocketseat" width="200" height="80">
```

## Variacoes por tipo de conteudo

### Foto de produto
```html
<img
  src="produto-camiseta-azul.webp"
  alt="Camiseta azul marinho tamanho M vista de frente"
  width="400"
>
```

### Avatar de usuario
```html
<img
  src="avatar-maria.webp"
  alt="Foto de perfil de Maria Silva"
  width="48"
  height="48"
>
```
Avatar e quadrado, entao width + height e seguro.

### Screenshot de interface
```html
<img
  src="dashboard-vendas.webp"
  alt="Tela do dashboard mostrando grafico de vendas do primeiro trimestre com tendencia de alta"
  width="800"
>
```

### Imagem decorativa
```html
<!-- Separador visual — nao transmite informacao -->
<img src="divider.svg" alt="" width="100">
```

### Imagem local com caminho relativo
```html
<img src="./assets/images/hero-banner.webp" alt="Banner principal do site com montanhas ao fundo">
```

### Multiplos formatos mencionados
```html
<!-- JPG: fotos, compressao com perda -->
<img src="foto.jpg" alt="Descricao da foto">

<!-- PNG: transparencia, sem perda -->
<img src="icone.png" alt="Icone de configuracoes">

<!-- WebP: moderno, menor tamanho -->
<img src="foto.webp" alt="Descricao da foto">

<!-- AVIF: mais moderno ainda, melhor compressao -->
<img src="foto.avif" alt="Descricao da foto">
```