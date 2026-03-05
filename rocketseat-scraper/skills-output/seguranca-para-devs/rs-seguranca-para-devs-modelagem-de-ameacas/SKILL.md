---
name: rs-seguranca-devs-modelagem-ameacas
description: "Applies threat modeling practices when designing system architecture, reviewing security, or planning infrastructure. Use when user asks to 'model threats', 'analyze security', 'draw architecture diagram', 'identify vulnerabilities', 'review attack surface', or 'plan security mitigations'. Guides STRIDE-based threat identification, trust boundary mapping, and mitigation planning. Make sure to use this skill whenever discussing system security architecture or threat analysis. Not for code-level security fixes, OWASP code patterns, or penetration testing execution."
---

# Modelagem de Ameacas

> Ao projetar ou revisar sistemas, identifique ameacas antes do agressor mapeando limites de confianca, atores externos e vetores de ataque com o padrao STRIDE.

## Rules

1. **Sempre desenhe antes de mitigar** — mapeie componentes, fluxos de dados e limites de confianca antes de listar ameacas, porque sem o mapa voce esquece vetores de ataque
2. **Use STRIDE como checklist** — Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege — porque cobre as 6 categorias fundamentais de ameaca
3. **Defina Trust Boundaries explicitamente** — separe o que voce controla do que nao controla (parceiros, internet, VPN interna), porque cada fronteira e um ponto de ataque
4. **Marque componentes fora de escopo** — sistemas de terceiros que voce nao desenvolve devem ser marcados como fora de escopo com justificativa, porque voce nao pode mitigar o que nao controla
5. **Cada ameaca vira tarefa** — ameaca identificada sem tarefa associada e ameaca ignorada, porque modelagem sem acao e documentacao morta
6. **Repita periodicamente** — a cada 3 meses ou quando a arquitetura mudar, refaca o exercicio com a equipe, porque novos componentes trazem novos vetores

## Como modelar

### Passo 1: Mapear componentes

```
Identifique:
- Processos (aplicacoes, APIs, proxies)
- Stores (bancos de dados, caches, filas)
- Atores externos (usuarios, sistemas parceiros, servicos terceiros)
- Fluxos de dados (REST, GraphQL, conexoes de banco, filas)
```

### Passo 2: Definir Trust Boundaries

```
Para cada par de componentes, pergunte:
- Se o componente A for comprometido, o componente B esta automaticamente comprometido?
- Se SIM → mesma trust boundary
- Se NAO → trust boundaries separadas

Exemplos tipicos:
- Internet publica ↔ VPN interna
- Aplicacao ↔ Banco de dados (usuario limitado, nao root)
- Sistema proprio ↔ Sistema de parceiro (fora de escopo)
```

### Passo 3: Aplicar STRIDE por componente

| Categoria | Pergunta |
|-----------|----------|
| **Spoofing** | Alguem pode se passar por outro ator? |
| **Tampering** | Alguem pode alterar dados em transito ou em repouso? |
| **Repudiation** | Alguem pode negar ter feito uma acao? |
| **Information Disclosure** | Dados sensiveis podem vazar? |
| **Denial of Service** | O servico pode ser derrubado? |
| **Elevation of Privilege** | Alguem pode obter permissoes que nao deveria? |

### Passo 4: Definir mitigacoes

```
Para cada ameaca:
1. Descreva o cenario de ataque
2. Defina a severidade (critico/alto/medio/baixo)
3. Proponha mitigacao concreta
4. Crie tarefa rastreavel
5. Status: Open → Mitigated (quando implementado)
```

## Example

**Cenario: Proxy de APIs com autenticacao**

Componentes:
- Proxy de APIs (processo principal)
- PostgreSQL (store de credenciais)
- Sistemas parceiros (atores externos, fora de escopo)
- Sistemas internos A e B (na VPN)

Trust Boundaries:
- Internet publica ↔ Proxy (parceiros acessam via HTTPS)
- Proxy ↔ PostgreSQL (usuario com permissoes limitadas, nao root)
- VPN interna ↔ Sistemas internos

**Ameaca identificada:** Credential Stuffing

```
Cenario: Atacante usa credenciais vazadas para tentar login na API
Severidade: Alta
Mitigacao:
  1. Token secreto compartilhado por parceiro (pre-autenticacao)
  2. Rate limiting por parceiro
  3. Validar tentativas contra base Have I Been Pwned
  4. Alertar administradores quando senha vazada for usada
Status: Open → criar tarefa
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo componente adicionado ao sistema | Atualize o diagrama e reavalie STRIDE |
| Integracao com servico externo | Marque como fora de escopo, defina trust boundary |
| Banco de dados acessado por aplicacao | Crie usuario com permissoes minimas, nunca root |
| API publica | Avalie credential stuffing, brute force, rate limiting |
| Mudanca de arquitetura | Reagende sessao de modelagem com a equipe |
| Equipe nova no projeto | Jogue Cornucopia para onboarding em seguranca |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Modelar ameacas sozinho | Reuna 3-6 pessoas da equipe |
| Listar ameacas sem diagrama | Desenhe o diagrama primeiro |
| Tratar modelagem como atividade unica | Repita a cada 3 meses |
| Deixar ameaca sem tarefa | Toda ameaca vira card/issue |
| Usar usuario root no banco de dados | Crie usuario com permissoes limitadas |
| Ignorar componentes de terceiros | Marque como fora de escopo com justificativa |
| Achar que checklist garante seguranca | Seguranca e trabalho criativo e continuo |

## Ferramentas

| Ferramenta | Tipo | Uso |
|------------|------|-----|
| **OWASP Threat Dragon** | Diagramas STRIDE (open source) | Desenhar e documentar ameacas |
| **OWASP Cornucopia** | Jogo de cartas (3-6 jogadores) | Pensar fora da caixa em equipe |
| **Microsoft Threat Modeling Tool** | Diagramas STRIDE | Alternativa ao Threat Dragon |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
