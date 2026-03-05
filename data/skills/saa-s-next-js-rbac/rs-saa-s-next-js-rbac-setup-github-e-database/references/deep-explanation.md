# Deep Explanation: Setup GitHub e Database

## Por que usar a GitHub CLI?

O instrutor enfatiza o uso da CLI do GitHub (`gh`) em vez da interface web. A razao principal e a eficiencia: com um unico comando voce cria o repositorio, configura o remote e faz o push, tudo sem sair do terminal. Para projetos que ja tem Git inicializado localmente, a opcao "Push an existing local repository to GitHub" e ideal porque nao reinicializa o Git — apenas conecta ao remote e envia.

## Por que Neon para Postgres?

O Neon foi escolhido porque:
1. **Plano gratuito generoso** — 500MB de storage sem custo, suficiente para projetos em desenvolvimento e aplicacoes pequenas
2. **Postgres nativo** — nao e um banco compativel, e Postgres real com todas as features
3. **Auto-suspend** — o banco detecta automaticamente quando nao ha uso e suspende apos o tempo configurado (ex: 5 minutos), evitando custos desnecessarios

## Auto-suspend: quando usar e quando nao usar

O instrutor faz uma distincao importante sobre o auto-suspend:

- **Usar (5 min):** projetos pessoais, desenvolvimento, aplicacoes com uso moderado/intermitente ao longo do dia. O banco suspende quando ninguem esta usando e volta quando recebe uma conexao.
- **Nao usar:** aplicacoes em producao com grande quantidade de uso continuo. O cold start (tempo para o banco "acordar") pode causar latencia perceptivel para o usuario.

A logica e simples: se o banco vai ficar ocioso por longos periodos, auto-suspend economiza. Se o banco tem uso constante, auto-suspend so adiciona latencia desnecessaria.

## Fluxo geral de deploy

Esta aula e a primeira de uma sequencia de deploy. O instrutor estabelece a ordem:
1. **Repositorio no GitHub** — codigo versionado e acessivel para o provider de deploy
2. **Banco de dados** — Postgres provisionado com connection string pronta
3. **Deploy do back-end** — proximo passo, usando os dois anteriores

A connection string do Neon sera usada como variavel de ambiente no provider de deploy (configurado nas aulas seguintes).

## Visibilidade do repositorio

O instrutor escolhe `private` porque esta gravando aulas e nao quer que o repositorio apareca no perfil publico. Em geral, a recomendacao e manter projetos em desenvolvimento como privados e tornar publicos apenas quando prontos, se for o caso.