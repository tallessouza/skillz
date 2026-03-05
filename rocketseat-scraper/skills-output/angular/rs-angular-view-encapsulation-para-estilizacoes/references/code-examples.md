# Code Examples: View Encapsulation no Angular

## Setup do projeto

### Criacao do projeto com versao especifica
```bash
npx @angular/cli@19.2.0 new view-encapsulation --style=css --ssr=false
cd view-encapsulation
code .
ng serve
```

### Configurar angular.json para pular testes unitarios
```json
{
  "schematics": {
    "@schematics/angular:component": {
      "skipTests": true
    }
  }
}
```

### Geracao dos componentes de exemplo
```bash
# Dentro de src/app/components/
ng generate component product-card --inline-style --inline-template
ng generate component user-details --inline-style --inline-template
```

Resultado: cada componente gera apenas um arquivo `.ts` (sem `.spec.ts`, sem `.html`, sem `.css` separados).

## Referenciando componentes no AppComponent

### app.component.html
```html
<app-product-card></app-product-card>
<app-user-details></app-user-details>
```

### app.component.ts (imports)
```typescript
@Component({
  imports: [ProductCardComponent, UserDetailsComponent],
  // ... resto da config
})
export class AppComponent {}
```

## Demonstracao de estilos globais

### styles.css — estilo global generico
```css
p {
  color: blue;
}
```
**Resultado:** TODOS os paragrafos da aplicacao (ProductCard e UserDetails) ficam azuis.

## Demonstracao de estilos encapsulados (Emulated)

### product-card.component.ts — estilo encapsulado
```typescript
@Component({
  selector: 'app-product-card',
  template: `<p>product-card works!</p>`,
  styles: [`
    p {
      font-weight: bold;
    }
  `]
})
export class ProductCardComponent {}
```
**Resultado:** apenas o paragrafo do ProductCard fica bold. O paragrafo do UserDetails NAO e afetado.

### O que o DevTools mostra (Emulated)
```css
/* Seletor com atributo unico do Angular */
p[_ngcontent-abc123] {
  font-weight: bold;
}

/* Seletor global do styles.css — sem atributo */
p {
  color: blue;
}
```

## Demonstracao de None (estilos vazam)

### product-card.component.ts — sem encapsulamento
```typescript
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-product-card',
  template: `<p>product-card works!</p>`,
  styles: [`
    p {
      font-weight: bold;
    }
  `],
  encapsulation: ViewEncapsulation.None
})
export class ProductCardComponent {}
```
**Resultado:** AMBOS os paragrafos ficam bold — o estilo vazou do ProductCard para toda a aplicacao.

### O que o DevTools mostra (None)
```css
/* Seletor global — sem atributo, igual ao styles.css */
p {
  font-weight: bold;
}

p {
  color: blue;
}
```

## Voltando para Emulated

```typescript
@Component({
  // ...
  encapsulation: ViewEncapsulation.Emulated  // ou simplesmente remova a linha
})
```
**Resultado:** volta ao comportamento isolado — apenas ProductCard afetado.

## Comparacao visual dos tres modos

| Modo | Seletor no DevTools | Afeta outros componentes? |
|------|-------------------|--------------------------|
| Emulated | `p[_ngcontent-xyz]` | Nao |
| None | `p` | Sim |
| ShadowDom | `p` (dentro de #shadow-root) | Nao (isolamento nativo) |