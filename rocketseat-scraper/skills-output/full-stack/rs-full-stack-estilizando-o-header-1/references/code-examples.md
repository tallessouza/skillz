# Code Examples: Estilizando o Header

## Estrutura HTML de referência

```html
<header>
  <div class="container">
    <div class="profile">
      <img src="profile.jpg" alt="Avatar" />
      <div>
        <h1>Nome do Usuário</h1>
        <p>Descrição do perfil com um <br> break aqui</p>
      </div>
    </div>
    <ul class="info">
      <li>
        <img src="icon-location.svg" alt="" />
        <span>São Paulo, Brasil</span>
      </li>
      <li>
        <img src="icon-company.svg" alt="" />
        <span>Empresa XYZ</span>
      </li>
      <li>
        <img src="icon-link.svg" alt="" />
        <a href="#">website.com</a>
      </li>
    </ul>
  </div>
</header>
```

## CSS completo — header.css

```css
header {
  padding-block: 32px;
  font: var(--text-md);
}

.profile {
  display: flex;
  align-items: center;
  gap: 32px;
}

.profile > div {
  max-width: 384px;
}

.profile h1 {
  font: var(--text-lg);
  color: var(--text-color-primary);
  margin-bottom: 8px;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 280px;
}

.info li {
  display: flex;
  align-items: center;
  gap: 8px;
}
```

## Importação no index.css

```css
@import url("header.css");
```

## Variação: Header sem profile (só info)

```css
header {
  padding-block: 24px;
  font: var(--text-md);
}

header .info {
  list-style: none;
  display: flex;
  gap: 24px; /* horizontal neste caso */
}

header .info li {
  display: flex;
  align-items: center;
  gap: 8px;
}
```

## Variação: Profile vertical (mobile-first)

```css
.profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.profile > div {
  max-width: 100%;
}
```

## Padrão de espaçamento com gap em diferentes níveis

```css
/* Nível 1: seções do header */
.container { display: flex; gap: 32px; }

/* Nível 2: itens da lista */
.info { display: flex; flex-direction: column; gap: 16px; }

/* Nível 3: conteúdo de cada item */
.info li { display: flex; gap: 8px; }
```

Observe a progressão: 32px → 16px → 8px. Gaps maiores separam elementos de maior hierarquia, gaps menores separam elementos internos. Isso cria ritmo visual.