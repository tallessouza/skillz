# Deep Explanation: Repositório para Refresh Token

## Por que ExecuteDeleteAsync em vez de Select + Delete?

O instrutor (Wellison) explica que o padrão comum de buscar uma entidade para depois deletá-la gera **duas queries** no banco de dados:

1. Um SELECT para trazer a entidade para a memória do servidor
2. Um DELETE para remover a entidade

Isso desperdiça:
- **Memória do servidor** — a entidade é carregada na RAM sem necessidade
- **Tempo de execução** — duas roundtrips ao banco quando uma bastaria

Com `ExecuteDeleteAsync`, o EF gera uma única query DELETE com WHERE diretamente, sem trazer nada para memória.

### Bônus: proteção contra bugs

O padrão `FirstOrDefaultAsync` + `Remove` só deleta UM registro. Se por algum bug existirem dois refresh tokens para a mesma pessoa, o `FirstOrDefault` retorna apenas o primeiro — a pessoa sempre ficará com tokens duplicados. O `Where(...).ExecuteDeleteAsync()` deleta TODOS os que satisfazem a condição, garantindo integridade.

### Se não existir nenhum registro?

`ExecuteDeleteAsync` simplesmente não faz nada — sem exceções, sem problemas. O DELETE é executado no banco e afeta zero linhas.

## Interfaces Read-Only vs Write-Only

A separação segue o Interface Segregation Principle. A interface read-only é consumida por regras de negócio que precisam consultar o refresh token (verificar validade, identificar o usuário). A write-only é usada no fluxo de geração de novo token.

## Sobre o `public` em interfaces

Em versões anteriores do .NET, colocar `public` na assinatura de um método em uma interface gerava erro de compilação, pois todo método de interface já é público por definição. Em versões mais recentes, o compilador simplesmente ignora o modificador. É indiferente colocá-lo ou não.

## DBSet como "ponte" para tabelas

O instrutor usa a analogia de "ponte": cada propriedade `DbSet<T>` no DbContext é uma ponte entre o código C# e uma tabela no banco de dados. O nome da propriedade deve corresponder ao nome da tabela — é assim que o EF faz o mapeamento automático.

## Regra de negócio: um token por pessoa

No projeto do curso, a regra é que cada pessoa pode ter apenas UM refresh token ativo. Ao gerar um novo, os anteriores são deletados. O instrutor faz questão de explicar que isso é uma decisão de negócio específica deste projeto.

Em outros cenários (como o WhatsApp), um usuário pode ter múltiplos dispositivos conectados, cada um com seu próprio refresh token. Nesse caso, a entidade RefreshToken teria propriedades adicionais sobre o dispositivo (sistema operacional, modelo, versão do navegador).

## Por que não simplesmente atualizar o token existente?

O instrutor discute essa alternativa: em vez de deletar e criar novo, poderia-se atualizar o token existente. Porém, seria necessário alterar TRÊS propriedades:
1. **Token** — o valor do refresh token muda
2. **AccessTokenId** — o JWT muda, logo seu ID muda
3. **CreatedAt** — a data de criação é usada para validar expiração

O instrutor considera que deletar e inserir é mais simples e transparente do que buscar, validar e atualizar três propriedades.

## AsNoTracking no read-only

Quando o EF trackeia uma entidade, ele mantém uma cópia em memória para detectar mudanças. Se a entidade não será editada (caso do read-only), esse tracking é desperdício. `AsNoTracking()` informa ao EF que pode ignorar o change tracking.

## Include para navigation properties

O EF é "lazy" por padrão com navigation properties. O `.Include(rt => rt.User)` força um JOIN com a tabela de users, preenchendo a propriedade de navegação `User` na entidade `RefreshToken`. Sem o Include, `refreshToken.User` seria null.