# Deep Explanation: Gateways de Criptografia

## Por que gateways para criptografia?

O instrutor parte de uma observacao pratica: ao criar casos de uso de autenticacao e cadastro, o caso de uso precisa lidar com duas responsabilidades externas:

1. **Banco de dados** — ja resolvido via repositorios (pattern conhecido)
2. **Criptografia** — hash de senha (Bcrypt) e geracao de token (JWT)

A analogia e direta: **repositorio esta para banco de dados assim como gateway de criptografia esta para funcoes de crypto**. Ambos sao adapters/portas entre o caso de uso e a infraestrutura.

## O papel do gateway

O instrutor usa o termo "gateway" explicitamente: "vai ter um carinha aqui no meio que vai gerenciar essa comunicacao entre o caso de uso e as funcoes de cripto."

Isso significa que o caso de uso nunca importa `bcryptjs` ou `@nestjs/jwt`. Ele conhece apenas o contrato abstrato. A implementacao concreta fica na camada de infra e e injetada via DI do NestJS.

## Interface Segregation aplicada

O instrutor faz um exercicio didatico: comeca com uma unica classe `Hasher` com dois metodos (`hash` e `compare`), depois aplica o principio I do SOLID (Interface Segregation) para separar em dois contratos:

- `HashGenerator` — apenas `hash(plain: string): Promise<string>`
- `HashComparer` — apenas `compare(plain: string, hash: string): Promise<boolean>`

A analogia usada e a classica da impressora do SOLID: uma impressora que copia, escaneia e imprime pode ter tres contratos separados. Se uma classe faz os tres, implementa os tres. Se faz apenas um, implementa apenas um.

No caso do hash, mesmo que a classe concreta (ex: `BcryptHasher`) implemente ambos os contratos, a separacao permite que um caso de uso que so precisa gerar hash dependa apenas de `HashGenerator`, sem carregar o contrato de comparacao.

## Por que abstract class e nao interface?

Limitacao tecnica do NestJS: interfaces TypeScript nao existem em runtime (sao apagadas na compilacao). O sistema de injecao de dependencia do NestJS precisa de um token em runtime para resolver a dependencia. Abstract classes existem em runtime e servem como token.

O instrutor faz questao de notar: "o mais correto seria usar uma interface, ta" — ou seja, a abstract class e um workaround pragmatico.

## Estrutura de pastas resultante

```
domain/
  forum/
    application/
      cryptography/
        encrypter.ts          # Contrato para JWT
        hash-generator.ts     # Contrato para gerar hash
        hash-comparer.ts      # Contrato para comparar hash
      repositories/
        students-repository.ts
      use-cases/
        register-student.ts
        authenticate-student.ts
```

## Conexao com o StudentsRepository

Antes de criar os gateways de crypto, o instrutor cria o `StudentsRepository` com dois metodos:
- `findByEmail(email: string): Promise<Student | null>` — para login (buscar usuario por email)
- `create(student: Student): Promise<void>` — para cadastro

E atualiza a entidade `Student` com propriedades `name`, `email` e `password` com getters (sem setters por enquanto).