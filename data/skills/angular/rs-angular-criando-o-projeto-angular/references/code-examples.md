# Code Examples: Criando Projeto Angular

## Comando completo de criacao

```bash
# Formato completo
npx @angular/cli@19.2.9 new projeto-go-task

# Interacoes do CLI:
# ? Which stylesheet format would you like to use? → CSS
# ? Do you want to enable Server-Side Rendering (SSR)? → N
```

## Criando projetos em versoes diferentes

```bash
# Versao especifica (recomendado)
npx @angular/cli@19.2.9 new meu-projeto

# Apenas major (pega ultima minor/patch da v19)
npx @angular/cli@19 new meu-projeto

# Outra versao major
npx @angular/cli@18 new meu-projeto-legado
```

## Navegacao e abertura no VS Code

```bash
cd projeto-go-task
ls                  # Lista arquivos do projeto
code .              # Abre no VS Code
```

## Executando o projeto

```bash
# No terminal, na raiz do projeto
npm run start

# O Angular CLI local executa: ng serve
# Projeto disponivel em: http://localhost:4200
```

## Estrutura do package.json gerado

```json
{
  "name": "projeto-go-task",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test"
  },
  "dependencies": {
    "@angular/core": "~19.2.0"
  },
  "devDependencies": {
    "@angular/cli": "~19.2.0"
  }
}
```

## Abrindo terminal no VS Code

O instrutor mostra que voce pode abrir o terminal integrado do VS Code:
- Menu: Terminal → New Terminal
- Atalho: Ctrl+` (backtick)
- O terminal abre automaticamente na raiz do projeto