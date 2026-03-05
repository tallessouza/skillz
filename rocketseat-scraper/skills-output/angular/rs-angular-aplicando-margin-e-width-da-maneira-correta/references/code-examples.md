# Code Examples: Width e Margin em Componentes Reutilizáveis

## Exemplo completo do card component (filho)

```typescript
@Component({
  selector: 'app-card',
  template: `
    <div class="card-container">
      <div class="card-header">
        <h2>Card Title</h2>
      </div>
      <div class="card-body">
        <p>Card content goes here</p>
      </div>
      <div class="card-footer">
        <span>Footer info</span>
      </div>
    </div>
  `,
  styles: [`
    /* AVISO: Largura e margens NÃO estão aqui.
       Isso permite que o componente seja reutilizável.
       O estilo de layout externo será definido pelo pai. */

    .card-container {
      border: 1px solid #ccc;
      border-radius: 8px;
      overflow: hidden;
    }

    .card-header {
      padding: 16px;
      background: #f5f5f5;
    }

    .card-header h2 {
      margin: 0;
      font-size: 1.2rem;
    }

    .card-body {
      padding: 16px;
    }

    .card-footer {
      padding: 12px 16px;
      background: #fafafa;
      border-top: 1px solid #eee;
    }
  `]
})
export class CardComponent {}
```

## Exemplo completo do consumidor (pai)

```typescript
@Component({
  selector: 'app-consumidor-card',
  template: `
    <!-- Cenário 1: Card pequeno com margem -->
    <div class="tamanho-1">
      <app-card />
    </div>

    <!-- Cenário 2: Card centralizado, maior -->
    <div class="tamanho-2">
      <app-card />
    </div>

    <!-- Cenário 3: Card full-width (comportamento padrão da div) -->
    <div>
      <app-card />
    </div>
  `,
  styles: [`
    .tamanho-1 {
      max-width: 400px;
      width: 100%;
      margin-bottom: 20px;
    }

    .tamanho-2 {
      max-width: 600px;
      width: 100%;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 30px;
    }

    /* tamanho-3 não precisa de classe —
       div sem width definido ocupa 100% por padrão */
  `]
})
export class ConsumidorCardComponent {}
```

## Criação dos componentes via CLI

```bash
# Card reutilizável (inline para simplificar)
ng generate component components/exemplo-card/card-component --inline-style --inline-template

# Componente pai consumidor
ng generate component components/exemplo-card/consumidor-card --inline-style --inline-template
```

## Variação: Mesmo princípio com botão

```typescript
// button.component.ts — SEM width/margin
@Component({
  selector: 'app-button',
  template: `<button class="btn"><ng-content /></button>`,
  styles: [`
    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      background: #007bff;
      color: white;
      cursor: pointer;
    }
  `]
})
export class ButtonComponent {}

// Uso no pai — PAI controla o tamanho
// <div style="width: 200px"><app-button>Salvar</app-button></div>
// <div style="width: 100%"><app-button>Confirmar</app-button></div>
```

## Variação: Usando CSS Grid no pai

```typescript
// O pai pode usar grid para controlar layout de múltiplos cards
@Component({
  selector: 'app-card-grid',
  template: `
    <div class="grid">
      <app-card />
      <app-card />
      <app-card />
    </div>
  `,
  styles: [`
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }
    /* Cada card se adapta ao espaço que o grid oferece */
  `]
})
export class CardGridComponent {}
```