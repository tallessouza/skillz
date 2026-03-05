# Code Examples: Automatizando Build com Babel Watch

## Exemplo 1: package.json sem watch (antes)

```json
{
  "scripts": {
    "build": "babel src/main.js --out-dir dist"
  }
}
```

Comportamento: executa uma vez e encerra. Precisa rodar `npm run build` a cada alteracao.

## Exemplo 2: package.json com watch (depois)

```json
{
  "scripts": {
    "build": "babel src/main.js --out-dir dist --watch"
  }
}
```

Comportamento: executa e fica observando. Recompila automaticamente a cada save.

## Exemplo 3: Watch com diretorio inteiro

```json
{
  "scripts": {
    "build": "babel src/ --out-dir dist --watch"
  }
}
```

Util quando ha multiplos arquivos em `src/`. O Babel observa todos.

## Exemplo 4: Scripts separados para build e dev

```json
{
  "scripts": {
    "build": "babel src/ --out-dir dist",
    "dev": "babel src/ --out-dir dist --watch"
  }
}
```

Variacao util: `npm run build` para producao (one-shot), `npm run dev` para desenvolvimento (watch).

## Exemplo 5: HTML referenciando o dist

```html
<!DOCTYPE html>
<html>
<head>
  <title>App</title>
</head>
<body>
  <!-- Referencia o codigo COMPILADO, nao o fonte -->
  <script src="dist/main.js"></script>
</body>
</html>
```

## Saida do terminal ao executar com watch

```bash
$ npm run build

> project@1.0.0 build
> babel src/main.js --out-dir dist --watch

Successfully compiled 1 file with Babel.
The watcher is ready.
```

Apos salvar uma alteracao no `src/main.js`:

```
Successfully compiled 1 file with Babel.
```

## Encerrando o watcher

```bash
# No terminal onde o watcher esta rodando:
# Pressione Ctrl+C

^C
$  # Terminal volta ao estado normal
```