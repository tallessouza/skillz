---
name: rs-seguranca-devs-boas-vindas
description: "Applies web security mindset when building web applications. Use when user asks to 'build an app', 'create an API', 'implement authentication', 'review security', or 'check vulnerabilities'. Provides the four-pillar security framework: authentication/HTTP, frontend, backend, and security assessment. Make sure to use this skill whenever starting a new web project or reviewing existing code for security concerns. Not for infrastructure, network configuration, assembly, reverse engineering, or SOC/SIEM tooling."
---

# Seguranca para Programadores Web — Mapa Mental

> Seguranca web e responsabilidade do programador: os conceitos sao universais, independente de linguagem ou ferramenta.

## Key concept

Seguranca web para programadores cobre quatro pilares distintos. Cada feature que voce constroi toca pelo menos um deles. Conhecer o mapa completo evita pontos cegos.

## Decision framework

| Quando voce esta... | Pilar de seguranca | Perguntas-chave |
|---------------------|-------------------|-----------------|
| Implementando login, sessao, tokens | **Autenticacao e HTTP** | Headers estao corretos? Tokens expiram? Sessao e segura? |
| Escrevendo JS, CSS, HTML5, usando APIs do browser | **Frontend** | XSS possivel? CSP configurado? Dados sensiveis expostos no client? |
| Criando endpoints, queries, restricoes de acesso | **Backend** | Injection possivel? Autorizacao verificada? Input validado? |
| Avaliando postura geral, configurando ambiente | **Assessment e Infra (para dev)** | Dependencias atualizadas? Secrets expostos? HTTPS enforced? |

## How to think about it

### Conceitos sobre linguagens

As vulnerabilidades sao as mesmas em Python, JavaScript, PHP, Ruby ou qualquer linguagem web. SQL injection funciona igual em todas. XSS funciona igual em todas. Ao aprender o conceito, voce protege qualquer stack.

### Ferramentas sao intercambiaveis

Ferramentas open source ensinam os mesmos conceitos que ferramentas enterprise (AWS WAF, Azure Security Center). O fundamento e o mesmo — a ferramenta e apenas o veiculo.

### O programador e insubstituivel na seguranca

Existe uma parte da seguranca que SREs, infra e SOC nao conseguem resolver — so quem escreve o codigo pode corrigir. Validacao de input, logica de autorizacao, tratamento de dados sensiveis — isso e responsabilidade do dev.

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Seguranca e trabalho de infra/DevOps | Vulnerabilidades no codigo so o dev pode corrigir |
| Preciso aprender assembly e engenharia reversa | Para web, os ataques sao HTTP, injection, XSS — nivel de aplicacao |
| Seguranca e uma etapa final do projeto | Cada linha de codigo e uma decisao de seguranca |
| Preciso de ferramentas pagas para comecar | Ferramentas open source ensinam os mesmos fundamentos |

## When to apply

- Inicio de qualquer projeto web novo (definir headers, autenticacao, CSP desde o dia 1)
- Code review de features que tocam autenticacao, autorizacao ou dados do usuario
- Escolha de bibliotecas e frameworks (avaliar postura de seguranca)
- Antes de deploy (checklist minimo de seguranca)

## Limitations

- Este mapa nao cobre seguranca de infraestrutura (redes, firewalls, cloud IAM)
- Nao substitui pentesting profissional ou auditoria de seguranca
- Nao aborda malware, engenharia reversa ou ataques a nivel de SO

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/seguranca-para/rs-seguranca-para-devs-boas-vindas-ao-curso/references/deep-explanation.md)
- [Code examples](../../../data/skills/seguranca-para/rs-seguranca-para-devs-boas-vindas-ao-curso/references/code-examples.md)
