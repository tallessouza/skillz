---
name: rs-angular-intro-componente-navbar
description: "Applies Angular navbar component creation patterns with Bootstrap integration. Use when user asks to 'create a navbar', 'add navigation bar', 'integrate Bootstrap in Angular', 'add icons to navbar', or 'build responsive navigation'. Covers Bootstrap CSS setup in angular.json, navbar HTML structure, Phosphor Icons integration, and component styling. Make sure to use this skill whenever building navigation components in Angular projects. Not for React/Vue navigation, Angular routing logic, or backend API work."
---

# Componente Navbar com Bootstrap no Angular

> Ao criar um navbar em Angular, configure dependencias externas no angular.json, estruture o HTML com classes Bootstrap, e estilize via CSS do componente.

## Rules

1. **Registre CSS externo no angular.json** — adicione o caminho em `projects.*.architect.build.options.styles`, porque o Angular so carrega CSS listado nesse array
2. **Reinicie o servidor apos alterar angular.json** — pare com Ctrl+C e execute `ng serve` novamente, porque alteracoes no angular.json nao sao detectadas pelo hot reload
3. **Use caminhos completos para node_modules** — `node_modules/bootstrap/dist/css/bootstrap.min.css`, porque caminhos incompletos causam erro de build silencioso
4. **Coloque assets em public/ organizados por componente** — `public/navbar/logo.png`, porque facilita referencia e manutencao
5. **Estilize no CSS do componente, nao no global** — `.navbar { background-color: white }` no arquivo CSS do componente, porque o encapsulamento do Angular protege contra vazamento de estilos
6. **Use classes Bootstrap para layout, classes proprias para visual** — `navbar-expand-lg` do Bootstrap + `.navbar-logo` customizada, porque separa responsabilidades

## How to write

### Configuracao do Bootstrap no angular.json

```json
"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "src/styles.css"
]
```

### Estrutura HTML do Navbar

```html
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

### CSS do componente

```css
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

## Example

**Before (navbar sem estrutura Bootstrap):**
```html
<div class="menu">
  <img src="logo.png">
  <a href="/list">Lista</a>
  <a href="/generate">Gerar</a>
</div>
```

**After (com Bootstrap e Phosphor Icons):**
```html
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

## Heuristics

| Situation | Do |
|-----------|-----|
| Instalou pacote CSS (Bootstrap, etc.) | Adicione ao array `styles` do angular.json e reinicie o servidor |
| Precisa de icones | Use Phosphor Icons via script CDN no angular.json ou instale via npm |
| Item de menu ativo | Aplique classe `active` e estilize `.nav-link.active` com cor do design |
| Layout horizontal no navbar | Use `navbar-nav` no `ul` + `d-flex align-items-center` nos `li` |
| Espacamento entre itens | Use classes Bootstrap utilitarias como `ms-3` em vez de CSS customizado |
| Exportando assets do Figma | Exporte em SVG (Ctrl+Shift+E no Figma), coloque em `public/{componente}/` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| CSS do Bootstrap no `styles.css` via `@import` | Caminho no array `styles` do angular.json |
| Imagens soltas na raiz de `public/` | Organizadas em `public/{componente}/logo.png` |
| Estilos de navbar no `styles.css` global | Estilos no CSS do proprio componente navbar |
| `style="color: blue"` inline no HTML | Classe `.nav-link.active` no CSS do componente |
| Alterar angular.json sem reiniciar servidor | Sempre Ctrl+C + `ng serve` apos mudancas |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
