# Code Examples: Componente Secondary Button

## 1. Geracao do componente via CLI

```bash
# Navegar ate a pasta de componentes
cd src/app/_components

# Gerar componente sem arquivos de teste
ng g c secondary-button --skip-tests
```

Saida esperada: criacao de `secondary-button/` com `.ts`, `.html`, `.css`.

## 2. CSS completo do Secondary Button

Copiado do Primary Button e ajustado:

```css
.custom-button {
  padding: 10px 20px;      /* top/bottom mudou para 10px */
  background: #1e3a5f;     /* cor solida blue-dark, sem linear-gradient */
  cursor: pointer;          /* garante pointer mesmo em <button> */
  gap: 8px;                 /* espaco entre icone e texto */
  display: flex;            /* necessario para alinhar icone + texto */
  align-items: center;      /* centraliza verticalmente */
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  height: 40px;             /* menor que o primary (48px) */
}

.custom-button:hover {
  opacity: 90%;
}

.custom-button i {
  font-size: 20px;          /* icone 20x20 conforme Figma */
}
```

## 3. HTML do componente

```html
<button class="custom-button">
  <i class="ph ph-plus"></i>
  Botão secundário
</button>
```

## 4. Usando no App Component

```html
<!-- app.component.html -->
<app-primary-button></app-primary-button>
<app-secondary-button></app-secondary-button>
```

O Angular importa automaticamente ao salvar (com standalone components), mas e necessario salvar o `app.component.ts` para que o import seja registrado.

## 5. Evolucao futura — icone dinamico (previsto)

```typescript
// secondary-button.component.ts (futuro)
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-secondary-button',
  standalone: true,
  templateUrl: './secondary-button.component.html',
  styleUrls: ['./secondary-button.component.css']
})
export class SecondaryButtonComponent {
  @Input() icon: string = 'ph-plus';
  @Input() label: string = 'Botão secundário';
}
```

```html
<!-- secondary-button.component.html (futuro) -->
<button class="custom-button">
  <i class="ph" [class]="icon"></i>
  {{ label }}
</button>
```

## 6. Estado disabled (previsto)

```css
/* Adicionar ao CSS quando implementar inputs */
.custom-button:disabled {
  opacity: 50%;
  cursor: not-allowed;
}
```