---
name: rs-csharp-dotnet-maui-endpoint-receber-imagem
description: "Applies .NET file upload endpoint patterns when building ASP.NET Core APIs that receive files. Use when user asks to 'create upload endpoint', 'receive file in API', 'accept image upload', 'IFormFile endpoint', or 'file upload controller'. Covers IFormFile usage, PUT for profile photo, single vs multiple files, proper route naming, and response codes. Make sure to use this skill whenever creating .NET endpoints that handle file uploads. Not for file validation, image processing, or storage logic."
---

# Endpoint para Receber Arquivos no .NET

> Use IFormFile para receber arquivos em endpoints ASP.NET Core, com rotas nomeadas e status codes corretos.

## Rules

1. **Use PUT para atualizar foto de perfil** — nao use POST para criar e PUT para atualizar separadamente, porque a logica e sempre "atualizar a foto atual", independente de ser a primeira
2. **Nomeie a rota quando ja existe metodo do mesmo tipo** — `change-photo` diferencia do PUT padrao de update de perfil, porque o HTTP nao permite dois metodos identicos na mesma rota
3. **Retorne 204 NoContent em sucesso** — upload bem-sucedido nao precisa devolver body, porque o cliente ja tem o arquivo localmente
4. **Declare erros 400 BadRequest** — arquivos invalidos devem retornar 400 com erro estruturado, porque o cliente precisa saber o que corrigir
5. **Exija autenticacao** — endpoints de upload DEVEM requerer usuario autenticado, porque arquivos sao vinculados a um usuario especifico
6. **Use IFormFile para arquivo unico, List\<IFormFile\> para multiplos** — a interface IFormFile aceita qualquer tipo de arquivo (imagem, txt, zip), porque e um container generico de arquivo

## How to write

### Endpoint de upload de arquivo unico

```csharp
[HttpPut("change-photo")]
[ProducesResponseType(StatusCodes.Status204NoContent)]
[ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status400BadRequest)]
[AuthenticatedUser]
public async Task<IActionResult> ChangeProfilePhoto(IFormFile file)
{
    // Use case executa validacao e persistencia
    await _useCase.Execute(file);
    return NoContent();
}
```

### Endpoint para multiplos arquivos

```csharp
[HttpPost("upload-documents")]
[ProducesResponseType(StatusCodes.Status204NoContent)]
[ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status400BadRequest)]
[AuthenticatedUser]
public async Task<IActionResult> UploadDocuments(List<IFormFile> files)
{
    await _useCase.Execute(files);
    return NoContent();
}
```

## Example

**Before (erro comum — rota duplicada sem nome):**
```csharp
// ERRO: ja existe um [HttpPut] no controller
[HttpPut]
public async Task<IActionResult> ChangePhoto(IFormFile file)
{
    return Ok(new { message = "uploaded" });
}
```

**After (com esta skill aplicada):**
```csharp
[HttpPut("change-photo")]
[ProducesResponseType(StatusCodes.Status204NoContent)]
[ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status400BadRequest)]
[AuthenticatedUser]
public async Task<IActionResult> ChangeProfilePhoto(IFormFile file)
{
    await _useCase.Execute(file);
    return NoContent();
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Upload de foto de perfil (sempre 1 arquivo) | `IFormFile file` como parametro |
| Upload de documentos (multiplos arquivos) | `List<IFormFile> files` como parametro |
| Ja existe PUT no controller | Adicione rota nomeada: `[HttpPut("change-photo")]` |
| Endpoint modifica recurso do usuario | Adicione atributo de autenticacao |
| Sucesso sem body de retorno | Retorne `204 NoContent` |
| Arquivo recebido precisa de validacao | Delegue ao Use Case, nao valide no controller |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `return Ok("uploaded")` em upload | `return NoContent()` — 204 sem body |
| POST para primeira foto, PUT para atualizar | PUT sempre — e sempre uma atualizacao |
| Validar extensao no controller | Delegar validacao ao Use Case |
| Receber arquivo como `byte[]` ou `string base64` | Usar `IFormFile` — interface nativa do .NET |
| Dois `[HttpPut]` sem rota nomeada no mesmo controller | Nomear rota: `[HttpPut("change-photo")]` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
