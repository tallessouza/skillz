# Deep Explanation: Caso de Uso de Autenticacao

## Por que comecar pelo use case e nao pelo controller?

O instrutor enfatiza um principio fundamental de design de software: **sempre de baixo para cima**. O controller serve especificamente para fornecer um meio de acesso externo ao use case. Sozinho, o controller nao tem responsabilidade quase nenhuma — ele e apenas uma ponte entre o mundo externo (HTTP) e a funcionalidade real.

O use case, por outro lado, descreve a funcionalidade no seu mais baixo nivel. Desde o inicio da criacao, voce ja consegue testar com testes unitarios. Se comecasse pelo controller, nao teria como validar que algo funciona.

**Fluxo correto de construcao:**
```
Use Case → Testes Unitarios → Controller → Integracoes externas
```

## Por que erros genericos em autenticacao?

Esta e uma decisao de **seguranca**, nao de conveniencia. O instrutor explica com um cenario pratico:

> Quando uma pessoa vai fazer a autenticacao, nao interessa se ela digitou o email errado, a senha errada, o usuario errado — todos os erros tem que ser iguais.

Se voce retorna "senha incorreta" separadamente de "usuario nao encontrado", um atacante que tenta burlar o sistema recebe um indicio de que acertou o email. Isso e um vetor de enumeracao de usuarios — uma vulnerabilidade real.

Por isso, `InvalidCredentialsError` e usado para TODOS os cenarios de falha, sem distincao.

## Clean code para booleanos

O instrutor apresenta uma regra pratica elegante: **leia a variavel como se tivesse um `if` na frente**.

- `if match` → nao faz sentido gramatical
- `if doesPasswordMatches` → faz sentido como pergunta

Prefixos recomendados: `is`, `has`, `does`. Esses verbos trazem sentido de sim/nao, transformando a variavel em uma pergunta semantica.

## Hashing de senhas — por que compare?

O processo de hashing e **unidirecional** — nao existe "des-hashear" uma senha. Para validar, voce precisa:

1. Pegar a senha em texto plano enviada pelo usuario
2. Usar `bcrypt.compare()` que internamente faz o hash da senha nova
3. Comparar com o hash armazenado no banco

O metodo `compare` do bcryptjs faz exatamente isso: recebe `(senhaPlana, hashArmazenado)` e retorna `true/false`.

## Reutilizacao de repositorio

O metodo `findByEmail` foi criado originalmente para o caso de uso de cadastro (verificar se email ja existe). Agora ele e reutilizado na autenticacao para buscar o usuario. Isso exemplifica o principio de que repositorios sao compartilhados entre use cases — eles nao pertencem a um use case especifico.

## Estrutura de entrada e saida

O instrutor tipifica explicitamente:
- **Request:** `{ email, password }` — o minimo para autenticacao tradicional
- **Response:** `{ user }` — retorna o usuario autenticado

Nota: tokens (JWT) nao sao responsabilidade do use case. O use case apenas confirma a identidade e retorna o usuario. A geracao de tokens fica em camadas superiores.