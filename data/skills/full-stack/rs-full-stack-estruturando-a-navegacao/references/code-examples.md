# Code Examples: Estruturando a Navegação

## Estrutura completa do projeto da aula

```html
<header>
  <nav>
    <!-- Logo envolvida em anchor -->
    <a href="#" id="logo">
      <img src="./assets/logo.svg" alt="Logo marca">
    </a>

    <!-- Menu principal com ID descritivo -->
    <ul id="primary-menu">
      <!-- Item com ícone -->
      <li>
        <a href="#">
          <img src="./assets/icons/magnifying-glass.svg" alt="Ícone de lupa">
        </a>
      </li>

      <!-- Items de texto (placeholder) -->
      <li><a href="#">Destinos</a></li>
      <li><a href="#">Pacotes</a></li>
      <li><a href="#">Depoimentos</a></li>

      <!-- Item com foto de perfil -->
      <li>
        <a href="#">
          <img src="./assets/profile-pic.png" alt="Imagem de Isabela Torres">
        </a>
      </li>
    </ul>
  </nav>
</header>
```

## Estrutura de pastas de assets

```
assets/
├── logo.svg              # Logo na raiz (caso especial)
├── profile-pic.png       # Foto de perfil na raiz (caso especial)
├── images/               # Fotos e imagens grandes
│   ├── hero-banner.jpg
│   ├── destination-1.jpg
│   └── destination-2.jpg
└── icons/                # Ícones pequenos
    ├── magnifying-glass.svg
    ├── airplane.svg
    └── map-pin.svg
```

## Emmet shortcuts para navegação

### Criar lista de menu com 3 itens
```
ul#primary-menu>li*3>a
```
Resultado:
```html
<ul id="primary-menu">
  <li><a href=""></a></li>
  <li><a href=""></a></li>
  <li><a href=""></a></li>
</ul>
```

### Criar nav completo com logo e menu
```
nav>a#logo>img^ul#primary-menu>li*4>a
```
Resultado:
```html
<nav>
  <a href="" id="logo"><img src="" alt=""></a>
  <ul id="primary-menu">
    <li><a href=""></a></li>
    <li><a href=""></a></li>
    <li><a href=""></a></li>
    <li><a href=""></a></li>
  </ul>
</nav>
```

## Variação: abordagem inversa (nav > header)

```html
<nav>
  <header>
    <a href="#" id="logo">
      <img src="./assets/logo.svg" alt="Logo marca">
    </a>
  </header>

  <ul id="primary-menu">
    <li><a href="#">Home</a></li>
    <li><a href="#">Sobre</a></li>
    <li><a href="#">Contato</a></li>
  </ul>
</nav>
```

## Variação: múltiplos menus

```html
<header>
  <nav>
    <a href="#" id="logo">
      <img src="./assets/logo.svg" alt="Logo marca">
    </a>

    <ul id="primary-menu">
      <li><a href="#">Home</a></li>
      <li><a href="#">Produtos</a></li>
      <li><a href="#">Sobre</a></li>
    </ul>

    <ul id="secondary-menu">
      <li>
        <a href="#">
          <img src="./assets/icons/magnifying-glass.svg" alt="Buscar">
        </a>
      </li>
      <li>
        <a href="#">
          <img src="./assets/icons/cart.svg" alt="Carrinho">
        </a>
      </li>
      <li>
        <a href="#">
          <img src="./assets/profile-pic.png" alt="Meu perfil">
        </a>
      </li>
    </ul>
  </nav>
</header>
```

## Alt text para diferentes tipos de imagem

```html
<!-- Ícone: descreva a função -->
<img src="./assets/icons/magnifying-glass.svg" alt="Ícone de lupa">
<img src="./assets/icons/airplane.svg" alt="Ícone de avião">
<img src="./assets/icons/map-pin.svg" alt="Ícone de localização">

<!-- Logo: identifique a marca -->
<img src="./assets/logo.svg" alt="Logo marca">

<!-- Foto de pessoa: identifique quem é -->
<img src="./assets/profile-pic.png" alt="Imagem de Isabela Torres">
```