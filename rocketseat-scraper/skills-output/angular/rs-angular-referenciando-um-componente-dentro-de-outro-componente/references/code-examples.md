# Code Examples: Referenciando Componentes no Angular

## Exemplo 1: Limpando o AppComponent antes de usar

O instrutor comeca removendo o template padrao do AppComponent:

```typescript
// ANTES — AppComponent com template padrao e title
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'meu-primeiro-projeto';
}
```

```typescript
// DEPOIS — AppComponent limpo
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {}
```

```html
<!-- app.component.html — vazio apos limpeza -->
```

O `RouterOutlet` tambem foi removido dos imports pois nao esta sendo utilizado neste momento (faz parte de configuracao de rotas).

## Exemplo 2: Adicionando o componente MeuBotao

```typescript
// app.component.ts — com MeuBotaoComponent importado
import { Component } from '@angular/core';
import { MeuBotaoComponent } from './meu-botao/meu-botao.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MeuBotaoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {}
```

```html
<!-- app.component.html — referenciando o componente -->
<app-meu-botao />
```

## Exemplo 3: O componente MeuBotao (criado no video anterior)

```typescript
// meu-botao.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-meu-botao',
  standalone: true,
  templateUrl: './meu-botao.component.html',
  styleUrl: './meu-botao.component.css'
})
export class MeuBotaoComponent {
  filtrar() {
    console.log('metodo filtrar');
  }

  limpar() {
    console.log('metodo limpar');
  }
}
```

```html
<!-- meu-botao.component.html -->
<button class="btn btn-flat" (click)="filtrar()">Filtrar</button>
<button class="btn btn-flat" (click)="limpar()">Limpar</button>
```

```css
/* meu-botao.component.css */
.btn {
  padding: 8px 16px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.btn-flat {
  background: #333;
  color: #fff;
}
```

## Exemplo 4: Servindo a aplicacao

```bash
# No terminal, dentro do diretorio do projeto
ng serve

# Aplicacao disponivel em:
# http://localhost:4200
```

## Exemplo 5: DOM resultante inspecionado no DevTools

```html
<html>
  <body>
    <!-- app-root = AppComponent (seletor unico fora do padrao) -->
    <app-root _nghost-abc123>

      <!-- app-meu-botao = MeuBotaoComponent -->
      <app-meu-botao _ngcontent-abc123 _nghost-def456>

        <!-- Template do MeuBotaoComponent -->
        <button _ngcontent-def456 class="btn btn-flat">Filtrar</button>
        <button _ngcontent-def456 class="btn btn-flat">Limpar</button>

      </app-meu-botao>

    </app-root>
  </body>
</html>
```

Note os atributos `_nghost-*` e `_ngcontent-*` que o Angular adiciona automaticamente para View Encapsulation.

## Exemplo 6: Testando estilos no DevTools

```css
/* No DevTools > Elements > Styles, o instrutor demonstra: */

/* Removendo background do btn-flat */
.btn-flat {
  /* background: #333; */  /* desmarcado no DevTools */
  /* color: #fff; */       /* desmarcado no DevTools */
}

/* Adicionando cor customizada em tempo real */
.btn-flat {
  color: blue;  /* adicionado manualmente no DevTools */
}

/* Tudo temporario — refresh volta ao original */
```

## Exemplo 7: Multiplos componentes no mesmo template

```html
<!-- app.component.html — padrao para compor varios componentes -->
<app-header />
<app-meu-botao />
<app-footer />
```

```typescript
// app.component.ts — cada componente deve ser importado
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, MeuBotaoComponent, FooterComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
```