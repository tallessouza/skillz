# Code Examples: Class Binding no Angular

## Exemplo 1: ActiveButton — Toggle ativo/inativo

```typescript
@Component({
  selector: 'app-active-button',
  standalone: true,
  template: `
    <button
      [class.active]="isActive"
      (click)="toggleActive()">
      {{ isActive ? 'Ativo' : 'Inativo' }}
    </button>
  `,
  styles: [`
    button {
      padding: 10px 20px;
      border: 2px solid #ccc;
      background: #f0f0f0;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.3s;
    }
    button.active {
      background: #4CAF50;
      color: white;
      border-color: #45a049;
    }
  `]
})
export class ActiveButtonComponent {
  isActive = false;

  toggleActive() {
    this.isActive = !this.isActive;
  }
}
```

**O que observar no DevTools:**
- Clicar no botao → classe `active` aparece no elemento
- Clicar novamente → classe `active` removida
- Texto alterna entre "Ativo" e "Inativo" via interpolacao ternaria

---

## Exemplo 2: InvalidInput — Validacao com classe de erro

```typescript
@Component({
  selector: 'app-invalid-input',
  standalone: true,
  template: `
    <input
      [class.is-invalid]="hasError"
      (input)="checkInput($event)"
      placeholder="Digite algo..." />
    @if (hasError) {
      <p class="error-text">O campo não pode estar vazio</p>
    }
  `,
  styles: [`
    input {
      padding: 8px 12px;
      border: 2px solid #ccc;
      border-radius: 4px;
      font-size: 16px;
      transition: border-color 0.3s;
    }
    input.is-invalid {
      border-color: #e74c3c;
      background-color: #ffeaea;
    }
    .error-text {
      color: #e74c3c;
      font-size: 14px;
      margin-top: 4px;
    }
  `]
})
export class InvalidInputComponent {
  hasError = false;

  checkInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.hasError = value.trim() === '';
  }
}
```

**Fluxo detalhado:**
1. `hasError` comeca `false` → sem classe `is-invalid`, sem paragrafo de erro
2. Usuario digita "Felipe" → `checkInput` verifica → nao vazio → `hasError = false` → nada muda
3. Usuario apaga tudo → `checkInput` verifica → vazio → `hasError = true`
4. Class binding aplica `is-invalid` no input
5. `@if (hasError)` renderiza o paragrafo de erro
6. Classe `error-text` e fixa (atributo `class` normal, nao binding)

---

## Exemplo 3: SimpleVisibility — Mostrar/ocultar com fade

```typescript
@Component({
  selector: 'app-simple-visibility',
  standalone: true,
  template: `
    <div class="message-box" [class.hidden]="isHidden">
      Este texto pode ser ocultado
    </div>
    <button (click)="toggleVisibility()">
      {{ isHidden ? 'Mostrar' : 'Ocultar' }} texto
    </button>
  `,
  styles: [`
    .message-box {
      padding: 16px;
      background: #e8f4fd;
      border-radius: 8px;
      margin-bottom: 12px;
      /* opacity para fade suave */
      opacity: 1;
      transition: opacity 0.3s ease;
    }
    .message-box.hidden {
      /* opacity: 0 mantem no DOM e ocupa espaco */
      opacity: 0;
      /* alternativa: display: none remove espaco mas mantem no DOM */
      /* display: none; */
    }
    button {
      padding: 8px 16px;
      cursor: pointer;
    }
  `]
})
export class SimpleVisibilityComponent {
  isHidden = false;

  toggleVisibility() {
    this.isHidden = !this.isHidden;
  }
}
```

**Pontos-chave:**
- `class="message-box"` → classe fixa, sempre presente
- `[class.hidden]="isHidden"` → classe dinamica, adicionada/removida
- `opacity: 0` com `transition` → efeito fade
- Texto do botao: interpolacao com ternario + concatenacao de string fixa

**Comparacao de abordagens para ocultar:**

```css
/* Abordagem 1: opacity (fade, ocupa espaco) */
.hidden { opacity: 0; }

/* Abordagem 2: display none (sem espaco, sem fade) */
.hidden { display: none; }
```

```html
<!-- Abordagem 3: @if (remove do DOM completamente) -->
@if (!isHidden) {
  <div class="message-box">Texto</div>
}
```

---

## Como referenciar componentes no AppComponent

```typescript
// app.component.ts
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ActiveButtonComponent], // adicionar aqui
  template: `<app-active-button />`
})
export class AppComponent {}
```

## Estrutura de pastas dos exemplos

```
src/app/components/
  class-binding/
    active-button/
      active-button.component.ts
    invalid-input/
      invalid-input.component.ts
    simple-visibility/
      simple-visibility.component.ts
```