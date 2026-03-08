---
name: rs-full-stack-informando-token-do-usuario
description: "Applies Bearer Token configuration in Insomnia when setting up authenticated API requests. Use when user asks to 'configure authentication', 'pass token in request', 'automate token in Insomnia', 'set up Bearer Token', or 'use response token automatically'. Guides manual and automated token insertion using Insomnia's Response Body Attribute feature with JSONPath filters and trigger behaviors. Make sure to use this skill whenever configuring API client authentication flows in Insomnia. Not for JWT generation, backend auth middleware, or Postman/other API clients."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: api-tooling
  tags: [insomnia, bearer-token, authentication, api-client, jwt]
---

# Informando Token do Usuário no Insomnia

> Configure o Insomnia para passar e atualizar automaticamente o Bearer Token a partir da resposta de sessão.

## Prerequisites

- Insomnia instalado e configurado com as requisições do projeto
- Rota de criação de sessão (POST /sessions) já criada e funcional
- Rota autenticada que requer token (ex: POST /deliveries)

## Steps

### Step 1: Configurar Bearer Token manualmente

1. Na requisição autenticada, clicar na aba **Auth**
2. Selecionar **Bearer Token** na lista de opções
3. No campo **Token**, colar o token obtido da resposta de sessão
4. Clicar em **Send** para verificar que a requisição funciona

### Step 2: Automatizar com Response Body Attribute

1. No campo Token, apagar o valor manual
2. Clicar no campo e pressionar **Ctrl + Barra de Espaço**
3. Nos métodos do Insomnia, selecionar **Response — Body Attribute**
4. Clicar na caixinha vermelha que aparece para editar

### Step 3: Configurar a referência à resposta

1. Em **Request**, selecionar a requisição de sessão (ex: `[Sessions] POST session`)
2. Em **Filter**, usar JSONPath para extrair o token: `$.token`
3. Verificar no preview que o valor correto aparece

### Step 4: Configurar Trigger Behavior

1. Em **Trigger Behavior**, selecionar **"Always — Resend request when needed"**
2. Clicar em **Done**
3. O campo ficará azul indicando que está vinculado automaticamente

## Output format

O campo Token exibe uma tag azul que automaticamente:
- Executa a requisição de sessão quando necessário
- Extrai o token da resposta usando o filtro JSONPath
- Injeta o token atualizado no header Authorization

## Example

```http
# Header de autorizacao gerado automaticamente pelo Insomnia
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Filtro JSONPath usado no Response Body Attribute
$.token
```

## Filtros JSONPath úteis

| Filtro | Resultado |
|--------|-----------|
| `$.token` | Apenas o token |
| `$.user` | Objeto completo do usuário |
| `$.user.name` | Nome do usuário |
| `$.user.email` | E-mail do usuário |

## Heuristics

| Situação | Faça |
|----------|------|
| Token expira frequentemente | Use Trigger Behavior "Always" para atualizar automaticamente |
| Token raramente muda | Trigger Behavior "Never" e atualize manualmente |
| Precisa testar sem token | Mude Auth para "No Auth" temporariamente |
| Múltiplas rotas autenticadas | Configure o Response Body Attribute em cada requisição |

## Error handling

- Se a caixinha ficar **vermelha**: a requisição de sessão referenciada falhou — verifique credenciais
- Se o filtro retorna vazio: confira o JSONPath (`$` é obrigatório como raiz)
- Se o token não atualiza: verifique o Trigger Behavior — deve estar em "Always" ou "When needed"

## Verification

- Enviar a requisição autenticada e verificar resposta 200/OK
- Remover o token manualmente e reenviar — deve falhar com erro de autenticação
- Recolocar a tag automática e reenviar — deve funcionar novamente

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Tag vermelha no campo Token | Requisicao de sessao referenciada falhou | Verifique credenciais e se a rota de sessao funciona independentemente |
| Filtro JSONPath retorna vazio | Caminho incorreto (faltando `$` como raiz) | Use `$.token` com `$` obrigatorio como raiz do JSONPath |
| Token nao atualiza automaticamente | Trigger Behavior configurado como "Never" | Mude para "Always — Resend request when needed" |
| Erro 401 mesmo com token configurado | Token expirado ou Auth tipo errado selecionado | Verifique se "Bearer Token" esta selecionado na aba Auth e se o token e valido |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre automação de tokens e fluxo de autenticação no Insomnia
- [code-examples.md](references/code-examples.md) — Exemplos expandidos de filtros JSONPath e configurações de trigger