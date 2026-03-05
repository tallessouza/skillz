# Deep Explanation: Custom Authorize Attribute

## Por que nao usar o Authorize da Microsoft

O instrutor (Wellison) explica que a abordagem padrao da Microsoft para autorizacao JWT tem limitacoes que ele considera problematicas em projetos reais:

### 1. Token valido != usuario valido

Quando voce usa `[Authorize]`, o .NET so verifica:
- Se o token foi gerado pela sua API (assinatura valida)
- Se o token nao expirou

Ele **nao** verifica se o usuario ainda existe no banco. Cenario problematico: usuario deleta a conta, mas ainda possui um token valido. O `[Authorize]` deixa a requisicao passar, a regra de negocio executa, tenta buscar o usuario no banco, nao encontra, e lanca um erro — quando poderia ter barrado na entrada.

### 2. Permissoes no payload do JWT sao perigosas

O instrutor levanta dois problemas com colocar roles/permissoes dentro do token:

**Problema de seguranca:** O payload do JWT nao e criptografado, apenas encodado em Base64. Qualquer pessoa pode decodificar no jwt.io e ver `"role": "admin"`. Se alguem intercepta esse token, sabe que pertence a um admin e pode direcionar ataques.

**Problema de sincronizacao:** Se voce remove a permissao de admin de alguem no banco de dados, o token antigo dessa pessoa ainda carrega `"role": "admin"` no payload. O `[Authorize(Roles = "admin")]` valida pelo conteudo do token, nao pelo banco. A pessoa continua acessando endpoints de admin ate o token expirar.

Mesmo mascarar o valor (usar um codigo ao inves de "admin") nao resolve o problema de sincronizacao e adiciona peso desnecessario ao token.

### 3. Execucao desnecessaria de regra de negocio

Na demonstracao, o instrutor mostra que sem nenhum atributo de autorizacao, a API processa a requisicao inteira — entra no controller, chama o use case, tenta ler o token do header (que esta vazio), e lanca uma excecao generica 500. O ideal e barrar **antes** de chegar na regra de negocio.

## Filosofia do instrutor

> "Eu gosto de ser um pouquinho controlador a nivel de codigo."

O Wellison prefere ter controle explicito sobre o que esta sendo validado. Com o `[Authorize]` padrao, voce delega a responsabilidade para um pacote e perde visibilidade das validacoes. Com atributo customizado, cada validacao e explicita e auditavel.

## Demonstracao passo a passo

Na aula, o instrutor faz debug da API mostrando:

1. **Sem token:** Chama GET /users → requisicao chega ao use case → tenta ler `Request.Headers.Authorization` → string vazia → tenta acessar posicao no vetor → excecao → filtro de excecao generico → erro 500

2. **Com token:** Faz login com Bruce Wayne → copia token → configura no Swagger (Bearer + token) → chama GET /users → token lido do header → JWT decodificado → ID extraido → busca usuario no banco → retorna perfil com sucesso

O contraste mostra que sem autorizacao adequada, a API aceita qualquer chamada e falha de forma confusa.

## Contexto: Cache Flow vs MAUI

Na trilha anterior de C# (Cache Flow), o `[Authorize]` padrao foi usado. Nesta trilha avancada, o instrutor ensina a abordagem customizada como evolucao. Ele menciona que usa atributos customizados em todos os seus projetos, simples ou complexos.