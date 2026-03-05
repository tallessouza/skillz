# Deep Explanation: Factories de Testes

## Por que Factories existem

O instrutor parte de um problema concreto: conforme a aplicacao cresce, os testes precisam criar entidades repetidamente. Um caso de uso de paginacao precisa de 20+ registros — sem factory, isso significa copiar e colar o bloco `Entity.create({...})` 20 vezes.

O Factory Pattern (Design Pattern classico) resolve exatamente isso: **fabricar coisas**. O instrutor faz questao de destacar a etimologia — "factory" = "fabrica" — para reforcar que o proposito e produzir instancias de forma padronizada.

## O insight do Partial<Props>

A sacada central da aula nao e apenas criar uma funcao helper — e o uso de `Partial<T>` do TypeScript para tornar a factory flexivel:

1. **Sem override:** factory retorna entidade com todos os defaults — util para testes de volume (paginacao, listagem)
2. **Com override parcial:** teste explicita apenas o campo que importa — `makeQuestion({ slug: Slug.create('my-slug') })` — tornando claro O QUE o teste valida

O instrutor demonstra isso ao vivo: mesmo mudando o titulo default na factory, o teste de slug continua passando porque o slug e passado explicitamente via override.

## Principio: teste deve ser explicito no que valida

O instrutor enfatiza que mesmo quando o default "funcionaria", voce deve passar o valor explicitamente se ele e parte da asserção. Isso torna o teste auto-documentado — quem le o teste entende imediatamente qual e o cenario sem precisar ir ate a factory ver os defaults.

## Progressao natural

A factory comeca simples (1 entidade) mas escala naturalmente:
- `makeQuestion()` — perguntas
- `makeAnswer()` — respostas
- `makeStudent()` — estudantes
- Cada entidade de dominio ganha sua factory

O instrutor antecipa: "daqui para frente" todos os testes usarao factories, porque a aplicacao vai crescer e ter muitos casos de uso dependendo de entidades pre-existentes.

## Posicionamento no projeto

As factories ficam em `test/factories/`, separadas do codigo de producao. Sao helpers exclusivos de teste — nao devem ser importadas em codigo de aplicacao.