# Code Examples: View Encapsulation Emulated

## Exemplo 1: Componente com Emulated explicito (desnecessario)

```typescript
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
  encapsulation: ViewEncapsulation.Emulated // DESNECESSARIO — ja e o padrao
})
export class ProductCardComponent {}
```

**Versao correta (sem declaracao explicita):**
```typescript
@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {}
```

## Exemplo 2: Estilos que NAO afetam filhos

**product-card.component.css:**
```css
p {
  font-weight: bold;
}
```

**product-card.component.html:**
```html
<p>Product card works!</p>
<app-custom-button></app-custom-button>
```

**custom-button.component.html:**
```html
<p>Custom button works!</p>
```

**Resultado:** Apenas o paragrafo "Product card works!" fica bold. O paragrafo dentro de `app-custom-button` nao e afetado.

### HTML gerado pelo Angular (inspecionando no navegador):

```html
<app-product-card _nghost-abc-c71>
  <p _ngcontent-abc-c71>Product card works!</p>
  <app-custom-button _ngcontent-abc-c71 _nghost-def-c188>
    <p _ngcontent-def-c188>Custom button works!</p>
  </app-custom-button>
</app-product-card>
```

**CSS compilado pelo Angular:**
```css
p[_ngcontent-abc-c71] {
  font-weight: bold;
}
```

O paragrafo do `custom-button` tem `_ngcontent-def-c188`, nao `_ngcontent-abc-c71`, entao nao corresponde ao seletor.

## Exemplo 3: Componente sem estilos (sem atributos de escopo)

```typescript
@Component({
  selector: 'app-user-details',
  template: `<p>User details works!</p>`
  // Sem styles nem styleUrls
})
export class UserDetailsComponent {}
```

**HTML gerado:**
```html
<app-user-details>
  <p>User details works!</p>
</app-user-details>
```

Nenhum atributo `_nghost` ou `_ngcontent` — o Angular otimiza removendo-os quando nao ha estilos.

**Apos adicionar estilo:**
```typescript
@Component({
  selector: 'app-user-details',
  template: `<p>User details works!</p>`,
  styles: [`p { font-weight: bold; }`]
})
export class UserDetailsComponent {}
```

**HTML gerado agora:**
```html
<app-user-details _nghost-xyz-c93>
  <p _ngcontent-xyz-c93>User details works!</p>
</app-user-details>
```

## Exemplo 4: Anti-pattern — seletor com atributo de escopo no global

```css
/* styles.css — NUNCA FACA ISSO */
p[_ngcontent-abc-c71] {
  color: red;
}
```

**Problemas:**
- `_ngcontent-abc-c71` nao existe em nenhum arquivo fonte
- Se ProductCardComponent for renomeado ou movido, o atributo muda
- Impossivel saber qual componente esse seletor afeta

## Exemplo 5: Estilizacao correta de filho via Input

```typescript
// custom-button.component.ts
@Component({
  selector: 'app-custom-button',
  template: `
    <button [style.color]="textColor" [class.large]="size === 'lg'">
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    button { padding: 8px 16px; border: none; cursor: pointer; }
    button.large { padding: 12px 24px; font-size: 1.2rem; }
  `]
})
export class CustomButtonComponent {
  @Input() textColor = 'inherit';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
}
```

```typescript
// product-card.component.ts
@Component({
  selector: 'app-product-card',
  template: `
    <p>Product card works!</p>
    <app-custom-button [textColor]="'red'" [size]="'lg'">
      Comprar
    </app-custom-button>
  `
})
export class ProductCardComponent {}
```

**Resultado:** O botao fica vermelho e grande, mas a decisao de como aplicar esses estilos pertence ao `CustomButtonComponent`. O pai apenas informa o que quer, o filho decide como implementar.

## Exemplo 6: Criando componente via CLI (como no video)

```bash
ng generate component components/custom-button --inline-style --inline-template
```

Isso gera um componente com estilos e template inline, que por padrao usa `ViewEncapsulation.Emulated` sem declarar explicitamente.