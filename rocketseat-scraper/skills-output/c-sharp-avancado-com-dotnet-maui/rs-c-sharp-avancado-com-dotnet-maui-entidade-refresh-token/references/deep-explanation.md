# Deep Explanation: Entidade Refresh Token

## Por que uma EntBase?

O instrutor enfatiza que toda entidade do projeto precisa seguir um padrao. A EntBase fornece tres propriedades universais:

1. **Id (Guid v7)** — IDs unicos que nao se repetem nem entre entidades diferentes. A versao 7 do GUID e a mais recente e recomendada.

2. **Active (bool)** — Mecanismo de soft delete. No caso do Refresh Token, essa propriedade nao sera utilizada diretamente, mas existe porque o padrao exige consistencia. A ideia e: se alguem deletar algo por engano (uma tarefa, por exemplo), basta trocar Active para true e a entidade e recuperada.

3. **CreatedAt (DateTime)** — Crucial para o Refresh Token porque determina a expiracao. O Refresh Token tambem expira (assim como o Access Token), e essa propriedade e usada para calcular se o token ainda esta dentro do prazo de validade.

## Correcao de nomenclatura: CreatedOn vs CreatedAt

O instrutor deixou um erro proposital no codigo original: `CreatedOn` em vez de `CreatedAt`. A explicacao linguistica:

- **"On"** — usado para datas (on Monday, on January 5th)
- **"At"** — usado para momentos especificos no tempo (at 3pm, at this exact moment)

Como DateTime armazena data E hora (um ponto especifico no tempo), a preposicao correta e **"at"**. O instrutor usou esse erro como oportunidade pedagogica para ensinar como criar migrations que alteram nomes de colunas ja existentes no banco de dados (cenario real de correcao em producao).

## Por que AccessTokenId?

Essa e a "validacao mestra" mencionada pelo instrutor. Para cada JWT (Access Token) gerado, um ID unico e atribuido. Esse ID e armazenado junto com o Refresh Token. Isso cria uma camada extra de seguranca:

- Quando a API recebe um Refresh Token para renovacao, ela pode cruzar o AccessTokenId armazenado com o token apresentado
- Isso ajuda a prevenir cenarios de reutilizacao indevida de tokens
- Permite invalidar especificamente um par Access+Refresh Token

## Propriedade de navegacao

A propriedade `User User` nao e uma coluna no banco de dados. E uma propriedade de navegacao do Entity Framework que:

- Permite fazer join automatico com a tabela de User
- Requer uso de `.Include()` na query para ser populada
- O `= default!` suprime o warning de nullable sem alterar comportamento — o EF sempre preenche quando Include e usado
- Na criacao do Refresh Token, essa propriedade nao e utilizada; apenas na leitura

## Relacao Refresh Token ↔ User

Todo Refresh Token pertence a uma pessoa. O UserId armazena essa relacao. Quando a API recebe um Refresh Token:

1. Busca o Refresh Token no banco
2. Usa o UserId para recuperar o usuario correto
3. Gera um novo Access Token para aquele usuario especifico
4. Gera um novo Refresh Token (rotacao)

## Sobre expiracao

O instrutor menciona que explicara com mais detalhes adiante, mas ja adianta:
- Access Token expira (tempo curto)
- Refresh Token TAMBEM expira (tempo mais longo)
- A propriedade CreatedAt e a base para calcular se o Refresh Token ainda e valido
- A diferenca entre expiracao de Access Token e Refresh Token sera abordada na aula de regra de negocio