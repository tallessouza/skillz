# Deep Explanation: Fundamentos de Subdomínios

## A analogia dos setores da empresa

O instrutor faz uma analogia importante: se você está desenvolvendo um software de gestão empresarial, a primeira associação é "subdomínios = setores da empresa". Isso não está errado, mas é incompleto:

- Um setor pode conter **vários** subdomínios
- Coisas **fora da empresa** (fornecedores, parceiros) também podem ser subdomínios
- "Tudo o que o software vai ter que tocar em algum momento" é potencialmente um subdomínio

## O teste do "emprego em risco"

Para identificar core subdomains, o instrutor usa um teste prático: "Se parar alguma dessas coisas, nosso emprego está em risco." Essa é a forma mais visceral de entender o que é core — não é sobre complexidade técnica, é sobre impacto no negócio.

## A fluidez das classificações

Um insight crucial: a **mesma funcionalidade** pode ser classificada diferentemente dependendo do negócio. O instrutor usa o exemplo de notificações:

- Em e-commerce → **generic** (facilmente substituível por serviço externo)
- Em fórum → **supporting** (quase impossível o fórum sobreviver sem notificações)

Isso reforça que a classificação vem do **cliente**, não do desenvolvedor. "Quem precisa do software, quem está com o problema, é que vai guiar a gente."

## Subdomínios vs. Microserviços — o desacoplamento certo

O instrutor faz questão de separar dois conceitos que as pessoas confundem:

1. **Desacoplamento de código** — subdomínios não podem ter dependência direta de funções entre si. "Eu posso deletar o código de um subdomínio e o outro tem que continuar funcionando."

2. **Desacoplamento de infraestrutura** — NÃO é necessário em monolito. Não precisa de sistema de mensageria (RabbitMQ, Kafka) para comunicar entre subdomínios dentro do mesmo deploy.

A solução no monolito: **domain events** — comunicação síncrona que mantém independência de código sem exigir infraestrutura distribuída.

## Por que classificar importa na prática

A classificação não é exercício acadêmico. O instrutor argumenta que muitas equipes tentam "atender todas as demandas do cliente" igualmente, quando deveriam:

1. Desenvolver **muito bem** o core
2. Considerar terceirizar generic (ex: "Será que eu preciso desenvolver um chat internamente?")
3. Avaliar se supporting domains justificam desenvolvimento interno

Isso é fundamentalmente uma decisão de **alocação de tempo e recursos**.

## O caso concreto do curso

No fórum que está sendo desenvolvido, o instrutor decide criar um subdomínio de **notificações** para demonstrar:

- Comunicação entre subdomínios via domain events
- Um novo tópico respondido → notificação para o autor
- Resposta escolhida como melhor → notificação para o autor da resposta
- Comentário em pergunta ou resposta → notificação

Isso será implementado como subdomínio separado dentro do **mesmo monolito**.

## Granularidade

O instrutor menciona que a granularidade é flexível: "A gente pode granularizar subdomínios o quanto a gente quiser." O fórum inteiro poderia ser repartido em sub-subdomínios (perguntas, respostas, comentários, etc.), mas nem sempre vale a pena. A granularidade deve servir ao entendimento do negócio, não à organização técnica.