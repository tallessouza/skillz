# Code Examples: Definindo Requisitos e Regras de Negocio

## Exemplo completo do README da aula

Este e o arquivo README.md que o Diego cria na aula, documentando todos os requisitos de um app estilo GymPass:

```markdown
# App

GymPass style app.

## RFs (Requisitos funcionais)

- [ ] Deve ser possível se cadastrar;
- [ ] Deve ser possível se autenticar;
- [ ] Deve ser possível obter o perfil de um usuário logado;
- [ ] Deve ser possível obter o número de check-ins realizados pelo usuário logado;
- [ ] Deve ser possível o usuário obter seu histórico de check-ins;
- [ ] Deve ser possível o usuário buscar academias próximas;
- [ ] Deve ser possível o usuário buscar academias pelo nome;
- [ ] Deve ser possível o usuário realizar check-in em uma academia;
- [ ] Deve ser possível validar o check-in de um usuário;
- [ ] Deve ser possível cadastrar uma academia;

## RNs (Regras de negócio)

- [ ] O usuário não deve poder se cadastrar com um e-mail duplicado;
- [ ] O usuário não pode fazer 2 check-ins no mesmo dia;
- [ ] O usuário não pode fazer check-in se não estiver perto (100m) da academia;
- [ ] O check-in só pode ser validado até 20 minutos após criado;
- [ ] O check-in só pode ser validado por administradores;
- [ ] A academia só pode ser cadastrada por administradores;

## RNFs (Requisitos não-funcionais)

- [ ] A senha do usuário precisa estar criptografada;
- [ ] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
- [ ] Todas as listas de dados precisam estar paginadas com 20 itens por página;
- [ ] O usuário deve ser identificado por um JWT (JSON Web Token);
```

## Mapeamento RF → RN

Cada RN se conecta a pelo menos um RF. Veja o mapeamento:

```
RF: Deve ser possivel se cadastrar
  └─ RN: O usuario nao deve poder se cadastrar com e-mail duplicado

RF: Deve ser possivel realizar check-in em uma academia
  ├─ RN: O usuario nao pode fazer 2 check-ins no mesmo dia
  └─ RN: O usuario nao pode fazer check-in se nao estiver perto (100m)

RF: Deve ser possivel validar o check-in de um usuario
  ├─ RN: O check-in so pode ser validado ate 20 minutos apos criado
  └─ RN: O check-in so pode ser validado por administradores

RF: Deve ser possivel cadastrar uma academia
  └─ RN: A academia so pode ser cadastrada por administradores
```

## Template para novos projetos

Use este template ao iniciar qualquer novo projeto backend:

```markdown
# [Nome do App]

[Descricao em uma linha do que o app faz]

## RFs (Requisitos funcionais)

- [ ] Deve ser possivel ...;
- [ ] Deve ser possivel ...;

## RNs (Regras de negocio)

- [ ] O usuario nao pode ...;
- [ ] O [entidade] so pode ... se ...;

## RNFs (Requisitos nao-funcionais)

- [ ] A senha do usuario precisa estar criptografada;
- [ ] Os dados precisam estar persistidos em um banco [banco];
- [ ] Todas as listas precisam estar paginadas com [N] itens por pagina;
- [ ] O usuario deve ser identificado por um [estrategia de auth];
```

## Exemplos de como RNs viram codigo

A RN "nao pode fazer 2 check-ins no mesmo dia" eventualmente vira algo como:

```typescript
// A regra de negocio se manifesta como um if no use case
const checkInOnSameDay = await checkInsRepository.findByUserIdOnDate(
  userId,
  new Date()
)

if (checkInOnSameDay) {
  throw new MaxNumberOfCheckInsError()
}
```

A RN "nao pode fazer check-in se nao estiver perto (100m)" vira:

```typescript
const distance = getDistanceBetweenCoordinates(
  { latitude: userLatitude, longitude: userLongitude },
  { latitude: gym.latitude, longitude: gym.longitude },
)

const MAX_DISTANCE_IN_KILOMETERS = 0.1 // 100 meters

if (distance > MAX_DISTANCE_IN_KILOMETERS) {
  throw new MaxDistanceError()
}
```

Essas implementacoes serao construidas nas proximas aulas — aqui o ponto e entender que cada RN documentada se traduz em um caminho condicional no codigo.