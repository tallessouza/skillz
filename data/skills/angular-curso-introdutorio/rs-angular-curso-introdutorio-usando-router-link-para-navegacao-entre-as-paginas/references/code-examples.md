# Code Examples: RouterLink para Navegacao em Angular

## Exemplo 1: Navbar com rotas fixas

### navbar.component.ts
```typescript
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {}
```

### navbar.component.html
```html
<!-- Logo redireciona para rota raiz -->
<a routerLink="/">
  <img src="logo.svg" alt="Logo" />
</a>

<!-- Links fixos da navbar -->
<a routerLink="/">Lista de Certificados</a>
<a routerLink="/certificados/novo">Gerar Certificado</a>
```

## Exemplo 2: Card com rota dinamica (ID fixo temporario)

### certificado-card.component.ts
```typescript
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-certificado-card',
  imports: [RouterLink],
  templateUrl: './certificado-card.component.html',
})
export class CertificadoCardComponent {
  id: string = '6';
}
```

### certificado-card.component.html
```html
<!-- Usando colchetes + array para rota dinamica -->
<div [routerLink]="['/certificados', id]">
  Ver Certificado
</div>
```

Resultado: navega para `/certificados/6`

## Exemplo 3: Botao de voltar

### certificado.component.ts
```typescript
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-certificado',
  imports: [RouterLink],
  templateUrl: './certificado.component.html',
  styleUrl: './certificado.component.css',
})
export class CertificadoComponent {}
```

### certificado.component.html
```html
<div routerLink="/" class="btn-voltar">Voltar</div>
```

### certificado.component.css
```css
.btn-voltar {
  cursor: pointer;
}
```

## Exemplo 4: Demonstracao da diferenca string vs colchetes

```html
<!-- SEM colchetes: valor e string literal -->
<a routerLink="/certificados">Fixo</a>
<!-- Navega para: /certificados -->

<!-- COM colchetes: valor e expressao TypeScript -->
<!-- Se 'teste' e uma variavel com valor '/certificados' -->
<a [routerLink]="teste">Dinamico</a>
<!-- Navega para: /certificados (valor da variavel) -->

<!-- COM colchetes + array: cada item e um segmento -->
<a [routerLink]="['/certificados', id]">Dinamico com ID</a>
<!-- Se id = '6', navega para: /certificados/6 -->
```

## Exemplo 5: RouterLink em componente customizado

```html
<!-- RouterLink funciona em componentes customizados -->
<app-certificado-card
  [routerLink]="['/certificados', id]">
</app-certificado-card>
```

O Angular aplica a diretiva RouterLink no elemento host do componente, interceptando cliques e navegando para a rota especificada.

## Configuracao de rotas referenciada

```typescript
// app.routes.ts (configuracao que a aula assume existir)
export const routes: Routes = [
  { path: '', component: ListaCertificadosComponent },
  { path: 'certificados/novo', component: FormularioComponent },
  { path: 'certificados/:id', component: CertificadoComponent },
];
```