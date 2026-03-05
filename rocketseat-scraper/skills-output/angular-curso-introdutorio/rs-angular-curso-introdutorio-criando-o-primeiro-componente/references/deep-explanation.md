# Deep Explanation: Criando o Primeiro Componente Angular

## Por que usar o CLI e nao criar manualmente?

O instrutor enfatiza que o comando `ng g c` (abreviacao de `ng generate component`) cria automaticamente os tres arquivos essenciais e ja configura o decorator `@Component` com as referencias corretas. Isso elimina erros de digitacao em paths e garante que o selector siga o padrao do projeto (prefixo configurado em `angular.json`).

## A logica do underline prefix em `_components/`

O instrutor cria a pasta com `_` (underline) no inicio do nome. A razao explicita: manter as pastas customizadas no topo da listagem alfabetica dentro de `app/`. Isso e uma convencao de organizacao visual, nao uma exigencia do framework.

## Os 3 arquivos de um componente

O Angular CLI gera por padrao 4 arquivos (HTML, TS, CSS, spec.ts). O instrutor ignora o `.spec.ts` com `--skip-tests` porque testes nao sao o foco da aula. Os tres arquivos core sao:

1. **HTML (`navbar.component.html`)** — Template visual. Contem o que o usuario ve. Vem com um paragrafo padrao `<p>navbar works!</p>` para validacao rapida.

2. **TypeScript (`navbar.component.ts`)** — Logica e metadados. O decorator `@Component` define:
   - `selector`: a tag HTML para usar o componente (ex: `app-navbar`)
   - `imports`: array de dependencias do componente
   - `templateUrl`: caminho para o arquivo HTML
   - `styleUrl`: caminho para o arquivo CSS
   - A classe exportada e onde fica a logica JavaScript do componente

3. **CSS (`navbar.component.css`)** — Estilos isolados. Vem vazio por padrao. Estilos aqui se aplicam APENAS a este componente (encapsulamento do Angular).

## O fluxo de renderizacao

O instrutor explica a cadeia completa:
1. `main.ts` faz bootstrap de `AppComponent` — este e o componente de entrada
2. `app.component.html` e o template raiz — tudo que o usuario ve passa por aqui
3. Para exibir um componente filho, adicione sua tag selector no HTML do pai
4. O Angular resolve o selector e renderiza o template do componente filho

## Hot reload com `ng serve`

O instrutor demonstra que ao salvar qualquer arquivo com `ng serve` rodando, a aplicacao atualiza automaticamente no navegador. Nao e necessario recarregar manualmente.

## Abreviacoes do CLI

| Comando completo | Abreviacao |
|-----------------|------------|
| `ng generate component` | `ng g c` |
| `ng generate` | `ng g` |
| `component` | `c` |

O instrutor recomenda usar as abreviacoes por praticidade.