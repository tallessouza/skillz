---
name: rs-full-stack-api-client-insomnia
description: "Guides setup and usage of Insomnia as API client for testing HTTP endpoints. Use when user asks to 'test an API', 'send a POST request', 'setup Insomnia', 'configure API client', or 'test endpoints beyond GET'. Make sure to use this skill whenever setting up API testing tools or choosing between Postman, Thunder Client, and Insomnia. Not for writing API code, implementing routes, or frontend HTTP calls."
---

# API Client — Insomnia

> Use Insomnia como ferramenta padrao para testar APIs com qualquer metodo HTTP alem do GET disponivel no navegador.

## Contexto

O navegador so faz requisicoes GET por padrao. Para testar POST, PUT, DELETE e outros metodos HTTP, um API client dedicado e necessario.

## Ferramentas disponiveis

| Ferramenta | Tipo | Quando usar |
|-----------|------|-------------|
| **Insomnia** | App standalone | Padrao recomendado — interface visual, organizacao de requests, gratuito |
| Postman | App standalone | Alternativa popular, mais pesado |
| Thunder Client | Extensao VS Code | Quando preferir ficar dentro do editor |

## Setup

### Step 1: Download
1. Acesse [insomnia.rest](https://insomnia.rest)
2. Clique em "Get Started for Free" ou va em Products > Insomnia
3. Faca signup/login (conta gratuita e suficiente)

### Step 2: Instalacao
1. Execute o instalador baixado
2. Abra o Insomnia
3. Faca login com a conta criada (redireciona pro navegador, depois volta ao app)

### Step 3: Verificacao
- O Insomnia abre com a interface principal
- Conta gratuita atende todas as necessidades de teste

## Plano gratuito vs pago

| Recurso | Free | Pago |
|---------|------|------|
| Testar APIs (todos os metodos HTTP) | Sim | Sim |
| Organizar requests em colecoes | Sim | Sim |
| Convidar membros ao projeto | Nao | Sim |
| Controle de permissoes | Nao | Sim |

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa testar endpoint POST/PUT/DELETE | Use Insomnia |
| Quer testar GET rapidamente | Navegador funciona, mas Insomnia mostra headers e status |
| Time compartilha colecao de requests | Considere plano pago do Insomnia |
| Prefere nao sair do VS Code | Use Thunder Client como alternativa |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre escolha de API clients e metodos HTTP
- [code-examples.md](references/code-examples.md) — Exemplos de configuracao e uso do Insomnia