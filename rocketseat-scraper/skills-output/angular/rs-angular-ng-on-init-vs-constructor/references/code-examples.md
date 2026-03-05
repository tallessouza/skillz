# Code Examples: ngOnInit vs Constructor

## Exemplo 1: Demonstracao da ordem de execucao

Exatamente como mostrado na aula:

```typescript
import { Component, OnInit, OnChanges, SimpleChanges, input } from '@angular/core';

@Component({
  selector: 'app-pessoa',
  template: `<p>{{ pessoa().nome }}</p>`
})
export class PessoaComponent implements OnInit, OnChanges {
  pessoa = input.required<{ nome: string }>();

  constructor() {
    console.log('--- constructor ---');
    console.log(this.pessoa); // undefined — input ainda nao recebeu valor
  }

  ngOnInit() {
    console.log('--- ngOnInit ---');
    console.log(this.pessoa()); // { nome: 'João' } — input ja tem valor
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('--- ngOnChanges ---');
    console.log(changes);
  }
}
```

**Output no console (primeira renderizacao):**
```
--- constructor ---
undefined
--- ngOnChanges ---
{ pessoa: { currentValue: { nome: 'João' }, ... } }
--- ngOnInit ---
{ nome: 'João' }
```

**Output ao clicar "mudar nome":**
```
--- ngOnChanges ---
{ pessoa: { currentValue: { nome: 'Maria' }, previousValue: { nome: 'João' }, ... } }
```

Apenas ngOnChanges e chamado nas atualizacoes subsequentes.

## Exemplo 2: Injecao de dependencia — antes vs depois

### Antes (constructor injection):

```typescript
import { Component } from '@angular/core';
import { MeuService } from './meu-service';

@Component({ selector: 'app-exemplo', template: '' })
export class ExemploComponent {
  constructor(private readonly _meuService: MeuService) {}
}
```

### Depois (inject function — forma moderna):

```typescript
import { Component, inject } from '@angular/core';
import { MeuService } from './meu-service';

@Component({ selector: 'app-exemplo', template: '' })
export class ExemploComponent {
  private meuService = inject(MeuService);
}
```

## Exemplo 3: Padrao tipico — fetch no ngOnInit

```typescript
import { Component, OnInit, inject, input } from '@angular/core';
import { UserService } from './user.service';

@Component({
  selector: 'app-user-profile',
  template: `
    @if (profile) {
      <h1>{{ profile.nome }}</h1>
    }
  `
})
export class UserProfileComponent implements OnInit {
  userId = input.required<string>();

  profile: UserProfile | null = null;

  private userService = inject(UserService);

  ngOnInit() {
    // userId ja tem valor aqui — seguro para usar na chamada HTTP
    this.userService.getProfile(this.userId()).subscribe(profile => {
      this.profile = profile;
    });
  }
}
```

## Exemplo 4: ngOnChanges para inputs que mudam

```typescript
import { Component, OnChanges, SimpleChanges, input } from '@angular/core';

@Component({
  selector: 'app-filtro',
  template: `<ul>@for (item of filtrados; track item.id) { <li>{{ item.nome }}</li> }</ul>`
})
export class FiltroComponent implements OnChanges {
  termo = input.required<string>();
  items = input.required<Item[]>();

  filtrados: Item[] = [];

  ngOnChanges(changes: SimpleChanges) {
    // Roda toda vez que termo ou items mudam
    this.filtrados = this.items().filter(item =>
      item.nome.toLowerCase().includes(this.termo().toLowerCase())
    );
  }
}
```