# Deep Explanation: Copy Assets com Webpack

## Por que copy-webpack-plugin existe?

O webpack, por padrao, so processa arquivos que fazem parte do grafo de dependencias — ou seja, arquivos que sao `import`ados ou `require`idos em algum ponto do codigo JavaScript. Assets estaticos referenciados diretamente no HTML (como icones SVG usados via `<img src="./src/assets/icon.svg">`) nao entram nesse grafo.

O copy-webpack-plugin resolve isso copiando pastas/arquivos inteiros para o diretorio de output, independente de serem referenciados no JS.

## Quando usar copy-webpack-plugin vs Asset Modules

### copy-webpack-plugin
- Assets referenciados por path no HTML ou CSS (nao importados no JS)
- Pastas inteiras de assets que precisam manter a estrutura de diretorios
- Arquivos estaticos como `robots.txt`, `favicon.ico`, `manifest.json`
- Icones SVG usados inline no HTML

### Asset Modules (webpack 5 built-in)
- Imagens importadas no JavaScript (`import logo from './logo.png'`)
- Assets que precisam de hash no nome para cache busting
- Arquivos que voce quer inline como data URI abaixo de certo tamanho

## O problema do hot reload com novos diretorios

O instrutor observou que ao rodar o build, a pasta `dist/src/assets` nao apareceu imediatamente no VS Code. Isso acontece porque:

1. O VS Code usa um file watcher que pode ter delay para detectar novos diretorios criados por processos externos
2. Com muitas aplicacoes abertas (OBS, VS Code, browser), o sistema operacional pode demorar para notificar o file watcher
3. A solucao simples: recarregar o explorador de arquivos do VS Code ou clicar no botao de refresh

Isso nao e um bug do plugin — os arquivos foram copiados corretamente. E apenas uma questao de UI do editor.

## Versionamento do plugin

O instrutor usa a versao `@11.0.0` especificamente. Isso e importante porque:
- Versoes major do copy-webpack-plugin podem ter breaking changes na API de configuracao
- A versao 11 e compativel com webpack 5
- Fixar a versao evita surpresas em `npm install` futuro

## A propriedade `patterns`

O `patterns` e um array, permitindo multiplas regras de copia. Cada objeto no array define:
- `from`: diretorio ou arquivo de origem (usar `path.resolve` para paths absolutos)
- `to`: diretorio de destino (tambem com `path.resolve`)

O uso de `path.resolve(__dirname, ...)` garante que os paths funcionem independente de onde o comando npm e executado.

## Estrutura de destino: por que `dist/src/assets`?

O instrutor copiou para `dist/src/assets/` (e nao `dist/assets/`) para manter a mesma estrutura relativa que o HTML espera. Se o HTML referencia `./src/assets/icon.svg`, o arquivo precisa estar em `dist/src/assets/icon.svg` para que o path relativo funcione apos o build.