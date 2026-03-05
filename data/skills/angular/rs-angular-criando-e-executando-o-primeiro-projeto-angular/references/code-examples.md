# Code Examples: Criando e Executando Projeto Angular

## Exemplo 1: Criacao com CLI global

```bash
# Verificar versao do CLI instalado
ng version
# Angular CLI: 19.2.4

# Criar projeto
ng new meu-primeiro-projeto --ssr=false --style=css
```

## Exemplo 2: Criacao com npx (versao especifica)

```bash
# Baixa temporariamente @angular/cli@19 e executa ng new
npx @angular/cli@19 new meu-primeiro-projeto --ssr=false --style=css
```

Saida esperada: criacao dos arquivos do projeto + instalacao de dependencias via npm.

## Exemplo 3: Abrir projeto no VSCode via terminal

```bash
cd meu-primeiro-projeto
code .
```

## Exemplo 4: Executar o projeto

**Opcao A — CLI global:**
```bash
ng serve
```

**Opcao B — npm scripts (CLI local):**
```bash
npm run start
```

Ambos resultam em:
```
Application bundle generation complete.
Watch mode enabled. Watching for file changes...

  ➜  Local:   http://localhost:4200/
```

## Exemplo 5: Estrutura do package.json gerado

```json
{
  "name": "meu-primeiro-projeto",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "test": "ng test"
  },
  "dependencies": {
    "@angular/core": "^19.0.0",
    "@angular/common": "^19.0.0"
  },
  "devDependencies": {
    "@angular/cli": "^19.0.0",
    "@angular/compiler-cli": "^19.0.0"
  }
}
```

## Exemplo 6: Primeiro componente modificado

```typescript
// app.component.ts — template inline simplificado
@Component({
  selector: 'app-root',
  template: '<h1>Olá, mundo!</h1>',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
```

## Exemplo 7: Consultar documentacao das flags

Acessar `https://angular.dev` → Reference → CLI Reference → ng new

Flags mais uteis:
```bash
ng new projeto --ssr=false      # Sem server-side rendering
ng new projeto --style=css      # CSS puro (alternativas: scss, sass, less)
ng new projeto --routing=true   # Ja configura Angular Router
ng new projeto --prefix=app     # Prefixo dos seletores de componente
```