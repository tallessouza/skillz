# Deep Explanation: Introducao — API REST com Node.js

## Visao do instrutor (Diego, Rocketseat)

O Diego posiciona este projeto como um ciclo completo "do zero ao deploy". A enfase nao e apenas em fazer a API funcionar, mas em cobrir **todo o ecossistema** que uma API de producao precisa:

### Porque "do zero ao deploy" importa

A maioria dos tutoriais para em "funciona no localhost". O diferencial aqui e que o projeto cobre:

1. **Codigo** — Fastify + TypeScript
2. **Dados** — SQL + Knex (query builder, nao ORM)
3. **Qualidade** — Testes automatizados + Linting
4. **Operacao** — Variaveis ambiente + Deploy automatizado

### Fastify como escolha de framework

O Diego chama Fastify de "micro framework para Node". A escolha e deliberada:
- Fastify e mais performatico que Express
- Tem sistema de plugins nativo
- Suporta schema validation out of the box
- Ecossistema crescente e ativo

### Knex como query builder

A escolha de Knex (nao Prisma, nao TypeORM) indica preferencia por:
- Controle direto sobre o SQL gerado
- Migrations como cidadaos de primeira classe
- Menor abstracao = menos surpresas
- Aprender SQL de verdade, nao so ORM magic

### Testes automatizados — a filosofia

Diego menciona que vai explicar "toda a diferenca sobre os tipos de testes", "quais priorizar", "quais ter mais, quais ter menos". Isso indica uma abordagem pragmatica:
- Nao e "100% coverage"
- E "testar o que importa"
- Priorizacao consciente de tipos de teste

### Deploy automatizado — CI/CD

A enfase em "cada vez que a gente altera alguma coisa no codigo, subir automaticamente" mostra foco em:
- Feedback loop rapido
- Reducao de erro humano no deploy
- Pratica profissional desde o inicio

### Linting como ferramenta de time

Diego descreve linting como "padronizar nosso codigo entre o nosso time". Nao e sobre preferencia pessoal — e sobre consistencia coletiva. Isso e especialmente importante para:
- Onboarding de novos devs
- Code review mais focado em logica (nao estilo)
- Reducao de conflitos de merge por formatacao

## Publico alvo

Diego indica que e especialmente valioso "se for um dos seus primeiros contatos com o Node de forma mais aprofundada". O projeto serve como:
- Primeiro projeto "serio" com Node
- Base para projetos profissionais futuros
- Referencia de stack e boas praticas