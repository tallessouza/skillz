# Code Examples: Gap e Margin

## 1. Gap básico com unidades diferentes

```html
<div class="container">
  <div class="box">1</div>
  <div class="box">2</div>
  <div class="box">3</div>
</div>
```

### Unidade fixa
```css
.container {
  display: flex;
  gap: 20px;
}
```

### Unidade relativa
```css
.container {
  display: flex;
  gap: 10%;
}
```

### Unidade flexível
```css
.container {
  display: flex;
  gap: 2rem;
}
```

## 2. Row-gap e Column-gap separados

```css
.container {
  display: flex;
  flex-wrap: wrap;
  row-gap: 10px;
  column-gap: 20px;
}
```

## 3. Margin-left auto — empurrar para direita

```css
.container {
  display: flex;
  gap: 20px;
}

/* O primeiro item e tudo após ele vai para a direita */
.box:first-child {
  margin-left: auto;
}
```

**Resultado:** `[                1] [2] [3]`

## 4. Margin-right auto — manter na esquerda, empurrar resto

```css
.box:first-child {
  margin-right: auto;
}
```

**Resultado:** `[1] [                2] [3]` — o item 1 fica na esquerda, os demais vão para a direita.

## 5. Margin-top auto — empurrar para baixo

```css
.container {
  display: flex;
  align-items: center;
  height: 400px;
  gap: 20px;
}

.box:first-child {
  margin-top: auto;
}
```

**Resultado:** Items 2 e 3 ficam centralizados verticalmente, item 1 é empurrado para baixo.

## 6. Centralizar um item com margin auto

```css
.container {
  display: flex;
}

.box {
  margin: 0 auto;
}
```

## 7. Padrão comum: navbar com logo à esquerda e ações à direita

```css
.navbar {
  display: flex;
  align-items: center;
  gap: 16px;
}

.navbar-actions {
  margin-left: auto;
}
```

```html
<nav class="navbar">
  <img src="logo.svg" alt="Logo">
  <a href="/">Home</a>
  <a href="/about">About</a>
  <div class="navbar-actions">
    <button>Login</button>
    <button>Sign Up</button>
  </div>
</nav>
```

## 8. Footer com item centralizado e último à direita

```css
.footer {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-center {
  margin-left: auto;
}

.footer-right {
  margin-left: auto;
}
```

```html
<footer class="footer">
  <span>© 2024</span>
  <span class="footer-center">Built with love</span>
  <a class="footer-right" href="/privacy">Privacy</a>
</footer>
```