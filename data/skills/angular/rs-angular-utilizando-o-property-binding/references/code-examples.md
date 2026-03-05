# Code Examples: Property Binding no Angular

## 1. Criando o componente

```bash
ng generate component property-binding
```

## 2. Registrando no AppComponent

```typescript
// app.component.ts
import { PropertyBindingComponent } from './property-binding/property-binding.component';

@Component({
  selector: 'app-root',
  imports: [PropertyBindingComponent],
  template: '<app-property-binding />'
})
export class AppComponent {}
```

## 3. Property Binding básico com value

```typescript
// property-binding.component.ts
export class PropertyBindingComponent {
  texto = 'texto do input';
}
```

```html
<!-- property-binding.component.html -->
<input id="meu-input" [value]="texto" />
```

O colchete `[value]` faz o binding da propriedade `texto` da classe para a propriedade `value` do input. Se `texto` não existir na classe, o Angular dá erro de compilação.

## 4. Property Binding com type

```typescript
export class PropertyBindingComponent {
  texto = 'texto do input';
  inputType = 'password';
}
```

```html
<input id="meu-input" [value]="texto" [type]="inputType" />
```

Com `inputType = 'password'`, o input exibe bolinhas. Mudando para `'text'`, exibe o texto normalmente.

## 5. Property Binding com disabled

```typescript
export class PropertyBindingComponent {
  texto = 'texto do input';
  inputType = 'text';
  inputDisabled = true;
}
```

```html
<input id="meu-input"
  [value]="texto"
  [type]="inputType"
  [disabled]="inputDisabled" />
```

Com `inputDisabled = true`, o input fica desabilitado (não recebe foco nem digitação). Com `false`, funciona normalmente.

## 6. Botões para habilitar/desabilitar (Event + Property Binding)

```typescript
export class PropertyBindingComponent {
  texto = 'texto do input';
  inputType = 'text';
  inputDisabled = true;

  habilitarInput() {
    this.inputDisabled = false;
  }

  desabilitarInput() {
    this.inputDisabled = true;
  }
}
```

```html
<input id="meu-input"
  [value]="texto"
  [type]="inputType"
  [disabled]="inputDisabled" />
<br />
<button (click)="habilitarInput()">Habilitar</button>
<button (click)="desabilitarInput()">Desabilitar</button>
```

Ao clicar em "Desabilitar", `inputDisabled` vira `true`, o Angular detecta a mudança e desabilita o input. Ao clicar em "Habilitar", o processo inverso ocorre.

## 7. Demonstrando que Property Binding é unidirecional

```typescript
export class PropertyBindingComponent {
  texto = 'texto do input';

  logarTexto() {
    console.log('Propriedade texto:', this.texto);
  }
}
```

```html
<input [value]="texto" />
<button (click)="logarTexto()">Logar Texto</button>
```

Mesmo digitando no input, `logarTexto()` sempre mostra `'texto do input'` — o valor original. A digitação do usuário não atualiza a propriedade da classe.

## 8. Sincronizando manualmente com Event Binding

```typescript
export class PropertyBindingComponent {
  texto = 'texto do input';
  inputDisabled = false;

  habilitarInput() {
    this.inputDisabled = false;
  }

  desabilitarInput() {
    this.inputDisabled = true;
  }

  logarTexto() {
    console.log('Propriedade texto:', this.texto);
  }

  onInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.texto = value;
  }
}
```

```html
<input id="meu-input"
  [value]="texto"
  [type]="inputType"
  [disabled]="inputDisabled"
  (input)="onInputChange($event)" />
<br />
<button (click)="habilitarInput()">Habilitar</button>
<button (click)="desabilitarInput()">Desabilitar</button>
<button (click)="logarTexto()">Logar Texto</button>
```

Agora, ao digitar no input, `onInputChange` captura o evento, extrai o valor com casting para `HTMLInputElement`, e atualiza `this.texto`. O botão "Logar Texto" reflete o valor atualizado.

## 9. Variações para prática (desafios do instrutor)

### Botões para mudar o type

```typescript
setTypeText() {
  this.inputType = 'text';
}

setTypePassword() {
  this.inputType = 'password';
}
```

```html
<button (click)="setTypeText()">Type: Text</button>
<button (click)="setTypePassword()">Type: Password</button>
```

### Botões para mudar o value

```typescript
setValorA() {
  this.texto = 'Valor A';
}

setValorB() {
  this.texto = 'Valor B';
}
```

```html
<button (click)="setValorA()">Setar Valor A</button>
<button (click)="setValorB()">Setar Valor B</button>
```