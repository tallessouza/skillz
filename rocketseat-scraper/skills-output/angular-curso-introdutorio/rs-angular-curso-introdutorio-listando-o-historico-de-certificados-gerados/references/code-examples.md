# Code Examples: Listando Historico de Certificados

## Exemplo 1: Criando inputs no componente filho

O componente `app-item-certificado` precisa receber dados do pai.

```typescript
// item-certificado.component.ts
import { Component, input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-item-certificado',
  templateUrl: './item-certificado.component.html',
})
export class ItemCertificadoComponent {
  @input() nomeAluno: string = '';
  @input() dataEmissao: string = '';
  @input() id: string = '';

  constructor(private router: Router) {}

  redirecionaCertificado() {
    this.router.navigate(['/certificado', this.id]);
  }
}
```

```html
<!-- item-certificado.component.html -->
<div>
  <p>{{ nomeAluno }}</p>
  <p>Gerado em: {{ dataEmissao }}</p>
  <button (click)="redirecionaCertificado()">Ver</button>
</div>
```

## Exemplo 2: Template do pai com @for e @if

```html
<!-- certificados.component.html -->
@if (certificados.length > 0) {
  <div class="lista-certificados">
    @for (certificado of certificados; track certificado.id) {
      <app-item-certificado
        [nomeAluno]="certificado.nome"
        [dataEmissao]="certificado.dataEmissao"
        [id]="certificado.id"
      />
    }
  </div>
}

@if (certificados.length === 0) {
  <div class="empty-state">
    <p>Nenhum certificado gerado</p>
  </div>
}
```

## Exemplo 3: Componente pai com lista de certificados

```typescript
// certificados.component.ts
@Component({
  selector: 'app-certificados',
  templateUrl: './certificados.component.html',
})
export class CertificadosComponent {
  certificados = [
    { id: '1', nome: 'José', dataEmissao: '2024-01-15' },
    { id: '2', nome: 'Joana', dataEmissao: '2024-01-16' },
  ];
}
```

## Exemplo 4: Redirecionamento apos geracao

O instrutor discute que apos gerar um certificado, o usuario deveria ser redirecionado para ver o resultado:

```typescript
// gerar-certificado.component.ts
gerarCertificado() {
  const novoCertificado = this.certificadoService.gerar({
    nome: this.nome,
    atividade: this.atividade,
  });

  // Redireciona para a pagina do certificado gerado
  this.router.navigate(['/certificado', novoCertificado.id]);
}
```

## Variacao: Usando @if/@else (alternativa ao padrao da aula)

```html
@if (certificados.length > 0) {
  @for (certificado of certificados; track certificado.id) {
    <app-item-certificado
      [nomeAluno]="certificado.nome"
      [dataEmissao]="certificado.dataEmissao"
      [id]="certificado.id"
    />
  }
} @else {
  <p>Nenhum certificado gerado</p>
}
```

## Erro comum: tipo errado no input

```typescript
// ERRADO — id vem como string do backend
@input() id: number = 0;

// CORRETO — verificar o tipo real dos dados
@input() id: string = '';
```