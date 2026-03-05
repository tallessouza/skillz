# Deep Explanation: Configurando o Webpack

## Por que separar a configuracao em arquivo?

O instrutor Rodrigo comeca mostrando que inicialmente o entry point era passado direto no script do package.json: `"build": "webpack ./src/js/index.js"`. Isso funciona para casos simples, mas conforme a configuracao cresce (output, mode, loaders, plugins), o script fica inviavel.

A solucao e criar `webpack.config.js` na raiz. O Webpack automaticamente detecta esse arquivo pelo nome — nao precisa passar flag nenhuma. O instrutor enfatiza: "tem que ser esse nome, porque quando a gente executar o Webpack, ele vai ver que na raiz tem um arquivo de configuracao."

## O papel do `path.resolve` e `__dirname`

O instrutor explica com clareza: cada sistema operacional pode ter uma estrutura de navegacao diferente. No Windows a barra pode ser invertida (`\`), no Linux e Mac e barra normal (`/`).

`__dirname` e uma variavel global do Node.js que retorna o caminho absoluto do diretorio onde o arquivo atual esta. Combinado com `path.resolve()`, ele constroi caminhos absolutos de forma segura independente do OS.

```javascript
// __dirname = '/home/user/project' (Linux)
// __dirname = 'C:\\Users\\user\\project' (Windows)
path.resolve(__dirname, 'src', 'js', 'index.js')
// Linux: '/home/user/project/src/js/index.js'
// Windows: 'C:\\Users\\user\\project\\src\\js\\index.js'
```

O `path` e um modulo nativo do Node — nao precisa instalar nada: `const path = require('path')`.

## Estrutura module.exports

O arquivo usa o padrao CommonJS (`module.exports = {}`). Dentro do objeto, as tres propriedades fundamentais sao:

1. **entry** — arquivo de entrada a partir do qual o Webpack resolve dependencias
2. **output** — objeto com `filename` (nome do bundle) e `path` (pasta de destino)
3. **mode** — `'development'` ou `'production'`

## O warning de mode

O instrutor demonstra ao vivo: ao executar `npm run build` sem definir `mode`, o Webpack emite um warning. Isso porque sem mode definido, o Webpack assume `'production'` por padrao e minifica tudo, o que dificulta debugging em desenvolvimento.

## Output filename e convencoes

O instrutor menciona que `main.js` e uma convencao comum usada por frameworks como React. O nome pode ser qualquer um, mas manter `main.js` facilita a integracao com ferramentas e a compreensao por outros desenvolvedores.

## A pasta dist

O Webpack cria a pasta `dist` automaticamente se ela nao existir. O instrutor mostra que apos rodar `npm run build`, o arquivo `dist/main.js` e gerado com todo o codigo empacotado. O conteudo desse arquivo e gerenciado pelo Webpack — nao e necessario editar ou entender o que esta la dentro.