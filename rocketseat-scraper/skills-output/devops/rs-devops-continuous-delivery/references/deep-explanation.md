# Deep Explanation: Continuous Delivery / Continuous Deployment

## CD vs Continuous Delivery vs Continuous Deployment

O instrutor mescla os dois conceitos intencionalmente: "Da pra mesclar os dois conceitos porque no final do dia nos estamos entregando continuamente, logo estamos tambem deployando continuamente." Na pratica, a distincao academica importa menos que o resultado — software chegando ao usuario de forma automatizada e segura.

## A analogia do slide da primeira aula

O instrutor referencia: "Aquele slide que nos vimos na primeira aula, que o time de infra pega o seu binario e coloca la no servidor, e o que a CD faz aqui." A CD automatiza exatamente o que antes era um processo manual de alguem do time de infra recebendo um arquivo e colocando num servidor.

## Camadas de seguranca antes do deploy

A CD nao e "jogar codigo em producao". Antes disso existem camadas:
1. Validacao de build
2. Validacao de dependencias
3. Testes automatizados (da CI)
4. Opcionalmente, aprovacao manual de uma pessoa responsavel

O instrutor destaca: "O fluxo de implantacao, nao. Esse e automatizado." Ou seja, a aprovacao pode ser manual, mas o ato de deployar e sempre automatizado.

## Homologacao vs Producao — valor diferente

- **Homologacao**: valor interno — testes com time de negocio, produto, desenvolvedores
- **Producao**: cenario real, valor entregue ao cliente final

O instrutor enfatiza que staging existe para que voce nao teste em producao. Os testes da CI sao na camada da aplicacao (unitario, integracao). O teste real de "funciona no ambiente" acontece em staging.

## 12-Factor App — ambientes similares

Referencia direta ao 12-factor: "Como manda o 12-factor, os 12 fatores, idealmente voce precisa ter ambientes muito similares de teste e producao." O ponto e dev/prod parity — ambientes iguais em ferramentas, diferentes em escala.

Exemplos concretos do instrutor:
- Kubernetes em producao → Kubernetes em staging
- ECS em producao → ECS em staging
- Nao importa a ferramenta, o espelhamento e obrigatorio

## Canary Deployment

O instrutor introduz o conceito de liberacao gradual: "Quero liberar, por exemplo, para 10% do trafego. A gente chama isso de Canary Deployment." Casos de uso:
- Nao tem seguranca total do processo
- Quer validar com nicho especifico de clientes
- Depois de validar, abre para 100%

Sera aprofundado no modulo 5 do curso.

## Rollback — a rede de seguranca

O instrutor e realista: "Pode acontecer, claro, voce fez, ali, a subida do software e quebrou em producao. Isso pode acontecer? Pode acontecer, sim."

A diferenca e:
- **Manual**: dor de cabeca, sem visibilidade, lento
- **Via pipeline**: mais simples, visivel para toda equipe, rastreavel

Menciona tambem smoke test pos-deploy: se o teste de fumaca falha, triga rollback automatico. Isso sera detalhado nos modulos 5 e 6 (observabilidade).

## CD para infraestrutura

O instrutor faz um paralelo importante com Terraform:
- **CI** = `terraform init` + `terraform plan` (validacao do que sera criado)
- **CD** = `terraform apply` (criacao real do recurso no provedor de nuvem)

"Quando a gente fala de infraestrutura, e mais comum voce chamar de pipeline de infraestrutura, mas a pratica CI e CD esta, tambem, ali."

## Relacao CI → CD

Sequencia obrigatoria:
1. CI integra e valida
2. CD pega o resultado validado e publica
3. Nao existe CD automatizada sem CI — "Nos nao temos ali, de forma automatizada, CD sem CI"

## Independencia de ferramenta

CD e uma pratica, nao uma ferramenta. O metodo de publicacao muda conforme o servico (Kubernetes, EC2, ECS), mas o conceito e o mesmo. O unico ponto e que cada recurso tem seu metodo especifico de deploy.