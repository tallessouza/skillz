---
name: rs-agentes-ia-n8n-tools
description: "Applies N8N AI Agent tool configuration patterns when building integrations between AI agents and external APIs. Use when user asks to 'add a tool to n8n agent', 'connect API to AI agent', 'make agent call external API', 'configure HTTP request tool', or 'dynamic URL in n8n'. Covers three methods: query parameters with AI, body parameters with AI, and fromAI() expressions in URLs. Make sure to use this skill whenever configuring N8N agent tools or external integrations. Not for general N8N workflow building without AI agents, nor for coding API integrations manually."
---

# N8N AI Agent Tools — Integracao com APIs Externas

> Tools dao ao agente de IA a habilidade de acessar sistemas externos, transformando texto do usuario em requisicoes HTTP automaticamente.

## Conceito Central

Tools sao habilidades que permitem ao agente olhar para o mundo externo. Sem tools, o agente so sabe o que o LLM ja conhece. Com tools, ele faz integracoes reais em tempo real.

## Rules

1. **Nomeie a tool pelo que ela faz** — nome descritivo como "cotacao" e descricao usada como parte do prompt pelo agente, porque o agente decide quando usar a tool baseado na descricao
2. **Instrua o agente no system prompt sobre quando usar a tool** — adicione "Use a tool X sempre que o usuario perguntar sobre Y", porque sem essa instrucao o agente nao sabe quando acionar a ferramenta
3. **Use HTTP Request Tool para APIs sem integracao nativa** — quando a API nao tem tool pronta no N8N, use HTTP Request Tool customizado, porque permite chamar qualquer API do mundo
4. **Use `$fromAI()` para valores dinamicos na URL** — quando o parametro faz parte da URL (nao eh query param nem body), porque eh a unica forma de injetar IA diretamente no path
5. **Inclua formato esperado na descricao do parametro AI** — escreva "codigo da moeda no formato USD, BRL, EUR", porque o agente precisa saber como converter linguagem natural para o formato da API

## Tres Metodos de Parametros Dinamicos com IA

### Metodo 1: Query Parameters (GET com parametros)
```
URL: https://api.exemplo.com/cotacao
Query Parameters: moeda = [botao AI ativado]
Descricao: "Codigo da moeda que o usuario informar no formato USD, BRL, EUR"
```
Usar quando: parametros vao na query string (`?moeda=USD`)

### Metodo 2: Body Parameters (POST)
```
URL: https://api.exemplo.com/cotacao
Body: moeda = [botao AI ativado]
Descricao: "Capture a moeda que o usuario falar no formato USD, BRL, EUR"
```
Usar quando: dados vao no corpo da requisicao POST

### Metodo 3: Expressao $fromAI() (valor dentro da URL)
```
URL: https://api.exemplo.com/cotacao/{{ $fromAI('moeda', 'Codigo da moeda que o usuario informar. No formato BRL, USD', 'string') }}
```
Usar quando: o valor dinamico faz parte do path da URL, nao eh parametro

## Example

**Cenario:** Agente financeiro que busca cotacao de moeda em tempo real.

**Configuracao da Tool:**
```
Nome: cotacao
Descricao: Busca cotacao de moeda
Metodo: GET
URL: https://economia.awesomeapi.com.br/last/{{ $fromAI('moeda', 'Codigo da moeda que o usuario informar. No formato BRL, USD') }}
```

**Instrucao no System Prompt do Agente:**
```
Voce eh um assistente especialista financeiro que fala tudo sobre cambio.
Use a tool cotacao sempre que o usuario perguntar sobre a cotacao de alguma moeda.
```

**Fluxo real:**
1. Usuario digita: "Qual a cotacao do dolar?"
2. Agente identifica que eh pergunta sobre cotacao → aciona tool
3. `$fromAI()` converte "dolar" → "USD"
4. Requisicao GET para `https://economia.awesomeapi.com.br/last/USD`
5. JSON retorna → agente formata resposta bonita automaticamente

## Heuristics

| Situacao | Faca |
|----------|------|
| Parametro faz parte do path da URL | Use `$fromAI()` na expressao da URL |
| Parametro vai na query string (GET) | Use Query Parameters com botao AI |
| Parametro vai no body (POST) | Use Body com botao AI |
| API sem integracao nativa no N8N | Use HTTP Request Tool |
| API com integracao nativa | Use a tool especifica (ex: Slack, Google) |
| Agente nao esta chamando a tool | Adicione instrucao explicita no system prompt |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Deixar valor fixo na URL (ex: `/USD`) | Use `$fromAI()` para valor dinamico |
| Clicar botao AI no campo URL inteiro | Use `$fromAI()` apenas na parte dinamica, mantendo a base da URL fixa |
| Tool sem descricao | Descreva o que a tool faz — o agente usa isso como prompt |
| Agente sem instrucao de quando usar a tool | Adicione no system prompt: "Use a tool X quando Y" |
| Codar integracao manualmente | Use N8N tools — mesma integracao sem codigo |

## Arquitetura do Agente Completo

```
Chat Input → AI Agent → Resposta
                ↕
         [Chat Model: OpenAI]
         [Memory: Window Buffer]
         [Tool: HTTP Request (cotacao)]
```

Cinco blocos constroem um agente com: inteligencia (LLM), memoria, e integracoes externas.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
