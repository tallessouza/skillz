# Deep Explanation: Repositório para Conexão entre Pessoas

## Por que renomear tudo?

O instrutor (Wellerson) enfatiza que os nomes originais (`PersonAssociation`, `GetPersonAssociationsForUser`) eram confusos e "horríveis". A lição principal: nomes ruins no início do projeto se propagam por todo o codebase. O momento de corrigir é agora, não depois.

O Visual Studio facilita com:
- **Renomear arquivo** → pergunta se quer renomear classe e referências automaticamente
- **Sync Namespaces** → botão direito no projeto, corrige todos os namespaces quando pastas são renomeadas

## A lógica bidirecional explicada

A entidade `UserConnection` tem dois lados:
- `User` (+ `UserId`) → pessoa que **gerou** o código de conexão
- `ConnectedUser` (+ `ConnectedUserId`) → pessoa que **usou** o código para se conectar

Exemplo do instrutor:
- Ellison gera código → Edeline usa → `UserId = Ellison`, `ConnectedUserId = Edeline`
- William gera código → Ellison usa → `UserId = William`, `ConnectedUserId = Ellison`

Quando Ellison busca suas conexões, seu ID pode estar em **qualquer** coluna. Por isso o WHERE usa OR.

## Por que o ForEach e não um Select?

O forEach com if/else é necessário porque:
1. A query retorna entidades `UserConnection`, não `User`
2. Cada `UserConnection` tem dois `User` — precisamos escolher o que **não** é o solicitante
3. Se `UserId == meuId` → eu gerei o código → retorno `ConnectedUser` (a outra pessoa)
4. Se `UserId != meuId` → eu usei o código de alguém → retorno `User` (quem gerou)

Isso garante que a lista final contém apenas as **outras** pessoas, nunca o próprio usuário.

## AsNoTracking — por que usar?

O Entity Framework por padrão "trackeia" todas as entidades carregadas, monitorando mudanças para eventual `SaveChanges()`. Quando a consulta é puramente de leitura (como listar conexões para o dashboard), `AsNoTracking()` elimina esse overhead de tracking, melhorando performance.

## Include — o que acontece sem ele?

Sem `.Include(c => c.User)`, o EF não faz o JOIN com a tabela de usuários. As propriedades `User` e `ConnectedUser` ficam `null`. O Include força o EF a carregar (eager loading) essas navigation properties.

## Registrar no DI — por que é urgente?

O instrutor destaca por "experiência própria": é muito comum criar interfaces e implementações, continuar codando, e depois perder tempo debugando um erro de runtime porque esqueceu de registrar no container de DI. A regra é: criou interface → registra no DI imediatamente, antes de qualquer outra coisa.

## Onde isso será usado?

No endpoint de dashboard do aplicativo. Quando o usuário abre o dashboard, a aplicação chama `IUserConnectionReadOnlyRepository.GetConnectionsForUser()` para listar todas as pessoas conectadas (como mostrado no Figma: Bruce Wayne, Edeline, William, etc.).