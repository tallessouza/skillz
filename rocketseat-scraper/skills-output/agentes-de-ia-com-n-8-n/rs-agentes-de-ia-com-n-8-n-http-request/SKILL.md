---
name: rs-agentes-ia-n8n-http-request
description: "Applies HTTP Request node configuration patterns when building n8n workflows that call external APIs. Use when user asks to 'add an API call in n8n', 'configure HTTP request node', 'connect to an external API', 'import curl into n8n', or 'fetch data from an API in n8n'. Covers curl import workflow, query parameters, API key authentication, and test-first methodology. Make sure to use this skill whenever configuring HTTP Request nodes in n8n automations. Not for webhook/trigger configuration, internal n8n node connections, or general REST API design."
---

# HTTP Request no n8n

> Sempre teste a API no Postman primeiro, confirme que funciona, depois importe o curl no n8n.

## Rules

1. **Teste antes no Postman** — valide a API externamente antes de configurar no n8n, porque debugar direto no n8n mistura erros de API com erros de configuração do node
2. **Use Import Curl** — nunca preencha campos manualmente quando pode copiar o curl do Postman (Code tab) e importar no n8n, porque elimina erros de digitação em URLs e parâmetros
3. **Teste o node isolado** — execute só o bloco HTTP Request (test step) antes de conectar ao fluxo, porque isola problemas de configuração do node vs problemas do workflow
4. **API Key via query parameter** — quando a API exige autenticação por token, adicione como query parameter na URL, porque é o padrão mais comum em APIs públicas simples
5. **Limpe artefatos do curl** — ao importar curl, remova caracteres especiais (`$`) e placeholders antes de importar, porque causam erro silencioso no parser do n8n
6. **Considere restrições de infraestrutura cloud** — o n8n cloud pode bloquear requisições por rate limiting de IP compartilhado, resolva com autenticação por API key quando disponível

## How to configure

### Fluxo completo: API externa no n8n

```
1. Ler documentação da API → entender endpoint, método, parâmetros
2. Testar no Postman → confirmar status 200 e resposta esperada
3. Copiar curl do Postman → aba Code > cURL
4. No n8n: adicionar node HTTP Request
5. Import Curl → colar o curl copiado
6. Ajustar parâmetros (tokens, pares de moeda, etc.)
7. Test Step → executar só esse node
8. Confirmou? → conectar ao fluxo
```

### Import Curl no n8n

```
Node HTTP Request → Import Curl → colar curl → Import
```

O n8n configura automaticamente: URL, método, headers e query parameters.

### Query Parameters com API Key

```
URL: https://economia.awesomeapi.com.br/json/last/USD-BRL
Query Parameters:
  - token: {sua-api-key}
```

## Example

**Before (configuração manual, propenso a erro):**
```
1. Abrir HTTP Request node
2. Digitar URL manualmente
3. Selecionar método GET
4. Adicionar parâmetros um a um
5. Testar e descobrir erro de digitação
```

**After (com Import Curl):**
```
1. Testar no Postman → status 200 ✓
2. Postman > Code > copiar curl
3. n8n > HTTP Request > Import Curl > colar
4. Substituir placeholder do token pela key real
5. Test Step → funciona de primeira
```

## Heuristics

| Situação | Faça |
|----------|------|
| API pública sem auth | Teste direto, mas prepare API key caso n8n cloud bloqueie |
| Erro de múltiplas requisições no cloud | Crie conta na API e use token de autenticação |
| API com documentação e exemplos | Copie o exemplo da doc, teste no Postman, depois importe |
| Curl tem `$` ou variáveis shell | Remova antes de importar no n8n |
| Node HTTP Request retorna erro | Volte ao Postman, confirme que funciona lá primeiro |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Configurar HTTP Request manualmente campo a campo | Import Curl do Postman |
| Testar API pela primeira vez dentro do n8n | Testar no Postman antes |
| Conectar o node ao fluxo sem testar isolado | Test Step primeiro no node isolado |
| Ignorar erro de rate limit no cloud e ficar retentando | Criar API key e autenticar |
| Deixar placeholder/token fake no campo de autenticação | Substituir pelo token real antes de testar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
