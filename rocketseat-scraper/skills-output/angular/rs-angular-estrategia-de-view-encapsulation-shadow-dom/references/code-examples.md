# Code Examples: View Encapsulation Shadow DOM

## Exemplo 1: Shadow DOM com JavaScript puro (conceitual)

O instrutor mostra que Shadow DOM e API do navegador, nao do Angular:

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Light DOM — estilo global */
    button { background-color: red; }
  </style>
</head>
<body>
  <div>
    <p>Paragrafo no Light DOM</p>

    <!-- Web Component com Shadow DOM -->
    <my-web-component>
      #shadow-root (open)
        <style>
          /* Global DENTRO do Shadow DOM */
          button { background-color: green; }
        </style>
        <button>Botao verde (Shadow DOM)</button>
    </my-web-component>

    <!-- Botao no Light DOM -->
    <button>Botao vermelho (Light DOM)</button>
  </div>
</body>
</html>
```

**Resultado:**
- Botao no Light DOM: `background-color: red` (afetado pelo estilo global)
- Botao no Shadow DOM: `background-color: green` (isolado, usa estilo interno)

## Exemplo 2: Estrutura do projeto Angular

```
src/app/
├── shadow-dom/
│   ├── shadow-host/
│   │   └── shadow-host.component.ts
│   └── child/
│       └── child.component.ts
└── app.component.ts
```

### Gerando os componentes via CLI

```bash
# Shadow Host — componente que tera o Shadow DOM
ng generate component shadow-dom/shadow-host --inline-style --inline-template

# Child — componente filho dentro do Shadow Host
ng generate component shadow-dom/child --inline-style --inline-template
```

## Exemplo 3: Shadow Host Component completo

```typescript
import { Component, ViewEncapsulation } from '@angular/core';
import { ChildComponent } from '../child/child.component';

@Component({
  selector: 'app-shadow-host',
  standalone: true,
  imports: [ChildComponent],
  template: `
    <p>shadow-host works!</p>
    <app-child></app-child>
  `,
  styles: [`
    /* Estes estilos sao globais DENTRO do Shadow DOM */
    /* Afetam este template E todos os componentes filhos */
    p {
      color: red;
    }
  `],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ShadowHostComponent {}
```

## Exemplo 4: Child Component dentro do Shadow Host

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-child',
  standalone: true,
  template: `
    <p>child works!</p>
    <video src="exemplo.mp4" controls width="640" height="360"></video>
  `,
  styles: [`
    /* Escopo local via Emulated (padrao) */
    /* So afeta elementos DESTE template */
    p {
      font-family: cursive;
    }
  `]
  // Nao precisa declarar encapsulation — Emulated e o padrao
  // Funciona normalmente dentro do Shadow Host
})
export class ChildComponent {}
```

## Exemplo 5: App Component carregando o Shadow Host

```typescript
import { Component } from '@angular/core';
import { ShadowHostComponent } from './shadow-dom/shadow-host/shadow-host.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ShadowHostComponent],
  template: `
    <app-shadow-host></app-shadow-host>
  `
})
export class AppComponent {}
```

## Exemplo 6: styles.css global (NAO afeta Shadow DOM)

```css
/* src/styles.css */

/* Este estilo afeta TODOS os paragrafos do Light DOM */
/* Mas NAO afeta paragrafos dentro de componentes com Shadow DOM */
p {
  color: blue;
}
```

**Resultado visual:**
- Paragrafos fora do Shadow DOM: azul (afetados pelo `styles.css`)
- Paragrafo do Shadow Host: vermelho (afetado pelo estilo do proprio componente)
- Paragrafo do Child: vermelho + cursive (vermelho herdado do Shadow Host, cursive do escopo local)

## Exemplo 7: Comportamento no DevTools

Ao inspecionar no navegador:

```html
<!-- O que voce ve no DevTools -->
<app-shadow-host>
  #shadow-root (open)
    <style>
      p { color: red; }
    </style>
    <p>shadow-host works!</p>
    <app-child _nghost-abc123>
      <p _ngcontent-abc123>child works!</p>
      <video src="exemplo.mp4" controls width="640" height="360">
        #shadow-root (user-agent)
          <!-- Controles nativos do video (play, pause, etc) -->
      </video>
    </app-child>
</app-shadow-host>
```

Observe:
- `#shadow-root (open)` no Shadow Host — sem atributos de escopo nos estilos
- `_nghost-*` e `_ngcontent-*` no Child — Emulated funciona normalmente dentro do Shadow DOM
- `#shadow-root (user-agent)` no `<video>` — exemplo de Shadow DOM nativo do navegador

## Exemplo 8: Diagrama de isolamento

```
┌─────────────────────────────────────────────┐
│  Light DOM (pagina web)                     │
│  styles.css: p { color: blue; }             │
│                                             │
│  ┌──── Web Component 1 (Shadow DOM) ────┐  │
│  │  style: button { color: green; }      │  │
│  │  <button>Nao afetado pelo Light DOM</button> │
│  │                                       │  │
│  │  ┌─ Child (Emulated) ─────────────┐  │  │
│  │  │  Isolado do Light DOM           │  │  │
│  │  │  Afetado pelo Shadow Host       │  │  │
│  │  └────────────────────────────────┘  │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌──── Web Component 2 (Shadow DOM) ────┐  │
│  │  Totalmente independente              │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  <button>Afetado pelo styles.css</button>   │
└─────────────────────────────────────────────┘
```