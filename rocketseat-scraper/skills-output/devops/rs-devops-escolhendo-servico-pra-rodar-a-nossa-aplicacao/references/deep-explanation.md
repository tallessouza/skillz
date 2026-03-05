# Deep Explanation: Escolhendo Servico AWS para Aplicacao Containerizada

## Por que nao usar Docker Hub com AWS?

O instrutor explica que o AppRunner da AWS so suporta dois providers de container registry: **Amazon ECR** e **Amazon ECR Public**. Docker Hub simplesmente nao e uma opcao. Alem disso, ele reforça que em producao, imagens devem ser privadas — o Docker Hub publico usado no curso era apenas para fins didaticos.

A analogia e simples: assim como o repositorio de codigo e privado (GitHub private repo), o repositorio de imagens tambem deve ser privado (ECR private).

## A hierarquia de servicos AWS para containers

O instrutor apresenta uma progressao clara de complexidade:

1. **EC2 puro** — Voce cria uma maquina virtual, instala Docker, roda o container. Funciona, mas exige configuracao manual do servidor, Node, dependencias. O instrutor descarta essa opcao porque "envolveria uma carga configurativa" desnecessaria.

2. **ECS (Elastic Container Service)** — Abstração sobre EC2 ou Fargate. Cria clusters, task definitions, services. O instrutor mostra o console do ECS e destaca que "traz uma certa complexidade" para o objetivo da aula.

3. **ECS + Fargate** — Serverless, sem gerenciar instancias. Boa opcao mas ainda complexa para o cenario.

4. **AppRunner** — O mais simples. Aponta para uma imagem de container e ele roda. O instrutor escolhe este porque "a gente quer algo muito mais simples". Suporta tanto container image quanto source code repository.

5. **EKS (Kubernetes)** — Mencionado como "proximo modulo", para orquestracao avancada.

## Por que tag do commit e nao latest?

O instrutor e enfatico: "A gente vai utilizar a latest para rodar a aplicacao de maneira nenhuma". A tag esta associada ao hash do commit (com split para pegar primeiros caracteres). A latest existe apenas "para fins de registro e documentacao". Isso garante rastreabilidade — cada deploy aponta para um commit especifico.

## CI ja concluida — o que tinha

O instrutor recapitula a pipeline CI antes de falar de CD:
1. Configurar ambiente Node
2. Instalar dependencias
3. Rodar testes
4. Gerar tag (hash do commit)
5. Login no container registry
6. Build da imagem
7. Push da imagem

Nota sobre otimizacao: dependencias sao instaladas fora do container porque os testes rodam no runner. Uma otimizacao futura seria copiar a node_modules ja gerada para dentro do Dockerfile ao inves de reinstalar.

## Por que Terraform e nao console?

O instrutor menciona que "a gente vai ja olhar para a boa prática" — criar ECR, IAM roles e AppRunner via Terraform. Isso se conecta ao modulo anterior de IaC. Inicialmente o Terraform roda localmente, com planos futuros de coloca-lo na pipeline de infraestrutura.

## Regiao escolhida

O instrutor usa **Ohio (us-east-2)**. Isso e relevante para configuracao de AWS credentials e ECR endpoints na pipeline.

## Free tier

O instrutor destaca que varios servicos AWS tem free tier e que o uso didatico nao gera custo — desde que a aplicacao nao fique rodando em producao indefinidamente.

## Transicao CI para CD

O ponto central da aula: CI (integracao continua) ja esta completa. Agora comeca CD (entrega continua). A diferenca:
- **CI**: commit → testes → build → push imagem (ja feito)
- **CD**: imagem nova → deploy automatico na AWS (proximo passo)

O objetivo final: "fizemos um commit, vou ter a integracao e eu tambem vou ver essa entrega totalmente de forma automatizada."