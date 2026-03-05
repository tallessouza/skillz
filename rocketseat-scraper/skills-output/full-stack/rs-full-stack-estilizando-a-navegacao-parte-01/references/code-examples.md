# Code Examples: Estilizando Navegacao com CSS Flexbox

## Estrutura HTML referenciada

```html
<nav>
  <ul>
    <li><a href="#">Link 1</a></li>
    <li><a href="#">Link 2</a></li>
    <li><a href="#">Link 3</a></li>
  </ul>
  <ul>
    <li><img src="lupa.svg" alt="Buscar"></li>
    <li><img src="avatar.png" alt="Perfil"></li>
  </ul>
</nav>
```

## nav.css completo da aula

```css
/* Container principal — elementos lado a lado com espaco entre */
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-block: 20px;
}

/* Lista — remove bullets, alinha horizontal, espaco entre itens */
nav ul {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 20px;
  padding-block: 8px;
}

/* Imagem de perfil — ultimo li */
nav ul li:last-child img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
}
```

## global.css — reset de anchors

```css
a {
  text-decoration: none;
  color: inherit;
}

a:hover {
  color: var(--brandColor);
  text-decoration: underline;
}
```

## Variacoes de padding-block

```css
/* Simetrico — 20px em cima e embaixo */
nav {
  padding-block: 20px;
}

/* Assimetrico — 40px em cima, 10px embaixo */
nav {
  padding-block: 40px 10px;
}
```

## Variacao: selecao com first-child

```css
/* Selecionar a primeira imagem (ex: lupa) */
nav ul li:first-child img {
  width: 24px;
  height: 24px;
}

/* Selecionar a ultima imagem (ex: avatar) */
nav ul li:last-child img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
```

## Variacao: nth-child para selecao especifica

```css
/* Segundo item da lista */
nav ul li:nth-child(2) {
  font-weight: bold;
}
```

## Comparacao: gap vs margin

```css
/* Com gap (preferido) */
nav ul {
  display: flex;
  gap: 20px;
}

/* Com margin (evitar) — ultimo item tem margem extra */
nav ul li {
  margin-right: 20px;
}
nav ul li:last-child {
  margin-right: 0; /* precisa resetar */
}
```

## Comparacao: padding-block vs padding shorthand

```css
/* padding-block (preferido para eixo vertical) */
nav {
  padding-block: 20px;
}

/* padding shorthand (menos semantico) */
nav {
  padding: 20px 0;
}
```

## Object-fit em diferentes cenarios

```css
/* Imagem quadrada — sem problemas */
img {
  width: 40px;
  height: 40px;
}

/* Imagem retangular — distorce sem object-fit */
img {
  width: 40px;
  height: 40px;
  object-fit: cover; /* corta excesso, mantem proporcao */
}

/* Alternativa: contain (mostra tudo, pode ter espacos) */
img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
```