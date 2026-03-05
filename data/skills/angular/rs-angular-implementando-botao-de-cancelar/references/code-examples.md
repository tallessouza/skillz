# Code Examples: Navegacao via Template com routerLink

## Exemplo completo da aula

### Antes da refatoracao

```typescript
// criar-filme.component.ts
import { Router } from '@angular/router';

@Component({
  selector: 'app-criar-filme',
  templateUrl: './criar-filme.component.html',
})
export class CriarFilmeComponent {
  constructor(private router: Router) {}

  cancelar() {
    this.router.navigate(['/explorar']);
  }
}
```

```html
<!-- criar-filme.component.html -->
<button (click)="cancelar()">Cancelar</button>
```

### Depois da refatoracao

```typescript
// criar-filme.component.ts
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-criar-filme',
  imports: [RouterLink],
  templateUrl: './criar-filme.component.html',
})
export class CriarFilmeComponent {
  // metodo cancelar() removido
}
```

```html
<!-- criar-filme.component.html -->
<button [routerLink]="['/explorar']">Cancelar</button>
```

## Variacoes

### routerLink com string simples (rota sem parametros)

```html
<button routerLink="/explorar">Cancelar</button>
```

### routerLink com array (quando ha parametros)

```html
<a [routerLink]="['/filme', filme.id]">Ver detalhes</a>
```

### routerLink em ancora vs botao

```html
<!-- Ancora: semanticamente correto para navegacao -->
<a routerLink="/explorar">Voltar</a>

<!-- Botao: quando visualmente precisa ser um botao -->
<button [routerLink]="['/explorar']">Cancelar</button>
```

### Caso onde metodo no componente e necessario

```typescript
// Quando ha logica antes de navegar, mantenha o metodo
cancelar() {
  if (this.formularioAlterado) {
    const confirma = confirm('Deseja descartar as alteracoes?');
    if (!confirma) return;
  }
  this.router.navigate(['/explorar']);
}
```

```html
<button (click)="cancelar()">Cancelar</button>
```