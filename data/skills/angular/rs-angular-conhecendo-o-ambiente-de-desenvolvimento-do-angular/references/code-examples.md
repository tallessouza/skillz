# Code Examples: Ambiente de Desenvolvimento Angular

## Verificacao do ambiente

```bash
# Verificar Node instalado
node --version
# Esperado: v18.x ou superior

# Verificar NPM instalado
npm --version

# Verificar Angular CLI
ng version
```

## Instalacao do Angular CLI

```bash
# Instalacao global (disponivel em qualquer diretorio)
npm install -g @angular/cli

# Alternativa: usar sem instalacao global
npx @angular/cli new meu-projeto
npx @angular/cli generate component meu-componente
```

## Criacao de projeto

```bash
# Criar novo projeto Angular
ng new meu-projeto

# O CLI vai perguntar:
# - Stylesheet format (CSS, SCSS, SASS, LESS)
# - SSR/SSG (Server-Side Rendering)

# Entrar no projeto
cd meu-projeto
```

## Servir a aplicacao

```bash
# Inicia servidor de desenvolvimento
ng serve
# Output: Application bundle generation complete.
# Acesse: http://localhost:4200

# O que acontece por debaixo dos panos:
# 1. Angular CLI compila TypeScript → JavaScript
# 2. Angular CLI compila SCSS → CSS
# 3. Angular CLI processa templates → HTML
# 4. Node.js cria servidor HTTP em localhost:4200
# 5. Navegador faz GET em localhost:4200
# 6. Navegador recebe JS/CSS/HTML puro e renderiza
```

## Build para producao

```bash
# Gera pasta dist/ com arquivos finais
ng build

# Conteudo de dist/:
# - index.html
# - main.js (todo JS compilado)
# - styles.css (todo CSS compilado)
# - assets/
```

## Estrutura do package.json de um projeto Angular

```json
{
  "name": "meu-projeto",
  "dependencies": {
    "@angular/core": "^19.0.0",
    "@angular/common": "^19.0.0",
    "@angular/compiler": "^19.0.0",
    "@angular/forms": "^19.0.0",
    "@angular/router": "^19.0.0",
    "@angular/platform-browser": "^19.0.0"
  },
  "devDependencies": {
    "@angular/cli": "^19.0.0",
    "@angular/compiler-cli": "^19.0.0",
    "typescript": "~5.6.0"
  }
}
```

## Extensoes VSCode — settings.json

```json
{
  "recommendations": [
    "angular.ng-template",
    "alexiv.vscode-angular2-files",
    "pkief.material-icon-theme",
    "wesbos.theme-shades-of-purple"
  ]
}
```

Salve como `.vscode/extensions.json` no projeto para recomendar automaticamente ao time.

## Fluxo completo: do codigo ao navegador

```
[TypeScript + Angular Syntax]
         │
         ▼ (ng serve / ng build)
[Angular CLI compila]
         │
         ├── TypeScript → JavaScript
         ├── SCSS/SASS → CSS
         └── Templates → HTML
         │
         ▼
[Node.js serve em localhost:4200]
         │
         ▼
[Navegador faz GET]
         │
         ▼
[Renderiza JS + CSS + HTML puro]
```