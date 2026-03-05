# Deep Explanation: Configuracao Inicial do Webpack

## Por que CommonJS no webpack.config.js?

O instrutor enfatiza que arquivos de configuracao como `webpack.config.js` rodam no ambiente Node.js, nao no navegador. Por isso, a sintaxe `import/export` (ESM) nao funciona diretamente — e necessario usar `require()` e `module.exports`.

Isso vale para qualquer arquivo que:
- Roda durante o processo de build (nao no browser)
- E executado pelo Node diretamente
- Configura ferramentas de desenvolvimento (webpack, babel, eslint, etc.)

## Por que path.resolve ao inves de caminhos manuais?

O instrutor explica que cada sistema operacional tem convencoes diferentes para separadores de caminho:
- Linux/macOS: `/` (barra)
- Windows: `\` (contrabarra)

Usando `path.resolve(__dirname, "src", "main.js")`, o Node.js resolve automaticamente o caminho correto para o SO em uso. Se voce escrever `"./src/main.js"` manualmente, pode funcionar na sua maquina mas quebrar em outro ambiente.

`__dirname` retorna o diretorio absoluto onde o arquivo de config esta localizado — garantindo que o path seja resolvido a partir da raiz do projeto, independente de onde o comando `npm run build` foi executado.

## Entry point centralizado

O `main.js` dentro de `src/` serve como ponto de entrada unico (entry point). A ideia e que toda a aplicacao parte desse arquivo — imports de modulos, estilos, dependencias, tudo e encadeado a partir daqui. O Webpack segue a arvore de dependencias a partir desse ponto para gerar o bundle final.

## devDependencies vs dependencies

O Webpack e o Webpack CLI sao instalados com `--save-dev` porque:
- So sao necessarios durante o desenvolvimento/build
- Nao sao enviados para producao
- O bundle gerado em `dist/` e o produto final — o Webpack em si nao precisa estar la

## target: "web"

Define que o output sera consumido por um navegador. Isso instrui o Webpack a:
- Nao incluir polyfills de Node.js desnecessarios
- Otimizar para o ambiente browser
- Usar convencoes de carregamento compatíveis com navegadores

## mode: "development" vs "production"

- `development`: builds rapidos, source maps detalhados, sem minificacao
- `production`: minificacao, tree-shaking, otimizacoes de tamanho

O instrutor usa `development` durante o curso. Em deploy real, trocar para `production`.

## Pasta dist nao aparece imediatamente

O instrutor menciona que apos rodar `npm run build`, a pasta `dist/` pode nao aparecer automaticamente no explorador de arquivos da IDE. Basta fazer reload da arvore de arquivos. Isso e um comportamento normal do VS Code e outras IDEs — file watchers nem sempre detectam mudancas externas instantaneamente.