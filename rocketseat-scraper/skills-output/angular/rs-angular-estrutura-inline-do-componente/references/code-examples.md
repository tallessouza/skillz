# Code Examples: Estrutura Inline do Componente Angular

## 1. Geracao via CLI

### Componente padrao (4 arquivos)
```bash
ng generate component button
```
Gera:
- `button.component.ts`
- `button.component.html`
- `button.component.css`
- `button.component.spec.ts`

### Componente inline (2 arquivos)
```bash
ng generate component button-flat --inline-style --inline-template
```
Gera:
- `button-flat.component.ts`
- `button-flat.component.spec.ts`

## 2. Comparacao lado a lado

### Componente separado (button.component.ts)
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
  filtrar() {
    console.log('Filtrar clicado');
  }
}
```

### Componente inline (button-flat.component.ts)
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-button-flat',
  template: `
    <button class="btn btn-flat" (click)="limpar()">
      Limpar filtro
    </button>
  `,
  styles: [`
    .btn {
      padding: 8px 16px;
      border: none;
      cursor: pointer;
      font-family: 'Arial', sans-serif;
    }
    .btn-flat {
      background: transparent;
      color: #333;
    }
  `]
})
export class ButtonFlatComponent {
  limpar() {
    console.log('Limpar filtro clicado');
  }
}
```

## 3. Importando o componente inline no AppComponent

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { ButtonComponent } from './button/button.component';
import { ButtonFlatComponent } from './button-flat/button-flat.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [ButtonComponent, ButtonFlatComponent]
})
export class AppComponent { }
```

```html
<!-- app.component.html -->
<app-button></app-button>
<app-button-flat></app-button-flat>
```

## 4. Estrutura HTML resultante no DOM

```html
<app-root>
  <app-button>
    <button class="btn btn-field">Filtrar</button>
  </app-button>
  <app-button-flat>
    <button class="btn btn-flat">Limpar filtro</button>
  </app-button-flat>
</app-root>
```

Cada componente aparece como um elemento customizado no DOM, com seus estilos encapsulados — os estilos de `app-button-flat` nao vazam para `app-button` e vice-versa.

## 5. Armadilha dos estilos encapsulados

```typescript
// ERRADO — falta a classe .btn base
@Component({
  selector: 'app-button-flat',
  template: `<button class="btn btn-flat">Limpar</button>`,
  styles: [`
    .btn-flat {
      background: transparent;
    }
    /* .btn nao esta aqui — o botao perde padding, font, etc */
  `]
})

// CORRETO — inclui todas as classes necessarias
@Component({
  selector: 'app-button-flat',
  template: `<button class="btn btn-flat">Limpar</button>`,
  styles: [`
    .btn {
      padding: 8px 16px;
      border: none;
      cursor: pointer;
    }
    .btn-flat {
      background: transparent;
      color: #333;
    }
  `]
})
```

## 6. Nomenclatura e convencoes

O Angular CLI segue um padrao automatico:

| Elemento | Convencao | Exemplo |
|----------|-----------|---------|
| Pasta | kebab-case | `button-flat/` |
| Arquivo | kebab-case + sufixo | `button-flat.component.ts` |
| Classe | PascalCase + sufixo | `ButtonFlatComponent` |
| Selector | prefixo + kebab-case | `app-button-flat` |

Isso vale tanto para componentes inline quanto separados — a unica diferenca e a quantidade de arquivos gerados.