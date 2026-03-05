# Deep Explanation: Design de Software e DDD

## A decepcao inicial: DDD nao e sobre codigo

O instrutor abre a aula com uma provocacao: "a primeira coisa que talvez eu possa te decepcionar um pouco e que DDD nao tem quase nada em correlacao com codigo." Essa e uma barreira mental comum — programadores associam DDD a patterns de codigo (repositories, aggregates), mas o livro do Eric Evans (Blue Book) dedica mais da metade do conteudo a conceitos que nao envolvem codigo algum.

O programador pratico tende a pular capitulos sobre linguagem ubiqua e dominio, achando que "a parte boa" e a parte de codigo. Mas e justamente o contrario — a parte mais valiosa do DDD e a que acontece antes de qualquer implementacao.

## Design de Software vs Arquitetura de Software

Essa e uma confusao que o instrutor destaca como extremamente comum na comunidade:

- **Design de Software**: como converter o problema do cliente em algo palpavel. Nao tem a ver com linguagem, framework, arquitetura ou organizacao de pastas. E o processo de traduzir necessidades reais em um modelo de software.

- **Arquitetura de Software** (ex: Clean Architecture): como estruturar o codigo. Desacoplamento, inversao de dependencia, injecao de dependencia — tudo isso e arquitetura.

**A implicacao pratica**: voce pode ter DDD sem Clean Architecture (usando MVC, por exemplo) e o software estar bem desenhado. Voce pode ter Clean Architecture sem DDD. Ou pode ter os dois juntos. Sao dimensoes independentes.

## Domain Experts: o programador nao e o expert

O instrutor enfatiza que, a menos que voce esteja desenvolvendo software para si mesmo, voce NAO e o domain expert. O domain expert e:

- A pessoa no balcao da agencia de viagens vendendo pacotes
- O barbeiro que atende clientes todo dia
- O atendente que lida com as situacoes reais

A primeira e mais importante etapa do desenvolvimento e a **conversa**. Nao UMA conversa — VARIAS conversas, com VARIOS domain experts. E dessas conversas que nasce a linguagem ubiqua.

## O exemplo do "usuario"

O instrutor usa um exemplo poderoso: num salao de beleza/barbearia, o barbeiro nunca vai dizer "eu aguardo o meu usuario chegar pra cortar o cabelo dele." Ele diz "meu cliente". E no mesmo negocio, existem:

- **Clientes** (quem vem cortar cabelo)
- **Fornecedores** (quem fornece produtos)
- **Atendentes** (quem agenda)
- **Barman** (algumas barbearias tem bar)

Ou seja: para a mesma entidade que o programador chamaria de `User`, o domain expert lista 4 nomenclaturas diferentes. Cada uma com comportamentos e atributos distintos. Essa e a riqueza que se perde quando se pula a etapa de design.

## O "vicio" do programador

O instrutor identifica um padrao comportamental: programadores querem colocar a mao na massa imediatamente. Querem pensar em banco de dados, frameworks, performance. Mas DDD ensina que existe uma etapa anterior fundamental — entender o problema. Da concepcao do projeto ate as primeiras linhas de codigo, "isso provavelmente pode demorar bastante."

## Artefatos legiveis

Uma premissa do DDD e que tudo que se produz — codigo, diagramas, documentacao — deve ser consumivel por qualquer pessoa envolvida no projeto. O codigo faz parte da linguagem ubiqua. E como se o software fosse legivel por pessoas de negocio. O instrutor reconhece que isso e "muito profundo" e dificil de atingir na pratica, mas e o norte.

## Conceitos que serao aprofundados

O instrutor menciona que nas proximas aulas cobrira:
- Agregados (Aggregates)
- Value Objects
- Eventos de Dominio
- Subdomínios
- Bounded Contexts
- Entidades
- Casos de Uso

Cada um desses conceitos possui implementacoes de codigo que "suprem as necessidades" do conceito teorico — ou seja, o codigo serve ao design, nao o contrario.

## O livro referencia

Eric Evans — "Domain-Driven Design: Tackling Complexity in the Heart of Software" (Blue Book). O instrutor recomenda fortemente para quem quer se aprofundar, deixando claro que algumas aulas nao conseguem cobrir a profundidade do livro inteiro.