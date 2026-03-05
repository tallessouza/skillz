---
name: rs-full-stack-configurando-insomnia
description: "Applies Insomnia API client configuration patterns when setting up API testing environments. Use when user asks to 'configure Insomnia', 'setup API client', 'organize API requests', 'create request collection', or 'setup environment variables in Insomnia'. Ensures proper use of environments, folder-scoped variables, and base URLs. Make sure to use this skill whenever configuring Insomnia for API development projects. Not for Postman, cURL, or other API clients."
---

# Configurando o Insomnia para APIs

> Organize o Insomnia com ambientes, variáveis e pastas por recurso para eliminar repetição e manter consistência.

## Prerequisites

- Insomnia instalado e aberto
- API rodando localmente (ex: `localhost:3333`)

## Steps

### Step 1: Criar Request Collection

1. Clicar em **Create** → **New Request Collection**
2. Nomear com o nome do projeto (ex: `API Restaurant`)

### Step 2: Configurar ambiente (Environment)

1. Clicar na engrenagem em **Base Environment**
2. Criar novo ambiente com nome descritivo (ex: `Dev`)
3. Escolher cor identificadora (verde para Dev, vermelho para Prod)
4. Adicionar `base_url` com valor do servidor:

```json
{
  "base_url": "http://localhost:3333"
}
```

### Step 3: Criar pasta por recurso

1. Clicar em **+** → **New Folder** com nome do recurso (ex: `Products`)
2. Abrir Environment da pasta e adicionar variável de escopo local:

```json
{
  "resource": "products"
}
```

### Step 4: Criar requests usando variáveis

1. Dentro da pasta, criar **New HTTP Request** (ex: `Index`)
2. Na URL, digitar `base_url` — autocompletar substitui pela variável
3. Adicionar `/` e digitar `resource` — autocompletar substitui pelo recurso
4. URL final renderizada: `http://localhost:3333/products`

## Output format

```
API Restaurant (Collection)
├── Environment: Dev (verde) → base_url = localhost:3333
└── Products/ (resource = "products")
    ├── Index      GET  {{base_url}}/{{resource}}
    ├── Show       GET  {{base_url}}/{{resource}}/:id
    ├── Create     POST {{base_url}}/{{resource}}
    ├── Update     PUT  {{base_url}}/{{resource}}/:id
    └── Delete     DEL  {{base_url}}/{{resource}}/:id
```

## Heuristics

| Situação | Faça |
|----------|------|
| URL base muda entre ambientes | Criar ambiente separado (Dev, Staging, Prod) com cores distintas |
| Variável usada em todas as pastas | Colocar no Base Environment |
| Variável específica de um recurso | Colocar no Environment da pasta, porque ela só existe naquele escopo |
| Novo recurso na API | Criar nova pasta com sua própria variável `resource` |

## Anti-patterns

| Nunca faça | Faça instead |
|------------|-------------|
| Digitar `localhost:3333` em cada request | Usar variável `base_url` do environment |
| Colocar todas as requests soltas sem pasta | Organizar por pasta = um recurso da API |
| Criar variável de recurso no Base Environment | Criar no Environment da pasta (escopo local) |
| Usar um único ambiente para Dev e Prod | Criar ambientes separados com cores diferentes |

## Verification

- Clicar **Send** em uma request e verificar resposta da API
- Alterar valor de `base_url` no environment e confirmar que todas as requests refletem a mudança

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre escopo de variáveis e organização
- [code-examples.md](references/code-examples.md) — Exemplos expandidos de configuração para diferentes APIs

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-configurando-o-insomnia-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-configurando-o-insomnia-1/references/code-examples.md)
