# Deep Explanation: Headers HTTP para CORS

## Por que CORS e responsabilidade do programador, nao da infra

O instrutor enfatiza repetidamente que CORS nao deve ser delegado para a equipe de infraestrutura. A razao central: **infra nao tem obrigacao de saber como sua aplicacao se comporta**. Se voce delegar, o time de infra vai fazer o mais seguro do ponto de vista deles — colocar `Access-Control-Allow-Origin: *` — porque eles nao conhecem quais origens sao legitimas para cada rota.

Cada aplicacao tem suas proprias regras de negocio. Uma API de parceiros precisa validar origens contra um cadastro no banco de dados. Uma API interna precisa liberar metodos diferentes de uma API publica. Isso e logica de negocio, nao configuracao de servidor.

## Como o navegador protege (e por que nao basta)

O navegador ja implementa a protecao basica: se voce acessar uma pagina em `127.0.0.1` e ela tentar fazer fetch para `0.0.0.0`, o navegador bloqueia porque sao origens diferentes. Porem, essa protecao depende dos headers que o servidor retorna.

### O fluxo de preflight (OPTIONS)

1. O navegador quer fazer GET ou POST para outra origem
2. **Antes** de fazer a requisicao real, ele envia uma requisicao OPTIONS para a mesma URL
3. Ele espera receber os headers `Access-Control-Allow-Origin` e `Access-Control-Allow-Methods` na resposta do OPTIONS
4. So se os headers estiverem corretos, ele faz a requisicao real

O instrutor demonstrou que mesmo setando os headers no GET/POST, sem o handler OPTIONS a requisicao falhava com 404 no preflight. **O navegador nem tenta a requisicao real sem aprovacao previa via OPTIONS.**

### Por que o preflight existe

O instrutor explica com um exemplo critico: mesmo que o hacker nao consiga *ler* os dados da resposta, pode ser **tarde demais** se a requisicao ja foi executada. Um POST para uma URL que faz um saque bancario, uma compra, adiciona o hacker como amigo numa rede social, ou vota nele num concurso — o dano ja foi feito. Por isso o navegador faz OPTIONS primeiro: para obter autorizacao antes de executar qualquer acao.

## O problema do asterisco

O site enablecors.org e frequentemente consultado por desenvolvedores com problemas de CORS. O instrutor critica diretamente as instrucoes do site, que sugerem configurar `Access-Control-Allow-Origin: *` no Apache ou Nginx.

A demonstracao pratica: o instrutor criou um `index.html` no dominio `hacker.com` (configurado localmente), copiou o HTML da aplicacao, e mostrou que com asterisco habilitado, o site do hacker conseguia fazer GET e POST para a API sem nenhum impedimento.

## Cenarios avancados mencionados

### APIs para parceiros de negocio
Quando voce tem uma API client-side consumida por parceiros que pagam pelo acesso, voce precisa:
- Cadastro de parceiros no banco de dados
- Validacao da origem contra a lista cadastrada (nao hardcoded)
- Controle por parceiro de quais metodos sao permitidos

### Controle de metodos por contexto
- **Interno (painel admin):** GET, POST, PUT, DELETE — acesso completo
- **Externo (parceiros/publico):** somente GET — apenas leitura
- Isso previne que mesmo com script injection no site do parceiro, o atacante nao consiga fazer DELETE ou PUT

## Headers nao cobertos nesta aula

O instrutor menciona que `Content-Security-Policy` e `X-Frame-Options` serao abordados no modulo de front-end, junto com click-jacking, onde fazem mais sentido contextualmente.