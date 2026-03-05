# Deep Explanation: Roteamento em Apps Electron

## Por que nao usar React Router DOM diretamente?

O instrutor explica que em uma aplicacao web tradicional, o usuario acessa um endereco e aquela e a unica "janela" dele — todas as rotas vivem dentro de um unico router. No Electron, porem, o metodo `createWindow` pode ser chamado multiplas vezes, criando janelas independentes. Cada janela pode ter sua propria estrutura de paginas e rotas.

Exemplo concreto: a janela principal (`main`) tem rotas como `/` e `/document`, enquanto uma janela de ajustes (`settings`) poderia ter rotas completamente diferentes como `/preferences` e `/about`. Essas instancias de roteamento precisam ser independentes.

## O papel do electron-router-dom

Criado por Dalton Menezes, o `electron-router-dom` resolve exatamente esse problema: permite ter multiplas instancias do React Router DOM dentro da mesma aplicacao Electron, uma para cada janela.

### Como funciona o ID

O ID e o elo entre o main process e o renderer process:

1. No main process, voce cria as rotas (file e URL) passando um ID: `createURLRoute('main', url)`
2. No renderer, o componente `<Router>` recebe props nomeadas com esses mesmos IDs: `<Router main={...} settings={...}>`

Se os IDs nao baterem, o roteamento nao funciona.

## Arquitetura de dois roots

- **createURLRoute**: usado em desenvolvimento, aponta para o dev server (ex: `http://localhost:5173`)
- **createFileRoute**: usado em producao, aponta para o arquivo HTML buildado

Isso substitui o `loadURL` e `loadFile` diretos do BrowserWindow, adicionando a camada de roteamento.

## Estrutura de pastas recomendada

```
src/
├── pages/
│   ├── Blank.tsx
│   └── Document.tsx
├── routes.tsx
└── App.tsx
```

O `routes.tsx` exporta a funcao `Routes` que configura o `Router` do electron-router-dom. O `App.tsx` renderiza `<Routes />` no lugar do conteudo principal.

## Link vs navegacao tradicional

O componente `Link` do react-router-dom funciona normalmente dentro do electron-router-dom — a navegacao e client-side, sem recarregar a janela. Isso e importante porque em Electron nao queremos recarregar a janela inteira ao navegar.