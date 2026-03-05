# Deep Explanation: Como Incluir CSS no Webpack

## Por que importar CSS via JavaScript?

O Webpack funciona a partir de um grafo de dependencias. Ele comeca pelo entry point (ex: `src/index.js`) e segue todos os `import` para descobrir o que precisa empacotar. Se voce linkar o CSS direto no HTML com `<link>`, o Webpack nao sabe que esse arquivo existe — ele fica fora do grafo.

Ao fazer `import './css/styles.css'` dentro do JavaScript, voce diz ao Webpack: "esse CSS e uma dependencia do meu app". Assim ele inclui no bundle.

## O que cada loader faz

### css-loader
Interpreta arquivos `.css` e resolve `@import` e `url()` dentro do CSS. Transforma o conteudo CSS em um modulo JavaScript que exporta uma string com o CSS.

### style-loader
Pega a string CSS que o `css-loader` produziu e injeta no DOM criando uma tag `<style>` no `<head>` da pagina. Por isso o CSS funciona mesmo sem um arquivo `.css` na pasta `dist`.

## Por que a ordem e invertida no array `use`?

O Webpack processa loaders de **tras pra frente** no array. Entao:

```javascript
use: ["style-loader", "css-loader"]
```

Executa: `css-loader` primeiro (le o arquivo CSS) → `style-loader` depois (injeta no DOM).

Se voce inverter, o `style-loader` recebe o arquivo CSS bruto sem ter sido interpretado pelo `css-loader`, e o build falha.

## O CSS nao gera arquivo separado

Como o instrutor destaca: "nao tem o arquivo css aqui, nao tem porque ta empacotado dentro do javascript". O `style-loader` embute o CSS no bundle JS. Em runtime, o JavaScript cria dinamicamente uma tag `<style>` com o conteudo CSS.

Para extrair CSS em arquivo separado (melhor para producao), use `mini-css-extract-plugin` no lugar do `style-loader`.

## A propriedade `module.rules`

O `module` no webpack.config.js define como diferentes tipos de arquivo devem ser tratados. O `rules` e um array onde cada regra tem:

- `test`: regex que identifica o tipo de arquivo
- `use`: array de loaders a aplicar
- `exclude` (opcional): pastas a ignorar

Voce pode ter multiplas regras no array para diferentes tipos: CSS, imagens, fontes, TypeScript, etc.

## O flag `i` na regex

```javascript
test: /\.css$/i
```

O `i` torna case-insensitive, entao tanto `.css` quanto `.CSS` sao capturados. E uma boa pratica defensiva.

## Por que excluir node_modules?

A pasta `node_modules` contem codigo de terceiros. Processar CSS de la pode:
1. Aumentar o tempo de build desnecessariamente
2. Causar conflitos com CSS que nao foi feito pra ser processado por seus loaders
3. Incluir estilos que voce nao quer no bundle

Se voce precisar de CSS de uma lib (ex: normalize.css), crie uma regra separada sem exclude para aquele caso especifico.

## Erro comum: "Module parse failed"

Quando voce importa um `.css` sem ter os loaders configurados, o Webpack tenta interpretar o CSS como JavaScript e falha com "Module parse failed". A solucao e sempre instalar e configurar `css-loader` + `style-loader`.