# Code Examples: Componente Primary Button

## 1. Geração do componente via CLI

```bash
# Na pasta do projeto Angular
ng g c components/primaryButton --skip-tests
```

Resultado gerado:
```
src/app/components/primary-button/
├── primary-button.component.ts
├── primary-button.component.html
└── primary-button.component.css
```

## 2. HTML do componente (primary-button.component.html)

```html
<button class="custom-button">Botão Primário</button>
```

Futuramente com @Input:
```html
<button class="custom-button">{{ label }}</button>
```

## 3. CSS completo (primary-button.component.css)

```css
.custom-button {
  height: 48px;
  padding: 12px 16px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  color: white;
  background: linear-gradient(90deg, #firstHexColor 0%, #secondHexColor 100%);
  cursor: pointer;
}

.custom-button:hover {
  opacity: 0.9;
}

/* Estado disable — será aplicado dinamicamente via @Input nas próximas aulas */
.custom-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

## 4. TypeScript do componente (primary-button.component.ts)

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-primary-button',
  standalone: true,
  imports: [],
  templateUrl: './primary-button.component.html',
  styleUrl: './primary-button.component.css'
})
export class PrimaryButtonComponent {}
```

## 5. Usando no componente pai (app.component.html)

```html
<app-navbar></app-navbar>
<app-primary-button></app-primary-button>
```

## 6. Importando no componente pai (app.component.ts)

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PrimaryButtonComponent } from './components/primary-button/primary-button.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, PrimaryButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {}
```

## 7. Erro comum — esqueceu de importar

Mensagem de erro do Angular:
```
'app-primary-button' is not a known element
```

Solução: adicionar `PrimaryButtonComponent` no array `imports` do componente que está usando.

## 8. Teste visual temporário — expandir botão

```css
/* Apenas para debug visual do gradiente — remover depois */
.custom-button {
  width: 100%;
}
```

Isso permite visualizar o gradiente que é sutil em botões pequenos.