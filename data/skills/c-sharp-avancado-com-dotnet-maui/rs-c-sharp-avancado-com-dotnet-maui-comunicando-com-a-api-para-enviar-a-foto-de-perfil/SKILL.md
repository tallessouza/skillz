---
name: rs-csharp-maui-enviar-foto-api-refit
description: "Applies Refit Multipart file upload pattern when building .NET MAUI API communication for sending files like profile photos. Use when user asks to 'upload file with Refit', 'send image to API', 'multipart form data in MAUI', 'send profile photo', or 'StreamPart Refit'. Covers Multipart attribute, StreamPart creation from FileResult, parameter name matching with API. Make sure to use this skill whenever implementing file upload in .NET MAUI with Refit. Not for JSON-only API calls, downloading files, or image display/rendering."
---

# Envio de Arquivos via Refit com Multipart

> Ao enviar arquivos (fotos, documentos) de um app .NET MAUI para uma API, use o formato Multipart com StreamPart do Refit, porque JSON nao suporta envio de arquivos binarios.

## Rules

1. **Sempre adicione o atributo `[Multipart]`** na interface Refit acima do metodo que envia arquivo, porque sem ele o Refit nao sabe que precisa usar form-data ao inves de JSON
2. **Use `StreamPart` como tipo do parametro** do arquivo na interface Refit, porque e a abstracao do Refit para envio de arquivos via stream
3. **O nome do parametro na interface Refit DEVE ser identico ao nome do parametro no controller da API** — se diferir, use `[AliasAs("nomeNaApi")]`, porque Multipart/form-data depende dos nomes dos campos do formulario
4. **Leia o arquivo como stream com `OpenReadAsync()`** a partir do `FileResult`, porque stream le o arquivo pouco a pouco sem carregar tudo na memoria
5. **Extraia nome e content type do proprio `FileResult`** — nunca fixe valores como `"image/jpg"`, porque o FileResult ja contem `FileName` e `ContentType` corretos
6. **Registre o UseCase e sua interface no container de DI** no `MauiProgram.cs`, porque esquecer causa erros de injecao de dependencia em runtime

## How to write

### Interface Refit com Multipart

```csharp
public interface IUserApi
{
    [Multipart]
    [Put("/users/change-photo")]
    Task<IApiResponse> ChangeProfilePhoto(StreamPart file);
}
```

### UseCase — criando StreamPart a partir de FileResult

```csharp
public async Task<Result> Execute(FileResult file)
{
    var photo = await file.OpenReadAsync();

    var request = new StreamPart(photo, file.FileName, file.ContentType);

    var response = await _userApi.ChangeProfilePhoto(request);

    if (response.IsSuccessStatusCode)
        return Result.Success();

    return Result.Failure(response.Error.GetErrorMessages());
}
```

### ViewModel — chamando o UseCase

```csharp
private async Task UpdateProfile(FileResult? file)
{
    if (file is null)
        return;

    StatusPage = StatusPage.Sending;

    var result = await _changeUserPhotoUseCase.Execute(file);

    if (result.IsSuccess)
        ShowSuccessFeedback("Sua foto de perfil foi atualizada com sucesso.");
    else
        ShowErrors(result.Errors);

    StatusPage = StatusPage.Default;
}
```

## Example

**Before (erro comum — sem Multipart, nome diferente):**
```csharp
// Falta [Multipart] — vai tentar enviar como JSON e falhar
[Put("/users/change-photo")]
Task<IApiResponse> ChangeProfilePhoto(StreamPart photo); // nome "photo" != "file" na API
```

**After (correto):**
```csharp
[Multipart]
[Put("/users/change-photo")]
Task<IApiResponse> ChangeProfilePhoto(StreamPart file); // nome "file" == parametro na API
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Nome do parametro diferente da API | Use `[AliasAs("nomeNaApi")]` no parametro |
| Enviar qualquer arquivo binario (foto, PDF) | Use `[Multipart]` + `StreamPart`, nunca JSON |
| FileResult pode ser nulo (usuario cancelou) | Verifique `if (file is null) return;` antes de processar |
| Chamada async na ViewModel | Troque `void` por `async Task` e use `await` |

## Anti-patterns

| Nunca escreva | Escreva instead |
|---------------|-----------------|
| `Task<IApiResponse> Upload(StreamPart file)` sem `[Multipart]` | `[Multipart]` acima do metodo |
| `new StreamPart(stream, "foto.jpg", "image/jpeg")` hardcoded | `new StreamPart(stream, file.FileName, file.ContentType)` |
| `async void UpdateProfile(...)` | `async Task UpdateProfile(...)` |
| Parametro `StreamPart photo` quando API espera `file` | `StreamPart file` ou `[AliasAs("file")] StreamPart photo` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
