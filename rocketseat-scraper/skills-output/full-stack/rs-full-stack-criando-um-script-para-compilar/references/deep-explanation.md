# Deep Explanation: Scripts Personalizados no package.json

## Por que scripts existem

O problema fundamental: pacotes instalados via npm ficam dentro de `node_modules/.bin/`. Para executar o Babel manualmente, voce precisaria digitar:

```bash
./node_modules/.bin/babel main.js --out-dir ./dist
```

Isso e improdutivo por tres razoes:
1. **Comando longo** — facil de errar, chato de digitar
2. **Nao padronizado** — cada dev pode digitar diferente
3. **Nao documentado** — ninguem sabe quais flags usar

## Como o npm resolve pacotes nos scripts

Quando voce coloca um comando dentro de `"scripts"` no package.json, o npm adiciona `./node_modules/.bin/` ao PATH automaticamente. Por isso:

- Dentro de scripts: `babel main.js` funciona
- Fora de scripts: `babel main.js` nao funciona (precisa do path completo)

Essa resolucao automatica e uma das grandes vantagens de usar o gerenciador de pacotes.

## A propriedade "scripts" no package.json

O `scripts` e um objeto onde cada propriedade e um script nomeado:

```json
{
  "scripts": {
    "build": "babel main.js --out-dir ./dist",
    "dev": "nodemon server.js",
    "test": "jest"
  }
}
```

### Convencao de posicionamento

O instrutor posiciona `scripts` antes de `devDependencies`. Isso faz sentido porque scripts sao a "interface publica" do projeto — o primeiro lugar onde um desenvolvedor olha para saber como usar o projeto.

## O padrao `npm run <nome>`

- `npm run build` — executa o script "build"
- `npm run dev` — executa o script "dev"
- Excecoes: `npm test` e `npm start` funcionam sem `run` (atalhos do npm)

## Anatomia do script de build

```
"build": "babel main.js --out-dir ./dist"
         |      |         |        |
         |      |         |        └── pasta de saida
         |      |         └── flag para definir diretorio de output
         |      └── arquivo de entrada
         └── pacote a executar (resolvido de node_modules)
```

### O flag `--out-dir`

- Abreviacao: `-d`
- Funcao: define em qual pasta o arquivo compilado sera salvo
- Se a pasta nao existe, o Babel cria automaticamente

## Aplicabilidade geral

O conceito de scripts personalizados se aplica a qualquer pacote, nao apenas ao Babel. Exemplos comuns:

- **TypeScript:** `"build": "tsc"`
- **ESLint:** `"lint": "eslint src/"`
- **Jest:** `"test": "jest --coverage"`
- **Nodemon:** `"dev": "nodemon server.js"`

O padrao e sempre o mesmo: nome semantico + comando com flags.

## Fluxo mental do instrutor

1. Problema: comando longo e repetitivo no terminal
2. Solucao: encapsular em um script nomeado
3. Beneficio: `npm run build` substitui todo o comando
4. Generalizacao: funciona com qualquer pacote, nao so Babel