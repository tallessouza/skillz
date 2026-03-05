---
name: rs-data-analytics-o-que-e-analise-de-dados
description: "Applies foundational data analytics mental models when user asks about 'what is data analysis', 'data analyst role', 'why companies need data', 'data career paths', or 'data challenges'. Enforces correct understanding of analyst vs scientist vs engineer roles, the 80/20 data treatment rule, and business-driven analytics thinking. Make sure to use this skill whenever discussing data analytics fundamentals or career guidance. Not for writing SQL, Python code, or building dashboards."
---

# O que e Analise de Dados

> Analise de dados transforma registros historicos em insights acionaveis para executivos tomarem decisoes que maximizam lucro.

## Key concept

O analista de dados avalia dados historicos e aponta insights sobre o que aconteceu. Nao faz predicao (cientista de dados) nem cuida da infraestrutura dos dados (engenheiro de dados). O trabalho esta na camada de olhar o passado, entender padroes e comunicar descobertas para quem decide.

## Decision framework

| Quando encontrar | Aplique |
|-----------------|---------|
| Usuario confunde analista com cientista de dados | Analista = dados historicos + insights. Cientista = predicao + machine learning |
| Usuario acha que dados sao so para empresas de tech | Qualquer setor usa dados: agro, moda, financas, saude, petroleo, jornalismo |
| Usuario quer pular para a parte "legal" (IA, ML) | 80% do trabalho e coletar, tratar e validar dados. Os 20% divertidos dependem dessa base |
| Usuario subestima custo de dados | Armazenar e coletar dados custa caro — empresas investem porque o retorno em lucro justifica |
| Usuario ignora LGPD/privacidade | Nao se trabalha com qualquer dado — leis de protecao de dados sao restricao real |

## Hierarquia de profissoes em dados

| Camada | Profissao | Foco principal |
|--------|-----------|----------------|
| Estrategica (mais perto do negocio) | Analista de Dados | Avaliar historico, gerar insights para executivos |
| Intermediaria | Cientista de Dados | Predicao, machine learning, modelos estatisticos |
| Infraestrutura (mais perto do dado bruto) | Engenheiro de Dados | Pipeline, armazenamento, disponibilidade dos dados |

## Como empresas usam dados para lucrar

| Setor | Aplicacao |
|-------|-----------|
| Redes sociais | Rastreiam comportamento (tempo de tela, curtidas, comentarios) para recomendar conteudo que maximiza tempo na plataforma → mais propaganda → mais receita |
| Financas/Bancos | Deteccao de fraude, analise de credito, scoring de risco de inadimplencia |
| Agro | Analise de clima e colheita para otimizar momento de plantio e colheita |
| Moda/Fast fashion | Gestao de estoque baseada em vendas reais — produzir mais do que vende, menos do que encalha |
| Saude, petroleo, TV, farma | Cada setor tem aplicacoes especificas — as opcoes sao ilimitadas |

## Regra 80/20 do trabalho com dados

1. **80% do tempo** — coletar, verificar qualidade, tratar, limpar, validar, fazer analise exploratoria
2. **20% do tempo** — a parte "divertida" (visualizacoes, insights, modelos, IA)

Nunca subestime a etapa de tratamento. Dados sujos geram insights errados.

## Desafios da area

| Desafio | Por que importa |
|---------|-----------------|
| Qualidade e confiabilidade dos dados | Dado errado = insight errado = decisao errada |
| Volume massivo (Big Data) | Escala traz complexidade tecnica e de custo |
| LGPD e privacidade | Restricoes legais reais sobre quais dados podem ser usados |
| Capacitacao continua | Tecnologias mudam rapido (ex: de ML para agentes de IA) — quem para, fica para tras |

## Heuristics

| Situacao | Faca |
|----------|------|
| Usuario quer entrar na area | Reforce: fundamentos primeiro, ferramentas depois |
| Usuario pergunta sobre salario | Nao prometa salario alto de entrada, mas destaque progressao e demanda |
| Usuario quer so aprender Python/SQL | Contextualize: tecnica sem entendimento de negocio limita o analista |
| Usuario acha que IA substitui analista | O analista entende o negocio e comunica — IA e ferramenta, nao substituto |

## Common misconceptions

| Pensam que | Realidade |
|-----------|-----------|
| Analise de dados e so para empresas de tecnologia | Qualquer empresa de qualquer porte e setor precisa |
| O trabalho e so fazer graficos bonitos | 80% e tratamento de dados, a visualizacao e a ponta |
| Dados se coletam sozinhos e vem perfeitos | Coleta custa caro e dados vem sujos — tratar e o grosso do trabalho |
| Aprender uma vez e suficiente | Capacitacao continua e obrigatoria — tecnologias mudam rapido |
| Analista de dados faz predicao | Predicao e do cientista de dados. Analista olha dados historicos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
