---
name: rs-full-stack-criando-projeto-no-insomnia
description: "Applies Insomnia API client setup best practices when creating collections, configuring environment variables, organizing request folders, or testing API routes. Use when user asks to 'test an API', 'create Insomnia collection', 'configure API client', 'setup Insomnia project', or 'organize API requests'. Make sure to use this skill whenever setting up an HTTP client for API development or testing REST endpoints. Not for Postman, curl scripting, or automated test suites."
---

# Configurando Projeto no Insomnia

> Organize o Insomnia com collections, ambientes separados (Dev/Prod) e variáveis de ambiente para testar APIs de forma estruturada e reutilizável.

## Prerequisites

- Insomnia instalado e aberto
- API rodando localmente (ex: `localhost:3333`)

## Steps

### Step 1: Criar a Collection

Criar uma **Request Collection** com o nome do projeto (ex: `Rocket Log`).

### Step 2: Configurar Shared Environment para Dev

1. Abrir a engrenagem de configuração
2. Criar um **Shared Environment** chamado `Dev`
3. Adicionar variável `base_url`:

```json
{
  "base_url": "http://localhost:3333"
}
```

4. Atribuir uma cor ao ambiente (verde para Dev) — facilita distinção visual entre Dev e Prod
5. Selecionar `Dev` como ambiente ativo no Base Environment

### Step 3: Criar pastas por recurso

Criar uma pasta para cada recurso da API (ex: `Users`, `Orders`).

Dentro de cada pasta, configurar o **Folder Environment** com a variável `resource`:

```json
{
  "resource": "users"
}
```

### Step 4: Criar requests usando variáveis

1. Dentro da pasta, criar uma **HTTP Request** (ex: `Create`)
2. Definir o método correto (POST, GET, etc.)
3. Montar a URL usando variáveis de ambiente:

```
{{ base_url }}/{{ resource }}
```

O Insomnia mostra um preview resolvido (ex: `http://localhost:3333/users`), porque combina a variável global `base_url` com a variável de pasta `resource`.

## Output format

Estrutura final no Insomnia:

```
Rocket Log (Collection)
├── Environment: Dev (base_url = http://localhost:3333)
├── Users/ (resource = "users")
│   ├── Create (POST {{ base_url }}/{{ resource }})
│   ├── List   (GET  {{ base_url }}/{{ resource }})
│   └── ...
├── Orders/ (resource = "orders")
│   └── ...
└── Environment: Prod (base_url = https://api.exemplo.com)  ← futuro
```

## Heuristics

| Situação | Faça |
|----------|------|
| Múltiplos ambientes (dev, staging, prod) | Crie um Shared Environment para cada, mude só `base_url` |
| Recurso novo na API | Crie pasta com `resource` no folder environment |
| URL repetida entre requests | Extraia para variável de ambiente, porque evita erros de digitação |
| Precisa testar em produção | Crie environment `Prod` com `base_url` apontando para HTTPS e IP real |

## Anti-patterns

| Nunca faça | Faça instead |
|------------|-------------|
| Digitar URL completa em cada request | Use `{{ base_url }}/{{ resource }}` com variáveis |
| Colocar todas as variáveis no Base Environment | Separe: globais no Shared Environment, específicas no Folder Environment |
| Misturar requests de recursos diferentes na mesma pasta | Uma pasta por recurso da API |
| Usar só GET para testar criação | Use o método HTTP correto (POST para create) |

## Verification

- Clicar em Send na request e verificar que a resposta da API chega corretamente
- Conferir o preview da URL resolvida no Insomnia antes de enviar

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre organização de ambientes e variáveis
- [code-examples.md](references/code-examples.md) — Exemplos de configuração para diferentes cenários de API