# Deep Explanation: Abertura — Modulo de Containers

## Motivacao do modulo

O instrutor posiciona Docker como ferramenta essencial para desenvolvimento full-stack moderno. O foco e pratico — nao teoria abstrata sobre containerizacao, mas sim como usar containers no dia a dia de desenvolvimento.

## Por que esses topicos nessa ordem

### 1. Containers individuais primeiro
Antes de orquestrar, e preciso entender o basico: como subir um container para a aplicacao Node e outro para o banco de dados. Cada container e isolado e tem seu proprio ambiente.

### 2. Postgres como banco principal
O instrutor destaca Postgres como "um dos mais utilizados no mercado" — e a escolha padrao para aplicacoes profissionais. SQLite aparece como alternativa relacional mais leve, util para desenvolvimento local ou aplicacoes simples.

### 3. Volumes como ponte para persistencia
Containers sao efemeros por natureza. Volumes resolvem o problema de perda de dados quando um container e destruido ou recriado. O instrutor enfatiza a importancia de vincular volumes a containers.

### 4. Docker Compose como automacao
O ponto culminante do modulo: ao inves de subir cada container manualmente, Docker Compose permite definir toda a infraestrutura em um arquivo e subir tudo com um unico comando.

## Conexao com o curso full-stack

Este modulo conecta o backend Node.js (ja desenvolvido em modulos anteriores) com a infraestrutura necessaria para rodar a aplicacao de forma profissional — banco de dados real, persistencia, e orquestracao de servicos.