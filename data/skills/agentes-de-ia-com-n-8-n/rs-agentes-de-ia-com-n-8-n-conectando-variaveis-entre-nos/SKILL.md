---
name: rs-agentes-ia-n8n-conectando-variaveis
description: "Applies n8n variable connection patterns between nodes when building workflows. Use when user asks to 'connect nodes', 'pass data between nodes', 'map variables in n8n', 'link webhook to HTTP request', or 'build n8n automation'. Ensures correct drag-and-drop mapping, expression syntax, and input-processing-output flow. Make sure to use this skill whenever wiring n8n nodes together or referencing previous node outputs. Not for n8n installation, credential setup, or JavaScript code nodes."
---

# Conectando Variáveis entre Nós no n8n

> Ao conectar nós no n8n, siga o padrão entrada-processamento-saída em cada nó, mapeando variáveis por drag-and-drop ou expressões.

## Rules

1. **Conecte os nós antes de mapear variáveis** — o n8n só exibe dados de nós anteriores após a conexão física entre eles, porque sem conexão não há histórico disponível
2. **Use "Execute Previous Node" após conectar** — quando conectar nós que já foram executados separadamente, clique no botão para popular o histórico do nó atual, porque sem isso as variáveis não aparecem para mapeamento
3. **Mapeie variáveis por drag-and-drop** — arraste o campo do painel de input para o campo de destino ao invés de digitar manualmente, porque reduz erros de sintaxe
4. **Nomeie nós de forma descritiva** — renomeie nós padrão para nomes significativos, porque os nomes aparecem nas expressões de referência (ex: `$json.moeda` vs `$('Webhook').item.json.moeda`)
5. **Teste em modo desenvolvimento antes de produção** — valide cada nó individualmente e depois execute ponta a ponta, porque erros em produção não mostram detalhes inline
6. **Configure a saída do webhook** — sem configuração explícita de resposta, o webhook retorna apenas "workflow was started", porque a saída precisa ser explicitamente conectada

## Sintaxe de Expressões

### Referenciando o nó imediatamente anterior
```
{{ $json.nomeDoCampo }}
```

### Referenciando um nó específico pelo nome
```
{{ $('NomeDoNo').item.json.nomeDoCampo }}
```

### Exemplo real: URL dinâmica com variável
```
https://api.exemplo.com/cotacao/{{ $json.moeda }}
```

## Fluxo Padrão

### Passo 1: Conectar os nós fisicamente
Arraste a saída (bolinha direita) do nó origem para a entrada (bolinha esquerda) do nó destino.

### Passo 2: Popular histórico
Clique no nó destino → botão "Execute Previous Node" para carregar dados do nó anterior.

### Passo 3: Mapear variáveis
No painel do nó destino, arraste campos do painel esquerdo (input) para os campos de configuração.

### Passo 4: Testar individualmente
Execute o nó atual isoladamente para validar que o mapeamento funciona.

### Passo 5: Testar ponta a ponta
Salve e execute o workflow completo em modo desenvolvimento. Depois teste em modo produção via ferramenta externa (Postman, curl).

## Example

**Before (URL hardcoded):**
```
URL: https://api.exemplo.com/cotacao/USD-BRL
```

**After (com variável mapeada):**
```
URL: https://api.exemplo.com/cotacao/{{ $json.moeda }}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Variáveis não aparecem no painel | Execute Previous Node primeiro |
| Nó conectado mas sem dados | Verifique se o nó anterior foi executado com sucesso |
| Expressão não resolve | Confirme o nome exato do nó e do campo (case-sensitive) |
| Teste OK em dev mas falha em prod | Verifique se salvou o workflow e se a URL de produção está ativa |
| API aceita formato simplificado | Teste com menos parâmetros antes de montar concatenações complexas |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| Digitar expressão manualmente sem testar | Arrastar campo do painel de input |
| Hardcodar valores que vêm de nós anteriores | Mapear variável dinâmica |
| Testar direto em produção | Testar em dev primeiro, depois produção |
| Deixar nomes padrão nos nós | Renomear para nomes descritivos |
| Assumir que webhook retorna dados automaticamente | Configurar saída explícita do webhook |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
