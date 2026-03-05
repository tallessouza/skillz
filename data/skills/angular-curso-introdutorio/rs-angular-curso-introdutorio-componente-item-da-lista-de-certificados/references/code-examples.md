# Code Examples: Componente Item da Lista de Certificados

## 1. Gerando o componente via Angular CLI

```bash
ng g c components/item-certificado --skip-tests
```

Resultado: 3 arquivos criados dentro de `src/app/components/item-certificado/`:
- `item-certificado.component.ts`
- `item-certificado.component.html`
- `item-certificado.component.css`

## 2. HTML completo do componente

```html
<!-- item-certificado.component.html -->
<div class="card custom-card">
  <div class="d-flex justify-content-between align-items-center">
    <div>
      <div class="nome-aluno fw-bold">Nome do Aluno</div>
      <small class="small-date">Gerado em 28/02/2026</small>
    </div>
    <app-secondary-button></app-secondary-button>
  </div>
</div>
```

### Explicacao da estrutura:
- `card` — classe Bootstrap para estilo base de card
- `custom-card` — classe propria para borda e border-radius do Figma
- `d-flex justify-content-between align-items-center` — distribui nome/data a esquerda e botao a direita
- `fw-bold` — Bootstrap para font-weight bold
- `<app-secondary-button>` — reutiliza componente de botao criado anteriormente

## 3. CSS completo do componente

```css
/* item-certificado.component.css */
.custom-card {
  border: 1px solid #E1E1E6;
  border-radius: 8px;
  margin-bottom: 8px;
}

.nome-aluno {
  color: #41414D;
}

.small-date {
  color: #A8A8B3;
}
```

## 4. Usando o componente no App

### Uso simples (teste):
```html
<!-- app.component.html -->
<app-item-certificado></app-item-certificado>
```

### Dentro de um container (visual correto):
```html
<!-- app.component.html -->
<div class="container">
  <app-item-certificado></app-item-certificado>
  <app-item-certificado></app-item-certificado>
  <app-item-certificado></app-item-certificado>
</div>
```

## 5. Evolucao progressiva do HTML

### Etapa 1 — Estrutura inicial com placeholders Bootstrap:
```html
<div class="card">
  <div class="d-flex justify-content-between align-items-center">
    <div>
      <div class="fw-bold text-primary">Nome do Aluno</div>
      <small class="text-muted">28/02/2026</small>
    </div>
    <app-secondary-button></app-secondary-button>
  </div>
</div>
```

### Etapa 2 — Substituindo utilities por classes custom:
```html
<div class="card custom-card">
  <div class="d-flex justify-content-between align-items-center">
    <div>
      <div class="nome-aluno fw-bold">Nome do Aluno</div>
      <small class="small-date">Gerado em 28/02/2026</small>
    </div>
    <app-secondary-button></app-secondary-button>
  </div>
</div>
```

O `text-primary` foi removido e substituido por `.nome-aluno` com a cor exata do Figma. O `text-muted` foi substituido por `.small-date`.

## 6. TypeScript do componente (gerado automaticamente)

```typescript
// item-certificado.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-item-certificado',
  templateUrl: './item-certificado.component.html',
  styleUrls: ['./item-certificado.component.css']
})
export class ItemCertificadoComponent {
}
```

## 7. Futuro: versao dinamica com @Input()

```typescript
// Proximas aulas — preparacao mencionada pelo instrutor
export class ItemCertificadoComponent {
  @Input() nomeAluno: string = '';
  @Input() dataGeracao: string = '';
}
```

```html
<div class="card custom-card">
  <div class="d-flex justify-content-between align-items-center">
    <div>
      <div class="nome-aluno fw-bold">{{ nomeAluno }}</div>
      <small class="small-date">Gerado em {{ dataGeracao }}</small>
    </div>
    <app-secondary-button></app-secondary-button>
  </div>
</div>
```