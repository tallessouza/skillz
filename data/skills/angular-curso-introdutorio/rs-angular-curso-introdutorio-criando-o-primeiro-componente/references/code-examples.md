# Code Examples: Criando o Primeiro Componente Angular

## 1. Navegacao no terminal ate a pasta correta

```bash
# Se voce esta na raiz do projeto, navegue ate _components
cd src/app/_components

# Para voltar uma pasta
cd ..

# Para voltar varias pastas
cd ../../..
```

## 2. Gerando o componente navbar

```bash
# Comando completo
ng generate component navbar --skip-tests

# Comando abreviado (recomendado)
ng g c navbar --skip-tests
```

**Output do CLI:**
```
CREATE navbar/navbar.component.html
CREATE navbar/navbar.component.ts
CREATE navbar/navbar.component.css
```

## 3. Arquivo HTML gerado (navbar.component.html)

```html
<p>navbar works!</p>
```

## 4. Arquivo CSS gerado (navbar.component.css)

```css
/* Vazio por padrao — adicione estilos especificos do componente aqui */
```

## 5. Arquivo TypeScript gerado (navbar.component.ts)

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

}
```

## 6. Referenciando o componente no app principal

```html
<!-- app.component.html -->
<!-- Antes: template padrao do Angular com "Hello, congratulations your app is running" -->

<!-- Depois: conteudo customizado + componente navbar -->
<p>Hello World</p>
<app-navbar></app-navbar>
```

**Resultado no navegador:**
```
Hello World
navbar works!
```

## 7. O main.ts (componente de entrada)

```typescript
// main.ts — define qual componente e o ponto de entrada da aplicacao
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent);
```

## 8. Executando o projeto

```bash
# Volte para a raiz do projeto antes de executar
cd ../../..

# Inicie o servidor de desenvolvimento
ng serve
```

**Output:**
```
** Angular Live Development Server is listening on localhost:4200 **
```

## 9. Estrutura final do projeto

```
src/
└── app/
    ├── _components/
    │   └── navbar/
    │       ├── navbar.component.ts
    │       ├── navbar.component.html
    │       └── navbar.component.css
    ├── app.component.ts
    ├── app.component.html
    ├── app.component.css
    └── main.ts
```