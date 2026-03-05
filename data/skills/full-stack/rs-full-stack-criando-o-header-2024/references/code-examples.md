# Code Examples: Criando o Header Responsivo

## HTML completo do header

```html
<header class="container py-base">
  <nav class="items-center gap-1.5">
    <!-- Logo com margin-right auto -->
    <a href="#">
      <img src="./assets/logo.svg" alt="Logo" />
    </a>

    <!-- Links visiveis apenas no desktop -->
    <a href="#about" class="desktop-only">Conheça o app</a>
    <a href="#features" class="desktop-only">Funcionalidades</a>
    <a href="#pricing" class="desktop-only">Planos e preços</a>

    <!-- CTA sempre visivel, tamanho responsivo -->
    <a href="#download" class="btn sm">Baixar</a>
  </nav>
</header>
```

## Utility classes usadas

```css
/* Container padrao */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding-inline: 1rem;
}

/* Padding vertical base */
.py-base {
  padding-block: var(--py-base);
}

/* Flex com alinhamento central */
.items-center {
  display: flex;
  align-items: center;
}

/* Gap com escape de ponto */
.gap-1\.5 {
  gap: 1.5rem;
}
```

## Header CSS especifico

```css
/* header.css */

/* Logo empurra navegacao para a direita */
header nav a:first-child {
  margin-right: auto;
}
```

## Botoes responsivos

```css
/* button.css */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
}

.btn.sm {
  padding: 8px 16px;
  font-size: 0.875rem;
}

.btn.md {
  padding: 12px 24px;
  font-size: 1rem;
}

.btn.lg {
  padding: 16px 32px;
  font-size: 1.125rem;
}

/* Hover com fix do background-clip */
.btn:hover {
  -webkit-background-clip: initial;
  /* reescrever cor explicitamente */
}

/* Desktop: botoes crescem um nivel */
@media (min-width: 80rem) {
  .btn.sm {
    padding: 12px 24px;
    font-size: 1rem;
  }
  .btn.md {
    padding: 16px 32px;
    font-size: 1.125rem;
  }
}
```

## Desktop-only pattern

```css
/* Esconde no mobile, mostra no desktop */
.desktop-only {
  display: none;
}

@media (min-width: 80rem) {
  .desktop-only {
    display: inline-flex;
  }
}
```

## Exportando logo do Figma

Quando o asset nao esta exportado:
1. Abra o Style Guide no Figma
2. Clique direito na imagem → Copy/Paste as → Copy as SVG
3. Crie o arquivo `assets/logo.svg`
4. Cole o SVG copiado

```
assets/
├── icons/
│   ├── game.svg
│   ├── check.svg
│   └── twitter.svg
└── logo.svg          ← criado manualmente do Figma
```

## Variacao: header com mais links

```html
<header class="container py-base">
  <nav class="items-center gap-1.5">
    <a href="#">
      <img src="./assets/logo.svg" alt="Logo" />
    </a>
    <a href="#about" class="desktop-only">Sobre</a>
    <a href="#features" class="desktop-only">Funcionalidades</a>
    <a href="#testimonials" class="desktop-only">Depoimentos</a>
    <a href="#pricing" class="desktop-only">Preços</a>
    <a href="#faq" class="desktop-only">FAQ</a>
    <a href="#download" class="btn sm">Começar grátis</a>
  </nav>
</header>
```

## Variacao: nav com dois grupos de botoes

```html
<header class="container py-base">
  <nav class="items-center gap-1.5">
    <a href="#">
      <img src="./assets/logo.svg" alt="Logo" />
    </a>
    <a href="#features" class="desktop-only">Features</a>
    <a href="#pricing" class="desktop-only">Pricing</a>
    <a href="#login" class="btn sm desktop-only">Entrar</a>
    <a href="#signup" class="btn sm">Criar conta</a>
  </nav>
</header>
```