# Code Examples: Definindo a Sessao de Conteudo Principal

## Exemplo completo do componente MainContent

### Template (main-content.component.html)

```html
<div class="max-w-5xl mx-auto px-4 py-5">
  <div class="flex flex-col gap-8">
    <!-- Aqui entram os componentes filhos: boas-vindas e colunas -->
    <div class="p-3 bg-amber-300">Secao de boas-vindas (placeholder)</div>
    <div class="p-3 bg-amber-900">Secao de colunas (placeholder)</div>
  </div>
</div>
```

### Uso no app.component.html

```html
<app-header />
<app-main-content />
```

### Componente TypeScript

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-main-content',
  standalone: true,
  templateUrl: './main-content.component.html',
})
export class MainContentComponent {}
```

## Progressao de classes aplicadas

### Passo 1: Apenas max-width

```html
<div class="max-w-5xl">
  <!-- Em 390px: ocupa tudo. Em 1200px: limitado a 1024px, mas alinhado a esquerda -->
</div>
```

### Passo 2: Centralizar

```html
<div class="max-w-5xl mx-auto">
  <!-- Agora centralizado horizontalmente -->
</div>
```

### Passo 3: Adicionar padding

```html
<div class="max-w-5xl mx-auto px-4 py-5">
  <!-- Conteudo protegido das bordas em mobile -->
</div>
```

### Passo 4: Flex column com gap

```html
<div class="max-w-5xl mx-auto px-4 py-5">
  <div class="flex flex-col gap-8">
    <!-- Filhos empilhados com 32px de espaco entre eles -->
  </div>
</div>
```

## Comparacao: flex vs flex-col

```html
<!-- flex (default: row) — elementos lado a lado -->
<div class="flex gap-8">
  <div>A</div>
  <div>B</div>
</div>

<!-- flex-col — elementos empilhados verticalmente -->
<div class="flex flex-col gap-8">
  <div>A</div>
  <div>B</div>
</div>
```

## Referencia de valores Tailwind usados

| Classe | Valor CSS |
|--------|-----------|
| `max-w-5xl` | `max-width: 1024px` |
| `mx-auto` | `margin-left: auto; margin-right: auto` |
| `px-4` | `padding-left: 16px; padding-right: 16px` |
| `py-5` | `padding-top: 20px; padding-bottom: 20px` |
| `gap-8` | `gap: 32px` |
| `flex` | `display: flex` |
| `flex-col` | `flex-direction: column` |
| `p-3` | `padding: 12px` |