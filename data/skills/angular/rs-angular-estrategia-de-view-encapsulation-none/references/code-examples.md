# Code Examples: View Encapsulation None

## Exemplo da aula — UserDetailsComponent com None

### Configuracao do componente

```typescript
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserDetailsComponent {}
```

### CSS do componente (user-details.component.css)

```css
p {
  font-family: cursive;
}
```

### Resultado no DOM inspecionado

Sem None (Emulated):
```html
<p _ngcontent-abc-123>Texto do user details</p>
```
```css
p[_ngcontent-abc-123] {
  font-family: cursive;
}
```

Com None:
```html
<p>Texto do user details</p>
```
```css
p {
  font-family: cursive;
}
/* Sem atributo de escopo — afeta TODOS os <p> da aplicacao */
```

## Comparacao dos tres modos

```typescript
// Emulated (DEFAULT) — escopo via atributos
@Component({
  encapsulation: ViewEncapsulation.Emulated // ou simplesmente omita
})

// None — sem escopo, estilos globais
@Component({
  encapsulation: ViewEncapsulation.None
})

// ShadowDom — escopo nativo via Shadow DOM
@Component({
  encapsulation: ViewEncapsulation.ShadowDom
})
```

## Alternativa ao None: ::ng-deep

Quando voce precisa estilizar um componente filho a partir do pai sem usar None:

```css
/* No CSS do componente pai (com Emulated) */
::ng-deep app-child p {
  font-family: cursive;
}
```

Isso permite afetar filhos sem tornar todos os estilos globais.

## Alternativa ao None: styles.css global

```css
/* styles.css (global) */
p {
  font-family: cursive;
}
```

Se o objetivo e ter estilos globais, use o arquivo que ja existe para isso.