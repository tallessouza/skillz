# Deep Explanation: Primeiro Teste Unitario

## Por que testes unitarios nao podem tocar no banco de dados

O instrutor demonstra o problema ao vivo: roda o teste uma vez, funciona. Roda a segunda vez, falha com erro de e-mail duplicado. Isso acontece porque o Prisma esta gravando no banco real, e o registro persiste entre execucoes.

Isso ilustra dois problemas fundamentais dos testes que batem em banco:
1. **Lentidao** — operacoes de I/O sao ordens de magnitude mais lentas que operacoes em memoria
2. **Conflitos** — estado persiste entre execucoes, gerando falhas intermitentes

O instrutor enfatiza: "se todos os testes unitarios baterem no banco de dados, primeiro vai ser extremamente lento, segundo a gente vai ter que ficar lidando com problemas de conflito."

## A principal vantagem da inversao de dependencia: testes

O ponto central da aula e que inversao de dependencia nao e apenas um padrao de arquitetura bonito — sua principal vantagem pratica e permitir a escrita de testes unitarios.

Como o `RegisterUseCase` recebe um `UsersRepository` por parametro (e nao instancia o Prisma internamente), podemos substituir a implementacao real por um objeto fake que imita a interface. O use case nao sabe e nao se importa com a implementacao concreta.

O instrutor explicita: "a gente vai ver a principal vantagem, na minha opinião, da gente utilizar inversão de dependência, que é para escrita de testes."

## Piramide de testes e velocidade

A analogia usada e a piramide de testes:
- **Base (unitarios):** milhares, rapidos (20ms cada), sem dependencias externas
- **Meio (integracao):** dezenas, medios, podem usar banco
- **Topo (end-to-end):** poucos, lentos, testam fluxo completo

"Não faz sentido um deploy da nossa aplicação ficar aguardando 20, 30 minutos os testes executarem." Por isso a base deve ser rapida.

## Retorno em objeto nomeado

O instrutor explica por que retornar `{ user }` ao inves de `user` direto: "mais pra frente, se essa função vier a retornar outras coisas, eu só adiciono essas outras coisas aqui embaixo, eu não preciso ficar mudando a estrutura de retorno."

Isso e um padrao de extensibilidade: adicionar campos ao retorno nao quebra consumers existentes que fazem destructuring.

## Verificacao de hash com compare

Como hashes sao one-way (nao da pra descriptografar), a verificacao e feita gerando um novo compare: "eu não posso pegar a senha e descriptografar ela. Mas eu posso gerar um novo hash e comparar."

O `compare` do bcryptjs recebe a senha plain-text e o hash existente, retornando `true` se batem.

## Fake repository vs Mock

O objeto criado na aula e um fake — uma implementacao simplificada que respeita a interface mas nao tem logica real. E diferente de um mock (que verifica se metodos foram chamados com argumentos especificos). Para testes unitarios de logica de negocio, fakes sao mais simples e suficientes.

## Identificando o que testar

O instrutor mostra como olhar para requisitos funcionais, nao-funcionais e regras de negocio para identificar testes:
- "Deve ser possível se cadastrar?" → teste de cadastro com sucesso
- "Usuário não deve poder se cadastrar com e-mail duplicado" → teste de duplicacao
- "Senha precisa ser criptografada" → teste de hash

Regra: **cada regra de negocio exige pelo menos um teste**.