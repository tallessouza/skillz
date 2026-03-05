# Deep Explanation: Lendo Dados de Arquivo no Node.js

## O problema fundamental

Quando usamos um banco de dados em memoria (um objeto JavaScript), todos os dados sao perdidos ao reiniciar o processo. A solucao e criar um ciclo de persistencia:

```
Memoria (objeto JS) → Arquivo (JSON string) → Memoria (objeto JS)
         ESCRITA via stringify        LEITURA via parse
```

## Por que hidratar no construtor?

O instrutor destaca que o `select` sempre le da memoria. Isso significa que o fluxo e:

1. App inicia → construtor executa
2. Construtor le arquivo → popula `#database`
3. Usuario faz request → `select` retorna dados da memoria
4. Usuario insere dados → `insert` atualiza memoria + persiste em arquivo

Se nao hidratarmos no construtor, o primeiro `select` retorna vazio mesmo com dados salvos no arquivo.

## A simetria stringify/parse

O instrutor enfatiza o processo inverso:

- **Escrita (persist):** `JSON.stringify(objeto)` → transforma objeto em texto → salva no arquivo
- **Leitura (load):** `JSON.parse(texto)` → transforma texto em objeto → popula a memoria

Essa simetria e fundamental. Se voce muda o formato de escrita, deve mudar o formato de leitura.

## Por que UTF-8?

O parametro `'utf8'` no `readFile` define o encoding dos caracteres. Sem ele, o Node.js retorna um `Buffer` (dados binarios), nao uma string. O `JSON.parse` precisa de uma string como input.

UTF-8 e o padrao da web e cobre todos os caracteres comuns (incluindo acentos em portugues).

## O papel do catch

O instrutor adiciona um `.catch()` ao `readFile` por uma razao pratica: na primeira execucao, o arquivo `db.json` pode nao existir. Sem o catch, o processo quebraria com um erro de arquivo nao encontrado.

A estrategia e: se der erro na leitura, chame `#persist()` para criar o arquivo com o estado atual (vazio). Assim, na proxima execucao, o arquivo ja existira.

## Assincrono vs Sincrono

O instrutor usa `readFile` (assincrono) com `.then()`, nao `readFileSync`. Isso significa que existe uma janela de tempo entre o construtor iniciar e os dados serem carregados. Em aplicacoes HTTP, isso raramente e problema porque o servidor demora mais para receber a primeira request do que o arquivo demora para ser lido.

## Demonstracao de persistencia

O instrutor demonstra o ciclo completo:
1. Insere dados via API
2. Para o servidor (Ctrl+C)
3. Reinicia o servidor
4. Faz GET e os dados continuam la

Isso prova que tanto a escrita (persist) quanto a leitura (load) estao funcionando corretamente.