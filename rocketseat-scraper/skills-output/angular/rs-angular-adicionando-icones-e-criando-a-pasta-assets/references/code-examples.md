# Code Examples: Assets e Icones no Angular

## Configuracao do angular.json

O trecho relevante do `angular.json` que define `public/` como diretorio de assets:

```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "projects": {
    "go-task": {
      "architect": {
        "build": {
          "options": {
            "assets": [
              {
                "glob": "**/*",
                "input": "public"
              }
            ]
          }
        }
      }
    }
  }
}
```

Essa regra `glob: "**/*"` com `input: "public"` significa: copie todos os arquivos de todas as subpastas dentro de `public/` para o output do build.

## Estrutura de pastas completa do projeto

```
go-task/
├── public/                  # Assets (fora do src/)
│   └── images/
│       ├── gotask-logo.svg
│       ├── icon-add.svg
│       ├── icon-bell.svg
│       ├── icon-close.svg
│       ├── icon-comment.svg
│       ├── icon-profile.svg
│       └── ...
├── src/
│   ├── app/
│   │   └── ...
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── angular.json
└── package.json
```

## Usando icones nos templates de componentes

### Icone simples em um componente

```html
<!-- header.component.html -->
<header>
  <img src="images/gotask-logo.svg" alt="GoTask" />
  <nav>
    <img src="images/icon-bell.svg" alt="Notificacoes" />
    <img src="images/icon-profile.svg" alt="Perfil" />
  </nav>
</header>
```

### Icone em um botao

```html
<!-- add-button.component.html -->
<button class="add-task">
  <img src="images/icon-add.svg" alt="Adicionar tarefa" />
  Nova Tarefa
</button>
```

### Icone com binding dinamico

```html
<!-- Caso precise alternar icones dinamicamente -->
<img [src]="'images/' + iconName + '.svg'" [alt]="iconAlt" />
```

## Comparacao: antes vs depois (Angular 16 vs 17+)

### Angular 16 (antigo)

```
src/
├── assets/
│   └── images/
│       └── logo.svg
├── app/
└── ...
```

Template referenciava:
```html
<img src="assets/images/logo.svg" alt="Logo" />
```

### Angular 17+ (atual)

```
public/
└── images/
    └── logo.svg
src/
├── app/
└── ...
```

Template referencia:
```html
<img src="images/logo.svg" alt="Logo" />
```

Note que o path nao inclui `public/` — o Angular serve o conteudo de `public/` diretamente na raiz.