# Code Examples: Componente Base UI com ng-content

## Geracao do componente

```bash
ng generate component components/base-ui --skip-tests
```

## Template do Base UI (versao debug)

```html
<!-- base-ui.component.html — versao com borda para debug -->
<div style="border: 1px solid red;">
  <ng-content></ng-content>
</div>
```

## Template do Base UI (versao final)

```html
<!-- base-ui.component.html -->
<div class="container custom-ui">
  <ng-content></ng-content>
</div>
```

## CSS do Base UI

```css
/* base-ui.component.css */
.custom-ui {
  margin-top: 40px;
}
```

## Uso no App Component (teste inicial)

```html
<!-- app.component.html -->
<app-navbar></app-navbar>
<app-base-ui>
  <span>teste</span>
</app-base-ui>
```

## Uso no App Component (conteudo completo)

```html
<!-- app.component.html -->
<app-navbar></app-navbar>
<app-base-ui>
  <!-- Todo o conteudo da pagina vai aqui -->
  <h1>Titulo da pagina</h1>
  <p>Conteudo que sera renderizado dentro do container com margens padrao</p>
</app-base-ui>
```

## Variacao: ng-content com select (multiplas zonas)

```html
<!-- layout.component.html -->
<header>
  <ng-content select="[header]"></ng-content>
</header>
<main class="container custom-ui">
  <ng-content></ng-content>
</main>
<footer>
  <ng-content select="[footer]"></ng-content>
</footer>
```

```html
<!-- uso -->
<app-layout>
  <div header>Cabecalho customizado</div>
  <p>Conteudo principal (cai no ng-content sem select)</p>
  <div footer>Rodape customizado</div>
</app-layout>
```

## Componente Base UI completo (TypeScript)

```typescript
// base-ui.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-base-ui',
  templateUrl: './base-ui.component.html',
  styleUrls: ['./base-ui.component.css']
})
export class BaseUiComponent {}
```

## Dica de debug visual

Quando criar componentes de layout, aplique uma borda temporaria para visualizar os limites:

```html
<!-- Temporario, para debug -->
<div style="border: 1px solid red;">
  <ng-content></ng-content>
</div>
```

Remova a borda apos confirmar que o conteudo esta sendo projetado corretamente.