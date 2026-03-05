# Deep Explanation: HtmlWebpackPlugin

## Por que o Webpack nao inclui HTML por padrao?

O Webpack foi criado como um **bundler de JavaScript**. Ele resolve o grafo de dependencias a partir de um entry point JS. HTML nao faz parte desse grafo — e um arquivo estatico que referencia o JS, nao o contrario. Por isso, incluir HTML no bundle requer um plugin separado.

## Por que usar `require()` e nao `import`?

O arquivo `webpack.config.js` e executado diretamente pelo Node.js. Ate versoes recentes do Node (sem `"type": "module"` no package.json), o sistema de modulos padrao e CommonJS (`require`/`module.exports`). Mesmo que o codigo da aplicacao use ES Modules (`import`/`export`), a configuracao do Webpack roda em contexto Node — entao deve usar a sintaxe que o Node entende nativamente.

O instrutor enfatiza: "a gente tem que usar essa maneira de importacao pro Node, porque a gente esta usando aqui o ambiente Node pra executar esses pacotes."

## Como o plugin funciona internamente

1. O Webpack executa o build normalmente, gerando os bundles JS
2. O HtmlWebpackPlugin intercepta o final do processo de compilacao
3. Ele gera (ou usa um template existente de) um arquivo HTML
4. Injeta tags `<script>` apontando para os bundles gerados
5. Coloca o HTML resultante na pasta de output (`dist/`)

Isso significa que o HTML source original **nao precisa ter nenhuma tag script**. O plugin cuida de toda a conexao entre HTML e JS.

## O array `plugins` no Webpack

A propriedade `plugins` no webpack.config.js e um array que aceita instancias de plugins. Cada plugin e uma classe que deve ser instanciada com `new`. O Webpack chama metodos especificos dessas instancias em diferentes fases do processo de build (hooks).

```javascript
plugins: [
  new HtmlWebpackPlugin(),    // Pode ter varios plugins
  new OutroPlugin(),
]
```

## Vantagem da injecao automatica

O instrutor destaca: "No nosso index.html aqui, ele nao tem conexao com o JavaScript, mas o proprio Webpack ja fez isso." Isso e uma vantagem porque:

- **Sem erros de path** — o plugin sabe exatamente o nome do bundle gerado
- **Compativel com hash no filename** — se usar `[contenthash]`, o plugin atualiza a referencia automaticamente
- **Menos manutencao manual** — nao precisa lembrar de atualizar o HTML quando muda o build