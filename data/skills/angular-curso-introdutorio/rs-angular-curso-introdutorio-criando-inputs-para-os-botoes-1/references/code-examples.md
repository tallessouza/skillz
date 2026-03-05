# Code Examples: Inputs em Componentes Angular

## 1. Primary Button — Input simples de texto

### TypeScript (primary-button.component.ts)
```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-primary-button',
  templateUrl: './primary-button.component.html',
  styleUrls: ['./primary-button.component.scss']
})
export class PrimaryButtonComponent {
  @Input() textoBotao: string = '';
}
```

### HTML (primary-button.component.html)
```html
<button>{{ textoBotao }}</button>
```

### Uso no formulario
```html
<!-- Sem colchetes — string literal direta -->
<app-primary-button textoBotao="Gerar Certificado"></app-primary-button>

<!-- Com colchetes — precisa aspas simples internas -->
<app-primary-button [textoBotao]="'Gerar Certificado'"></app-primary-button>
```

## 2. Secondary Button — Multiplos inputs + condicional

### TypeScript (secondary-button.component.ts)
```typescript
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-secondary-button',
  templateUrl: './secondary-button.component.html',
  imports: [CommonModule]
})
export class SecondaryButtonComponent {
  @Input() textoBotao: string = '';
  @Input() phClass: string = '';
  @Input() disable: boolean = false;
}
```

### HTML (secondary-button.component.html)
```html
<button [ngStyle]="disable ? { 'opacity': '50%' } : {}">
  @if (phClass) {
    <i [class]="phClass"></i>
  }
  {{ textoBotao }}
</button>
```

### Uso no formulario — com icone
```html
<app-secondary-button
  textoBotao="Adicionar"
  phClass="ph ph-plus"
  [disable]="atividade.length === 0">
</app-secondary-button>
```

### Uso na lista — sem icone
```html
<app-secondary-button textoBotao="Ver"></app-secondary-button>
```

## 3. Primary Button com disable — ngStyle

### TypeScript (primary-button.component.ts) atualizado
```typescript
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-primary-button',
  templateUrl: './primary-button.component.html',
  imports: [CommonModule]
})
export class PrimaryButtonComponent {
  @Input() textoBotao: string = '';
  @Input() disable: boolean = false;
}
```

### HTML atualizado
```html
<button [ngStyle]="disable ? { 'opacity': '50%' } : {}">
  {{ textoBotao }}
</button>
```

## 4. Formulario pai — logica de validacao

### TypeScript (certificado-form.component.ts)
```typescript
export class CertificadoFormComponent {
  atividades: string[] = ['Atividade 1', 'Atividade 2'];
  nome: string = '';
  atividade: string = '';

  get formValido(): boolean {
    // Invertido: retorna true quando deve DESABILITAR
    return !(this.atividades.length > 0 && this.nome.length > 0);
  }
}
```

### HTML (certificado-form.component.html)
```html
<form #form="ngForm">
  <input [(ngModel)]="nome" name="nome" required maxlength="50" />
  <input [(ngModel)]="atividade" name="atividade" />

  <app-secondary-button
    textoBotao="Adicionar"
    phClass="ph ph-plus"
    [disable]="atividade.length === 0">
  </app-secondary-button>

  <app-primary-button
    textoBotao="Gerar Certificado"
    [disable]="formValido">
  </app-primary-button>
</form>
```

## 5. RouterLinkActive — navegacao com estado ativo

### Navbar HTML
```html
<nav>
  <a routerLink="/certificado"
     routerLinkActive="active"
     [routerLinkActiveOptions]="{ exact: true }">
    Lista de Certificados
  </a>
  <a routerLink="/certificado/novo"
     routerLinkActive="active"
     [routerLinkActiveOptions]="{ exact: true }">
    Gerar Certificado
  </a>
</nav>
```

### Navbar TypeScript — imports necessarios
```typescript
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  imports: [RouterLink, RouterModule]
  // RouterModule necessario para routerLinkActive funcionar
})
```

## 6. Pagina sem itens — botao com routerLink

### certificados.component.html (estado vazio)
```html
<!-- Quando nao tem certificados na lista -->
<app-secondary-button
  textoBotao="Gerar Certificado"
  routerLink="certificado/novo">
</app-secondary-button>
```