# Deep Explanation: Node.js Fundamentos

## A historia da V8 e o insight de Ryan Dahl

O instrutor explica que quando o Google Chrome surgiu, sua grande revolucao perante outros navegadores (Firefox, Internet Explorer) era a **V8** — um motor de JavaScript que conseguia ler, entender e interpretar JavaScript de maneira muito performatica.

Ryan Dahl (o instrutor menciona "Ryan Dahlke" mas o nome correto e Ryan Dahl) teve o insight fundamental: se os browsers entendem JavaScript para manipular interfaces (colocar elementos em tela, remover elementos), por que nao extrair esse mecanismo do browser e colocar numa plataforma independente para usar JavaScript para **outros propositos**?

O Node adaptou a V8 que rodava dentro do Chrome (para manipulacao de frontend) para entao utilizar JavaScript para:
- Construcao de servidores HTTP
- Aplicacoes CLI
- Aplicacoes mobile
- Qualquer ferramenta que precise executar JavaScript fora do browser

## Non-blocking IO — Explicacao do instrutor

O instrutor descreve non-blocking IO como "input e output nao bloqueante", significando que no Node e possivel realizar acoes de forma parcial sem bloquear outras acoes de acontecerem ao mesmo tempo. Ele descreve isso como "uma concorrencia entre nossos processos".

A consequencia pratica direta disso e o **streaming**: a habilidade de ler ou escrever dados de forma parcial enquanto continua executando outras tarefas na aplicacao.

## Streaming — O exemplo concreto

O instrutor usa o exemplo de ler um arquivo CSV muito grande (varios gigabytes) de "pouquinho em pouquinho", ja tratando os dados sem precisar consumir tudo de uma so vez. Isso e possivel gracas a arquitetura non-blocking IO do Node.

## Por que comecar sem frameworks

O instrutor enfatiza fortemente a decisao pedagogica de criar o primeiro projeto **sem qualquer dependencia externa** — uma API REST completa com rotas e persistencia de dados, tudo usando apenas Node puro. A justificativa:

> "Eu quero que voce tenha a experiencia de desenvolver um projeto, entender como o Node funciona por baixo dos panos, como cada coisinha funciona."

Isso inclui entrar em "coisas mais profundas do proprio Node", especialmente streaming.

## Ubiquidade do Node

O instrutor lista diversas tecnologias que usam Node por baixo dos panos:
- **Mobile:** React Native, Ionic Framework, NativeScript
- **Frontend:** Next.js, React, Vue, Angular
- **Backend:** Servidores HTTP, APIs REST

O ponto principal: "tudo que a gente usa de JavaScript fora do browser, usa Node por baixo dos panos."

## Requisitos mencionados

- Node.js versao 18.x
- HTTPie (ferramenta de CLI para testar HTTP)