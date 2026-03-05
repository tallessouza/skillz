# Code Examples: Adicionando Atividades na Lista do Formulário

## Exemplo completo do componente

```typescript
// certificado-form.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-certificado-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './certificado-form.component.html',
})
export class CertificadoFormComponent {
  nome: string = '';
  atividade: string = '';
  atividades: string[] = [];

  adicionarAtividade() {
    this.atividades.push(this.atividade);
    this.atividade = '';
  }

  excluirAtividade(index: number) {
    this.atividades.splice(index, 1);
  }
}
```

## Exemplo completo do template

```html
<!-- certificado-form.component.html -->
<form>
  <label>Nome</label>
  <input [(ngModel)]="nome" name="nome" />

  <label>Atividade</label>
  <input [(ngModel)]="atividade" name="atividade" />
  <button type="button" (click)="adicionarAtividade()">Adicionar</button>

  <ul>
    @for (atividade of atividades; track $index) {
      <li>
        {{ atividade }}
        <button type="button" (click)="excluirAtividade($index)" class="remove-btn">
          X
        </button>
      </li>
    }
  </ul>

  <button [disabled]="!nome || !atividades.length">Gerar Certificado</button>
</form>
```

## Demonstracao do console.log para debug

O instrutor usou este pattern para verificar que o index estava correto:

```typescript
excluirAtividade(index: number) {
  console.log(index); // verifica o index antes de remover
  this.atividades.splice(index, 1);
}
```

Saida no console ao clicar nos botoes X:
```
0  // primeiro item
1  // segundo item
```

## Variacao: com validacao antes de adicionar

```typescript
adicionarAtividade() {
  if (this.atividade.trim()) {
    this.atividades.push(this.atividade.trim());
    this.atividade = '';
  }
}
```

## Variacao: usando objetos em vez de strings

```typescript
interface Atividade {
  nome: string;
}

atividades: Atividade[] = [];

adicionarAtividade() {
  this.atividades.push({ nome: this.atividade });
  this.atividade = '';
}
```

## Commit de referencia

[Commit da aula](https://github.com/skillz-education/curso-entrada-angular/commit/49f955283455f3d45a796a9a47ec57b57cce64b9)