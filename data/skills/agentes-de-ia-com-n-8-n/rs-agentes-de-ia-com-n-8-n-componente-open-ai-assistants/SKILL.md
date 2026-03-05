---
name: rs-agentes-ia-n8n-openai-assistants
description: "Applies correct OpenAI Assistant integration patterns when building N8N workflows. Use when user asks to 'connect OpenAI assistant', 'use assistant in n8n', 'create n8n automation with OpenAI', or 'choose between agent and assistant'. Enforces the distinction between AI Agent nodes, OpenAI API calls, and OpenAI Assistants. Make sure to use this skill whenever the user is working with OpenAI components in N8N. Not for building AI Agents inside N8N or direct OpenAI API chat completions."
---

# Componente OpenAI — Assistants no N8N

> Ao integrar OpenAI no N8N, identifique se o caso pede um AI Agent (tudo no N8N), um Assistant (tudo na OpenAI, N8N apenas conecta), ou uma chamada direta de API.

## Rules

1. **Distinga os 3 modelos de uso** — AI Agent (construido dentro do N8N), Assistant (construido na OpenAI, acessado via N8N), API direta (chamada simples sem estado), porque usar o bloco errado na situacao errada gera resultados inconsistentes
2. **Organize credenciais por projeto** — uma API Key por projeto na OpenAI Platform, porque permite controle de custo por projeto
3. **Nunca confunda Assistant com AI Agent** — o Assistant vive na plataforma OpenAI (platform.openai.com), o AI Agent vive inteiramente no N8N, porque a arquitetura e o fluxo de dados sao completamente diferentes
4. **API Key so aparece uma vez** — copie e guarde ao criar, porque a OpenAI nao permite visualizar novamente
5. **Hierarquia OpenAI: Organization > Project > API Key > Assistant** — respeite essa estrutura ao configurar credenciais no N8N

## Decision Framework

| Cenario | Use | Onde a logica vive |
|---------|-----|-------------------|
| Automacao completa com tools, memory, sub-agents | AI Agent (bloco Agent do N8N) | Dentro do N8N |
| Agente ja configurado na OpenAI com prompt, docs, tools | Assistant (bloco OpenAI > Assistant) | Fora do N8N (OpenAI Platform) |
| Chamada simples de texto, audio ou imagem sem estado | API direta (bloco OpenAI > Chat/Audio/Image) | Chamada stateless |

## How to connect

### Passo 1: Criar credencial no N8N
```
1. No bloco OpenAI, clique em "Credentials to connect with"
2. Crie nova credencial com a API Key do projeto na OpenAI Platform
3. Salve — o N8N testa automaticamente a conexao
```

### Passo 2: Selecionar Assistant
```
1. No bloco OpenAI, selecione recurso "Assistant"
2. Operacao: "Send Message" (ou Create, Delete, List)
3. Em "Assistant", selecione "From List" — o N8N busca os assistants da credencial
4. Selecione o assistant desejado
```

## Example

**Errado — criar logica duplicada:**
```
Trigger → OpenAI (Chat) com system prompt copiado do Assistant
→ Problema: prompt duplicado, sem file search, sem tools do Assistant
```

**Correto — apontar para o Assistant existente:**
```
Trigger → OpenAI (Assistant > Send Message) → seleciona Assistant "Aula"
→ Usa prompt, modelo, tools e docs configurados na OpenAI Platform
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Ja tem assistant configurado na OpenAI com docs e tools | Use bloco OpenAI > Assistant |
| Precisa de tools customizadas do N8N (HTTP, banco, etc) | Use bloco AI Agent |
| So precisa de uma resposta simples sem contexto | Use bloco OpenAI > Chat (API direta) |
| Quer controlar custo por projeto | Crie API Key separada por projeto |
| Precisa de file search ou code interpreter | Configure no Assistant da OpenAI, acesse via N8N |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Copiar system prompt do Assistant para um bloco Chat | Apontar para o Assistant via bloco OpenAI > Assistant |
| Usar uma unica API Key para todos os projetos | Criar uma API Key por projeto para controle de custo |
| Criar AI Agent no N8N quando ja existe Assistant configurado | Conectar ao Assistant existente |
| Tentar recriar file search manualmente no N8N | Usar file search nativo do Assistant na OpenAI |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
