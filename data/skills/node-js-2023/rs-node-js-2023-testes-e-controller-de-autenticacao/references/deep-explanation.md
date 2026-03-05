# Deep Explanation: Testes e Controller de Autenticacao

## Por que nunca chamar outro use case no teste

O instrutor Diego explica com clareza: se voce chama o `RegisterUseCase` dentro do teste do `AuthenticateUseCase`, voce esta testando dois use cases ao mesmo tempo. Se o registro quebrar, o teste de autenticacao falha — mas o problema nao e na autenticacao. Isolamento e a base de testes unitarios confiaveis.

A solucao e usar o acesso direto ao repositorio in-memory. Como voce tem acesso ao `usersRepository`, pode chamar `.create()` diretamente, pulando toda a logica do use case de registro. Isso garante que o unico codigo sendo exercitado e o de autenticacao.

## O pattern SUT (System Under Test)

Vem da comunidade de testes. Quando voce copia testes entre arquivos (e isso acontece muito), nomear a variavel principal como `sut` evita o erro classico de esquecer de renomear `registerUseCase` para `authenticateUseCase`. O nome `sut` e valido em qualquer arquivo de teste.

## Por que hash no setup

O repositorio `.create()` recebe dados "crus" — nao passa pela logica do use case. Entao voce precisa enviar o `password_hash` ja processado, nao a senha em texto plano. O use case de autenticacao vai comparar o hash armazenado com a senha recebida usando `bcryptjs.compare()`.

## Rotas como entidades (REST semantico)

Diego compartilha uma dica de design: traduza rotas para entidades, nao verbos. `POST /authenticate` lido como "estou criando um authenticate" — nao faz sentido. `POST /sessions` lido como "estou criando uma sessao" — perfeito. Cada rota deve representar um recurso/entidade.

Exemplos:
- `POST /users` → criando um usuario
- `POST /sessions` → criando uma sessao (login)
- `DELETE /sessions` → destruindo uma sessao (logout, futuro)

## Status codes para autenticacao

- **200 OK** para login bem-sucedido — nao 201, porque nao esta criando um recurso persistido (a sessao ainda nao foi implementada com JWT)
- **400 Bad Request** para credenciais invalidas — informacao enviada esta errada

## A filosofia de testes no dia-a-dia

Diego menciona que na Skillz, nas aplicacoes back-end, ele nao roda mais o servidor durante o desenvolvimento. Todas as alteracoes sao validadas por testes. Se os testes passam, a aplicacao funciona. O Insomnia/Postman so e usado nas primeiras funcionalidades para validacao visual, depois tudo e coberto por testes.

Isso so e possivel porque a arquitetura SOLID permite testar use cases isoladamente, sem subir servidor HTTP, sem banco de dados real, sem dependencias externas.

## A autenticacao e mais que validar credenciais

O controller implementado nesta aula apenas valida email/senha. Diego deixa claro que autenticacao completa envolve: gerar token (JWT), identificar o usuario nas proximas requisicoes, e implementar logout. Essas partes vem em aulas futuras.