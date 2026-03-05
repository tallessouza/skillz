# Deep Explanation: Rota de Autenticacao via Senha

## Por que duas formas de autenticacao?

O instrutor explica que a aplicacao SaaS tem dois metodos de login: senha e GitHub. Isso cria uma situacao onde um usuario que se cadastrou via GitHub nao possui `passwordHash` no banco. Por isso, e obrigatorio verificar se `passwordHash` e null antes de tentar comparar — caso contrario, `bcrypt.compare` receberia null e falharia de forma inesperada.

## Fluxo de validacao em camadas

O instrutor estrutura a validacao como uma cascata de guards:

1. **Email existe?** — Se nao, retorna `invalidCredentials`
2. **Tem password hash?** — Se nao, retorna mensagem especifica sobre login social
3. **Senha bate?** — Se nao, retorna `invalidCredentials`
4. **Tudo OK** — Gera token

Observe que os passos 1 e 3 retornam a mesma mensagem generica. Isso e intencional: impede um atacante de descobrir quais emails estao cadastrados na plataforma (enumeracao de usuarios).

Ja o passo 2 retorna uma mensagem diferente ("Use social login") porque o usuario precisa saber que deve usar outro metodo de autenticacao — nao e uma falha de credencial, e uma orientacao de fluxo.

## JWT Subject (`sub`)

O instrutor demonstra primeiro gerando um JWT sem dados no payload, depois mostra no jwt.io que o token nao contem informacao util. Entao adiciona o `sub` (subject) com o ID do usuario.

O `sub` e uma claim padrao do JWT (RFC 7519) que identifica o "dono" do token. O instrutor chama atencao para isso: "subject e quem esta criando este token, para quem este token se refere".

Nao colocar dados sensiveis no JWT (como email, role, etc.) e uma boa pratica porque o JWT e decodificavel por qualquer pessoa — ele nao e encriptado, apenas assinado.

## Rota como `/sessions/password`

O path `/sessions/password` segue a convencao RESTful onde "session" representa o recurso de autenticacao. O `/password` diferencia do login social (`/sessions/github`). Isso e mais semantico do que `/login` ou `/auth`.

## FastifyJWT — registro vs uso

O `fastifyJwt` e registrado no server com um `secret`. Depois, qualquer rota pode usar `reply.jwtSign()` para gerar tokens. O `expiresIn` e passado no momento do sign (nao no register) para permitir flexibilidade — diferentes rotas podem gerar tokens com duracoes diferentes.

## Bcrypt e timing attacks

O instrutor usa `bcrypt.compare` ao inves de comparacao direta de strings. Alem do bcrypt lidar com o salt automaticamente, ele tambem faz comparacao em tempo constante (timing-safe), prevenindo ataques de timing onde um atacante mede o tempo de resposta para inferir caracteres corretos da senha.