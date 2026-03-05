# Deep Explanation: Requisitos da Aplicacao

## O raciocinio do instrutor

Diego Fernandes apresenta um framework de planejamento que ele usa pessoalmente em todo projeto backend: pensar em **tres dimensoes** antes de codar.

### Por que RF e RN antes de tudo?

O instrutor enfatiza que mesmo antes de "sair colocando a mao na massa", e necessario "descrever, colocar no papel, quais sao as funcionalidades da aplicacao, o que o usuario pode ou nao pode fazer dentro do app."

A motivacao e simples: sem esse mapeamento, voce descobre requisitos durante a implementacao — o que causa refatoracoes, features esquecidas e bugs de escopo.

### A diferenca sutil entre RN e RNF

O exemplo mais revelador da aula e a regra: "deve ser possivel identificar o usuario entre as requisicoes."

Diego explica que ele **propositalmente** escreveu de forma abrangente porque:
- A aplicacao nao tera autenticacao tradicional (email/senha)
- A FORMA de identificar o usuario e uma decisao tecnica (RNF), nao uma regra de negocio
- A regra de negocio so diz que a identificacao DEVE existir

Isso ilustra a separacao: RN define a necessidade, RNF define a solucao tecnica.

### RNF como decisao incremental

Diego escolhe nao definir RNF no inicio: "eu nao vou fazer agora porque eu quero que a gente va detalhando conforme a gente for chegando nas features." Isso reflete uma abordagem pragmatica — decisoes tecnicas podem (e devem) ser adiadas ate o momento em que voce tem informacao suficiente.

### Formas alternativas de abordar

Diego menciona que existem outras abordagens de design de software: atores, casos de uso, etc. Mas para o contexto de uma API REST, RF + RN + RNF sao suficientes e praticos. "Pelo menos regras de negocio e requisitos funcionais sao coisas que a gente precisa pensar desde antes de sair criando as primeiras rotas."

### O README como ferramenta de gestao

Diego transforma os requisitos em uma checklist markdown no README do projeto. Ele reconhece que "para mais pessoas trabalhando no projeto, existem estrategias melhores", mas para projetos pessoais ou pequenos, o README com checkboxes e pratico e visivel.

### O cenario concreto

A aplicacao e um controle de financas pessoal:
- Usuario cria transacoes de credito (+) e debito (-)
- Cada usuario so ve suas proprias transacoes
- O resumo da conta soma creditos e subtrai debitos
- Exemplo: depositar R$1.000 + debitar R$500 = resumo de R$500

Esse cenario simples ja revela regras nao obvias: isolamento entre usuarios, tipos de transacao com comportamento diferente, necessidade de identificacao sem autenticacao formal.