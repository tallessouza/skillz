# Deep Explanation: Refatorando Controllers para Clean Architecture

## Por que refatorar controllers?

Na Clean Architecture, cada camada tem uma responsabilidade clara. O controller pertence a camada de infraestrutura/apresentacao — ele recebe requests HTTP e retorna responses. Ele **nao** deve conter logica de negocio nem acessar o banco diretamente.

Quando o controller usa `PrismaService` diretamente, ele:
- Acopla a camada HTTP ao ORM especifico
- Mistura responsabilidades (HTTP + persistencia + negocio)
- Torna impossivel testar o controller sem banco de dados
- Duplica logica que deveria estar centralizada no use case

## O processo de refatoracao

O instrutor (Diego/Rocketseat) demonstra um processo direto:

1. **Substituir a injecao**: trocar `PrismaService` por `RegisterStudentUseCase` no constructor
2. **Chamar o use case**: `const result = await this.registerStudent.execute({ name, email, password })`
3. **Tratar o resultado**: verificar `result.isLeft()` para erros
4. **Limpar imports**: remover importacoes nao utilizadas do Prisma

## Sobre nomes diferentes entre camadas

O instrutor faz uma observacao importante: o controller se chama `CreateAccount` mas o use case se chama `RegisterStudent`. Ele explica que "nao e um problema os nomes serem diferentes" — isso e valido porque cada camada usa o vocabulario do seu contexto. O controller fala em termos de HTTP (criar conta), o dominio fala em termos de negocio (registrar estudante).

## Tratamento de erros (incompleto nesta aula)

O instrutor reconhece que o tratamento de erros ainda esta incompleto — os `throwErrors` estao vazios. Ele promete resolver isso em aulas seguintes. Isso e uma pratica comum em refatoracoes incrementais: primeiro mover a estrutura, depois refinar o tratamento de erros.

## Validacao pos-refatoracao

O instrutor enfatiza duas formas de validacao:
1. **Teste manual**: criar uma conta via API e verificar que funciona
2. **Testes automatizados**: rodar testes E2E (`pnpm run test:e2e`) que "realmente garantem que tudo esta funcionando" + testes unitarios (`pnpm run test`)

A enfase nos testes E2E e importante — eles sao o teste que "realmente garante" a integracao, porque testam o fluxo completo incluindo o wiring do NestJS DI.