# Deep Explanation: Exemplo Pratico de DDD

## O software como organismo vivo

O instrutor enfatiza que software nao e tecnologia — e uma representacao do mundo real. Essa mudanca de mentalidade faz voce organizar arquivos e pastas de forma que representem os problemas sendo resolvidos, nao as tecnologias utilizadas.

A frase chave: "O seu software e um organismo vivo e nao e uma representacao do banco de dados."

## O erro classico: banco de dados primeiro

O padrao mais comum entre desenvolvedores iniciantes ao criar um e-commerce:
1. Vao ao banco de dados
2. Criam tabelas
3. Cada tabela vira uma entidade no codigo
4. Usam ORM/Active Record para conectar

O caminho correto e o inverso: o banco de dados e apenas uma camada de persistencia. A aplicacao deveria funcionar completamente sem ele.

## O desafio proposto pelo instrutor

> "A gente deveria garantir, inclusive via testes automatizados, que as regras de negocio da nossa aplicacao funcionam, estao validadas, mesmo sem banco de dados, mesmo sem nenhuma rota no nosso back-end, mesmo sem nenhum framework, sem nada."

Isso significa que as regras de negocio vivem nas entidades e casos de uso, nao nos controllers, nao nos middlewares, nao no ORM.

## Subdominios em aplicacao monolitica

Mesmo sem microservicos, subdominios existem e devem ser representados na estrutura do codigo. No exemplo do e-commerce:
- **Purchases (compras):** lida com clientes, pedidos, produtos
- **Logistics (logistica):** lida com destinatarios, entregas, enderecos

## A mesma entidade real, contextos diferentes

O conceito mais poderoso demonstrado: um "cliente" no mundo real e:
- **Customer** no subdominio de compras (nome, email, documento)
- **Recipient** no subdominio de logistica (rua, numero, CEP)

No banco de dados, esses dados podem estar na MESMA tabela `customers`. Mas no codigo, sao entidades separadas porque cada contexto precisa de informacoes diferentes.

> "As entidades no codigo nao precisam refletir a estrutura do banco de dados. A maneira que voce vai persistir os dados nao deveria influenciar na maneira que voce organiza o seu codigo."

## Relacionamentos entre entidades: a pergunta chave

Para definir como entidades se relacionam, pergunte: "A entidade A depende de B para existir?"

No exemplo: o cliente pode existir antes do pedido (a pessoa cria uma conta). Entao Order nao contem Customer — contem apenas uma referencia (customerDocument/ID).

O instrutor menciona que isso se aprofunda com o conceito de **aggregates** em DDD avancado.

## Casos de uso como ponto de orquestracao

Casos de uso sao onde as entidades se relacionam e as regras de negocio acontecem. Exemplo citado: "o cliente so pode fazer um pedido depois de cadastrar o endereco" — essa regra vive no caso de uso SubmitOrder, nao no controller.

## Estrutura de pastas e opiniao

O instrutor e explicito: "Estrutura de pastas, voce so vai encontrar a padronizacao se estiver utilizando um framework." Cada time escolhe e padroniza. A preferencia dele e usar `domain/` com subdominios dentro.