---
name: rs-ia-node-marketplace-gemini-api-key
description: "Guides through obtaining a Gemini API Key from Google AI Studio. Use when user asks to 'setup gemini', 'get gemini api key', 'configure gemini', or 'integrate with gemini api'. Walks through Google AI Studio, Google Cloud project creation, and key generation. Make sure to use this skill whenever setting up Gemini-based projects or configuring AI features that use Google Gemini. Not for OpenAI, Anthropic, or other LLM provider API key setup."
---

# Gemini API Key Setup

> Obter a API Key do Gemini requer um projeto no Google Cloud e acesso ao Google AI Studio.

## Prerequisites

- Conta Google ativa
- Acesso ao Google Cloud Console (console.cloud.google.com)
- Navegador com login Google ativo

## Steps

### Step 1: Acessar a documentacao do Gemini

Pesquisar por "Gemini Docs" ou acessar diretamente a pagina de documentacao do Gemini. Na pagina inicial, localizar o botao "Get Gemini API Key".

### Step 2: Acessar o Google AI Studio

Clicar em "Get Gemini API Key" para ser redirecionado ao Google AI Studio. Fazer login se necessario.

### Step 3: Garantir projeto no Google Cloud

Se voce nao tem um projeto no Google Cloud:
1. Acessar console.cloud.google.com
2. Clicar em "Novo Projeto" no topo
3. Criar o projeto e aguardar a criacao

Se ja tem projetos, eles aparecerao na lista do AI Studio.

### Step 4: Criar a API Key

1. No Google AI Studio, clicar em "Create API Key"
2. Selecionar o projeto Google Cloud desejado na lista
3. A chave sera gerada e exibida

### Step 5: Configurar no projeto

```bash
# Adicionar ao .env do projeto
GEMINI_API_KEY=sua_chave_aqui
```

```typescript
// Garantir que .env esta no .gitignore
// .gitignore
.env
```

## Output format

Apos seguir os passos, voce tera:
- Uma API Key do Gemini pronta para uso
- A chave configurada como variavel de ambiente no projeto

## Error handling

- Se nao aparecem projetos no AI Studio: ir ao Google Cloud Console e criar um projeto manualmente
- Se o botao "Create API Key" nao aparece: verificar se esta logado na conta Google correta
- Se a chave nao funciona: verificar se o projeto Google Cloud esta ativo e com billing habilitado (free tier e suficiente)

## Verification

```bash
# Testar a chave com curl
curl "https://generativelanguage.googleapis.com/v1beta/models?key=$GEMINI_API_KEY"
```

Se retornar uma lista de modelos, a chave esta funcionando.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
