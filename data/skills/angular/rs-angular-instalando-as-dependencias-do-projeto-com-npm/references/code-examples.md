# Code Examples: Instalando Dependencias com NPM

## Fluxo completo: Clone → Install → Run

```bash
# 1. Clonar o projeto
git clone https://github.com/usuario/projeto-angular.git
cd projeto-angular

# 2. Verificar estrutura (node_modules NAO existe)
ls
# package.json  package-lock.json  src/  angular.json  tsconfig.json  ...

# 3. Tentar rodar sem instalar (vai falhar)
npm run start
# Error: pacotes nao instalados

# 4. Instalar dependencias
npm install
# ... instalacao das dependencias ...

# 5. Verificar que node_modules foi criada
ls node_modules/
# @angular/  rxjs/  typescript/  zone.js/  ...

# 6. Rodar o projeto
ng serve
# ou
npm run start
# Application is running on http://localhost:4200
```

## Fluxo de delecao segura da node_modules

```bash
# 1. Parar ng serve (Ctrl+C no terminal)
# 2. Fechar TODOS os terminais do projeto
# 3. Fechar o VS Code
# 4. No File Explorer do Windows/Mac/Linux: deletar a pasta node_modules
# 5. Reabrir VS Code
# 6. Reinstalar:
npm install
# 7. Rodar novamente:
npm run start
```

## Verificacao rapida de dependencias

```bash
# Verificar se esta na raiz do projeto
ls package.json
# package.json  ← se aparece, esta no lugar certo

# Verificar se node_modules existe
ls node_modules 2>/dev/null && echo "Existe" || echo "Precisa instalar"
```

## Diferenca entre ng serve e npm run start

```json
// package.json - secao scripts
{
  "scripts": {
    "start": "ng serve",
    "build": "ng build",
    "test": "ng test"
  }
}
```

```bash
# Equivalentes:
ng serve              # usa Angular CLI global
npm run start         # usa Angular CLI local (node_modules/.bin/ng)
npx ng serve          # tambem usa CLI local
```