# Code Examples: Organizando os Assets

## Estrutura completa do projeto da aula

```
project/
└── assets/
    ├── icons/
    │   ├── arrow-right.svg          # Seta branca (estado default)
    │   ├── arrow-right-hover.svg    # Seta azul (estado hover)
    │   ├── magnifying-glass.svg     # Icone de busca
    │   └── list.svg                 # Icone de lista/menu
    ├── images/
    │   ├── image-01.png
    │   ├── image-02.png
    │   ├── image-03.png
    │   ├── ...
    │   └── image-18.png
    ├── ads.png                      # Banner de anuncio
    └── logo.svg                     # Logo do portal de noticias
```

## Workflow de exportacao no Figma

### Exportacao batch (todos os assets marcados)

```
1. Clique em area vazia do canvas (nada selecionado)
2. Ctrl+Shift+E (Windows) / Cmd+Shift+E (Mac)
3. Selecione pasta de destino
4. Confirme exportacao
```

### Exportacao individual (assets nao marcados)

```
1. Clique no elemento desejado
2. Painel direito → Export
3. Selecione formato (SVG para vetores, PNG para raster)
4. Clique Export
5. Salve no destino correto
```

## Convencao de nomes por estado

```
# Pattern: {descricao}-{estado}.{extensao}

# Icones
arrow-right.svg              # default
arrow-right-hover.svg        # mouse sobre o elemento
arrow-right-active.svg       # clicado/pressionado
arrow-right-disabled.svg     # desabilitado

# Botoes (se exportados como imagem)
button-primary.png           # default
button-primary-hover.png     # hover
button-primary-pressed.png   # pressed
```

## Referenciando assets no HTML

```html
<!-- Logo como SVG -->
<img src="./assets/logo.svg" alt="Portal de Noticias">

<!-- Imagem de conteudo -->
<img src="./assets/images/image-01.png" alt="Descricao da noticia">

<!-- Icone inline (permite manipulacao CSS) -->
<img src="./assets/icons/magnifying-glass.svg" alt="Buscar">
```

## Referenciando assets no CSS

```css
/* Background com imagem */
.ad-banner {
  background-image: url('../assets/ads.png');
}

/* Icone que muda no hover */
.nav-arrow {
  background-image: url('../assets/icons/arrow-right.svg');
}

.nav-arrow:hover {
  background-image: url('../assets/icons/arrow-right-hover.svg');
}
```

## Variacoes de estrutura para projetos maiores

```
# Projeto pequeno (< 20 assets)
assets/
├── icons/
├── images/
└── logo.svg

# Projeto medio (20-100 assets)
assets/
├── icons/
│   ├── navigation/
│   └── social/
├── images/
│   ├── heroes/
│   ├── thumbnails/
│   └── avatars/
├── ads/
└── logos/

# Projeto com framework (React/Next)
public/
├── icons/
├── images/
└── logo.svg
src/
└── assets/        # Assets importados pelo bundler
    ├── icons/     # SVGs como componentes
    └── images/
```