# Deep Explanation: Caso de Uso Editar Pergunta

## Por que copiar do Delete e adaptar?

O instrutor demonstra um padrao pratico: ao criar um novo caso de uso CRUD, copie o mais proximo que ja existe e adapte. O Delete e o Edit compartilham a mesma estrutura inicial — buscar entidade, validar autoria, executar acao. A diferenca e que Delete remove e Edit modifica + salva.

## Setters como contrato de mutabilidade

Um ponto crucial mencionado: "lá dentro da question, é importante lembrar que ele só vai permitir a gente alterar os campos que a gente colocou a propriedade set". Isso significa que a entidade `Question` controla explicitamente quais campos podem ser alterados apos criacao. Se um campo nao tem setter, o caso de uso simplesmente nao consegue modifica-lo — o TypeScript impede em tempo de compilacao.

No caso da Question, os campos com setter sao:
- `title`
- `content`
- `bestAnswerId`

Porem, `bestAnswerId` nao e editado aqui porque "a escolha como a melhor resposta não vai ser feita no mesmo momento que eu estou editando uma pergunta". Isso demonstra o principio de Single Responsibility aplicado a casos de uso.

## Save vs Create no repositorio

O instrutor nota que o repositorio so tinha `create` e `delete`, e cria o metodo `save`. A distincao semantica e importante:
- `create`: insere nova entidade (push no array)
- `save`: substitui entidade existente no mesmo indice
- `delete`: remove entidade pelo indice

No repositorio in-memory, `save` encontra o indice do item existente e substitui: `this.items[itemIndex] = question`. Em banco real, isso seria um UPDATE.

## Granularidade de testes — escolha pragmatica

O instrutor menciona explicitamente que poderia testar "editar pergunta que nao existe" mas escolhe nao fazer: "Nem tudo na aplicação necessariamente precisa ser testado. Isso aqui é mais uma condicional que a gente faz para evitar algum erro muito grotesco, mas não necessariamente causaria algum problema sério."

Isso reflete uma visao pragmatica: testes devem cobrir regras de negocio (autorizacao) e caminhos criticos, nao necessariamente cada condicional defensiva. A granularidade e uma escolha da equipe.

## toMatchObject no Jest

O instrutor usa `toMatchObject` em vez de `toEqual` para a asseracao do teste. A razao: `toMatchObject` verifica se as propriedades passadas estao contidas no objeto, sem exigir igualdade total. Isso permite verificar apenas `title` e `content` sem precisar listar todas as outras propriedades da Question.