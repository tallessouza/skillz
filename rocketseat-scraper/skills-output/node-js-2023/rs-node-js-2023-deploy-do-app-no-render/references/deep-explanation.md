# Deep Explanation: Deploy no Render

## Por que PostgreSQL e nao MySQL?

O instrutor (Diego) explica que o Postgres e o unico banco relacional verdadeiramente open source. MySQL nao e open source a menos que se use o fork MariaDB. Por isso, a grande maioria dos servicos de hospedagem (Render, Fly.io, Railway) suportam apenas Postgres como banco relacional.

## A promessa do Query Builder

Quando se usa um query builder como o Knex, a troca de banco de dados deveria "simplesmente funcionar". Essa aula comprova isso na pratica: a aplicacao foi desenvolvida inteira com SQLite e, ao trocar o client para `pg` e apontar a connection string para Postgres, tudo continua funcionando sem alterar nenhuma query.

## Por que z.coerce?

O Render envia a variavel PORT como string. Sem coerce, o Zod rejeita porque o schema espera number. O `z.coerce.number()` faz: "nao importa o tipo recebido, tente converter para numero". Se a conversao falhar, o default (3333) e usado. Essa tecnica do Zod e generalizavel para qualquer variavel ambiente que precisa de conversao de tipo.

## Sobre hospedagem gratuita — perspectiva do instrutor

Diego enfatiza: "de graca nao existe nem injecao na testa". Planos gratuitos sao para teste. Em producao com usuarios reais, voce vai precisar pagar. Bancos gratuitos no Render expiram em 90 dias. Maquinas free tem 500MB RAM e 0.1 CPU. Isso e importante para definir expectativas.

## Tres plataformas recomendadas

1. **Render.com** — Painel intuitivo, comunicacao simples, ideal para iniciantes
2. **Fly.io** — Mais poderoso, porem linguagem mais tecnica, melhor para quem ja tem experiencia com hospedagem
3. **Railway** — Tambem uma boa opcao com suporte a Postgres, Redis e multiplas tecnologias

## O que o Render faz por baixo (Docker)

O Render cria uma imagem Docker da aplicacao apos o build. Diego explica para iniciantes: "e como se fosse um zip da aplicacao com tudo que ela precisa ali dentro". Nas proximas execucoes, esse cache acelera o deploy.

## Dica do Insomnia: environments

Para alternar entre dev e prod sem trocar URLs manualmente:
1. Manage Environments > criar sub-environment "DEV" (cor roxa) com `url = http://localhost:3333`
2. Criar sub-environment "PROD" (cor verde) com `url = https://sua-app.onrender.com`
3. Nas rotas, usar `{{ url }}/transactions` via Ctrl+Space
4. Alternar entre ambientes com um clique