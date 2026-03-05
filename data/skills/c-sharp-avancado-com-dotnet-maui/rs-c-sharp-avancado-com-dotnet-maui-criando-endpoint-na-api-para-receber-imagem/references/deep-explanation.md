# Deep Explanation: Endpoint para Receber Arquivos no .NET

## Por que PUT e nao POST?

O instrutor explica uma decisao pragmatica: nao vale a pena criar logica condicional para verificar se o usuario ja tem foto (POST) ou esta atualizando (PUT). A operacao e sempre "definir a foto de perfil atual". Deletar foto seria um endpoint separado com DELETE.

Isso simplifica o controller e evita estados intermediarios. O cliente sempre chama PUT — o backend decide internamente se cria ou substitui o arquivo.

## O problema de rotas duplicadas

Quando um controller ja tem um `[HttpPut]` (ex: atualizar perfil), voce nao pode adicionar outro PUT sem rota. O ASP.NET Core nao sabe qual metodo invocar. A solucao e dar rota nomeada: `[HttpPut("change-photo")]`, assim como ja existia `[HttpPut("change-password")]`.

## IFormFile — o container universal de arquivos

A interface `IFormFile` do .NET abstrai qualquer arquivo enviado via multipart/form-data. O Swagger automaticamente reconhece e mostra o botao "Choose File" quando detecta `IFormFile` como parametro.

Propriedades disponiveis no IFormFile:
- `ContentType` — tipo MIME do arquivo (ex: `image/jpeg`)
- `Length` — tamanho em bytes
- `FileName` — nome original do arquivo
- `OpenReadStream()` — stream para ler o conteudo

### Armadilha: validar pelo nome do arquivo

O instrutor alerta explicitamente: **nao valide o tipo de arquivo pela extensao**. Um usuario pode renomear `malware.exe` para `foto.jpg`. A validacao correta (coberta na proxima aula) usa o content type e/ou magic bytes do arquivo.

## Single vs List

- `IFormFile file` — recebe exatamente 1 arquivo
- `List<IFormFile> files` — recebe N arquivos na mesma request

O instrutor mostra o caso de multiplos arquivos (ex: upload de documentos bancarios), mas enfatiza que para foto de perfil, arquivo unico e o correto.

## ProducesResponseType — documentando o contrato

Os atributos `[ProducesResponseType]` nao afetam a execucao, mas documentam o contrato da API:
- Swagger usa para gerar documentacao precisa
- Clientes sabem exatamente o que esperar
- 204 = sucesso sem body
- 400 = erro com `ResponseErrorJson` no body

## Autenticacao obrigatoria

O atributo `[AuthenticatedUser]` e customizado (implementado em aulas anteriores). Garante que o endpoint so e acessivel com token JWT valido. Sem ele, qualquer pessoa poderia fazer upload de arquivos sem identificacao.