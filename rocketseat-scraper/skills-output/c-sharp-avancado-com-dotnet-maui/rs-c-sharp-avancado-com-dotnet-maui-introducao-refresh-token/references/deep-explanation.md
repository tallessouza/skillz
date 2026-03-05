# Deep Explanation: Refresh Token — Arquitetura e Implementacao

## Por que o access token tem que expirar rapido?

O instrutor Wellison explica com um cenario concreto: imagine que alguem rouba um access token. Esse token representa voce — a pessoa mal-intencionada vai se passar por voce. Se o token dura dias, o estrago e enorme. Se dura 10 minutos, o dano e minimizado porque em pouco tempo o token expira e o invasor perde o acesso.

## O intervalo magico: 5 a 20 minutos

O instrutor e enfatico: nao existe numero magico universal. O time deve sentar e discutir:
- **Dados muito sensiveis** (transacoes bancarias, documentos, enderecos): mais perto de 5 minutos
- **Dados menos sensiveis**: pode chegar a 20 minutos
- Menos que 5 minutos: desnecessario, fica muito rapido
- Mais que 20 minutos: problema de seguranca

No exemplo do projeto, o token esta configurado com 1000 minutos (~16.5 horas) no `appsettings.development.json`, mas o instrutor deixa claro que isso esta errado para producao.

## Como o codigo atual gera o token

No projeto, a classe `JWTTokenGenerator` fica em:
```
Infrastructure/Security/Tokens/Access/Generator/
```

Na funcao `Generate`, linha 30, cria-se o descritor do token. Na linha 32, a propriedade `Expires` e preenchida com:
```csharp
DateTime.UtcNow.AddMinutes(expirationMinutes)
```

Isso pega o momento exato da geracao e adiciona X minutos, resultando na data/hora de expiracao.

## Por que resolver token com outro token funciona?

A duvida natural: "vamos resolver o problema de um token com outro token?" A resposta e sim, porque os dois tokens tem propositos completamente diferentes:

- **Access token (JWT)**: auto-contido, carrega informacoes da pessoa, usado em TODA requisicao, NAO pode ser invalidado (nao tem como "apagar" um JWT que ja foi emitido)
- **Refresh token**: valor aleatorio no banco de dados, usado APENAS para renovar access tokens, PODE ser invalidado (basta deletar ou alterar status no banco)

## Analogia com WhatsApp (sessoes)

O instrutor usa o exemplo do WhatsApp para explicar sessoes:
- Voce tem sessoes no Android, iPhone, Chrome
- Cada sessao tem seu proprio refresh token associado ao dispositivo
- Se voce ve uma sessao estranha (ex: Android quando voce so usa iPhone), voce remove aquela sessao
- Remover sessao = invalidar o refresh token daquele dispositivo
- O access token NAO e invalidado — ele simplesmente expira naturalmente

## Por que refresh token NAO deve ser JWT?

O instrutor explica: JWT e um valor grande. Refresh token vai ser armazenado no banco de dados. Usar um valor menor economiza espaco. Alem disso, refresh token nao precisa carregar informacoes (claims) — ele so precisa ser unico para que o banco consiga associar ao usuario correto.

## O fluxo transparente detalhado

O ponto mais importante para UX: o usuario NUNCA percebe que o token expirou.

1. App faz requisicao normal com access token
2. API valida token ANTES de chegar no controller (middleware de validacao)
3. Se expirado, API retorna erro (401)
4. App detecta esse erro especifico
5. App automaticamente chama endpoint de refresh com o refresh token guardado
6. API busca refresh token no banco, verifica existencia e usuario associado
7. API gera NOVO par (access + refresh) e devolve
8. App armazena os novos tokens
9. App refaz a requisicao original com o novo access token
10. Tudo isso: zero cliques, zero telas de login, zero interrupcao

## O que sera implementado nas proximas aulas

1. **Novo endpoint** na API para receber refresh token
2. **Nova tabela** no banco de dados para armazenar refresh tokens (valor unico + user_id)
3. **Regra de negocio** para validar refresh token e gerar novos tokens
4. **Codigo no aplicativo** para interceptar 401 e renovar automaticamente