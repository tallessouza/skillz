# Deep Explanation: Estrutura de Chamadas Distribuidas

## Por que modulos separados por dominio

O instrutor enfatiza que o AppController "cresce de uma maneira nao tao saudavel" quando todas as rotas ficam nele. No contexto de observabilidade, isso e ainda mais critico: cada modulo gera spans distintos no trace, facilitando a identificacao de gargalos. Se tudo esta no AppController, os spans se misturam e perdem utilidade diagnostica.

A estrutura recomendada segue o padrao do NestJS:
- **Module**: registra controller + service
- **Controller**: define rotas e recebe requests
- **Service**: contem logica de negocio

Cada dominio (users, orders, etc.) tem seu proprio trio de arquivos dentro de `domain/`.

## Conceito de Upstream e Downstream

O instrutor menciona "upstream" e "downstream" brevemente. No contexto de chamadas distribuidas:
- **Upstream (app2)**: quem SERVE os dados. Tem o dominio real (banco, logica).
- **Downstream (app1)**: quem CONSOME os dados. Faz a chamada HTTP.

O app1 nao tem o dominio de usuarios — ele precisa pedir ao app2. Isso e um padrao comum em microservicos e e exatamente o cenario que distributed tracing resolve: ver a cadeia completa de chamadas.

## Por que Undici e nao Axios

O instrutor escolhe Undici explicitamente por performance: "por uma questao de performance, a gente vai de Undici". Undici e o client HTTP que o proprio Node.js usa internamente (a partir do Node 18). Vantagens:
- Pool de conexoes gerenciado automaticamente
- Menor overhead de memoria
- Compativel com OpenTelemetry HttpInstrumentation sem config extra
- API simples: `request()` retorna `{ statusCode, body }`

## O que o trace revela

No final da aula, o instrutor mostra no Grafana que o trace capturou toda a cadeia:
1. Request chega no app1 controller
2. App1 faz HTTP call para app2
3. App2 processa em 5ms
4. Resposta volta para app1

Isso e o valor real de distributed tracing: ver ONDE o tempo esta sendo gasto entre servicos. Sem instrumentacao, voce so veria o tempo total no app1 sem saber quanto foi latencia de rede vs processamento no app2.

## Tipagem minima

O instrutor cria uma tipagem inline `{ name: string; email: string }[]` e menciona que "e legal utilizar um pacote pra validar a tipagem, poderia ser no Zod". A tipagem minima garante que o TypeScript valide em compile-time, mas Zod validaria em runtime — importante quando o dado vem de outro servico via HTTP (voce nao controla o schema).

## Deserializacao explicita

O Undici retorna o body como stream. E necessario chamar `await body.json()` para deserializar. Isso e diferente do Axios que deserializa automaticamente. O instrutor destaca isso como passo obrigatorio.