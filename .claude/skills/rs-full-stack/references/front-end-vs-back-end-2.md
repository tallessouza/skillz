---
name: rs-full-stack-front-end-vs-back-end
description: "Applies client-server mental model when discussing web architecture. Use when user asks 'what is front-end', 'what is back-end', 'how does a website work', 'client-server', or 'how browser communicates with server'. Guides architectural decisions by clarifying front-end vs back-end boundaries. Make sure to use this skill whenever explaining web fundamentals or deciding where logic belongs. Not for specific framework setup, deployment, or database design."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos-web
  tags: [web, frontend, backend, client-server, architecture]
---

# Front-end vs Back-end

> Tudo que o usuario pode ver e interagir e front-end (cliente); tudo que acontece no servidor, invisivel ao usuario, e back-end.

## Key concept

A web funciona no modelo **cliente-servidor**: o navegador (cliente/front-end) faz um pedido, o servidor (back-end) processa e devolve uma resposta. O navegador renderiza essa resposta como a pagina que o usuario ve.

## Decision framework

| Quando voce encontrar | Aplique |
|----------------------|---------|
| Logica de exibicao, interacao, layout | Front-end (HTML, CSS, JavaScript no navegador) |
| Logica de negocio, processamento, armazenamento | Back-end (servidor) |
| Duvida sobre onde colocar algo | Pergunte: "o usuario precisa ver/interagir com isso?" — se sim, front-end; se nao, back-end |
| Comunicacao entre cliente e servidor | Protocolos (HTTP, IP) — o navegador envia request, servidor devolve response |

## How to think about it

### Analogia da farmacia

O **cliente** vai a farmacia e pede um remedio ao farmaceutico. O farmaceutico vai aos **fundos** buscar o remedio e traz de volta. O cliente so interage com o balcao (front) — nunca ve o estoque nos fundos (back).

- **Cliente** = usuario + navegador (front-end)
- **Farmaceutico/fundos** = servidor (back-end)
- **Pedido** = request HTTP
- **Remedio entregue** = response (HTML, CSS, JS, imagens)

### Fluxo real

```
Usuario digita google.com
       │
       ▼
Navegador (front-end) envia request
       │ (protocolos: IP, HTTP)
       ▼
Servidor (back-end) processa
       │
       ▼
Resposta: HTML, CSS, JS, imagens
       │
       ▼
Navegador renderiza a pagina
       │
       ▼
Usuario ve e interage com o resultado
```

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Front-end e so "a parte bonita" | Front-end inclui toda logica de interacao, estado local, e comunicacao com o servidor |
| Back-end e "o banco de dados" | Back-end e o servidor inteiro: logica de negocio, autenticacao, processamento, E acesso a dados |
| O navegador so mostra HTML | O navegador executa JavaScript, gerencia estado, faz novas requests — e uma plataforma completa |
| Front-end e back-end sao independentes | Eles se comunicam constantemente via requests e responses |

## When to apply

- Ao decidir onde implementar uma funcionalidade nova
- Ao debugar — saber se o problema esta no cliente ou no servidor
- Ao planejar arquitetura de uma aplicacao web
- Ao explicar conceitos web para iniciantes

## Limitations

- Essa divisao e simplificada — existem padroes como SSR (Server-Side Rendering) e SSG (Static Site Generation) que borram a linha entre front e back
- Aplicacoes modernas com frameworks full-stack (Next.js, Nuxt) executam codigo em ambos os lados

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Logica de negocio exposta no front-end | Decisao incorreta sobre onde colocar a logica | Mova validacoes criticas e regras de negocio para o back-end |
| Dados sensiveis visiveis no navegador | Informacoes retornadas pela API sem filtragem | Filtre os campos no back-end antes de enviar a resposta |
| Pagina nao carrega mas API funciona | Problema no front-end (JS, CSS, HTML) | Inspecione o console do navegador para erros de renderizacao |
| API retorna dados mas pagina mostra vazio | Front-end nao esta processando a resposta corretamente | Verifique o fetch/axios e o parsing do JSON no front-end |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Exemplos praticos de comunicacao cliente-servidor