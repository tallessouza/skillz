---
name: rs-full-stack-criando-projeto-no-insomnia
description: "Configures Insomnia API client setup when creating request collections, configuring base URL environment variables, and making test requests. Use when user asks to 'test an API', 'setup Insomnia', 'create API collection', 'configure Insomnia environment', or 'make HTTP request in Insomnia'. Make sure to use this skill whenever setting up an API testing workspace for a new project. Not for Postman, curl CLI usage, or automated API testing with code."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [insomnia, api-client, testing, http, environment-variables]
---

# Criando Projeto no Insomnia

> Configure o Insomnia com projeto, variavel de ambiente e requisicao de teste antes de comecar a desenvolver endpoints.

## Prerequisites

- Insomnia instalado e aberto
- API rodando localmente (ex: `http://localhost:3333`)

## Steps

### Step 1: Criar a Request Collection

1. Clique em **Create**
2. Selecione **Request Collection**
3. Defina o nome do projeto (ex: `Refound`)
4. Clique em **Create**

### Step 2: Configurar variavel de ambiente (Base URL)

1. Clique em **Base Environment**
2. Clique no botao de editar
3. Crie a variavel `base_url` com o endereco da API

```json
{
  "base_url": "http://localhost:3333"
}
```

4. Feche o editor de ambiente

### Step 3: Criar requisicao de teste

1. Clique no botao **+** → **HTTP Request**
2. Renomeie para "teste"
3. Mantenha o metodo **GET**
4. No campo de URL, digite `base` e selecione `base_url` no autocomplete
5. Clique em **Send**
6. Verifique a resposta retornada pela API

## Output format

Ao final, o workspace Insomnia contem:
- Um projeto nomeado com a Request Collection
- Variavel `base_url` configurada no Base Environment
- Uma requisicao GET de teste confirmando conexao com a API

## Verificacao

- A requisicao GET retorna resposta da API (status 200 ou mensagem configurada)
- A variavel `base_url` aparece no autocomplete ao digitar `base` no campo de URL

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa testar API localmente | Configure `base_url` como `http://localhost:{porta}` |
| Multiplos ambientes (dev, staging, prod) | Crie sub-environments com URLs diferentes |
| Visualizar ambiente como tabela | Ative a flag **Table View** (ficara verde) |
| Visualizar ambiente como JSON | Desative a flag **Table View** — mostra o JSON direto |
| Trocar de projeto | Clique na seta de voltar, selecione o projeto na lista |

## Anti-patterns

| Evite | Faca em vez disso |
|-------|-------------------|
| Digitar URL completa em cada requisicao | Use a variavel `base_url` do environment |
| Deixar projeto com nome padrao | Nomeie com o nome real do projeto |
| Testar API sem variavel de ambiente | Configure `base_url` primeiro, porque facilita trocar entre ambientes |

## Troubleshooting

### Problem: Insomnia request returns "Error: connect ECONNREFUSED"
- **Cause**: The API server is not running or is listening on a different port than configured in `base_url`
- **Fix**: Verify the server is running with `npm run dev`, then confirm the port in `base_url` matches the server's listening port

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre organizacao de workspace e variaveis de ambiente
- [code-examples.md](references/code-examples.md) — Exemplos de configuracao de environments e requisicoes