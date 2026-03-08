---
name: 2023-entendendo-streams-no-node
description: "Processes data incrementally using Node.js Readable and Writable Streams with pipe and backpressure management, avoiding loading entire payloads into memory. Use when user asks to 'stream data', 'process large files', 'handle file uploads', 'pipe readable to writable', or 'avoid memory issues with large data'. Make sure to use this skill whenever handling large file uploads, CSV imports, media streaming, or any I/O operation where data should be processed in chunks. Not for small JSON responses, frontend fetch API, or message queue consumers."
category: reference
tags: [buffers, streams]
mind_lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: fundamentos-nodejs
  tags: [streams, readable, writable, pipe, backpressure, nodejs, performance]
---

# Streams no Node.js

> Processe dados incrementalmente usando Streams — nunca carregue payloads inteiros em memoria quando os dados podem ser lidos ou escritos aos poucos.

## Conceito central

Streams permitem ler e processar dados em pequenas partes (chunks) antes de receber o conteudo completo. Isso e o que fez o Node.js se destacar como tecnologia — resolver problemas de processamento de grandes volumes com simplicidade e performance.

## Dois tipos fundamentais

| Tipo | Direcao | Exemplo |
|------|---------|---------|
| **Readable Stream** | Dados chegando ao servidor | Upload de CSV, request body, leitura de arquivo |
| **Writable Stream** | Dados saindo do servidor | Streaming de video/audio, response body, escrita em arquivo |

## Decision framework

| Situacao | Abordagem |
|----------|-----------|
| Arquivo > 10MB sendo enviado pelo usuario | Readable Stream — processe chunks enquanto upload acontece |
| Enviar video/audio para o cliente | Writable Stream — envie pedacos incrementalmente |
| Importacao de CSV com milhares de linhas | Readable Stream — insira no banco a cada chunk recebido |
| Response body pequeno (JSON simples) | Stream nao necessaria — resposta direta e suficiente |
| Arquivo cabe inteiro em memoria sem impacto | Stream opcional — avalie se a complexidade compensa |

## Rules

1. **Nunca bufferize payloads grandes** — se o arquivo pode ter mais de alguns MB, use Stream, porque esperar o upload completo desperdiça tempo e memoria
2. **Processe durante o recebimento** — a cada chunk recebido de uma Readable Stream, execute a operacao (insert no banco, transformacao), porque isso reduz latencia total drasticamente
3. **Use Writable Streams para respostas grandes** — envie dados ao cliente incrementalmente, porque o cliente pode comecar a consumir antes do processamento terminar
4. **Pipe conecta Readable a Writable** — use `.pipe()` ou `pipeline()` para conectar streams, porque gerencia backpressure automaticamente

## Exemplo: O problema sem Streams

**Sem Streams (upload de 1GB CSV):**
```
Usuario faz upload (1GB, ~100s) → Node espera TODO arquivo → Le arquivo → Insere no banco
Tempo total: 100s upload + tempo de processamento
```

**Com Streams:**
```
Usuario faz upload → A cada chunk (~10MB/s) Node ja processa → Insere ~10k linhas/chunk
Tempo total: upload e processamento acontecem em PARALELO
```

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `const file = await readFile('large.csv')` para arquivos grandes | `const stream = createReadStream('large.csv')` |
| Esperar upload completo para processar | Processar chunks via Readable Stream da request |
| Carregar 1GB em memoria para enviar ao cliente | Writable Stream enviando chunks incrementalmente |
| Ignorar backpressure ao escrever rapido demais | Usar `pipeline()` que gerencia backpressure |

## Heuristics

| Situacao | Acao |
|----------|------|
| Importacao de dados (CSV, XML, JSON grande) | Readable Stream obrigatoria |
| Streaming de midia (audio, video) | Writable Stream obrigatoria |
| Processamento de logs em tempo real | Readable Stream + Transform Stream |
| API retornando lista com milhoes de registros | Stream a response ao inves de JSON.stringify tudo |
| Arquivo < 1MB em servidor com memoria sobrando | Stream opcional, avalie simplicidade vs performance |

## Troubleshooting

### Writable stream para de receber dados sem erro aparente
**Symptom:** A stream de escrita para de processar chunks sem emitir erro ou encerrar
**Cause:** Backpressure — o writable nao consegue consumir na velocidade que o readable envia, e o buffer interno encheu
**Fix:** Use `pipeline()` ou `.pipe()` que gerenciam backpressure automaticamente ao inves de `write()` manual

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
