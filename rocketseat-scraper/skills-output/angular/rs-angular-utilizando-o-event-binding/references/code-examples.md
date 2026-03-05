# Code Examples: Event Binding no Angular

## Setup: Criando o componente

```bash
ng generate component event-binding
```

## Template completo do componente

```html
<!-- event-binding.component.html -->
<button (click)="onButtonClick()">Meu Botao</button>

<input
  id="meuInput"
  (input)="onInput($event)"
  (focus)="onFocus()"
  (blur)="onBlur()"
/>
```

## Classe completa do componente

```typescript
// event-binding.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-event-binding',
  templateUrl: './event-binding.component.html',
})
export class EventBindingComponent {

  onButtonClick() {
    console.log('onButtonClick');
  }

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    console.log('value:', value);
  }

  onFocus() {
    console.log('onFocus');
  }

  onBlur() {
    console.log('onBlur');
  }
}
```

## Carregando o componente no AppComponent

```html
<!-- app.component.html -->
<app-event-binding></app-event-binding>
```

```typescript
// app.component.ts
import { EventBindingComponent } from './event-binding/event-binding.component';

@Component({
  selector: 'app-root',
  imports: [EventBindingComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
```

## Evolucao passo a passo mostrada na aula

### Passo 1: Evento simples sem parametro

```html
<button (click)="onButtonClick()">Botao</button>
```

```typescript
onButtonClick() {
  console.log('onButtonClick');
}
```

### Passo 2: Evento com $event (logando o objeto)

```html
<input (input)="onInput($event)" />
```

```typescript
// Primeira versao — com any (NAO recomendado)
onInput(event: any) {
  console.log('onInput', event);
}
```

O `console.log(event)` mostra um objeto `InputEvent` com diversas propriedades, incluindo `target` que aponta para a instancia do elemento input.

### Passo 3: Tipando corretamente e acessando value

```typescript
// Versao correta — com tipagem e casting
onInput(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  console.log('value:', value);
}
```

### Passo 4: Multiplos eventos no mesmo elemento

```html
<input
  (input)="onInput($event)"
  (focus)="onFocus()"
  (blur)="onBlur()"
/>
```

```typescript
onFocus() {
  console.log('onFocus');
}

onBlur() {
  console.log('onBlur');
}
```

## Equivalencia Angular vs JavaScript puro

```javascript
// JavaScript puro (addEventListener)
const botao = document.querySelector('button');
botao.addEventListener('click', () => {
  console.log('clicked');
});

const input = document.querySelector('input');
input.addEventListener('input', (event) => {
  console.log(event.target.value);
});
input.addEventListener('focus', () => {
  console.log('focus');
});
input.addEventListener('blur', () => {
  console.log('blur');
});
```

```html
<!-- Angular (event binding) -->
<button (click)="onButtonClick()">Botao</button>
<input
  (input)="onInput($event)"
  (focus)="onFocus()"
  (blur)="onBlur()"
/>
```

## Eventos comuns por elemento

### Button
```html
<button (click)="onClick()">Click</button>
```

### Input text
```html
<input
  (input)="onInput($event)"
  (change)="onChange($event)"
  (focus)="onFocus()"
  (blur)="onBlur()"
  (keydown)="onKeydown($event)"
  (keyup)="onKeyup($event)"
/>
```

### Textarea
```html
<textarea
  (input)="onInput($event)"
  (focus)="onFocus()"
  (blur)="onBlur()"
  (keydown)="onKeydown($event)"
></textarea>
```

### Form
```html
<form (submit)="onSubmit($event)">
  <!-- campos -->
</form>
```

```typescript
onSubmit(event: Event) {
  event.preventDefault();
  // processar formulario
}
```