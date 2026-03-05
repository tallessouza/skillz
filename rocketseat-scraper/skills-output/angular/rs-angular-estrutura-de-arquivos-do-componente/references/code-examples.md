# Code Examples: Estrutura de Arquivos do Componente Angular

## 1. Gerando o componente via CLI

```bash
ng generate component meu-botao
```

Saída esperada — cria a pasta `src/app/meu-botao/` com 4 arquivos:
```
src/app/meu-botao/
  meu-botao.component.ts
  meu-botao.component.html
  meu-botao.component.css
  meu-botao.component.spec.ts
```

## 2. Template HTML completo (meu-botao.component.html)

```html
<button class="btn btn-flat" (click)="limpar()">Limpar</button>
<button class="btn btn-filled" (click)="filtrar()">Filtrar</button>
```

Nota: o template tem dois botões. Componentes podem agrupar múltiplos elementos HTML.

### Variação: template com estrutura mais complexa

```html
<button class="btn btn-flat" (click)="limpar()">Limpar</button>
<button class="btn btn-filled" (click)="filtrar()">Filtrar</button>
<div>
  <div>
    <p>Texto adicional dentro do componente</p>
  </div>
</div>
```

## 3. CSS encapsulado (meu-botao.component.css)

```css
.btn {
  --bg-color: #000;
  --text-color: #fff;
  font-family: sans-serif;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.btn-flat {
  background-color: var(--bg-color);
  color: var(--text-color);
}

.btn-filled {
  background-color: var(--bg-color);
  color: var(--text-color);
}
```

Nota: usando CSS puro com variáveis CSS. Estas classes só se aplicam a este componente (encapsulação Angular).

## 4. TypeScript completo (meu-botao.component.ts)

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-meu-botao',
  imports: [],
  templateUrl: './meu-botao.component.html',
  styleUrl: './meu-botao.component.css'
})
export class MeuBotaoComponent {
  limpar() {
    console.log('método limpar');
  }

  filtrar() {
    console.log('método filtrar');
  }
}
```

## 5. Referenciando o componente em outro template

```html
<!-- Opção 1: auto-fechamento -->
<app-meu-botao />

<!-- Opção 2: tag de abertura e fechamento -->
<app-meu-botao></app-meu-botao>
```

Para isso funcionar, o componente que consome `app-meu-botao` precisa importá-lo:

```typescript
import { Component } from '@angular/core';
import { MeuBotaoComponent } from '../meu-botao/meu-botao.component';

@Component({
  selector: 'app-outro-componente',
  imports: [MeuBotaoComponent],
  templateUrl: './outro-componente.component.html',
  styleUrl: './outro-componente.component.css'
})
export class OutroComponenteComponent {}
```

## 6. Propriedades disponíveis no @Component (Ctrl+Espaço)

```typescript
@Component({
  selector: 'app-meu-botao',          // obrigatório — como referenciar
  imports: [],                          // dependências standalone
  templateUrl: './meu-botao.component.html',  // ou template: '<button>...'
  styleUrl: './meu-botao.component.css',      // ou styles: ['.btn { ... }']
  standalone: true,                     // padrão true
  // encapsulation: ViewEncapsulation.Emulated  // padrão, 99% dos casos
})
```