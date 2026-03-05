---
name: rs-agentes-ia-n8n-analisando-dados-execucao
description: "Applies n8n execution data analysis patterns when debugging workflows, inspecting webhook payloads, or troubleshooting automations. Use when user asks to 'debug n8n workflow', 'check webhook data', 'view execution logs', 'inspect request payload', or 'import production data to dev'. Ensures correct use of test URL vs production URL, execution logs, and copy-to-editor workflow. Make sure to use this skill whenever working with n8n execution inspection or webhook debugging. Not for building new workflows, configuring nodes, or deploying automations."
---

# Analisando Dados de Execução no n8n

> Sempre inspecione os logs de execução para validar dados antes de adicionar novos nós ao workflow.

## Rules

1. **Use a Test URL para desenvolvimento** — a Test URL traz dados para o editor visual, a Production URL executa sem exibir no editor, porque sem essa distinção você debugga no escuro
2. **Verifique execuções pela aba Executions** — dados enviados pela URL de produção só aparecem na aba Executions, não no editor, porque o editor só mostra execuções via Test URL
3. **Inspecione o payload completo** — verifique headers, parameters, query e body de cada execução, porque erros silenciosos se escondem em campos que você não olhou
4. **Distinga GET vs POST** — requisições GET enviam dados via query parameters, POST envia via body, porque confundir os dois causa payload vazio sem erro aparente
5. **Importe dados de produção para dev** — use "Copy to Editor" para trazer dados reais de uma execução para o ambiente de desenvolvimento, porque recriar payloads manualmente introduz divergências
6. **Nodes verdes = sucesso** — na visualização de logs, blocos verdes indicam execução bem-sucedida; erros aparecem com indicação visual diferente, porque a cor é o primeiro sinal de diagnóstico

## How to debug

### Inspecionar execução de webhook

```
1. Abrir o workflow no editor (ambiente de desenvolvimento)
2. Verificar se a automação está ativa
3. Ir na aba "Executions"
4. Clicar na execução desejada para ver os logs
5. Clicar duas vezes no nó (bloco) para ver detalhes
6. Verificar: headers → parameters → query → body
```

### Importar dados de produção para dev

```
1. Aba "Executions" → selecionar a execução com os dados desejados
2. Clicar em "Copy to Editor"
3. Os dados da execução são carregados no ambiente de desenvolvimento
4. Adicionar novos nós e testar usando esses dados reais
```

## Example

**Antes (debugging cego):**
```
Problema: webhook recebe dados mas automação "não funciona"
Ação errada: reenviar requisição repetidamente pela Production URL
Resultado: execuções acontecem mas não aparecem no editor
```

**Depois (com esta skill):**
```
1. Ir na aba Executions → encontrar a execução
2. Abrir logs → verificar se o nó está verde (sucesso)
3. Clicar duas vezes no nó → inspecionar body
4. Identificar que o campo "moeda" veio como "usd" (minúsculo) em vez de "USD"
5. Copy to Editor → testar fix no ambiente de dev com dados reais
```

## Heuristics

| Situação | Ação |
|----------|------|
| Requisição enviada mas nada aparece no editor | Verifique se usou Test URL (dev) ou Production URL (prod) |
| Payload chega vazio no webhook | Confira se o método (GET/POST) está correto e se os dados estão no campo certo (query vs body) |
| Erro com dado específico de produção | Use "Copy to Editor" para importar os dados exatos para dev |
| Nó aparece verde mas dados parecem errados | Clique duas vezes no nó e inspecione headers, parameters e body |
| Precisa testar com dados reais sem reenviar requisição | Aba Executions → Copy to Editor |

## Anti-patterns

| Nunca faça | Faça isto |
|------------|-----------|
| Debugar reenviando pela Production URL | Use a Test URL ou importe via Copy to Editor |
| Assumir que executou sem verificar logs | Sempre verifique na aba Executions |
| Recriar payload manualmente para testar | Importe dados reais com Copy to Editor |
| Ignorar campos de headers e parameters | Inspecione o payload completo |
| Testar só com GET quando o webhook espera POST | Confirme o método HTTP configurado no nó |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
