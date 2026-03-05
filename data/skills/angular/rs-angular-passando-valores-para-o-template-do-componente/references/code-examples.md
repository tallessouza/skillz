# Code Examples: Interpolacao Angular

## 1. Exibir propriedades simples

```typescript
@Component({
  selector: 'app-user',
  template: `
    <p>{{ nome }}</p>
    <p>{{ idade }}</p>
    <p>{{ estaAtivo }}</p>
  `
})
export class UserComponent {
  nome = 'Ana';
  idade = 25;
  estaAtivo = true;
}
```

**Resultado no navegador:**
```
Ana
25
true
```

Todos os valores sao convertidos para string automaticamente.

## 2. Operacoes matematicas

```typescript
@Component({
  selector: 'app-calc',
  template: `
    <p>Total: R$ {{ precoUnitario * quantidade }}</p>
    <p>Soma: {{ 10 + 5 }}</p>
  `
})
export class CalcComponent {
  precoUnitario = 10;
  quantidade = 5;
}
```

**Resultado:**
```
Total: R$ 50
Soma: 15
```

Se `quantidade` mudar (ex: via metodo `atualizarQuantidade()`), o template atualiza automaticamente pelo Change Detection.

## 3. Operacoes com strings

```typescript
@Component({
  selector: 'app-name',
  imports: [UpperCasePipe],
  template: `
    <p>Nome completo: {{ nome + ' ' + sobrenome }}</p>
    <p>Maiusculas: {{ 'Angular' | uppercase }}</p>
  `
})
export class NameComponent {
  nome = 'Ana';
  sobrenome = 'Silva';
}
```

**Resultado:**
```
Nome completo: Ana Silva
Maiusculas: ANGULAR
```

## 4. Acessar objetos e arrays

```typescript
@Component({
  selector: 'app-data',
  template: `
    <p>Email: {{ usuario.email }}</p>
    <p>Primeira fruta: {{ frutas[0] }}</p>
  `
})
export class DataComponent {
  usuario = {
    nome: 'Carlos',
    email: 'carlos@exemplo.com'
  };
  frutas = ['Maca', 'Banana', 'Laranja'];
}
```

**Resultado:**
```
Email: carlos@exemplo.com
Primeira fruta: Maca
```

**ERRADO** (nao faca):
```html
<p>{{ usuario }}</p>   <!-- Mostra [object Object] -->
<p>{{ frutas }}</p>    <!-- Mostra itens de forma nao controlada -->
```

## 5. Operador ternario

```typescript
@Component({
  selector: 'app-status',
  template: `
    <p>Status: {{ estaLogado ? 'Online' : 'Offline' }}</p>
  `
})
export class StatusComponent {
  estaLogado = true;
}
```

**Resultado:**
```
Status: Online
```

## 6. Pipes nativos

```typescript
@Component({
  selector: 'app-formatted',
  imports: [DatePipe, CurrencyPipe, UpperCasePipe],
  template: `
    <p>Data formatada: {{ dataEvento | date:'shortDate' }}</p>
    <p>Valor: {{ valorCompra | currency:'BRL':'symbol':'1.2-2' }}</p>
    <p>{{ 'Ola Mundo' | uppercase }}</p>
  `
})
export class FormattedComponent {
  dataEvento = new Date();
  valorCompra = 149.90;
}
```

**Resultado (exemplo):**
```
Data formatada: 2/28/26
Valor: R$149.90
OLA MUNDO
```

## 7. Getter (propriedade computada)

```typescript
@Component({
  selector: 'app-computed',
  template: `
    <p>{{ nomeCompleto }}</p>
  `
})
export class ComputedComponent {
  nome = 'Ana';
  sobrenome = 'Silva';

  get nomeCompleto(): string {
    return `${this.nome} ${this.sobrenome}`;
  }
}
```

**Resultado:**
```
Ana Silva
```

No template: `{{ nomeCompleto }}` — sem parenteses.
Na classe: `this.nomeCompleto` — acessa como propriedade.

## 8. AsyncPipe com Observable

```typescript
@Component({
  selector: 'app-async',
  imports: [AsyncPipe],
  template: `
    <p>{{ dados$ | async }}</p>
  `
})
export class AsyncComponent {
  dados$ = new Observable<string>(observer => {
    observer.next('Dados carregados');
  });
}
```

**Resultado:**
```
Dados carregados
```

O AsyncPipe se inscreve automaticamente e se desinscreve quando o componente e destruido.

## 9. ANTI-PATTERN: Metodo com efeito colateral

```typescript
// NAO FACA ISSO
@Component({
  selector: 'app-bad',
  template: `
    <p>{{ meuCounter() }}</p>
  `
})
export class BadComponent {
  counter = 0;

  meuCounter() {
    this.counter += 1; // EFEITO COLATERAL
    return this.counter;
  }
}
```

**Resultado inesperado:** O counter mostra 2, 3, ou valores maiores logo no primeiro render. A cada interacao do usuario, pula numeros de forma imprevisivel. O Angular pode ate exibir erros no console.

**Versao correta:**
```typescript
@Component({
  selector: 'app-good',
  template: `
    <p>{{ counter }}</p>
    <button (click)="incrementar()">+1</button>
  `
})
export class GoodComponent {
  counter = 0;

  incrementar() {
    this.counter += 1;
  }
}
```