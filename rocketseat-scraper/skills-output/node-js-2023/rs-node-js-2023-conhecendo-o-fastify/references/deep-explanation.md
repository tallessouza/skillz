# Deep Explanation: Conhecendo o Fastify

## O papel do micro framework

O Diego explica que ferramentas como Fastify e Express existem para resolver a parte "mais tradicional" de construir uma API em Node.js: rotas, parametros, plugins, cabecalhos, respostas JSON, requisicoes JSON. Tudo isso e possivel construir na mao usando apenas o modulo `http` do Node, mas "nao vale a pena todo projeto construir do zero".

O micro framework e, portanto, uma camada de conveniencia sobre o core do Node — ele resolve apenas o roteamento e o handling de requisicoes, sem impor mais nada.

## Por que nao Express?

### Manutencao
O argumento mais forte do Diego: "a propria equipe que mantem o Express ja falou que nao e um projeto o qual eles dedicam muito tempo mantendo." Isso significa que bugs ficam abertos mais tempo, features novas do JavaScript/Node demoram a ser suportadas, e a comunidade migra gradualmente.

O Fastify, por outro lado, tem "um time muito mais ativo lancando novas features, dando manutencao, mantendo a comunidade."

### Similaridade de API
O Diego faz questao de destacar que "a API e extremamente semelhante ao Express." Isso reduz o risco da escolha — mesmo aprendendo Fastify, se um dia precisar trabalhar com Express, "pela similaridade da API, voce dificilmente vai ter problemas em trabalhar com as duas tecnologias."

### Performance
Fastify e "mais performatico que o Express." Isso vem da arquitetura interna do Fastify que usa schema-based serialization e um roteamento otimizado com radix tree.

### TypeScript
"O Fastify ja tem uma integracao direta com o proprio TypeScript, enquanto no Express a gente precisa instalar uma biblioteca terceira, porque o codigo do Express nao e desenvolvido com TypeScript."

Isso e relevante porque tipos nativos sao mais precisos e atualizados que `@types/` mantidos pela comunidade.

### Async/Await
"Ele esta muito mais pronto para lidar com o assincronismo do JavaScript mais moderno." No Fastify, "a gente inclusive e obrigado a utilizar o async" nas rotas. Isso e um design deliberado — forca o padrao correto.

No Express, "se a gente trabalhar com async await, a gente vai ter que acabar lidando, trabalhando com outras bibliotecas, instalando outras bibliotecas para facilitar o trabalho com erros." Isso porque o Express foi criado antes de Promises serem padrao no Node, e seu error handling nao captura rejeicoes de promises automaticamente.

## Micro framework vs framework opinado

O Diego introduz uma taxonomia importante:

- **Micro framework** (Fastify, Express): "nao traz uma opiniao muito forte" — nao define estrutura de pastas, nomes de arquivos, ferramentas de integracao, GraphQL ou nao, framework de testes. "A unica coisa que ele traz e a parte de roteamento."

- **Framework opinado** (NestJS, AdonisJS): "tem uma estrutura de pastas a seguir, uma convencao em quais ferramentas, quais bancos de dados vai utilizar, nao podendo fugir muito dessas convencoes."

A recomendacao clara: "para quem esta aprendendo Node do zero, com certeza o melhor caminho e desenvolver com um micro framework." Frameworks opinados sao para depois, quando voce entende o que cada camada faz.

## Quando usar framework opinado

O Diego menciona que "em aplicacoes no futuro, pode valer a pena utilizar frameworks mais opinados como o proprio Nest, como o proprio Adonis." A promessa e que "mais para frente a gente explica quando voce vai escolher entre um e outro."

O criterio implicito: quando a equipe e grande e precisa de convencoes enforced, ou quando o projeto e complexo o suficiente para se beneficiar de estrutura pre-definida.