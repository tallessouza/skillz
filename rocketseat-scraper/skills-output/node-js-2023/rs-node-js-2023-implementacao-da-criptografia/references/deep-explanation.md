# Deep Explanation: Implementacao da Criptografia

## Por que separar em CryptographyModule?

O instrutor enfatiza que nao e obrigatorio criar um modulo separado — seria possivel reutilizar outros modulos. Porem, a separacao traz clareza organizacional. Cada modulo de infra (database, cryptography, http) encapsula suas implementacoes concretas e exporta apenas os contratos abstratos.

## O padrao provide/useClass

Este e o mesmo padrao usado nos repositorios. O instrutor faz a conexao explicita: "a gente vai fazer mais ou menos como a gente fez com os repositorios". No `DatabaseModule`, cada repositorio abstrato do dominio tem um `provide` apontando para a classe abstrata e um `useClass` apontando para a implementacao Prisma. Aqui, o mesmo padrao se aplica para criptografia.

O que isso significa na pratica: quando qualquer classe da aplicacao declara uma dependencia em `Encryptor` (a classe abstrata), o NestJS automaticamente injeta `JwtEncryptor` (a implementacao concreta). O consumidor nunca sabe qual implementacao esta usando.

## Uma classe, multiplos contratos

O `BcryptHasher` implementa tanto `HashGenerator` quanto `HashComparer`. Isso e perfeitamente valido porque bcrypt precisa das duas operacoes. No modulo, isso resulta em dois registros separados:

```typescript
{ provide: HashComparer, useClass: BcryptHasher },
{ provide: HashGenerator, useClass: BcryptHasher },
```

Ambos apontam para a mesma classe, mas cada contrato e exportado independentemente. Isso permite que no futuro, se necessario, voce troque apenas o hasher ou apenas o comparador.

## JwtEncryptor depende de outro modulo

O instrutor destaca que e "totalmente comum" uma classe de infra depender de outro modulo do NestJS. O `JwtEncryptor` precisa do `JwtService`, que vem do `AuthModule` (configurado anteriormente no curso). Isso e resolvido naturalmente pela injecao de dependencias do NestJS.

## Curiosidade: JWT se pronuncia "Jot"

O instrutor menciona que a pronuncia oficial de JWT e "Jot" (RFC 7519), embora quase ninguem use essa pronuncia no dia a dia.

## Async desnecessario

O instrutor nota que quando uma funcao apenas retorna uma Promise sem usar `await`, o `async` e desnecessario. Tanto `encrypt` quanto `hash` e `compare` simplesmente retornam a Promise da biblioteca subjacente, entao nao precisam de `async`.

## Salt rounds como configuracao

O instrutor sugere que o valor 8 (salt rounds do bcrypt) poderia ser extraido como uma configuracao. Ele mostra a abordagem de criar uma propriedade privada `HASH_SALT_LENGTH = 8`, transformando o magic number em algo configuravel e legivel.