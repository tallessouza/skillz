# Deep Explanation: Adicionando Produto no Banco

## Por que usar .d.ts e não .ts para tipos de tabela?

Quando você cria um arquivo `.d.ts` (declaration file) e utiliza apenas tipos primitivos (`string`, `number`, `boolean`), o TypeScript trata essas tipagens como **globalmente disponíveis**. Isso significa que você não precisa de `import` ou `export` — o tipo simplesmente existe em qualquer arquivo do projeto.

Isso é especialmente útil para tipos de tabela/repository porque:
1. São usados em múltiplos arquivos (controllers, services, repositories)
2. Representam contratos estáveis (a estrutura da tabela muda raramente)
3. Eliminam imports repetitivos que poluem o topo dos arquivos

**Limitação importante:** Se o tipo precisar importar outro módulo (ex: um enum de outro arquivo), o arquivo deixa de ser um declaration file puro e os tipos não ficam mais globais. Nesse caso, use `.ts` com `export`.

## Convenção de nomenclatura: Por que `ProductRepository`?

O instrutor escolhe `Repository` (e não `Table`, `Model` ou `Entity`) porque:
- **Repository** é um termo do Domain-Driven Design que representa o contrato de acesso a dados
- Manter no **singular** permite representar tanto um registro quanto a coleção
- O sufixo `Repository` diferencia claramente de tipos de domínio (`Product` vs `ProductRepository`)

O instrutor mencionou que poderia ser `ProductTable` também, mas optou por `Repository` como convenção do projeto.

## Fluxo: Validate → Insert → Response

O padrão ensinado segue uma ordem clara:
1. **Importar** o knex centralizado (`@/database/knect`)
2. **Validar** os dados recebidos (já feito em aula anterior)
3. **Inserir** usando `await knect<Type>("table").insert({...})`
4. **Retornar** status 201 sem corpo

O `await` é essencial porque o insert é assíncrono — sem ele, a resposta seria enviada antes da inserção completar.

## Por que 201 e não 200?

O HTTP define status codes semânticos:
- **200 OK** — operação genérica bem-sucedida
- **201 Created** — recurso foi criado com sucesso

Usar 201 comunica ao cliente (e a outros desenvolvedores) que a operação criou algo novo. O `.json()` sem argumento retorna um corpo vazio, que é adequado quando o cliente não precisa do registro criado de volta.

## Verificação no banco

O instrutor demonstrou a verificação executando `SELECT * FROM products` diretamente no banco de dados, confirmando que o registro foi inserido corretamente. Isso é uma boa prática durante desenvolvimento — nunca confie apenas no status code, verifique o dado real.

## O poder do autocomplete com Generic

Ao passar `<ProductRepository>` como Generic no `knect("products")`, o TypeScript:
- Oferece **autocomplete** dos campos válidos ao digitar dentro do `insert({})`
- **Marca erro** se você tentar inserir um campo que não existe no tipo
- **Valida o tipo** do valor (ex: `name` precisa ser string, `price` precisa ser number)

O instrutor demonstrou isso pressionando espaço dentro do objeto de insert e vendo os campos disponíveis, e depois tentando passar um campo inexistente que gerou erro imediatamente.