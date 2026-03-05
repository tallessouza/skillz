# Deep Explanation: Dados Relacionados em uma API REST

## O problema fundamental do REST com relacionamentos

O instrutor usa o forum da Skillz como exemplo concreto. Ao abrir a listagem de perguntas, cada pergunta ja mostra o nome do autor. Se o backend so retornasse o `authorId`, o frontend precisaria fazer uma requisicao separada para cada pergunta — completamente inviavel numa listagem com dezenas de items.

## Overfetching explicado

Overfetching acontece quando uma rota retorna mais dados do que o frontend precisa. O instrutor da o exemplo: se a rota de detalhe de uma pergunta ja trouxer todas as respostas junto, o que acontece quando alguem precisa apenas dos dados da pergunta sem as respostas? Nao tem como — a rota retorna tudo.

O problema pratico: cada byte a mais na resposta aumenta o tempo de transferencia e o processamento necessario. Isso se acumula especialmente em dispositivos moveis e conexoes lentas.

## Underfetching explicado

O extremo oposto: micro-rotas que retornam pedacinhos de informacao. Uma rota so pra pergunta, outra so pro autor, outra so pras respostas, outra pro autor de cada resposta. Resultado: para montar uma unica tela, o frontend precisa fazer 5, 10, 15 requisicoes.

Cada requisicao tem overhead de HTTP (headers, handshake, latencia de rede). Multiplicar isso por N items torna a aplicacao lenta e complexa.

## Por que o GraphQL surgiu

O instrutor menciona explicitamente: "existe um motivo pelo qual o GraphQL surgiu". O GraphQL permite que o frontend especifique exatamente quais dados precisa, eliminando overfetching e underfetching por design. Mas como a maioria das aplicacoes usa REST (o padrao mais utilizado), precisamos lidar com esses problemas manualmente.

## O meio-termo na pratica

O instrutor define a estrategia para a aplicacao do curso:

1. **Listagem de perguntas** → ja vem com dados do autor (inline)
2. **Listagem de respostas** → ja vem com dados do autor (inline)
3. **Listagem de comentarios** → ja vem com dados do autor (inline)
4. **Detalhe de pergunta (getQuestionBySlug)** → retorna pergunta + autor + anexos (2 relacionamentos inline)
5. **Respostas da pergunta** → rota separada (nao embutida no detalhe)

O principio e: listagens incluem o minimo de relacionamentos necessarios (geralmente autor), e detalhes incluem relacionamentos diretos essenciais. Colecoes grandes (respostas, comentarios) ficam em rotas separadas.

## A importancia da comunicacao backend-frontend

O instrutor enfatiza: "e muito importante que back-end e front-end estejam caminhando juntos, estejam se comunicando a todo tempo para entender qual que e o melhor padrao". O meio-termo ideal nao e uma formula — depende das necessidades reais das telas do frontend.

## Implicacoes arquiteturais

O instrutor menciona que essas decisoes impactam o codigo em multiplas camadas: repositorios precisam fazer JOINs, use cases precisam orquestrar dados de multiplas entidades, presenters precisam formatar dados compostos. Independente da arquitetura utilizada, os problemas de overfetching e underfetching sempre aparecem em REST.