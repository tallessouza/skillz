# Code Examples: :host e :host-context

## Exemplo completo do componente com :host

```typescript
@Component({
  selector: 'app-child',
  template: `<p>Child Component</p>`,
  encapsulation: ViewEncapsulation.Emulated,
  styles: [`
    :host {
      display: block;
      width: 300px;
      margin: 12px;
      padding: 16px;
      border: 2px solid #ccc;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    :host:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    /* Variacoes por atributo */
    :host([tema="primario"]) {
      background-color: #3498db;
      color: white;
    }

    :host([tema="secundario"]) {
      background-color: #2ecc71;
      color: white;
    }

    :host([tamanho="grande"]) {
      font-size: 1.5rem;
      padding: 24px;
      width: 500px;
    }

    :host([desabilitado]) {
      opacity: 0.5;
      pointer-events: none;
      cursor: not-allowed;
    }

    /* Variacao por classe */
    :host(.ativo) {
      border-color: #e74c3c;
      border-width: 3px;
    }

    /* Reagindo ao contexto do pai */
    :host-context(.tema-escuro) {
      background-color: #333;
      color: #eee;
      border-color: #555;
    }
  `]
})
export class ChildComponent {}
```

## Template do componente pai mostrando todas as variacoes

```html
<!-- Basico -->
<app-child></app-child>

<!-- Tema primario + tamanho grande -->
<app-child tema="primario" tamanho="grande"></app-child>

<!-- Tema secundario -->
<app-child tema="secundario"></app-child>

<!-- Desabilitado (atributo booleano) -->
<app-child desabilitado></app-child>

<!-- Com classe ativo -->
<app-child class="ativo"></app-child>

<!-- Dentro de contexto escuro (:host-context) -->
<div class="tema-escuro">
  <app-child></app-child>
</div>

<!-- Dentro de contexto claro (nao ativa :host-context) -->
<div class="tema-claro">
  <app-child></app-child>
</div>
```

## O que aparece no DevTools (Emulated)

Quando o Angular compila com Emulated, o `:host` vira:

```css
/* :host original */
[_nghost-ng-c93] {
  display: block;
  width: 300px;
  /* ... */
}

/* :host:hover original */
[_nghost-ng-c93]:hover {
  transform: translateY(-4px);
  /* ... */
}

/* :host([tema="primario"]) original */
[tema="primario"][_nghost-ng-c93] {
  background-color: #3498db;
  /* ... */
}
```

O atributo `_nghost-ng-c93` e o escopo unico gerado pelo Angular para esse componente.

## Exemplo pratico: botao reutilizavel com variacoes

```typescript
@Component({
  selector: 'app-button',
  template: `<ng-content></ng-content>`,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s;
    }

    :host([variante="primario"]) {
      background-color: #3498db;
      color: white;
    }

    :host([variante="primario"]):hover {
      background-color: #2980b9;
    }

    :host([variante="perigo"]) {
      background-color: #e74c3c;
      color: white;
    }

    :host([desabilitado]) {
      opacity: 0.5;
      pointer-events: none;
    }

    :host-context(.formulario-compacto) {
      padding: 4px 8px;
      font-size: 12px;
    }
  `]
})
export class ButtonComponent {}
```

```html
<app-button variante="primario">Salvar</app-button>
<app-button variante="perigo">Excluir</app-button>
<app-button variante="primario" desabilitado>Processando...</app-button>

<div class="formulario-compacto">
  <app-button variante="primario">OK</app-button>  <!-- menor automaticamente -->
</div>
```