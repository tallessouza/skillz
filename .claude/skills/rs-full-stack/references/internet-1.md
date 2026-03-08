---
name: rs-full-stack-internet-1
description: "Applies foundational internet and web architecture concepts when designing or explaining web applications. Use when user asks to 'explain how the web works', 'what is DNS', 'how does a browser find a server', 'client-server architecture', or 'how the internet works'. Ensures correct use of terms like IP, DNS, domain, backbone, intranet vs internet, and client-server file exchange. Make sure to use this skill whenever explaining web fundamentals or onboarding junior developers. Not for network engineering, TCP/IP deep protocol analysis, or infrastructure deployment."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: web-fundamentals
  tags: [internet, web, dns, http, fundamentals]
---

# Internet e Web — Fundamentos

> A internet e a infraestrutura de computadores interligados; a web e o conjunto de servicos construidos sobre essa infraestrutura.

## Key concept

A internet e uma rede mundial de computadores fisicamente interligados (cabos submarinos, backbone terrestre, roteadores). A web e a camada de servicos — sites, email, streaming — que funciona sobre essa infraestrutura. Programacao web significa construir servicos que serao distribuidos atraves dessa rede para qualquer pessoa no mundo.

A analogia central: a web e uma teia de aranha (web = teia em ingles), onde cada ponto da teia e um computador conectado a todos os outros.

## Decision framework

| Quando encontrar | Aplique |
|-----------------|---------|
| Alguem confunde internet com web | Internet = infraestrutura fisica. Web = servicos construidos sobre ela |
| Duvida sobre como um site e acessado | Dominio → DNS → IP → roteadores → servidor → arquivos devolvidos |
| Rede interna vs externa | Intranet = rede local (casa/empresa). Internet = rede externa global |
| "Por que programacao WEB?" | Porque os arquivos (HTML/CSS/JS) sao distribuidos pela internet para qualquer pessoa |

## How to think about it

### O caminho de uma requisicao

```
Usuario digita skillz.com.br
       │
       ▼
   Navegador
       │
       ▼
   Roteador local (sua casa)
       │
       ▼
   Provedor de internet (Vivo, Oi, etc.)
       │
       ▼
   DNS converte dominio → IP (o "CEP" do computador)
       │
       ▼
   Cadeia de roteadores (backbone)
       │
       ▼
   Servidor (computador que guarda os arquivos)
       │
       ▼
   Devolve arquivos: HTML, CSS, JavaScript
       │
       ▼
   Navegador renderiza o site
```

### A analogia do CEP

IP e como o CEP de um endereco — um numero dificil de memorizar. Dominios sao como o nome da rua: `skillz.com.br` e facil de lembrar. O DNS e o sistema que converte o nome legivel no numero real (IP).

### Por que isso importa para o programador

Voce nao precisa memorizar IPs ou entender cada roteador. Mas eventualmente vai precisar:
- Configurar um dominio
- Debugar problemas de IP/DNS
- Entender que seu site sao arquivos servidos por um computador remoto

## Glossario tecnico

| Termo | Significado |
|-------|------------|
| **Internet** | Rede mundial de computadores fisicamente interligados |
| **Web** | Servicos construidos sobre a internet (sites, email, streaming) |
| **Intranet** | Rede interna (computadores conectados localmente) |
| **IP** | Internet Protocol — endereco numerico unico de cada computador na rede |
| **DNS** | Domain Name System — converte nomes de dominio em enderecos IP |
| **Dominio** | Nome legivel que aponta para um IP (ex: skillz.com.br) |
| **Backbone** | Infraestrutura fisica principal (cabos submarinos, terrestres) |
| **Servidor** | Computador que armazena e devolve arquivos quando requisitado |

## Common misconceptions

| Pensam que | Realidade |
|-----------|-----------|
| Internet e web sao a mesma coisa | Internet = infraestrutura. Web = servicos sobre ela |
| A comunicacao e toda "pelo ar" | Grande parte e via cabos fisicos submarinos e subterraneos (backbone) |
| Preciso saber IPs para programar | Voce usa dominios; o DNS resolve o IP automaticamente |
| Um site "esta na nuvem" magicamente | Um site sao arquivos em um computador servidor, acessado via internet |

## When to apply

- Explicar fundamentos web para iniciantes
- Contextualizar por que se chama "programacao web"
- Diagnosticar problemas de DNS ou dominio
- Entender a cadeia completa de uma requisicao HTTP

## Limitations

- Esta skill cobre o modelo conceitual, nao protocolos detalhados (TCP/IP, HTTP, TLS)
- Nao substitui conhecimento de redes para devops/infra
- O modelo DNS apresentado e simplificado (nao cobre resolvers recursivos, TTL, etc.)

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Site nao carrega mas internet funciona | Problema de DNS ou dominio | Verificar DNS com `nslookup dominio.com` |
| "ERR_NAME_NOT_RESOLVED" no navegador | DNS nao consegue resolver o dominio | Verificar se o dominio esta correto ou trocar DNS para 8.8.8.8 |
| Localhost nao responde | Servidor local nao esta rodando | Iniciar o servidor na porta correta |
| Confusao entre internet e web | Conceitos misturados | Internet = infraestrutura fisica, Web = servicos sobre ela |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases do instrutor
- [code-examples.md](references/code-examples.md) — Diagramas expandidos e exemplos praticos