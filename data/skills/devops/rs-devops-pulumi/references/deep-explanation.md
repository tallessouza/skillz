# Deep Explanation: Pulumi — IaC Multi-Cloud

## Por que o instrutor nao escolheu Pulumi para o curso

O instrutor explicitamente menciona dois motivos para nao adotar Pulumi no curso:

1. **Problemas de gerenciamento** — dentro de alguns recursos especificos que serao utilizados no curso, Pulumi apresenta limitacoes
2. **Limitacao no plano individual** — para uso em time (contexto educacional), o Free tier nao seria suficiente
3. **Popularidade** — existe uma ferramenta que "domina o mercado" (Terraform, apresentada na aula seguinte), e faz mais sentido ensinar a mais adotada

## A analogia CDK vs Pulumi

O instrutor posiciona Pulumi como estando "na mesma linha do CDK" — ambos permitem usar linguagens de programacao reais ao inves de DSLs. A diferenca critica: CDK e vinculado a AWS, Pulumi suporta multiplas clouds nativamente.

## Curva de aprendizado vs curva de adocao

O instrutor faz uma distincao interessante: ao usar a mesma linguagem do projeto (ex: Python), a **curva de aprendizado** e menor (voce ja sabe a linguagem). Porem, a **curva de adocao** pode ser ate maior — porque adotar uma nova ferramenta de IaC envolve mais do que saber a linguagem (configuracao, integracao com CI/CD, workflows do time, etc.).

## O valor do declarativo para replicacao

O instrutor destaca que um dos maiores problemas resolvidos pelo IaC e a replicacao de ambientes. Cita o Twelve-Factor App como referencia: ambientes dev e prod devem ser o mais parecidos possivel. O fluxo:

1. Cria o declarativo uma vez
2. Replica para quantos ambientes precisar
3. Se alguem deletar recursos no console manualmente, basta rodar o Pulumi novamente

Isso contrasta com a abordagem "imperativa" de clicar no console da cloud, que e irreproduzivel e propensa a erro.

## Ferramentas historicas mencionadas

O instrutor menciona Ansible, Chef e Puppet como ferramentas mais antigas que implementaram IaC no mercado. Sugere estudar para entender o conceito historico, mas nao as aborda no curso por serem de uma geracao anterior.

## Multi-cloud como diferencial

A demonstracao no site do Pulumi mostra o suporte a dezenas de providers: AWS, Azure, Google Cloud, Alibaba Cloud, DigitalOcean, DataDog, Aquasec, Aviatrix, entre outros. Cada provider tem exemplos em todas as linguagens suportadas.