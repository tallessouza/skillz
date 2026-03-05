# Deep Explanation: Estrutura do Projeto Angular

## Analogia do instrutor

O instrutor usa a metafora de "bicho de sete cabeças" para descrever a reacao inicial dos alunos ao verem tantos arquivos. A mensagem central e: **cada arquivo tem um dono e um proposito claro**, e voce nao precisa mexer na maioria deles no dia-a-dia.

## angular.json — O coracao da aplicacao

O instrutor enfatiza que este arquivo "assusta" mas e essencialmente um arquivo de **configuracoes** usado pelo Angular CLI. Cada comando do CLI (`ng serve`, `ng build`, `ng test`) consulta este arquivo para saber como executar.

Configuracoes disponiveis:
- **Schematics** — Define como `ng generate component` cria componentes (tipo de stylesheet, inline template, criacao automatica de spec files)
- **Assets** — A pasta `public/` e configurada aqui como fonte de assets estaticos
- **Build** — Configuracoes de build de producao e desenvolvimento
- **Serve** — Configuracoes do servidor de desenvolvimento
- **Environments** — Variaveis de ambiente por target (dev, prod)
- **Test** — Configuracoes de testes unitarios

Exemplo pratico do instrutor: ao rodar `ng generate component teste-comp`, o CLI consulta os schematics em `angular.json` para decidir:
- Qual tipo de stylesheet usar (CSS, SCSS, etc)
- Se usa inline template
- Se cria arquivo `.spec.ts` automaticamente

## package.json — Tres niveis de entendimento

### Nivel 1: Scripts
Os scripts sao aliases para comandos do Angular CLI local:
```json
{
  "start": "ng serve",
  "build": "ng build",
  "test": "ng test"
}
```

Ponto critico do instrutor: **o `ng` executado e o local** (`node_modules/.bin/ng`), nao o instalado globalmente. Isso garante que todos no time usem a mesma versao.

### Nivel 2: dependencies vs devDependencies
O instrutor usa exemplos concretos:
- **TypeScript em devDependencies** — O navegador nao entende TypeScript, entao o codigo do compilador nao precisa estar no bundle final
- **Karma em devDependencies** — Testes unitarios so rodam em desenvolvimento

### Nivel 3: package-lock.json
Rastreia versoes exatas de **todas** as dependencias, incluindo dependencias transitivas (dependencias das dependencias). Exemplo do instrutor: RxJS provavelmente depende de outras bibliotecas, e o lock file registra as versoes exatas de todas elas.

## src/ — Onde o codigo vive

### index.html e o seletor app-root
O `index.html` carrega `<app-root>`, que e o seletor do `AppComponent`. Este e sempre o componente base que carrega todos os outros. O instrutor nota que "geralmente nao mexemos nesse arquivo".

### styles.css — Escopo global
O instrutor demonstra que qualquer classe definida em `styles.css` estara disponivel em **todos** os componentes. Isso contrasta com os arquivos `.component.css` que sao escopados.

### Anatomia de um componente (app.component.ts)
```typescript
@Component({
  selector: 'app-root',          // Tag HTML usada no index.html
  imports: [],                     // Dependencias do componente
  templateUrl: './app.component.html',  // Arquivo de template
  styleUrl: './app.component.css'       // Folha de estilo escopada
})
export class AppComponent {
  // Propriedades e metodos acessiveis no template
}
```

### app.config.ts e app.routes.ts
Arquivos de configuracao global da aplicacao. `app.config.ts` define providers (HttpClient, rotas, etc). `app.routes.ts` configura o roteamento.

## Pastas que nao se edita

O instrutor e enfatico: **nunca altere arquivos dentro de `node_modules` manualmente**. Se algo quebrar, delete a pasta e rode `npm install` novamente. O mesmo vale para `.angular/` (cache interno).

## Sobre o .gitignore
O instrutor explica que `node_modules` pode ter 200-300MB, entao nunca deve ser commitada. O `.gitignore` lista tudo que o Git deve ignorar.