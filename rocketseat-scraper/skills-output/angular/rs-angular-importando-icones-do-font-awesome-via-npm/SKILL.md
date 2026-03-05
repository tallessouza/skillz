---
name: rs-angular-font-awesome-npm
description: "Guides Font Awesome installation via NPM in Angular projects. Use when user asks to 'install font awesome', 'add icons to angular', 'setup fontawesome npm', 'import svg icons angular', or 'configure font awesome component'. Covers package compatibility, correct package names, component imports, and icon styling. Make sure to use this skill whenever setting up Font Awesome in an Angular project via NPM. Not for CDN-based Font Awesome setup, React Font Awesome, or custom SVG icon systems."
---

# Font Awesome via NPM no Angular

> Instale e configure Font Awesome como pacote NPM no Angular, respeitando compatibilidade de versoes e importando icones por componente.

## Prerequisites

- Projeto Angular existente (verificar versao no `package.json`)
- NPM disponivel
- Se versao Angular 19.x: instalar `@fortawesome/angular-fontawesome@1`

## Steps

### Step 1: Verificar versao do Angular

```bash
# No package.json, verificar o campo da versao do @angular/core
# Angular 19.x → @fortawesome/angular-fontawesome@1
# Consultar tabela de compatibilidade no NPM do pacote
```

### Step 2: Instalar os 5 pacotes

```bash
npm install --save @fortawesome/angular-fontawesome@1 @fortawesome/fontawesome-svg-core @fortawesome/free-regular-svg-icons @fortawesome/free-solid-svg-icons @fortawesome/free-brands-svg-icons
```

**Atencao critica:** O namespace e `@fortawesome` (com R — foRtawesome), nao `@fontawesome`.

### Step 3: Verificar instalacao no package.json

```json
{
  "dependencies": {
    "@fortawesome/angular-fontawesome": "^1.x.x",
    "@fortawesome/fontawesome-svg-core": "^7.x.x",
    "@fortawesome/free-regular-svg-icons": "^7.x.x",
    "@fortawesome/free-solid-svg-icons": "^7.x.x",
    "@fortawesome/free-brands-svg-icons": "^7.x.x"
  }
}
```

### Step 4: Importar no componente

```typescript
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `<fa-icon [icon]="faCoffee"></fa-icon>`
})
export class ExampleComponent {
  faCoffee = faCoffee;
}
```

### Step 5: Estilizar icones

```html
<!-- Inline style -->
<fa-icon [icon]="faCoffee" [style.color]="'red'"></fa-icon>

<!-- CSS class -->
<fa-icon [icon]="faCoffee" class="icon-blue"></fa-icon>

<!-- Atributos do componente: size, flip, rotate, animation, border -->
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Icone solido (preenchido) | Importar de `free-solid-svg-icons` |
| Icone contorno (outline) | Importar de `free-regular-svg-icons` |
| Logo de marca (GitHub, Twitter) | Importar de `free-brands-svg-icons` |
| Icone usado em multiplos componentes | Importar `FontAwesomeModule` em cada componente que usa |
| Versao Angular diferente | Consultar tabela de compatibilidade no NPM |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `@fontawesome/...` (sem R) | `@fortawesome/...` (com R: foRtawesome) |
| Instalar sem `@1` no Angular 19 | `@fortawesome/angular-fontawesome@1` |
| Importar todos os icones de uma vez | Importar apenas os icones usados (tree shaking) |
| Esquecer `FontAwesomeModule` nos imports | Adicionar em cada componente standalone que usa `<fa-icon>` |

## Verification

- Icone renderiza como SVG inline no HTML
- Apenas icones importados entram no bundle (tree shaking)
- `package.json` contem os 5 pacotes nas versoes corretas

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
