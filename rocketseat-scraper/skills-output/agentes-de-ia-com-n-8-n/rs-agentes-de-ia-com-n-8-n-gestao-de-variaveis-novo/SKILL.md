---
name: rs-agentes-ia-n8n-gestao-variaveis
description: "Applies n8n variable management patterns when building automation workflows. Use when user asks to 'connect nodes', 'pass data between nodes', 'map variables', 'use Edit Fields', 'reference previous nodes', or 'extract specific fields' in n8n. Enforces input-processing-output discipline, $JSON references, and Edit Fields (Set) node usage. Make sure to use this skill whenever creating or debugging n8n workflows that pass data between nodes. Not for HTTP request configuration, webhook setup, or n8n installation."
---

# Gestao de Variaveis no n8n

> Cada no tem entrada, processamento e saida — extraia apenas o necessario e armazene em variaveis nomeadas antes de passar adiante.

## Rules

1. **Nunca conecte nodes diretamente sem filtrar dados** — use um node Edit Fields (Set) entre o gatilho e o proximo node, porque o gatilho traz dados em excesso e o node seguinte precisa apenas de campos especificos
2. **Nomeie variaveis pelo conteudo** — `moeda`, `email`, `userId`, nunca `data`, `value`, `field1`, porque o nome deve descrever o dado armazenado
3. **Use $json para referenciar o no anterior** — `$json.body.moeda` acessa diretamente o no imediatamente anterior, porque e a forma mais simples e direta
4. **Use $('NomeDoNo') para nos distantes** — `$('Webhook').item.json.body.moeda` referencia qualquer no pelo nome, porque nem sempre o dado vem do no imediatamente anterior
5. **Prefira mapeamento manual sobre JSON** — no Edit Fields, use o modo manual com drag-and-drop dos campos, porque reduz erros e mostra os valores em tempo real
6. **Sempre valide com play isolado** — execute o node Edit Fields sozinho para confirmar que a variavel tem o valor esperado antes de conectar ao proximo node

## How to write

### Edit Fields (Set) — Mapeamento de variavel

```
Node: Edit Fields (Set)
Mode: Manual
Fields:
  - Name: moeda
    Type: String
    Value: {{ $json.body.moeda }}  (expressao, nao texto fixo)
```

### Referencia ao no anterior ($json)

```
// Acessa o output do no imediatamente anterior
{{ $json.body.moeda }}        // campo moeda dentro de body
{{ $json.headers }}            // headers do no anterior
{{ $json.body }}               // body completo
```

### Referencia a qualquer no pelo nome

```
// Acessa output de um no especifico (util quando ha varios nos entre eles)
{{ $('Webhook').item.json.body.moeda }}
{{ $('Webhook').item.json.headers }}
```

## Example

**Before (conexao direta sem filtro):**
```
[Webhook] ──────────> [HTTP Request]
           passa TUDO: body, headers, params, execution mode...
```

**After (com gestao de variaveis):**
```
[Webhook] ──> [Edit Fields] ──> [HTTP Request]
               moeda = $json.body.moeda
               passa APENAS o necessario
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Gatilho traz muitos campos mas proximo node precisa de poucos | Insira Edit Fields entre eles |
| Precisa de dado do no imediatamente anterior | Use `$json.campo` |
| Precisa de dado de 2+ nos atras | Use `$('NomeDoNo').item.json.campo` |
| Nao sabe a estrutura do JSON | Abra `{{ }}`, digite `$json.` e use o autocomplete |
| Valor fixo (hardcoded) | Use modo Fixed no campo do Edit Fields |
| Valor dinamico vindo de outro node | Use modo Expression (arraste o campo ou escreva a expressao) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Conectar gatilho direto ao HTTP Request | Inserir Edit Fields no meio para filtrar |
| Passar todos os campos adiante | Extrair apenas os campos necessarios |
| Escrever valor fixo quando deveria ser expressao | Arrastar o campo ou usar `{{ $json.campo }}` |
| Usar `$json` para no que nao e o anterior | Usar `$('NomeDoNo').item.json.campo` |
| Nomear variavel como `campo1`, `valor` | Nomear pelo conteudo: `moeda`, `email` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
