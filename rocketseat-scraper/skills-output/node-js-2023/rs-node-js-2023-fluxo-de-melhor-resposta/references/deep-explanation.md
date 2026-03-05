# Deep Explanation: Fluxo de Domain Events — Best Answer Chosen

## Por que comparar com equals() e nao com ===

O instrutor destaca um problema sutil mas critico: quando voce tem duas instancias de `UniqueEntityID` com o mesmo valor interno (ex: mesmo UUID string), `===` retorna `false` porque compara a **referencia em memoria** das duas instancias, nao o valor primitivo que elas encapsulam.

Nos testes unitarios isso pode funcionar por acaso (se a mesma instancia for reutilizada), mas em testes e2e e producao, onde objetos sao reconstruidos do banco de dados, cada reconstrucao cria uma nova instancia — e `===` quebra.

A solucao e usar o metodo `equals()` que existe na classe `UniqueEntityID` (ou na classe base `Entity`/`ValueObject`), que compara o valor primitivo interno.

## Inversao da logica condicional

O instrutor mostra uma evolucao no codigo. Primeiro ele escreve:
```
if (bestAnswerId) {
  if (bestAnswerId !== this.props.bestAnswerId) {
    // dispara evento
  }
}
```

Depois refatora para early returns:
```
if (bestAnswerId === undefined) return
if (this.props.bestAnswerId !== undefined && !this.props.bestAnswerId.equals(bestAnswerId)) {
  // dispara evento
}
```

A motivacao: ao inves de aninhar ifs para chegar ao caso positivo, use early returns para eliminar os casos negativos. O codigo fica mais plano e mais facil de ler.

## Quando disparar o evento

O evento so deve ser disparado quando:
1. O `bestAnswerId` recebido NAO e undefined (alguem esta escolhendo uma resposta, nao removendo)
2. Ja existia um `bestAnswerId` anterior
3. O novo id e DIFERENTE do anterior

Se o setter for chamado com o mesmo id que ja existe, nao faz sentido disparar notificacao duplicada.

Se nao existia `bestAnswerId` anterior (primeira vez escolhendo), o evento tambem deve ser disparado — o instrutor menciona isso implicitamente no fix do bug do teste.

## O bug no teste

O teste falhava porque a logica original so disparava evento quando `this.props.bestAnswerId` ja existia E era diferente. Mas no teste, a question era criada SEM bestAnswerId, entao o guard `this.props.bestAnswerId !== undefined` impedia o disparo na primeira atribuicao.

A correcao: quando `bestAnswerId` anterior e `undefined` (primeira vez), o evento TAMBEM deve ser disparado. O early return so impede quando o NOVO valor e `undefined`.

## InMemoryRepository e disparo de eventos

Para que domain events funcionem nos testes, o `InMemoryRepository` precisa chamar `DomainEvents.dispatchEventsForAggregate(entity)` nos metodos `create` e `save`. Sem isso, os eventos sao registrados no aggregate mas nunca despachados.

## Extensao sugerida pelo instrutor

O instrutor sugere como exercicio criar o mesmo fluxo para:
- `AnswerCommentCreatedEvent` — notificar o autor da resposta quando alguem comenta
- `QuestionCommentCreatedEvent` — notificar o autor da pergunta quando alguem comenta

Ele considera essas notificacoes menos importantes que a de melhor resposta, mas uteis em um sistema real.