# Deep Explanation: Customizando Mapeamento com Mapster

## Por que substituir AutoMapper por Mapster?

O instrutor posiciona o Mapster como uma alternativa mais simples ao AutoMapper. A diferenca fundamental: AutoMapper exige que voce registre TODOS os mapeamentos (mesmo os triviais), enquanto Mapster so precisa de configuracao quando ha algo especial (ignorar campo, transformar valor, converter tipo).

## Anatomia do TypeAdapterConfig

O padrao `TypeAdapterConfig<Source, Destination>.NewConfig()` e a peca central. O `.NewConfig()` vem IMEDIATAMENTE apos o fechamento dos generics (`>`). O instrutor enfatiza isso: "Nao e uma funcao separada. E logo apos voce colocar o sinal de maior."

Isso significa que esta errado:
```csharp
var config = TypeAdapterConfig<A, B>;
config.NewConfig(); // ERRADO
```

O correto e sempre encadeado:
```csharp
TypeAdapterConfig<A, B>.NewConfig() // CORRETO
```

## Ignore vs Map — quando usar cada um

### Ignore
Usado quando o destino tem uma propriedade que NAO deve ser preenchida pelo mapeamento. Caso classico: senha. A request traz a senha em texto puro, mas o mapeamento nao deve copiar ela diretamente — o use case vai criptografar e preencher depois.

### Map com transformacao
Usado quando a propriedade existe nos dois lados mas precisa de transformacao. Caso classico: `DateTime.Date` para zerar o horario, padronizando para meia-noite.

### Map para conversao de tipo
Usado quando os tipos sao completamente diferentes. Caso classico: lista de GUIDs na request vira lista de entidades Assignee. O Mapster precisa saber como converter um GUID individual em uma entidade Assignee (preenchendo `UserId`).

## A decisao Adapt() vs IMapper

O instrutor explicitamente prefere `.Adapt<T>()` (metodo de extensao) ao inves de injetar `IMapper` via DI. Razoes:
- Economiza uma instancia de objeto
- Economiza um parametro no construtor
- Sintaxe mais direta: `request.Adapt<User>()` vs `_mapper.Map<User>(request)`

Se voce usa `.Adapt()`, o pacote `Mapster.DependencyInjection` e desnecessario e deve ser removido.

## Organizacao de classes de mapeamento

O instrutor menciona uma pratica que viu em um projeto real: separar configuracoes em duas classes — uma para Request-to-Domain, outra para Domain-to-Response. Ele considera "bem interessante" mas desnecessario para projetos pequenos. A pasta foi renomeada de `AutoMapper/` para `Mappings/` justamente para ser mais generica e acomodar qualquer biblioteca.

## Sync Namespaces no Visual Studio

Ao renomear pastas, o namespace do C# nao atualiza automaticamente (namespace reflete o caminho da pasta). O Visual Studio tem a opcao "Sync Namespaces" (botao direito no projeto) que atualiza todos os namespaces para refletir a estrutura atual de pastas.

## Distinct para evitar IDs duplicados

Ao mapear lista de Assignees, o instrutor aplica `.Distinct()` no source para garantir que nao haja IDs duplicados. Isso e feito no proprio mapeamento, nao no use case, porque e uma preocupacao de dados — "eu quero garantir que nao vai ter IDs duplicados aqui".