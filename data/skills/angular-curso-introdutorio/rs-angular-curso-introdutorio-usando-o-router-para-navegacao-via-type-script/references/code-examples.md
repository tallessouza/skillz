# Code Examples: Angular Router — Navegacao Programatica

## Exemplo completo do componente da aula

### item-certificado.component.ts

```typescript
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-item-certificado',
  templateUrl: './item-certificado.component.html',
})
export class ItemCertificadoComponent {
  @Input() id: string = '';

  constructor(private router: Router) {}

  redirecionaCertificado() {
    this.router.navigate(['certificados', this.id]);
  }
}
```

### item-certificado.component.html

```html
<div class="certificado-item">
  <span>{{ id }}</span>
  <button (click)="redirecionaCertificado()">Ver certificado</button>
</div>
```

## Comparacao dos 3 metodos de navegacao

### 1. navigate() — rotas dinamicas (RECOMENDADO)

```typescript
// Forma um array de segmentos: /certificados/2
this.router.navigate(['certificados', this.id]);

// Com multiplos segmentos: /usuarios/42/certificados
this.router.navigate(['usuarios', this.userId, 'certificados']);
```

### 2. navigateByUrl() — rotas fixas

```typescript
// String fixa, sem variaveis
this.router.navigateByUrl('/home');
this.router.navigateByUrl('/certificados');
```

### 3. Concatenacao (anti-pattern mostrado na aula)

```typescript
// O instrutor mostra que voce ENCONTRA isso em projetos
// mas NAO recomenda
this.router.navigateByUrl('certificados/' + this.id);

// Ou com template literal
this.router.navigateByUrl(`certificados/${this.id}`);

// O correto e usar navigate() com array
this.router.navigate(['certificados', this.id]);
```

## Injecao no constructor vs ngOnInit

```typescript
// CORRETO: Router injetado no constructor
export class MeuComponente {
  constructor(private router: Router) {}

  navegarParaDetalhe() {
    this.router.navigate(['detalhe', this.id]);
  }
}

// ERRADO: tentar usar Router no ngOnInit sem injetar no constructor
export class MeuComponente implements OnInit {
  ngOnInit() {
    // router nao existe aqui se nao foi injetado no constructor
  }
}
```

## Usando (click) em diferentes elementos

```html
<!-- Em botao -->
<button (click)="redirecionaCertificado()">Ver</button>

<!-- Em div -->
<div (click)="redirecionaCertificado()">Clique aqui</div>

<!-- Em componente customizado -->
<app-item-certificado (click)="redirecionaCertificado()"></app-item-certificado>
```