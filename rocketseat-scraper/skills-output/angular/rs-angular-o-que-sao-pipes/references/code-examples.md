# Code Examples: Angular Pipes

## Sintaxe basica de pipe no template

```html
<!-- Propriedade amount passada como parametro ao currency pipe -->
<p>Texto total: {{ amount | currency }}</p>
```

`amount` e uma propriedade da classe do componente. O pipe `currency` recebe esse valor, formata como moeda, e retorna o valor formatado para exibicao. O valor original de `amount` nao e alterado.

## Pipe com parametros adicionais

```html
<!-- Primeiro parametro: valor da propriedade -->
<!-- Segundo parametro apos ':' configura o pipe -->
<p>{{ birthday | date:'fullDate' }}</p>

<!-- Multiplos parametros separados por ':' -->
<p>{{ birthday | date:'short':'UTC' }}</p>
```

## Encadeamento de pipes

```html
<!-- date formata a data, uppercase transforma o resultado em maiusculas -->
<p>{{ birthday | date:'fullDate' | uppercase }}</p>
```

O fluxo: `birthday` → `date pipe` retorna string formatada → `uppercase pipe` retorna string em maiusculas → exibido no template.

## Importando pipes no componente

```typescript
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CurrencyPipe], // importar aqui para usar no template
  template: `<p>{{ amount | currency }}</p>`
})
export class ExampleComponent {
  amount = 12345;
}
```

## Ternario com pipe — cuidado com precedencia

```html
<!-- ERRADO — pipe tem precedencia maior que ternario -->
{{ isAdmin ? 'access granted' : 'access denied' | uppercase }}

<!-- CORRETO — parenteses resolvem -->
{{ (isAdmin ? 'access granted' : 'access denied') | uppercase }}
```

## Concatenacao com pipe — funciona naturalmente

```html
<!-- Concatenacao tem precedencia adequada, nao precisa parenteses -->
{{ firstName + ' ' + lastName | uppercase }}
```

## Setup do projeto da aula

```bash
# Criar projeto com Angular CLI (v20 na aula)
ng new projeto-pipes

# Configuracoes escolhidas:
# - CSS (nao SCSS)
# - SSR: N
# - Zoneless: N
# - AI tools: None

# Executar
cd projeto-pipes
ng serve
# Acessa http://localhost:4200
```