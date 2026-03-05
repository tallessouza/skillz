# Deep Explanation: Unindo DDD ao SOLID

## A mentalidade central

O instrutor (Diego, Skillz) traz uma provocacao fundamental: **voce consegue desenvolver seu software sem banco de dados?** A maioria dos desenvolvedores aprendeu a programar de forma totalmente acoplada ao meio externo — o software depende de algo acontecer no banco de dados para funcionar. Isso e um sinal de acoplamento excessivo.

## Por que repositorios sao interfaces

O repositorio vem do **Data Mapper Pattern** — e a classe que conecta a aplicacao a algo do mundo externo, a uma camada de persistencia. Pode ser banco de dados, arquivo, JSON, qualquer coisa.

Ao definir como interface, voce ganha:
- **Multiplas implementacoes**: Postgres, MongoDB, InMemory, API
- **Testabilidade**: testes rodam sem banco real
- **Confianca**: regras de negocio executam exatamente como instruido no codigo

## Camada de infraestrutura = tudo que pode dar errado

O instrutor define infraestrutura como "tudo o que a gente nao tem total controle" — frameworks, bancos de dados, APIs externas. O resto, que e puramente codigo, e o que temos controle e sabemos que sempre vai executar da forma esperada.

## O synthetic sugar do TypeScript

Em vez de:
```typescript
class SubmitOrder {
  private ordersRepository: OrdersRepository

  constructor(ordersRepository: OrdersRepository) {
    this.ordersRepository = ordersRepository
  }
}
```

O TypeScript permite:
```typescript
class SubmitOrder {
  constructor(private ordersRepository: OrdersRepository) {}
}
```

O `private` na frente do parametro cria automaticamente a propriedade a partir do parametro recebido.

## A dor como pre-requisito

O instrutor faz uma observacao importante: esses principios fazem mais sentido quando voce **ja sentiu a dor** de manter software grande e acoplado — dificil de dar manutencao, dificil de testar, dificil de ter confianca. Sem essa experiencia, a motivacao para desacoplar pode parecer abstrata.

## O exercicio proposto

Diego sugere: pegue um software que voce desenvolveu recentemente, mesmo simples, e tente reescrever as regras de negocio sem banco de dados. Voce vai perceber o quanto o codigo original era acoplado. O software nao vai ser "navegavel" no final, mas a estrutura, as regras, os relacionamentos entre entidades — tudo isso funciona independente de infra.

## Conexao SOLID ↔ DDD

- **Dependency Inversion (D do SOLID)**: use cases dependem de abstracoes (interfaces), nao de implementacoes concretas
- **Open/Closed Principle**: novas implementacoes de repositorio nao exigem mudanca nos use cases
- **Liskov Substitution**: qualquer implementacao de `OrdersRepository` pode substituir outra sem quebrar o sistema
- **Entidades DDD**: modelam o dominio sem conhecer persistencia
- **Use Cases DDD**: orquestram regras de negocio usando interfaces de repositorio