---
name: rs-discover-front-end-e-back-end
description: "Applies client-server architecture mental model when designing or explaining web applications. Use when user asks to 'explain front-end and back-end', 'how does a website work', 'client-server communication', 'what happens when I access a URL', or 'browser and server interaction'. Make sure to use this skill whenever explaining web fundamentals or architecting client-server systems. Not for specific framework setup, deployment, or database design."
---

# Front-end e Back-end

> Toda aplicação web é uma troca de dados entre um cliente (front-end) e um servidor (back-end).

## Key concept

Front-end é tudo que acontece no navegador (cliente). Back-end é tudo que acontece no servidor. A comunicação entre eles segue um ciclo: o cliente faz um pedido, o servidor processa e responde.

A analogia central: uma farmácia. O cliente é a pessoa que pede o remédio. O browser é o farmacêutico que traduz o pedido. Os fundos da farmácia são o servidor, onde o remédio é buscado.

## Decision framework

| Quando encontrar | Aplique |
|-----------------|---------|
| Usuário digita URL no browser | Cliente (browser) envia pedido ao servidor |
| Servidor processa e responde | Retorna HTML, CSS, JS, imagens — uma cópia da página |
| Recurso não existe no servidor | Servidor responde com erro (ex: 404 Not Found) |
| Precisa de lógica visível ao usuário | Front-end (HTML, CSS, JavaScript) |
| Precisa de lógica que roda no servidor | Back-end (servidor remoto) |

## How to think about it

### O ciclo request-response

```
[Browser/Cliente] --pedido (URL)--> [Servidor]
[Browser/Cliente] <--resposta (HTML, CSS, JS, imagens)-- [Servidor]
```

1. Usuário digita `google.com` no navegador
2. Browser traduz esse pedido e envia ao servidor
3. Servidor (computador ligado em algum lugar do mundo) processa
4. Se encontra: responde com os arquivos da página (HTML, CSS, JS, imagens)
5. Se não encontra: responde com erro (404 Not Found)
6. Browser renderiza a resposta para o usuário

### Mapeamento dos termos

| Termo técnico | Analogia da farmácia | Função |
|--------------|----------------------|--------|
| Browser (Chrome, Firefox, Safari) | Farmacêutico | Traduz o pedido do cliente e apresenta a resposta |
| Servidor | Fundos da farmácia | Armazena e entrega o que foi pedido |
| Cliente/Front-end | Pessoa + farmacêutico | Toda a interação do lado de quem pede |
| Back-end | Fundos da farmácia | Toda a lógica do lado de quem responde |
| URL (google.com) | Nome do remédio | O pedido específico sendo feito |
| HTML, CSS, JS, imagens | O remédio entregue | Os arquivos que compõem a resposta |

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Front-end e back-end são linguagens | São **lados** da comunicação — cada lado usa suas próprias tecnologias |
| O site "mora" no navegador | O navegador recebe uma **cópia** dos arquivos do servidor a cada pedido |
| Front-end é só visual | Front-end é tudo que roda no cliente, incluindo lógica JavaScript |
| O servidor é algo abstrato | É um computador real, ligado em algum lugar do mundo |

## When to apply

- Ao explicar arquitetura web para iniciantes
- Ao decidir onde colocar lógica (cliente vs servidor)
- Ao debugar problemas de comunicação entre browser e servidor
- Ao entender códigos de status HTTP (200 OK, 404 Not Found)

## Limitations

- Esta visão é simplificada — não cobre CDNs, caching, proxies reversos, ou arquiteturas serverless
- A analogia da farmácia não captura aspectos como autenticação, estado, ou conexões persistentes

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações