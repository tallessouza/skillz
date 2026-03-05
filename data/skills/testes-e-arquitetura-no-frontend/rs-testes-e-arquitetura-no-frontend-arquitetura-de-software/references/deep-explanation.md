# Deep Explanation: Arquitetura de Software no Frontend

## Definicoes dos grandes nomes

O instrutor traz tres definicoes complementares:

1. **Robert Martin (Uncle Bob):** "Arquitetura e a arte de adiar decisoes." Manter opcoes abertas o maximo possivel. Conecta diretamente com o Open/Closed Principle do SOLID.

2. **Ralph Johnson:** "Arquitetura e sobre as coisas importantes. O que quer que isso seja." Definicao propositalmente generica — o que e "importante" depende do contexto.

3. **Martin Fowler:** "As decisoes que sao dificeis de mudar, uma vez implementadas, sao consideradas arquiteturais." Esta e a definicao mais pratica e operacional.

## Arquitetura vs Design

O instrutor faz uma distincao crucial: **"Arquitetura e design, mas nem todo design e arquitetura."**

- **Arquitetura:** lado publico das interfaces, organizacao de alto nivel. Exemplo: escolher Next.js.
- **Design:** detalhes internos de implementacao. Exemplo: como organizar componentes.

A imagem mental mais importante da aula: **tres circulos concentricos onde arquitetura restringe design que restringe codigo.** Escolher React/Next ja te restringe — voce nao vai aplicar POO classica dentro de componentes funcionais, por exemplo.

## Os dois valores do software

1. **Comportamento:** o que o sistema faz — fazer a maquina gerar ou economizar dinheiro.
2. **Estrutura (arquitetura):** a maleabilidade. O "soft" de software. A facilidade de ser alterado para atender novas necessidades.

O instrutor enfatiza: "A unica certeza que a gente tem e que o software vai evoluir e as necessidades vao mudar." Por isso arquitetura importa.

## Primeira lei da arquitetura

**Tudo e trade-off.** Nao existem balas de prata. Sempre depende: do caso, da realidade, da equipe, de orcamento, do tempo.

## Modularidade, Coesao e Acoplamento

- **Modularidade:** organizar e agrupar codigo relacionado.
- **Coesao:** medida de quao relacionados estao as partes do modulo (componente, pagina, funcao). **Alta coesao e desejavel.**
- **Acoplamento:** medida de dependencia entre modulos. **Baixo acoplamento e desejavel.**

## SOLID adaptado para frontend funcional

O instrutor faz um ponto importante: "Todos esses conceitos foram pensados para POO. A gente tem que adaptar para o frontend funcional com hooks do React."

A **triade mais importante** segundo o instrutor:
1. **Single Responsibility Principle (SRP)**
2. **Open/Closed Principle (OCP)** — aberto para extensao, fechado para modificacao
3. **Dependency Inversion Principle (DIP)** — modulos de alto nivel nao dependem de baixo nivel, ambos dependem de abstracoes

Sobre DIP especificamente: "Em vez de importar tudo dentro do componente, inverta as dependencias. Quem chamar esse componente deve passar pra ele o que ele precisa." Isso ajuda enormemente nos testes — em vez de depender de mocks, voce tem alternativas melhores para testar componentes e funcoes.

## Estilos arquiteturais — visao geral

O instrutor apresenta quatro estilos para contexto:

### Monolito em camadas
- **Pros:** simplicidade, custo inicial baixo, familiaridade (muitas equipes adotam acidentalmente)
- **Contras:** acoplamento acidental entre camadas, escalabilidade limitada (escalar tudo mesmo se so uma parte precisa)

### Microservicos
- **Pros:** deploy independente, alta escalabilidade, permite diferentes linguagens por servico
- **Contras:** complexidade operacional (monitoramento, logs distribuidos, orquestracao), desafios de consistencia de dados (sagas)

### Event-Driven Architecture
- **Pros:** forte desacoplamento, resiliencia, facil adicionar novos servicos
- **Contras:** rastreabilidade complexa, consistencia eventual

### Serverless
- **Pros:** foco na logica de negocio, custo sob demanda
- **Contras:** vendor lock-in, latencia de cold start

## Insight sobre decisoes acidentais

"Se voce nao esta adotando conscientemente nenhum padrao de arquitetura, voce esta seguindo de forma acidental algum padrao." O instrutor enfatiza que nao decidir ja e uma decisao — e geralmente resulta em monolito acidental com acoplamento entre camadas.