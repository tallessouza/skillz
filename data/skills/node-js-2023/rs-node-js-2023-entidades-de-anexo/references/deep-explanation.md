# Deep Explanation: Entidades de Anexo

## Por que nao usar polimorfismo aqui?

O instrutor explica que polimorfismo (parentId + parentType) e uma abordagem valida e ate sera usada mais adiante no curso para comentarios. Porem, para anexos, ele opta por bridge entities porque:

1. **Clareza na persistencia** — com `parentId` + `parentType: 'question' | 'answer'`, ao buscar um attachment no banco, voce precisa de logica condicional para saber de qual tabela buscar o pai. Com bridge entities, a relacao e explicita: `QuestionAttachment` sempre aponta para a tabela de questions.

2. **Polimorfismo e questao de gosto** — o instrutor enfatiza que "polimorfismo e muito pessoal, muito de gosto" e que existem varias formas de resolver o mesmo problema. Ele escolhe bridges aqui e promete mostrar polimorfismo depois com comentarios, para que o aluno conheça ambas abordagens.

## Analogia com tabela pivo

O instrutor faz uma analogia com banco de dados: as bridge entities sao "como uma tabela pivo em relacionamentos N:N". Porem, ele imediatamente corrige: "nao precisamos enxergar dessa forma porque ainda nao chegamos no banco de dados". Na camada de dominio, bridge entities sao apenas uma forma de conectar duas entidades quando uma delas pode pertencer a multiplos tipos de pai.

## Por que a bridge estende Entity?

Mesmo que a bridge talvez nao vire uma tabela no banco, estender Entity da a ela um ID unico. Isso permite que no futuro ela seja persistida independentemente se necessario, e mantem o padrao consistente com o resto do dominio.

## Preparacao para Watched Lists

O instrutor menciona que essa estrutura de bridge entities e fundamental para o proximo passo: usar Watched Lists na edicao. Na criacao, basta criar tudo no banco. Na edicao, e preciso detectar quais anexos foram adicionados, removidos ou mantidos — e ai que a Watched List entra. As bridge entities facilitam esse tracking porque cada conexao e uma entidade rastreavel individualmente.

## Quando USAR polimorfismo

O instrutor deixa claro que polimorfismo sera usado para comentarios mais adiante. A regra implicita e:
- **Bridge entities** — quando a entidade compartilhada (Attachment) tem dados proprios significativos e a conexao e apenas referencial
- **Polimorfismo** — quando o comportamento da entidade muda dependendo do pai, ou quando a simplicidade de uma unica classe supera a clareza de multiplas bridges