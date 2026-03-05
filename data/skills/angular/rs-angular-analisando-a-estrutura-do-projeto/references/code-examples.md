# Code Examples: Estrutura do Projeto Angular

## Estrutura completa de um projeto Angular novo

```
meu-primeiro-projeto/
├── .angular/                    # Cache interno do Angular (nao editar)
├── .vscode/                     # Configuracoes do VSCode
├── node_modules/                # Dependencias (nao editar, nao commitar)
├── public/                      # Assets estaticos (imagens, icones, fontes)
├── src/
│   ├── app/
│   │   ├── app.component.css        # Estilos escopados do componente raiz
│   │   ├── app.component.html       # Template do componente raiz
│   │   ├── app.component.spec.ts    # Testes do componente raiz
│   │   ├── app.component.ts         # Classe do componente raiz
│   │   ├── app.config.ts            # Configuracao global (providers)
│   │   └── app.routes.ts            # Configuracao de rotas
│   ├── index.html                   # HTML base (carrega <app-root>)
│   ├── main.ts                      # Bootstrap da aplicacao
│   └── styles.css                   # CSS global
├── .editorconfig                    # Formatacao do editor
├── .gitignore                       # Arquivos ignorados pelo Git
├── angular.json                     # Configuracoes do Angular CLI
├── package.json                     # Dependencias e scripts npm
├── package-lock.json                # Lock de versoes (nao editar)
├── README.md                        # Documentacao do projeto
├── tsconfig.app.json                # TypeScript config (aplicacao)
├── tsconfig.json                    # TypeScript config (base)
└── tsconfig.spec.json               # TypeScript config (testes)
```

## Scripts no package.json

```json
{
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test"
  }
}
```

Equivalencias:
```bash
# Esses pares fazem a mesma coisa:
npm run start    # === ng serve (usa CLI local)
npm run build    # === ng build (usa CLI local)
npm run test     # === ng test  (usa CLI local)
```

## Instalando uma dependencia

```bash
# Dependencia de producao (vai pro bundle final)
npm install date-fns

# Resultado no package.json:
# "dependencies": {
#   "date-fns": "^3.x.x",
#   ...
# }
```

```bash
# Dependencia de desenvolvimento (nao vai pro bundle)
npm install --save-dev @types/some-lib

# Resultado no package.json:
# "devDependencies": {
#   "@types/some-lib": "^1.x.x",
#   ...
# }
```

## CSS global vs escopado

### Global (src/styles.css)
```css
/* Disponivel em TODOS os componentes */
.teste {
  background-color: white;
}

/* Reset global, tipografia base, variaveis CSS */
:root {
  --primary-color: #3f51b5;
}

body {
  margin: 0;
  font-family: Roboto, sans-serif;
}
```

### Escopado (app.component.css)
```css
/* Disponivel APENAS no AppComponent */
h1 {
  color: var(--primary-color);
}
```

## Componente raiz (app.component.ts)

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',              // <app-root> no index.html
  imports: [],                         // Componentes/diretivas usados no template
  templateUrl: './app.component.html', // Arquivo de template HTML
  styleUrl: './app.component.css'      // Arquivo de estilos escopados
})
export class AppComponent {
  title = 'meu-primeiro-projeto';
  // Propriedades e metodos acessiveis no template
}
```

## index.html carregando o componente raiz

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>MeuPrimeiroProjeto</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <!-- Este seletor carrega o AppComponent -->
  <app-root></app-root>
</body>
</html>
```

## main.ts — Bootstrap

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
```

## app.config.ts — Providers globais

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes)
    // provideHttpClient(),
    // outros providers globais
  ]
};
```

## Gerando componente com schematics customizados

```bash
# Comando basico
ng generate component teste-comp

# O CLI consulta angular.json > schematics para decidir:
# - Tipo de stylesheet (css, scss, less)
# - Inline template ou arquivo separado
# - Criar .spec.ts ou nao
```

Configuracao em angular.json:
```json
{
  "schematics": {
    "@schematics/angular:component": {
      "style": "scss",
      "skipTests": false,
      "standalone": true
    }
  }
}
```

## angular.json — Secao de assets

```json
{
  "assets": [
    {
      "glob": "**/*",
      "input": "public"
    }
  ]
}
```

Tudo dentro de `public/` sera tratado como asset estatico e copiado para o build final.