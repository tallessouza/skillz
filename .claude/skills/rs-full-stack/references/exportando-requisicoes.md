---
name: rs-full-stack-exportando-requisicoes
description: "Applies Insomnia export/import workflow when user asks to 'export requests', 'save Insomnia collection', 'import API requests', 'share Insomnia workspace', or 'backup API routes'. Guides through exporting collections as JSON and importing them back. Make sure to use this skill whenever working with Insomnia request management or API collection sharing. Not for creating new requests, configuring environments, or writing API code."
---

# Exportando e Importando Requisicoes no Insomnia

> Exporte colecoes do Insomnia como JSON e versione junto ao projeto para documentacao viva das rotas da API.

## Prerequisites

- Insomnia instalado com colecao de requisicoes criada
- Projeto com repositorio Git (para versionar o arquivo exportado)

## Steps

### Step 1: Exportar a colecao

1. Abrir o Insomnia e selecionar a colecao/projeto
2. Clicar no menu da colecao → **Export**
3. Manter todas as requisicoes marcadas (ou desmarcar as desnecessarias)
4. Clicar em **Export** → **Done**
5. Salvar na raiz do projeto como `requests_insomnia.json`

### Step 2: Versionar o arquivo

```bash
git add requests_insomnia.json
git commit -m "docs: add Insomnia requests export"
```

### Step 3: Importar em outro Insomnia

1. Abrir Insomnia → botao **Create** → **Import**
2. Arrastar o arquivo JSON ou clicar para selecionar `requests_insomnia.json`
3. Clicar em **Scan** para visualizar o conteudo
4. Clicar em **Import** para restaurar todas as requisicoes

## Output format

Arquivo `requests_insomnia.json` na raiz do projeto contendo todas as requisicoes em formato JSON do Insomnia.

## Error handling

- Se o arquivo JSON estiver corrompido, re-exportar a partir do Insomnia original
- Se a importacao nao mostrar requisicoes, verificar se o formato e compativel com a versao do Insomnia

## Verification

- Abrir o Insomnia apos importacao e confirmar que todas as requisicoes estao presentes
- Testar pelo menos uma requisicao para validar que URLs e bodies estao corretos

## Heuristics

| Situacao | Acao |
|----------|------|
| Projeto novo com API existente | Exportar e commitar o JSON junto ao projeto |
| Mudou de maquina | Importar o JSON no novo Insomnia |
| Compartilhar com colega | Enviar o JSON exportado |
| Esqueceu como fez uma requisicao | Consultar o JSON exportado ou reimportar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre por que versionar requisicoes
- [code-examples.md](references/code-examples.md) — Exemplo do JSON exportado e variações de uso

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-exportando-requisicoes/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-exportando-requisicoes/references/code-examples.md)
