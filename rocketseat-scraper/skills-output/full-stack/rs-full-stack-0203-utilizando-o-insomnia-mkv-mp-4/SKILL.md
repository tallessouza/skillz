---
name: rs-full-stack-utilizando-insomnia
description: "Guides Insomnia API client setup and usage when testing REST APIs. Use when user asks to 'test an API', 'send a request', 'setup Insomnia', 'create API collection', or 'debug endpoint'. Covers workspace organization, collections, HTTP requests, and response inspection. Make sure to use this skill whenever configuring Insomnia or explaining API testing workflows with GUI clients. Not for automated testing, CI/CD integration, or code-based HTTP clients like axios or fetch."
---

# Utilizando o Insomnia

> Organize requisicoes em workspaces e colecoes no Insomnia para testar APIs de forma persistente e reproduzivel.

## Quando usar

Insomnia resolve o problema de testar APIs pelo navegador: requisicoes nao ficam salvas, nao da pra configurar metodos diferentes de GET, e montar a requisicao toda vez e improdutivo. Com Insomnia, tudo fica salvo e organizado.

## Steps

### Step 1: Organizar o Workspace

1. Abrir Insomnia
2. Clicar no nome do workspace → Settings → Renomear para o nome do projeto
3. Um workspace por projeto ou contexto (pessoal, empresa, cliente)

### Step 2: Criar uma Colecao

1. Clicar em **New Collection**
2. Nomear descritivamente: `Minha Primeira API`, `Users API`, `Auth Endpoints`
3. Uma colecao agrupa todas as requisicoes de uma API

### Step 3: Criar uma Requisicao HTTP

1. Dentro da colecao, clicar no botao **+**
2. Selecionar **HTTP Request**
3. Renomear com duplo-clique: usar nome descritivo como `Obter Mensagem`, `Listar Usuarios`
4. Selecionar o metodo HTTP (GET, POST, PUT, DELETE) no dropdown a esquerda da URL

### Step 4: Configurar e Enviar

1. Inserir a URL: `http://localhost:3333`
2. Configurar parametros, headers ou body conforme necessario
3. Clicar em **Send**
4. Visualizar a resposta no painel direito

## Interface — 3 Paineis

| Painel | Posicao | Conteudo |
|--------|---------|----------|
| Lista de requisicoes | Esquerda | Todas as requisicoes salvas da colecao |
| Requisicao (request) | Centro | URL, metodo, parametros, headers, body |
| Resposta (response) | Direita | Status code, body da resposta, tempo |

## Hierarquia de organizacao

```
Workspace (ex: "Rocket City")
└── Collection (ex: "Minha Primeira API")
    ├── Obter Mensagem       [GET]
    ├── Criar Usuario        [POST]
    └── Deletar Usuario      [DELETE]
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo projeto | Criar workspace dedicado |
| Nova API ou grupo de endpoints | Criar colecao dentro do workspace |
| Novo endpoint | Criar requisicao com nome descritivo do que ela faz |
| Precisa testar amanha de novo | Insomnia ja salva automaticamente — so reabrir |
| Paineis apertados | Arrastar as linhas divisorias para ajustar largura |

## Anti-patterns

| Evite | Faca em vez disso |
|-------|-------------------|
| Testar API direto no navegador | Usar Insomnia — requisicoes ficam salvas e configuradas |
| Deixar nome padrao "New Request" | Renomear para acao descritiva: "Obter Mensagem", "Criar Produto" |
| Jogar tudo num workspace so | Separar workspaces por projeto/contexto |
| Requisicao sem nome claro | Nomear pelo que a requisicao faz, nao pela rota |

## Verification

- Servidor deve estar rodando (`npm run dev`) antes de enviar requisicao
- Resposta aparece no painel direito com status code e body
- Se nao responder: verificar se a porta na URL esta correta e o servidor esta ativo

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e contexto do instrutor
- [code-examples.md](references/code-examples.md) — Exemplos praticos de configuracao e uso