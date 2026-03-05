# Deep Explanation: Validacao de Access Token via Refresh Token

## Por que essa camada extra de seguranca?

O instrutor apresenta um cenario concreto: imagine que voce esta usando sua conta normalmente, mas percebe que um dispositivo desconhecido tambem esta acessando sua conta. A solucao seria implementar um endpoint para revogar refresh tokens — o usuario clica um botao, a API deleta o refresh token do banco.

**O problema:** mesmo apos deletar o refresh token, se um atacante tem apenas o access token (sem o refresh token), ele ainda consegue se passar pelo usuario ate o token expirar. O refresh token ja foi revogado, entao o atacante nao consegue renovar — mas durante a janela de validade do access token, o acesso continua.

**A solucao:** adicionar uma verificacao no filtro de autorizacao que compara o Access Token ID (armazenado no payload do JWT) com os Access Token IDs na tabela refresh_token do banco. Se o refresh token foi deletado, o access token ID nao sera encontrado, e a requisicao e bloqueada instantaneamente — sem precisar esperar a expiracao.

## Fluxo tecnico detalhado

1. O access token contem um ID unico no seu payload (JTI - JWT ID)
2. Esse ID e armazenado na tabela `refresh_token` na coluna `access_token_id`
3. No filtro `OnAuthorizationAsync`, apos validar o JWT e buscar o user:
   - Extrai o `accessTokenId` do token
   - Consulta o banco: "existe um refresh token para este user com este access token ID?"
   - Se nao existe → 401 imediato

## Mecanismo de "matar sessao"

Deletar o refresh token do banco funciona como um kill switch:
- O refresh token endpoint ja rejeita (refresh token nao encontrado)
- O filtro de autorizacao agora tambem rejeita (access token ID nao encontrado)
- Resultado: invalidacao instantanea, sem esperar expiracao do JWT

## Ponto de atencao: performance

O instrutor enfatiza que essa abordagem adiciona 2 consultas ao banco por requisicao autenticada:
1. Buscar a entidade user pelo ID
2. Verificar se existe refresh token associado

Para bancos pequenos e organizados, nao ha problema. Mas em producao com bases grandes e queries complexas (muitos joins), isso pode impactar performance. O conselho e: monitore, mantenha indices adequados, e garanta que o banco esta organizado.

## Efeito colateral: testes de integracao

O instrutor alerta que essa mudanca quebra os testes de integracao existentes, porque agora o filtro de autorizacao depende de um refresh token existir no banco para cada access token usado nos testes. Isso sera corrigido na aula seguinte.

## Injecao de dependencia no filtro

Para acessar o repositorio no filtro de autorizacao:
- Receber `IRefreshTokenReadOnlyRepository` via construtor
- O container de DI fornece a instancia
- Armazenar em propriedade privada readonly da classe