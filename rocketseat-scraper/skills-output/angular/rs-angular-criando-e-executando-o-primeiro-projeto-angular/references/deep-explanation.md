# Deep Explanation: Criando e Executando Projeto Angular

## A dualidade do Angular CLI (global vs local)

O instrutor enfatiza que este e um detalhe facil de esquecer e vale anotar. Quando voce instala o Angular CLI globalmente (`npm install -g @angular/cli`), os comandos `ng` ficam disponiveis direto no terminal. Porem, todo projeto Angular tambem traz o `@angular/cli` como dependencia local no `node_modules/`.

Isso significa que existem **dois Angular CLIs** na sua maquina quando voce trabalha num projeto:

1. **Global** — usado quando voce digita `ng serve` direto no terminal
2. **Local** — usado quando voce roda `npm run start`, que executa o `ng serve` listado nos scripts do `package.json`

A diferenca pratica: o CLI global usa a versao instalada na sua maquina. O CLI local usa a versao especificada no `package.json` do projeto. Em equipes, isso garante que todos usem a mesma versao.

## Por que npx e mais seguro que ng new direto

O instrutor comeca mostrando `ng new` mas depois muda para `npx @angular/cli@19 new` — e explica que isso garante a versao exata. Se voce tem CLI global na versao 18 mas quer criar um projeto na 19, o `ng new` criaria na 18. O `npx` baixa temporariamente a versao especificada, executa o comando, e descarta.

## Os scripts do package.json

O instrutor destaca que os comandos em `scripts` do `package.json` (`start`, `build`, `test`) sao apenas aliases para comandos do Angular CLI local:

```json
{
  "scripts": {
    "start": "ng serve",
    "build": "ng build",
    "test": "ng test"
  }
}
```

Esses comandos sao executados com `npm run <nome>`. O `npm run start` e equivalente a rodar `ng serve` do CLI local. Isso e um padrao do npm, nao do Angular — qualquer projeto Node pode ter scripts customizados.

## Template inicial do AppComponent

Ao criar o projeto, o Angular gera um `AppComponent` com um template padrao (pagina de boas-vindas). O instrutor mostra que e so substituir o conteudo por um simples `<h1>Ola, mundo!</h1>` para comecar a trabalhar. O hot-reload do `ng serve` atualiza automaticamente no navegador.

## Flags do ng new

O instrutor menciona que quando voce nao passa flags como `--ssr` e `--style`, o CLI pode perguntar interativamente. Porem, para algumas pessoas ele nao pergunta (comportamento inconsistente). Por seguranca, sempre passe as flags explicitamente.