# Code Examples: Atualizando o Ambiente de Desenvolvimento para o Angular 20

## Verificar versao do Node.js

```bash
node --version
# Output esperado: v22.15.0 (ou qualquer versao dentro do range 20/22/24)
```

## Verificar versao do Angular CLI

```bash
ng version
# Output mostra a versao do Angular CLI e dependencias
```

## Desinstalar Angular CLI global

```bash
npm uninstall -g @angular/cli
```

Apos desinstalar, o comando `ng` nao sera mais reconhecido:

```bash
ng version
# Erro: 'ng' is not recognized / command not found
```

## Instalar Angular CLI na ultima versao

```bash
npm install -g @angular/cli
```

Isso instala a versao mais recente disponivel no npm (no momento do video, 20.3.7).

## Verificar instalacao

```bash
ng version
# Angular CLI: 20.3.7
```

## Criar novo projeto

```bash
ng new projeto-versao-20
```

Respostas interativas:
```
? Which stylesheet format would you like to use? CSS
? Do you want to enable Server-Side Rendering (SSR)? No
? Do you want to create a zoneless application? No
? Which AI tool would you like to configure? None
```

## Alternativa com npx (sem instalar CLI global)

```bash
npx @angular/cli@20 new projeto-versao-20
```

Util para criar projetos em versoes especificas sem alterar o CLI global.

## Rodar o projeto

```bash
cd projeto-versao-20
ng serve
# Output: Application is running on http://localhost:4200
```

## Verificar versao no package.json

```json
{
  "dependencies": {
    "@angular/core": "^20.0.0",
    "@angular/common": "^20.0.0",
    "@angular/compiler": "^20.0.0"
  }
}
```

## Abrir projeto no VS Code

```bash
cd projeto-versao-20
code .
```