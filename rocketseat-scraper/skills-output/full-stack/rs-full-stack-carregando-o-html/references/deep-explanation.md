# Deep Explanation: Carregando o HTML no Webpack

## Por que o HTML nao entra na build por padrao?

O Webpack e fundamentalmente um **bundler de JavaScript**. Seu ponto de entrada (`entry`) e um arquivo JS, e ele resolve dependencias a partir dele. O HTML nao faz parte dessa arvore de dependencias JavaScript, entao o Webpack simplesmente o ignora.

Quando voce executa o DevServer sem o HTML-Webpack-Plugin, o resultado e apenas o bundle JS sendo servido — sem nenhuma pagina HTML para renderizar conteudo visual.

## O que o HTML-Webpack-Plugin faz

1. **Pega um template HTML** — o arquivo `index.html` do seu projeto
2. **Gera um novo HTML na pasta `dist`** — processado e otimizado
3. **Injeta automaticamente as tags `<script>`** — apontando para os bundles gerados pelo Webpack
4. **Gerencia hashes automaticamente** — se voce usar `[contenthash]` no output, o plugin atualiza as referencias

Sem o plugin, voce teria que manualmente criar um HTML na `dist` e apontar para o bundle correto — fragil e propenso a erros.

## A propriedade `template`

```javascript
new HtmlWebpackPlugin({
  template: path.resolve(__dirname, "index.html"),
})
```

`path.resolve(__dirname, "index.html")` garante um caminho absoluto, independente de onde o comando e executado. Isso evita problemas em ambientes CI/CD ou execucoes de diretorios diferentes.

## Plugins como array

A propriedade `plugins` no Webpack e um array porque voce pode (e vai) adicionar multiplos plugins:

```javascript
plugins: [
  new HtmlWebpackPlugin({ template: "..." }),
  // Futuramente: MiniCssExtractPlugin, CopyWebpackPlugin, etc.
]
```

Cada plugin e uma instancia (`new`) que recebe um objeto de configuracao.

## Sequencia tipica de configuracao Webpack

1. Entry + Output (JS bundling) ← ja feito
2. DevServer ← ja feito
3. **HTML-Webpack-Plugin** ← esta aula
4. CSS loaders (css-loader, style-loader ou MiniCssExtractPlugin) ← proximas aulas
5. Asset loaders (imagens, fontes)
6. Otimizacoes de producao

## Comportamento do VS Code

O instrutor menciona que as vezes o VS Code nao atualiza a arvore de arquivos imediatamente apos o build gerar novos arquivos. Isso e um comportamento conhecido — o file watcher pode ter um pequeno delay. Solucao: clicar no botao de reload do explorer ou usar `Ctrl+Shift+P` > "Refresh Explorer".

## Versao do plugin

A versao `5.6.0` do html-webpack-plugin e compativel com Webpack 5. Se usar Webpack 4, seria necessario `html-webpack-plugin@4.x`. Sempre verificar compatibilidade de versao major entre plugin e Webpack.