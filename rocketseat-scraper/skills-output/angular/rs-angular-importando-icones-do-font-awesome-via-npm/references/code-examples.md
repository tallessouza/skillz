# Code Examples: Font Awesome via NPM no Angular

## Instalacao completa (uma linha)

```bash
npm install --save @fortawesome/angular-fontawesome@1 @fortawesome/fontawesome-svg-core @fortawesome/free-regular-svg-icons @fortawesome/free-solid-svg-icons @fortawesome/free-brands-svg-icons
```

## Componente com icone solid

```typescript
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-fontawesome-npm',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `<fa-icon [icon]="faCoffee"></fa-icon>`
})
export class FontawesomeNpmComponent {
  faCoffee = faCoffee;
}
```

## Componente com icone regular

```typescript
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-fontawesome-npm',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `<fa-icon [icon]="faBell"></fa-icon>`
})
export class FontawesomeNpmComponent {
  faBell = faBell;
}
```

## Multiplos icones com estilizacao

```typescript
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-fontawesome-npm',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    <fa-icon [icon]="faCoffee" [style.color]="'red'"></fa-icon>
    <fa-icon [icon]="faBell" [style.color]="'blue'"></fa-icon>
  `
})
export class FontawesomeNpmComponent {
  faCoffee = faCoffee;
  faBell = faBell;
}
```

## Estilizacao via CSS class

```typescript
@Component({
  selector: 'app-fontawesome-npm',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `<fa-icon [icon]="faCoffee" class="icon-primary"></fa-icon>`,
  styles: [`
    .icon-primary {
      color: red;
      font-size: 2rem;
    }
  `]
})
export class FontawesomeNpmComponent {
  faCoffee = faCoffee;
}
```

## Verificacao no package.json

Apos instalacao, confirmar que as dependencias existem:

```json
{
  "dependencies": {
    "@fortawesome/angular-fontawesome": "^1.0.0",
    "@fortawesome/fontawesome-svg-core": "^7.0.0",
    "@fortawesome/free-brands-svg-icons": "^7.0.0",
    "@fortawesome/free-regular-svg-icons": "^7.0.0",
    "@fortawesome/free-solid-svg-icons": "^7.0.0"
  }
}
```

## Geracao do componente (CLI)

```bash
ng generate component components/font-awesome-npm
```