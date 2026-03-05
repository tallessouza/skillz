# Code Examples: Two-Way Data Binding no Angular

## Exemplo completo da aula

### Gerando o componente

```bash
ng generate component to-way-data-binding
```

### Componente TypeScript (to-way-data-binding.component.ts)

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-to-way-data-binding',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './to-way-data-binding.component.html',
  styleUrl: './to-way-data-binding.component.css'
})
export class ToWayDataBindingComponent {
  texto = 'texto inicial';

  logarTexto() {
    console.log('Texto:', this.texto);
  }
}
```

### Template HTML (to-way-data-binding.component.html)

```html
<input id="meu-input" name="meu-input" [(ngModel)]="texto" />

<button (click)="logarTexto()">Logar texto</button>

<p>Texto atual: {{ texto }}</p>
```

### Usando no AppComponent

```html
<!-- app.component.html -->
<app-to-way-data-binding />
```

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { ToWayDataBindingComponent } from './to-way-data-binding/to-way-data-binding.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ToWayDataBindingComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
```

## Comparacao: approach manual vs ngModel

### Approach manual (property binding + event binding)

```typescript
export class PropertyBindingComponent {
  texto = '';

  atualizarTexto(event: Event) {
    const input = event.target as HTMLInputElement;
    this.texto = input.value;
  }
}
```

```html
<!-- Precisa de DOIS bindings separados -->
<input [value]="texto" (input)="atualizarTexto($event)" />
<p>{{ texto }}</p>
```

### Approach com ngModel (two-way)

```typescript
export class TwoWayComponent {
  texto = '';
}
```

```html
<!-- UM binding faz tudo -->
<input [(ngModel)]="texto" name="texto" />
<p>{{ texto }}</p>
```

## Erro comum: FormsModule ausente

```typescript
// ERRADO — vai dar erro
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [], // Faltou FormsModule!
  template: '<input [(ngModel)]="valor" />',
})
export class ExampleComponent {
  valor = '';
}
// Error: Can't bind to 'ngModel' since it isn't a known property of 'input'
```

```typescript
// CORRETO
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [FormsModule], // FormsModule presente
  template: '<input [(ngModel)]="valor" name="valor" />',
})
export class ExampleComponent {
  valor = '';
}
```

## Variacao: multiplos campos sincronizados

```typescript
export class FormComponent {
  nome = '';
  email = '';
  idade = 0;
}
```

```html
<input [(ngModel)]="nome" name="nome" placeholder="Nome" />
<input [(ngModel)]="email" name="email" placeholder="Email" />
<input [(ngModel)]="idade" name="idade" type="number" placeholder="Idade" />

<p>{{ nome }} - {{ email }} - {{ idade }}</p>
```

## Fluxo de dados visualizado

```
Classe do Componente          Template (HTML)
┌──────────────────┐          ┌──────────────────┐
│ texto = 'abc'    │ ──[()]──>│ <input value=abc> │
│                  │ <──[()]──│ usuario digita... │
│ texto = 'abcd'   │ ──[()]──>│ {{ texto }} =abcd │
└──────────────────┘          └──────────────────┘

[( )] = banana-in-a-box = two-way data binding
[ ]   = property binding = one-way (classe → template)
( )   = event binding    = one-way (template → classe)
```