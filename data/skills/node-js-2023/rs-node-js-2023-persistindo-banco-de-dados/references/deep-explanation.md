# Deep Explanation: Persistindo Banco de Dados

## Por que fs/promises e nao fs?

O modulo `fs` tradicional usa o padrao de callbacks — voce passa uma funcao como parametro para saber quando a operacao terminou. O `fs/promises` permite usar `.then()/.catch()` e `async/await`, que e o padrao moderno de assincronismo em JavaScript.

A unica limitacao: `fs/promises` nao tem metodos de streaming (`createReadStream`, `createWriteStream`). Se precisar ler ou escrever arquivos por partes (streaming), use o `fs` tradicional.

## O problema dos caminhos relativos

Quando voce escreve `fs.writeFile('db.json', ...)`, o Node resolve esse caminho relativo ao **diretorio onde voce executou o comando**, nao ao diretorio onde o arquivo `.js` esta.

Exemplo pratico do instrutor:
- Arquivo `database.js` esta em `src/`
- Se executa `node src/server.js` da raiz → `db.json` e criado na raiz
- Se executa `node server.js` de dentro de `src/` → `db.json` e criado em `src/`

Isso causa bugs silenciosos: o arquivo e criado em lugares diferentes dependendo de onde voce esta no terminal.

## import.meta.url — a solucao ESM

Em projetos com `"type": "module"` no package.json, as variaveis `__dirname` e `__filename` do CommonJS nao existem. A alternativa moderna e `import.meta.url`, que retorna o caminho completo do arquivo atual como URL:

```
file:///home/user/project/src/database.js
```

## O construtor URL como navegador de caminhos

O instrutor faz uma analogia excelente: **o construtor URL funciona como o comando `cd` no terminal**.

```javascript
new URL('../db.json', import.meta.url)
```

E como se voce estivesse no diretorio do arquivo atual e executasse `cd ../db.json`. O `..` sobe uma pasta, e `db.json` e o destino.

O resultado e um objeto URL com a propriedade `pathname` contendo o caminho absoluto. O `fs.writeFile` aceita esse objeto URL diretamente.

## Padrao de inicializacao com constructor

O constructor da classe faz duas coisas:
1. Tenta ler o arquivo existente com `readFile`
2. Se o arquivo nao existe (`.catch`), chama `persist()` para criar o arquivo vazio

Isso garante que o arquivo sempre existe apos a instanciacao, evitando erros futuros de leitura.

## Por que JSON e nao outro formato?

O instrutor explica que como os dados sao objetos JavaScript nativos, JSON e a escolha natural:
- `JSON.stringify()` converte objeto → string (para escrita)
- `JSON.parse()` converte string → objeto (para leitura)
- `writeFile` so aceita strings, entao a conversao e obrigatoria

## readFile precisa de encoding

Ao chamar `fs.readFile(path, 'utf8')`, o segundo parametro `'utf8'` e importante. Sem ele, o readFile retorna um Buffer (bytes brutos) em vez de uma string, e `JSON.parse` nao consegue processar um Buffer diretamente.