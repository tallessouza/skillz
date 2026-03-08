---
name: rs-clean-code
description: "Enforces clean code best practices when writing functions, naming variables, structuring React components, applying SOLID principles, or implementing DDD patterns. Make sure to use this skill whenever refactoring code for readability, creating pure components, decomposing React UI, handling conditionals, or organizing domain-driven architecture. Not for DevOps, infrastructure, or database schema design."
---

# Clean Code — Decision Tree Router

> Siga a árvore de decisão abaixo para chegar na skill certa.

## Decision Tree

```
O que você está fazendo?
│
├─ Modelando domínio (DDD)?
│  ├─ Primeira vez modelando → [principios-de-ddd.md](references/principios-de-ddd.md)
│  ├─ Precisa de exemplo prático → [exemplo-pratico-de-ddd.md](references/exemplo-pratico-de-ddd.md)
│  └─ Conectando DDD com SOLID → [unindo-ddd-ao-solid.md](references/unindo-ddd-ao-solid.md)
│
├─ Estruturando arquitetura (SOLID)?
│  ├─ Aprendendo princípios → [principios-de-solid.md](references/principios-de-solid.md)
│  ├─ Precisa de exemplo prático → [exemplo-pratico-de-solid.md](references/exemplo-pratico-de-solid.md)
│  └─ Invertendo dependências (DIP) → [unindo-ddd-ao-solid.md](references/unindo-ddd-ao-solid.md)
│
├─ Escrevendo código (naming, condicionais, funções)?
│  ├─ Nomeando variáveis → [nomenclatura-de-variaveis-download-exercicio.md](references/nomenclatura-de-variaveis-download-exercicio.md)
│  ├─ Nomeando booleanos (causa vs efeito) → [causa-vs-efeito.md](references/causa-vs-efeito.md)
│  ├─ Escrevendo condicionais (early return, sem else) → [regras-em-condicionais.md](references/regras-em-condicionais.md)
│  ├─ Parâmetros e desestruturação → [parametros-e-desestruturacao.md](references/parametros-e-desestruturacao.md)
│  ├─ Magic numbers → [numeros-magicos.md](references/numeros-magicos.md)
│  ├─ Conversões de tipo (evitar !!, +, '') → [evite-syntatic-sugars.md](references/evite-syntatic-sugars.md)
│  ├─ Código em inglês → [codigo-em-ingles.md](references/codigo-em-ingles.md)
│  └─ Comentários vs documentação → [comentarios-vs-documentacao.md](references/comentarios-vs-documentacao.md)
│
├─ Escrevendo React components?
│  ├─ Componente puro (sem side effects) → [componentes-puros.md](references/componentes-puros.md)
│  ├─ Composição vs customização (slots, children) → [composicao-vs-customizacao.md](references/composicao-vs-customizacao.md)
│  ├─ Condicionais no render (ternary, &&) → [condicionais-no-render.md](references/condicionais-no-render.md)
│  ├─ Desacoplando componentes → [desacoplando-componentes.md](references/desacoplando-componentes.md)
│  └─ Funções e eventos no React → [funcoes-e-eventos-no-react.md](references/funcoes-e-eventos-no-react.md)
│
└─ Entendendo clean code em geral?
   ├─ O que é clean code → [o-que-e-ou-nao-e-clean-code.md](references/o-que-e-ou-nao-e-clean-code.md)
   ├─ Princípios fundamentais → [principios-do-codigo-limpo.md](references/principios-do-codigo-limpo.md)
   └─ Clean code no back-end → [clean-code-no-back-end.md](references/clean-code-no-back-end.md)
```

## Roteamento pelo orquestrador

Quando chamado pelo `rs-implementation-workflow`:
- **Fase 1 (DDD)** → Siga o ramo "Modelando domínio"
- **Fase 2 (SOLID)** → Siga o ramo "Estruturando arquitetura"
- **Fase 3 (Implementação)** → Siga o ramo "Escrevendo código" + "Escrevendo React components" conforme stack

## Cross-References — Decision Coverage

Quando este router nao cobre uma decisao, delegue para:

| Decisao | Delegue para | Motivo |
|---------|-------------|--------|
| D1_RUNTIME (Node.js) | [rs-node-js](../rs-node-js/SKILL.md) | Runtime, Fastify, NestJS |
| D1_FRAMEWORK_WEB (Next.js) | [rs-next-js](../rs-next-js/SKILL.md) | Next.js / React |
| D3_TESTING (Jest/Playwright) | [rs-testes-e](../rs-testes-e/SKILL.md) | Testes |
| D3_DEPLOY (Docker/CI) | [rs-devops](../rs-devops/SKILL.md) | Deploy, CI/CD |
