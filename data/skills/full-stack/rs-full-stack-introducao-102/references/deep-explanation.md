# Deep Explanation: API REST com Node.js

## Contexto da jornada

Esta aula e o ponto de partida de um modulo focado em criar APIs REST com Node.js. O instrutor posiciona este modulo como uma nova etapa na jornada de estudos, indicando que conceitos anteriores de Node.js ja foram cobertos.

## O que e uma API REST

REST (Representational State Transfer) e um estilo arquitetural para sistemas distribuidos. Uma API REST expoe recursos via endpoints HTTP, utilizando os verbos padrao (GET, POST, PUT, DELETE) para operacoes CRUD.

### Fundamentos que serao abordados

O instrutor destaca que o modulo comeca pelos **fundamentos** de uma API REST antes de partir para implementacao. Isso indica uma abordagem bottom-up:

1. **Fundamentos REST** — Entender os principios antes de codar
2. **TypeScript** — Adicionar seguranca de tipos ao Node.js
3. **Express** — Framework HTTP para roteamento e middlewares
4. **Schema Validation** — Validacao estruturada dos dados de entrada

## Por que este stack especifico

### TypeScript como fundacao
Node.js por padrao usa JavaScript, que e dinamicamente tipado. Em APIs, onde dados trafegam entre cliente e servidor, a tipagem estatica do TypeScript previne uma classe inteira de bugs:
- Parametros de funcao incorretos
- Propriedades faltando em objetos
- Tipos de retorno inconsistentes

### Express como framework HTTP
Express e o framework mais estabelecido do ecossistema Node.js. Sua filosofia minimalista permite:
- Adicionar apenas o que voce precisa via middlewares
- Roteamento declarativo e composivel
- Integracao com qualquer ORM, validador ou logger

### Schema Validation como camada de seguranca
Dados vindos do cliente (body, query params, headers) nunca sao confiaveis. Schema Validation permite:
- Definir o formato esperado declarativamente
- Rejeitar dados invalidos antes de chegar na logica de negocio
- Gerar mensagens de erro claras e padronizadas

## Mentalidade do modulo

O instrutor enfatiza "focar em API REST" — indicando que este modulo e dedicado exclusivamente a construcao de APIs, separando concerns de frontend, banco de dados avancado, ou deploy. Essa separacao e intencional: dominar a camada HTTP antes de compor com outras camadas.