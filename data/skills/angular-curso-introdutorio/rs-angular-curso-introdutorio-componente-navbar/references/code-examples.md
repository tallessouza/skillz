# Code Examples: Componente Navbar com Bootstrap no Angular

## 1. Instalacao do Bootstrap

```bash
npm install bootstrap
```

## 2. Configuracao no angular.json

Localize o array `styles` dentro de `projects > seu-projeto > architect > build > options`:

```json
{
  "projects": {
    "seu-projeto": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "node_modules/bootstrap/dist/css/bootstrap.min.css",
              "src/styles.css"
            ]
          }
        }
      }
    }
  }
}
```

Para adicionar Phosphor Icons, inclua a referencia do script tambem no angular.json ou adicione no `index.html`:

```html
<script src="https://unpkg.com/@phosphor-icons/web"></script>
```

## 3. Teste rapido de integracao Bootstrap

Antes de construir o navbar completo, valide que o Bootstrap foi importado:

```html
<!-- navbar.component.html (teste) -->
<button class="btn btn-primary">Teste</button>
```

Se o botao aparecer azul e estilizado, o Bootstrap esta funcionando.

## 4. HTML completo do Navbar

```html
<!-- navbar.component.html -->
<nav class="navbar navbar-expand-lg">
  <div class="container-fluid">
    <a class="navbar-logo">
      <img alt="Logo" src="navbar/logo.png" />
    </a>
    <div class="collapse navbar-collapse justify-content-end">
      <ul class="navbar-nav">
        <li class="nav-item d-flex align-items-center">
          <ph-medal></ph-medal>
          <a class="nav-link active">Lista de certificados</a>
        </li>
        <li class="nav-item d-flex align-items-center ms-3">
          <ph-circles-three-plus></ph-circles-three-plus>
          <a class="nav-link">Gerar certificado</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
```

## 5. CSS do componente

```css
/* navbar.component.css */
.navbar {
  background-color: white;
  padding: 1rem 2rem;
  border-bottom: 1px solid #E0E0E0;
}

.navbar-logo img {
  height: 40px;
}

.nav-link.active {
  color: #5C6BC0;
}
```

## 6. Posicionamento no App Component

```html
<!-- app.component.html -->
<app-navbar></app-navbar>
<!-- resto do conteudo -->
```

## 7. Classes Bootstrap utilizadas — referencia rapida

| Classe | Funcao |
|--------|--------|
| `navbar` | Container principal de navegacao |
| `navbar-expand-lg` | Responsivo — colapsa em telas menores que lg |
| `container-fluid` | Container com largura total |
| `collapse navbar-collapse` | Area colapsavel do navbar |
| `justify-content-end` | Alinha itens a direita |
| `navbar-nav` | Lista de navegacao horizontal |
| `nav-item` | Item individual da lista |
| `nav-link` | Link de navegacao estilizado |
| `d-flex` | Display flex |
| `align-items-center` | Alinha verticalmente ao centro |
| `ms-3` | Margin start (esquerda) nivel 3 |
| `active` | Estado ativo do item de navegacao |