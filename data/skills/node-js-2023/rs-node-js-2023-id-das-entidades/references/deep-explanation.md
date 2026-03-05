# Deep Explanation: ID das Entidades — UniqueEntityID

## Por que encapsular o ID em uma classe?

O instrutor explica que a motivacao central eh "deixar a aplicacao a prova do futuro". Hoje o projeto usa `randomUUID()` do Node.js, mas amanha pode ser qualquer outra estrategia (CUID, ULID, nanoid, ID sequencial, etc). Ao encapsular em `UniqueEntityID`, a troca acontece em **um unico lugar** e todas as entidades refletem automaticamente.

## UniqueEntityID como Value Object

O instrutor posiciona o `UniqueEntityID` como um Value Object compartilhado entre todas as entidades — assim como o `Slug` que foi criado anteriormente. A diferenca eh que enquanto o Slug pertence a uma entidade especifica, o UniqueEntityID eh universal: toda entidade da aplicacao usa.

Segue a mesma estrutura de qualquer VO:
- Propriedade `value` privada
- Construtor que recebe o valor
- Accessors para expor o valor

## O construtor opcional — criar vs reconstituir

Um detalhe fundamental: o `value` no construtor eh **opcional**. Isso resolve dois cenarios:

1. **Criacao de nova entidade:** nao passa ID, o VO gera automaticamente via `randomUUID()`
2. **Reconstituicao de entidade existente:** passa o ID que veio do banco de dados

Este padrao eh essencial porque entidades de dominio precisam existir nos dois contextos — criacao e rehydration.

## DDD nao dita implementacao

O instrutor faz questao de enfatizar: **nada disso esta escrito no livro do DDD.** DDD define conceitos teoricos (entidades, value objects, casos de uso). A decisao de criar uma classe `UniqueEntityID` eh uma **opcao de implementacao** que o instrutor adotou por experiencia propria.

Citacao do instrutor: "Jamais voce vai ver dentro do livro do DDD falando 'crie uma classe UniqueEntityID'. Isso eh algo especifico da nossa implementacao."

Isso eh importante porque muitos desenvolvedores tratam padroes de implementacao como se fossem regras do DDD, quando na verdade sao convencoes de equipe/projeto.

## Pensar nos detalhes desde o inicio

O instrutor defende pensar nesses detalhes arquiteturais desde o comeco do projeto, em vez de criar codigo e depois voltar refatorando. A filosofia eh: "eu nao quero criar muito codigo e depois voltar refatorando muita coisa, eu quero que a gente ja aprenda."

Isso nao significa over-engineering — significa estabelecer as abstraccoes fundamentais (Entity base, UniqueEntityID, Value Objects) antes de comecar a proliferar entidades concretas.

## toString() e toValue() — interface publica do VO

O instrutor cria dois metodos de acesso:
- `toString()`: permite interpolacao em strings e logs naturalmente
- `toValue()`: retorna o valor primitivo para comparacoes e serialization

Isso segue o padrao de VO onde o valor interno eh protegido mas acessivel de forma controlada.