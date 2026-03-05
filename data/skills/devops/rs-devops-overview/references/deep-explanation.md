# Deep Explanation: Infrastructure as Code — Overview e Modelos

## O ciclo completo do IaC

O instrutor apresenta o fluxo como uma imagem mental clara:

1. **Developers escrevem codigo** — nao necessariamente so devs, tambem SREs e pessoas de infra. A sacada e a aproximacao entre areas: infra, que normalmente fica distante do codigo, se aproxima atraves do IaC.

2. **Versionamento via Git** — o codigo passa por controle de versao. A ferramenta pode ser GitHub, Bitbucket, Azure DevOps, GitLab — nao faz diferenca fundamental. O importante e o fluxo: commit → push → magia acontece.

3. **Orquestracao com cloud provider** — apos o push, uma orquestracao se comunica com o provedor (AWS, Azure, GCP, Oracle). O suporte e abrangente para quase todas as clouds. On-premise tambem e possivel, com limitacoes.

4. **Criacao, edicao e delecao** — o recurso passa pela estrutura de SCM (pull request, code review) e o estado e refletido no provedor. Para delecao, alterar o estado do codigo resulta em delecao no provedor.

5. **Seguranca contra erros** — se ocorre erro (sintaxe, recurso nao encontrado, tag mal escrita), a infra NAO e mutabilizada. Isso gera um alerta para correcao, mas o estado anterior permanece intacto. Isso e uma garantia fundamental do modelo declarativo.

## Por que IaC e um pilar DevOps

O instrutor enfatiza que IaC ajuda a "evitar silos entre areas" — um pilar da cultura DevOps. Quando infra vira codigo, developers podem entender e contribuir para infraestrutura, e pessoas de infra podem usar ferramentas de desenvolvimento (Git, code review, CI/CD). Isso "democratiza o assunto".

## Declarativo: o modelo preferido

### A analogia do estado

O declarativo fala sobre **estado**. Voce declara: "preciso de um EC2". Como isso sera feito? A linguagem/ferramenta resolve. E como programacao declarativa — voce descreve o resultado desejado, nao os passos.

### Interdependencias automaticas

Quando voce cria algo com interdependencias, o modelo declarativo considera isso automaticamente. Voce nao precisa se preocupar com ordem de criacao — a ferramenta analisa o grafo de dependencias e resolve.

### Historico de estados

O instrutor destaca que voce consegue manter estados passados. Exemplo: "eu tinha um EC2 com tal capacidade, agora tenho com capacidade maior/menor, mas no historico sei que em dado momento tinha um tipo de maquina e depois passei a ter outro." Isso e valioso para auditoria e rollback.

### Facilitacao de delecao

Delecoes sao simplificadas porque o estado e refletido no provedor. Se voce altera o estado removendo um recurso, o provedor tambem deleta. Nao precisa saber "como deletar" — apenas altere o estado.

## Imperativo: quando e por que evitar

### Foco no "como"

O imperativo tem sequencias de comandos para criar recursos. Em vez de "quero um EC2", voce tem "execute comando A, depois B, depois C".

### Ordem obrigatoria

O instrutor enfatiza que na maioria (quase totalidade) dos casos, a execucao deve ser serial, em ordem. Com interdependencias, a ordem e responsabilidade do autor — nao da ferramenta.

### Historico limitado

No imperativo, voce tem historico dos comandos executados, mas nao do estado resultante. E uma diferenca sutil mas importante: saber o que foi executado nao e o mesmo que saber o estado atual da infra.

## EC2 como exemplo recorrente

O instrutor usa EC2 (Elastic Computing Cloud) da AWS como exemplo principal. EC2 e um recurso de maquina virtual — sera usado em exemplos praticos ao longo do curso. O curso trabalha primariamente com AWS, com exemplos adicionais de GCP e Azure ao final do modulo.

## Contexto do modulo

Este modulo trabalha mais localmente (similar ao modulo anterior de aplicacao). O modulo seguinte sobre CI/CD vai colocar tudo orientado a pipelines de infraestrutura.