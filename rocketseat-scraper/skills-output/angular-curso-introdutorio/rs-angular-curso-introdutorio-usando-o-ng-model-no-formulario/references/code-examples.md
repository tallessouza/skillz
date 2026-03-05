# Code Examples: NgModel e Two-Way Binding

## Exemplo 1: Variavel exibida em tempo real (demonstracao do instrutor)

O instrutor criou um `<span>` provisorio para mostrar visualmente o two-way binding:

```typescript
// certificado-form.component.ts
export class CertificadoFormComponent {
  nome: string = '';
}
```

```html
<!-- certificado-form.component.html -->
<input type="text" [(ngModel)]="nome" />
<span>{{ nome }}</span>
```

Ao digitar no input, o `<span>` reflete o valor em tempo real. Esse `<span>` foi removido depois — serviu apenas para demonstrar o conceito.

## Exemplo 2: Setup completo do componente com FormsModule

```typescript
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
}
```

## Exemplo 3: Template completo com ngModel e lista

```html
<!-- Inputs com two-way binding -->
<input type="text" [(ngModel)]="nome" placeholder="Nome" />
<input type="text" [(ngModel)]="atividade" placeholder="Atividade" />

<!-- Lista com one-way binding (codigo → template) -->
<div class="item-list">
  @for (atividade of atividades; track $index) {
    <div class="item">{{ atividade }}</div>
    @if ($index + 1 !== atividades.length) {
      <hr />
    }
  }
</div>
```

## Exemplo 4: Lista com dados manuais para teste

O instrutor testou a lista adicionando valores diretamente no array:

```typescript
export class CertificadoFormComponent {
  nome: string = '';
  atividade: string = '';
  atividades: string[] = ['Angular', 'React', 'COBOL'];
}
```

Resultado renderizado:
```
Angular
───────
React
───────
COBOL
```
(Sem `<hr>` apos o ultimo item graças a logica com `$index`)

## Exemplo 5: Visualizando o index (demonstracao provisoria)

O instrutor mostrou o index para explicar a logica antes de criar o condicional:

```html
@for (atividade of atividades; track $index) {
  <div class="item">{{ atividade }}</div>
  <span>{{ $index }} / {{ atividades.length }}</span>
  <hr />
}
```

Resultado: `0 / 3`, `1 / 3`, `2 / 3` — mostrando que quando `$index + 1 === length`, e o ultimo item.

## Exemplo 6: Logica condicional final do separador

```html
@for (atividade of atividades; track $index) {
  <div class="item">{{ atividade }}</div>
  @if ($index + 1 !== atividades.length) {
    <hr />
  }
}
```

A condicao `$index + 1 !== atividades.length` garante que o `<hr>` so aparece entre itens, nunca apos o ultimo.