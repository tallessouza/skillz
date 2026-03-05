# Code Examples: Analisando um Projeto Angular

## Criacao do projeto

```bash
# Criar novo projeto Angular
ng new meu-projeto-angular

# O CLI perguntara:
# ? Would you like to add Angular routing? (y/N)
# ? Which stylesheet format would you like to use? (CSS/SCSS/Sass/Less)
```

## Instalacao de dependencias

```bash
# Navegar para o diretorio do projeto
cd meu-projeto-angular

# Instalar todas as dependencias do package.json
npm install
```

## Estrutura padrao do projeto

```
meu-projeto-angular/
├── angular.json            # Configuracao do workspace Angular
├── package.json            # Dependencias e scripts npm
├── tsconfig.json           # Configuracao base do TypeScript
├── tsconfig.app.json       # Config TS para a aplicacao
├── tsconfig.spec.json      # Config TS para testes
├── src/
│   ├── index.html          # HTML principal (entry point)
│   ├── main.ts             # Bootstrap da aplicacao
│   ├── styles.css          # Estilos globais
│   ├── app/
│   │   ├── app.component.ts       # Componente raiz
│   │   ├── app.component.html     # Template do componente raiz
│   │   ├── app.component.css      # Estilos do componente raiz
│   │   ├── app.component.spec.ts  # Testes do componente raiz
│   │   └── app.module.ts          # Modulo principal
│   ├── assets/             # Arquivos estaticos (imagens, fontes)
│   └── environments/       # Configuracoes por ambiente
│       ├── environment.ts
│       └── environment.prod.ts
└── node_modules/           # Dependencias instaladas (nao commitar)
```

## Comandos do Angular CLI

```bash
# Gerar um componente
ng generate component nome-do-componente
# Atalho: ng g c nome-do-componente

# Gerar um service
ng generate service nome-do-service
# Atalho: ng g s nome-do-service

# Gerar um module
ng generate module nome-do-module
# Atalho: ng g m nome-do-module

# Rodar a aplicacao em modo desenvolvimento
ng serve
# Acesse em http://localhost:4200

# Build para producao
ng build --configuration production
```

## Tecnicas de debug em Angular

```typescript
// 1. Console.log no lifecycle hook para verificar inicializacao
ngOnInit() {
  console.log('Componente inicializado', this.dados);
}

// 2. Verificar bindings no template com json pipe
// No HTML: {{ minhaVariavel | json }}

// 3. Usar Angular DevTools (extensao do Chrome)
// Permite inspecionar component tree, change detection, etc.
```

```bash
# 4. Rodar com source maps para debug no browser
ng serve --source-map

# 5. Verificar erros de compilacao no terminal
# O Angular CLI mostra erros detalhados com arquivo e linha
```