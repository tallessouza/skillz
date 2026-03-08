---
name: rs-seguranca-devs-boas-vindas
description: "Applies web security mindset and four-pillar framework when starting web projects or reviewing existing code for security concerns. Use when user asks to 'build an app', 'create an API', 'implement authentication', 'review security', 'check vulnerabilities', or 'start a new web project'. Provides the four-pillar security framework: authentication/HTTP, frontend (XSS/CSP), backend (injection/authorization), and security assessment (deps/secrets). Make sure to use this skill whenever starting a new web project or reviewing code for security concerns. Not for network infrastructure, hardware firewalls, assembly/reverse engineering, or SOC/SIEM tooling."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: seguranca-para-devs
  module: introduction
  tags: [security, web-security, mindset, overview, security-pillars]
---

# Seguranca para Programadores Web — Mapa Mental

> Seguranca web e responsabilidade do programador: os conceitos sao universais, independente de linguagem ou ferramenta.

## Key concept

Seguranca web para programadores cobre quatro pilares distintos. Cada feature que voce constroi toca pelo menos um deles. Conhecer o mapa completo evita pontos cegos.

## Decision framework

| Quando voce esta... | Pilar de seguranca | Perguntas-chave |
|---------------------|-------------------|-----------------|
| Implementando login, sessao, tokens | **Autenticacao e HTTP** | Headers corretos? Tokens expiram? Sessao segura? |
| Escrevendo JS, CSS, HTML5, usando APIs do browser | **Frontend** | XSS possivel? CSP configurado? Dados sensiveis no client? |
| Criando endpoints, queries, restricoes de acesso | **Backend** | Injection possivel? Autorizacao verificada? Input validado? |
| Avaliando postura geral, configurando ambiente | **Assessment e Infra** | Dependencias atualizadas? Secrets expostos? HTTPS enforced? |

## How to think about it

### Conceitos sobre linguagens
As vulnerabilidades sao as mesmas em Python, JavaScript, PHP, Ruby ou qualquer linguagem web. SQL injection funciona igual em todas. XSS funciona igual em todas. Ao aprender o conceito, voce protege qualquer stack.

### O programador e insubstituivel na seguranca
Existe uma parte da seguranca que SREs, infra e SOC nao conseguem resolver — so quem escreve o codigo pode corrigir. Validacao de input, logica de autorizacao, tratamento de dados sensiveis — isso e responsabilidade do dev.

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Seguranca e trabalho de infra/DevOps | Vulnerabilidades no codigo so o dev pode corrigir |
| Preciso aprender assembly e engenharia reversa | Para web, ataques sao HTTP, injection, XSS — nivel de aplicacao |
| Seguranca e uma etapa final do projeto | Cada linha de codigo e uma decisao de seguranca |
| Preciso de ferramentas pagas para comecar | Ferramentas open source ensinam os mesmos fundamentos |

## When to apply

- Inicio de qualquer projeto web novo (definir headers, autenticacao, CSP desde o dia 1)
- Code review de features que tocam autenticacao, autorizacao ou dados do usuario
- Escolha de bibliotecas e frameworks (avaliar postura de seguranca)
- Antes de deploy (checklist minimo de seguranca)

## Limitations

- Nao cobre seguranca de infraestrutura (redes, firewalls, cloud IAM)
- Nao substitui pentesting profissional ou auditoria de seguranca
- Nao aborda malware, engenharia reversa ou ataques a nivel de SO

## Troubleshooting

### Equipe nao prioriza seguranca
**Symptom:** Features entregues sem revisao de seguranca, vulnerabilidades descobertas em producao
**Cause:** Seguranca vista como responsabilidade exclusiva de outro time
**Fix:** Adote o modelo de quatro pilares: cada dev verifica seu pilar ao implementar. Seguranca nao e etapa — e propriedade de cada linha de codigo.

## Deep reference library

- [deep-explanation.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-boas-vindas-ao-curso/references/deep-explanation.md) — Filosofia do instrutor sobre seguranca como responsabilidade do dev, mapa completo dos 4 pilares
- [code-examples.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-boas-vindas-ao-curso/references/code-examples.md) — Checklist pratico por pilar
