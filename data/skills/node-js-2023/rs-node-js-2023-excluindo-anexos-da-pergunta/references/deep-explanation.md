# Deep Explanation: Cascade Delete via Repository Dependency Injection

## O insight central

O instrutor apresenta um pattern que muitos desenvolvedores nao percebem: **repositorios podem depender de outros repositorios**, usando exatamente a mesma inversao de dependencia que se usa entre casos de uso e repositorios.

A frase-chave: "A parte de inversao de dependencia que a gente fez nos casos de uso, onde um caso de uso pode receber um repositorio, isso tambem pode ser feito nos proprios repositorios. Isso e bem legal."

## Por que isso importa

Quando voce deleta um aggregate root (como `Question`), todas as entidades que pertencem a esse agregado (como `QuestionAttachment`) precisam ser removidas. Sem esse pattern, voce teria duas opcoes ruins:

1. **O caso de uso faz a limpeza** — viola encapsulamento, porque o caso de uso precisa conhecer detalhes internos do agregado
2. **Nao limpa** — dados orfaos ficam no sistema

A solucao elegante: o repositorio do agregado raiz recebe os repositorios das entidades filhas e faz a limpeza internamente no metodo `delete`.

## A progressao do pattern

O instrutor faz questao de mencionar que esse pattern se aplica em duas camadas:

1. **InMemory (testes)** — onde ele demonstra na aula
2. **Infraestrutura (banco real)** — "Mais para frente, a gente vai fazer isso tambem quando a gente integrar com a camada de persistencia"

Isso reforca que DDD patterns sao independentes de tecnologia. O InMemory nao e "fake" — ele segue as mesmas regras arquiteturais.

## O metodo deleteManyByQuestionId

O instrutor usa `filter` para manter apenas os items cujo `questionId` e DIFERENTE do recebido:

```typescript
const questionAttachments = this.items.filter(
  (item) => item.questionId.toString() !== questionId,
)
this.items = questionAttachments
```

Note o detalhe: `questionId` e um `UniqueEntityID`, entao precisa do `.toString()` para comparacao com string.

## Efeito colateral nos testes

O instrutor destaca um ponto pratico importante: ao adicionar uma dependencia no construtor do `InMemoryQuestionsRepository`, **todos os lugares que instanciam esse repositorio precisam ser atualizados**. Ele percorre os outros arquivos de teste para garantir que nenhum teste quebrou.

## Observacao do instrutor sobre opcionalidade

"E claro que e so um exemplo, a gente pode aplicar isso aqui ou pode nao aplicar. O teste continuaria funcionando mesmo se eu nao fizesse isso."

Isso mostra maturidade: o pattern nao e obrigatorio no InMemory para testes passarem, mas e uma boa pratica que antecipa o comportamento real da aplicacao e garante consistencia desde os testes.