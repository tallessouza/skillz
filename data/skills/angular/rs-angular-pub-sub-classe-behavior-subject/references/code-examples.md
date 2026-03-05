# Code Examples: BehaviorSubject no Angular

## Exemplo 1: Implementacao basica do video

### Componente com BehaviorSubject local (para aprendizado)

```typescript
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-behavior-subject',
  template: `
    <button (click)="emitirValor()">Emitir valor</button>
    <button (click)="segundaInscricao()">Segunda inscrição</button>
  `,
  standalone: true,
})
export class BehaviorSubjectComponent implements OnInit {
  meuBehaviorSubject$ = new BehaviorSubject<string>('primeiro valor');

  ngOnInit(): void {
    this.primeiraInscricao();
  }

  primeiraInscricao(): void {
    this.meuBehaviorSubject$.subscribe((value) => {
      console.log('Primeira inscrição:', value);
    });
    // Ao se inscrever, ja recebe 'primeiro valor' imediatamente
  }

  emitirValor(): void {
    this.meuBehaviorSubject$.next('valor enviado');
    // Primeira inscricao recebe 'valor enviado'
    // BehaviorSubject armazena 'valor enviado' como ultimo valor
  }

  segundaInscricao(): void {
    this.meuBehaviorSubject$.subscribe((value) => {
      console.log('Segunda inscrição:', value);
    });
    // Se emitirValor() ja foi chamado, recebe 'valor enviado'
    // Se nao, recebe 'primeiro valor'
  }
}
```

### Sequencia de execucao demonstrada no video

```
1. Pagina carrega → ngOnInit → primeiraInscricao()
   Console: "Primeira inscrição: primeiro valor"

2. Click "Emitir valor"
   Console: "Primeira inscrição: valor enviado"

3. Click "Segunda inscrição"
   Console: "Segunda inscrição: valor enviado"   ← recebe ULTIMO valor, nao o inicial

4. Click "Emitir valor" novamente
   Console: "Primeira inscrição: valor enviado"
   Console: "Segunda inscrição: valor enviado"   ← ambos recebem
```

## Exemplo 2: Padrao Service (desafio proposto pelo instrutor)

### Service com BehaviorSubject

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeSubject$ = new BehaviorSubject<'light' | 'dark'>('light');
  theme$ = this.themeSubject$.asObservable();

  toggleTheme(): void {
    const current = this.themeSubject$.getValue();
    this.themeSubject$.next(current === 'light' ? 'dark' : 'light');
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.themeSubject$.next(theme);
  }
}
```

### Componente A — emite mudanca

```typescript
@Component({
  selector: 'app-theme-toggle',
  template: `<button (click)="toggle()">Trocar tema</button>`,
  standalone: true,
})
export class ThemeToggleComponent {
  private themeService = inject(ThemeService);

  toggle(): void {
    this.themeService.toggleTheme();
  }
}
```

### Componente B — reage a mudanca

```typescript
@Component({
  selector: 'app-header',
  template: `<header [class]="theme">Header</header>`,
  standalone: true,
})
export class HeaderComponent implements OnInit {
  private themeService = inject(ThemeService);
  theme: string = 'light';

  ngOnInit(): void {
    this.themeService.theme$.subscribe((theme) => {
      this.theme = theme;
      // Recebe 'light' imediatamente (valor inicial)
      // Recebe atualizacoes quando ThemeToggleComponent chama toggle()
    });
  }
}
```

## Exemplo 3: Comparacao Subject vs BehaviorSubject

```typescript
// SUBJECT — sem memoria
const subject = new Subject<string>();
subject.next('valor A');                    // emitido, ninguem ouviu
subject.subscribe(v => console.log(v));     // inscrito, nada acontece
subject.next('valor B');                    // console: "valor B"

// BEHAVIORSUBJECT — com memoria
const behavior = new BehaviorSubject<string>('inicial');
behavior.next('valor A');                   // emitido, armazenado
behavior.subscribe(v => console.log(v));    // console: "valor A" (ultimo valor)
behavior.next('valor B');                   // console: "valor B"
```