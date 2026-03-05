# Deep Explanation: Webpack Dev Server

## Por que usar webpack-dev-server?

O webpack por padrao so faz build estatico — voce roda `webpack` e ele gera os arquivos em `dist/`. Para desenvolvimento, isso e ineficiente: cada alteracao exige rebuild manual e refresh no navegador.

O webpack-dev-server resolve isso criando um servidor HTTP local que:
1. Serve os arquivos compilados da memoria (mais rapido que disco)
2. Monitora alteracoes nos arquivos fonte (file watching)
3. Recompila automaticamente quando detecta mudanca
4. Recarrega o navegador via WebSocket

## Anatomia da configuracao devServer

### `static.directory`

```javascript
static: {
  directory: path.join(__dirname, 'dist'),
}
```

Define qual diretorio o servidor vai servir como raiz. Usa `path.join` com `__dirname` para construir caminho absoluto independente de onde o comando e executado.

Antes do webpack-dev-server v4, a propriedade era `contentBase` (string simples). Agora e um objeto `static` com `directory` — mais explicito e extensivel.

### `port: 3000`

Porta onde o servidor escuta. O padrao e 8080, mas o instrutor usa 3000 por convencao com projetos Node.js/Express.

### `open: true`

Abre o navegador automaticamente ao iniciar o servidor. Evita o passo manual de abrir `http://localhost:3000`.

### `liveReload: true`

Faz reload completo da pagina quando arquivos mudam. Diferente de HMR (Hot Module Replacement) que troca modulos sem reload completo.

- **liveReload**: recarrega a pagina inteira — mais simples, funciona com qualquer tipo de arquivo
- **HMR (hot: true)**: substitui modulos em runtime — mais rapido, preserva estado, mas requer suporte no codigo

Para projetos simples com HTML/CSS/JS vanilla, `liveReload: true` e suficiente.

## Por que `--save-dev`?

O webpack-dev-server e ferramenta de desenvolvimento apenas. Em producao, os arquivos ja estao compilados em `dist/`. Salvar como `devDependency` garante que:
- `npm install --production` nao instala o servidor
- O bundle de producao fica menor
- A intencao fica clara no `package.json`

## Por que `webpack serve` e nao `webpack-dev-server`?

Desde webpack 5, o CLI unificou comandos. `webpack serve` e o comando oficial que internamente usa webpack-dev-server. O comando antigo `webpack-dev-server` diretamente esta depreciado.

## Fluxo de compilacao com devServer

```
src/index.js → webpack compila → bundle em memoria → servido via HTTP
                    ↑                                      |
                    |                                      ↓
              file watcher ← detecta mudanca ← browser WebSocket
```

Nota: com devServer, o bundle NAO e escrito em disco na pasta `dist/`. Ele fica em memoria para velocidade. So o `npm run build` gera arquivos fisicos.