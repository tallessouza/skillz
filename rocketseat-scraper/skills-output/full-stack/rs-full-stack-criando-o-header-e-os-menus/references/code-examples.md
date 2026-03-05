# Code Examples: Header e Menus com CSS Utility-First

## Exemplo completo do HTML

```html
<header class="container">
  <nav id="primary" class="grid grid-flow-col">
    <div>
      <img src="./assets/icons/list.svg" alt="Ícone de menu" />
      <strong>Menu</strong>
    </div>
    <div>
      <img src="./assets/logo.svg" alt="TechNews Logo" />
    </div>
    <div>
      <strong>Buscar</strong>
      <img src="./assets/icons/magnifying-glass.svg" alt="Ícone de lupa para pesquisa" />
    </div>
  </nav>

  <nav id="secondary" class="grid grid-flow-col">
    <a href="#">Inteligência Artificial</a>
    <a href="#">Blockchain</a>
    <a href="#">Hologramas</a>
    <a href="#">Internet</a>
    <a href="#">Vestíveis</a>
    <a href="#">Realidade Aumentada</a>
    <a href="#">Realidade Virtual</a>
  </nav>
</header>
```

## Classes utilitárias (global.css)

```css
.grid {
  display: grid;
}

.grid-flow-col {
  grid-auto-flow: column;
}
```

## Container (global.css)

```css
.container {
  max-width: 1280px;
  padding-inline: 32px;
  margin-inline: auto;
}
```

## Header styles completo (header.css)

```css
#primary {
  padding-block: 20px;

  /* Logo centralizado */
  div:nth-child(2) {
    margin-inline: auto;
  }

  /* Busca alinhada à direita */
  div:nth-child(3) {
    justify-self: end;
  }

  /* Ícone + texto alinhados */
  div {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

#secondary {
  padding-block: 14px;
  border: 1px solid var(--stroke-color);
  border-inline: none;
  justify-content: space-between;
}
```

## Variação: sem nesting (CSS tradicional)

Para navegadores que não suportam nesting nativo:

```css
#primary {
  padding-block: 20px;
}

#primary div:nth-child(2) {
  margin-inline: auto;
}

#primary div:nth-child(3) {
  justify-self: end;
}

#primary div {
  display: flex;
  align-items: center;
  gap: 8px;
}
```

## Variação: mais classes utilitárias

Expandindo o sistema utility-first para cobrir mais padrões usados na aula:

```css
/* Alinhamento */
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.justify-self-end {
  justify-self: end;
}

/* Espaçamento */
.gap-8 {
  gap: 8px;
}

.mx-auto {
  margin-inline: auto;
}

.py-14 {
  padding-block: 14px;
}

.py-20 {
  padding-block: 20px;
}
```

Com essas classes, o HTML ficaria:

```html
<nav id="primary" class="grid grid-flow-col py-20">
  <div class="flex items-center gap-8">...</div>
  <div class="mx-auto">...</div>
  <div class="flex items-center gap-8 justify-self-end">...</div>
</nav>

<nav id="secondary" class="grid grid-flow-col py-14 justify-between">
  ...
</nav>
```

## Variação: container com CSS custom properties

```css
.container {
  --container-max: 1280px;
  --container-padding: 32px;

  max-width: var(--container-max);
  padding-inline: var(--container-padding);
  margin-inline: auto;
}
```

Permite override por contexto:

```css
.container.narrow {
  --container-max: 960px;
}
```