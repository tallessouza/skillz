# Deep Explanation: Caso de Uso de Validar Check-in

## Contexto do negocio

O validate check-in e o processo onde a academia confirma a presenca do usuario. Existem dois cenarios reais:

1. **Sistema integrado** — academia tem sistema proprio que integra com a API, usuario coloca digital ou CPF e o sistema valida automaticamente
2. **Manual** — academia menor, funcionario abre o sistema, ve que a pessoa fez check-in no app, e clica para validar

Essa funcionalidade sera provavelmente acessada por integracao terceira com o sistema da academia. Isso justifica manter o use case desacoplado da infraestrutura (controllers, rotas, Prisma).

## Por que reutilizar o repositorio

O instrutor (Diego) comeca copiando o check-in use case existente e renomeando para validate. O repositorio `CheckInsRepository` ja existe e ja tem o `create`. Em vez de criar um novo repositorio, ele adiciona `findById` e `save` ao mesmo, porque:

- O repositorio representa a **entidade** (CheckIn), nao o caso de uso
- Cada caso de uso que trabalha com check-ins usa o mesmo repositorio
- Isso segue o principio de coesao — metodos relacionados a mesma entidade ficam juntos

## O padrao findById + mutate + save

Este e o padrao central da aula. Em vez de ter um metodo `update(id, fields)` generico no repositorio:

1. **findById** — busca o objeto completo
2. **Mutacao no objeto** — `checkIn.validated_at = new Date()`
3. **save** — persiste o objeto mutado

Vantagens:
- O use case tem controle total sobre a logica de negocio antes de salvar
- O repositorio nao precisa saber quais campos podem ser atualizados
- Facilita adicionar validacoes (ex: tempo limite de 20 minutos, que sera implementado na proxima aula)

## findById retornando null vs undefined

O `Array.find()` nativo do JavaScript retorna `undefined` quando nao encontra. O instrutor explicitamente normaliza para `null`:

```typescript
const checkIn = this.items.find((item) => item.id === id)
if (!checkIn) {
  return null
}
return checkIn
```

Razao: a interface do repositorio deve ser consistente. `null` e a convencao para "busquei e nao encontrei", enquanto `undefined` pode significar "nao busquei" ou "propriedade nao existe".

## save vs create — semantica distinta

- `create` — insere um novo item no array (`this.items.push(checkIn)`)
- `save` — encontra o item existente pelo id e substitui no array

A implementacao do save usa `findIndex` + substituicao direta:

```typescript
const checkInIndex = this.items.findIndex((item) => item.id === checkIn.id)
if (checkInIndex >= 0) {
  this.items[checkInIndex] = checkIn
}
```

O `findIndex` retorna `-1` quando nao encontra, por isso a checagem `>= 0`.

## Estrategia de teste duplo

O instrutor faz uma observacao importante: "nao tem necessariamente uma unica forma do meu teste validar que aquilo esta funcionando". Ele usa DUAS verificacoes:

1. **Retorno do use case** — `expect(checkIn.validated_at).toEqual(expect.any(Date))`
2. **Estado interno do repositorio** — `expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))`

Isso garante que:
- O use case retorna o objeto atualizado (poderia retornar uma copia desatualizada)
- O repositorio realmente persistiu a mudanca (o save poderia ter falhado silenciosamente)

## Teste de recurso inexistente

Para testar que o erro e lancado corretamente:

```typescript
await expect(() =>
  sut.execute({ checkInId: 'inexistent-check-in-id' }),
).rejects.toBeInstanceOf(ResourceNotFoundError)
```

O `await` antes do `expect` garante que a promise resolve/rejeita antes do Jest avaliar o resultado.

## Regra de negocio pendente

O instrutor menciona que falta implementar: "o check-in so pode ser validado ate 20 minutos apos ser criado". Isso sera feito na proxima aula usando manipulacao de datas (dayjs) e os mocks de data do vitest (`vi.useFakeTimers`).