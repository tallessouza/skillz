# Code Examples: Pipes de Manipulacao de Texto no Angular

## Exemplo 1: LowerCasePipe basico

```typescript
import { Component } from '@angular/core';
import { LowerCasePipe } from '@angular/common';

@Component({
  selector: 'app-lowercase-demo',
  standalone: true,
  imports: [LowerCasePipe],
  template: `
    <h3>Texto original: {{ newsTitle }}</h3>
    <p>Com lowercase: {{ newsTitle | lowercase }}</p>

    <h3>Texto original: {{ userName }}</h3>
    <p>Com lowercase: {{ userName | lowercase }}</p>
  `
})
export class LowercaseDemoComponent {
  newsTitle = 'Nova Atualização do ANGULAR Lançada!';
  // resultado: nova atualização do angular lançada!

  userName = 'JOÃO_SILVA@EMAIL.COM';
  // resultado: joão_silva@email.com
}
```

## Exemplo 2: UpperCasePipe com encadeamento de DatePipe

```typescript
import { Component } from '@angular/core';
import { UpperCasePipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-uppercase-demo',
  standalone: true,
  imports: [UpperCasePipe, DatePipe],
  template: `
    <h3>Texto original: {{ alertTitle }}</h3>
    <p>Alerta: {{ alertTitle | uppercase }}</p>

    <h3>Data original (DatePipe): {{ sendDate | date:'full' }}</h3>
    <p>Data uppercase: {{ sendDate | date:'full' | uppercase }}</p>
  `
})
export class UppercaseDemoComponent {
  alertTitle = 'atenção: sistema em manutenção';
  // resultado uppercase: ATENÇÃO: SISTEMA EM MANUTENÇÃO

  sendDate = new Date();
  // date:'full' retorna algo como "Friday, February 28, 2026 at 3:45:00 PM GMT-03:00"
  // depois uppercase: "FRIDAY, FEBRUARY 28, 2026 AT 3:45:00 PM GMT-03:00"
}
```

### Fluxo do encadeamento explicado:

```
sendDate (Date object)
  │
  ▼ date:'full'
"Friday, February 28, 2026 at 3:45:00 PM GMT-03:00"
  │
  ▼ uppercase
"FRIDAY, FEBRUARY 28, 2026 AT 3:45:00 PM GMT-03:00"
```

## Exemplo 3: TitleCasePipe

```typescript
import { Component } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-titlecase-demo',
  standalone: true,
  imports: [TitleCasePipe],
  template: `
    <h3>Nome original: {{ fullName }}</h3>
    <p>Nome formatado: {{ fullName | titleCase }}</p>

    <h3>Descricao original: {{ description }}</h3>
    <p>Descricao formatada: {{ description | titleCase }}</p>
  `
})
export class TitlecaseDemoComponent {
  fullName = 'joão da silva santos';
  // resultado: João Da Silva Santos

  description = 'aprendendo angular com pipes de texto';
  // resultado: Aprendendo Angular Com Pipes De Texto
}
```

## Exemplo 4: Todos os pipes em um unico componente comparativo

```typescript
import { Component } from '@angular/core';
import { LowerCasePipe, UpperCasePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-text-pipes-comparison',
  standalone: true,
  imports: [LowerCasePipe, UpperCasePipe, TitleCasePipe],
  template: `
    <table>
      <tr>
        <th>Original</th>
        <th>lowercase</th>
        <th>uppercase</th>
        <th>titleCase</th>
      </tr>
      <tr>
        <td>{{ sample }}</td>
        <td>{{ sample | lowercase }}</td>
        <td>{{ sample | uppercase }}</td>
        <td>{{ sample | titleCase }}</td>
      </tr>
    </table>
  `
})
export class TextPipesComparisonComponent {
  sample = 'angular é INCRÍVEL para devs';
  // lowercase: angular é incrível para devs
  // uppercase: ANGULAR É INCRÍVEL PARA DEVS
  // titleCase: Angular É Incrível Para Devs
}
```

## Exemplo 5: Uso pratico — badge de status

```typescript
@Component({
  imports: [UpperCasePipe],
  template: `
    <span class="badge" [class]="status">
      {{ status | uppercase }}
    </span>
  `
})
export class StatusBadgeComponent {
  status = 'active'; // exibe: ACTIVE
}
```

## Exemplo 6: Uso pratico — nome de usuario normalizado

```typescript
@Component({
  imports: [TitleCasePipe],
  template: `
    <p>Bem-vindo, {{ userName | titleCase }}!</p>
  `
})
export class WelcomeComponent {
  userName = 'maria santos'; // exibe: Bem-vindo, Maria Santos!
}
```