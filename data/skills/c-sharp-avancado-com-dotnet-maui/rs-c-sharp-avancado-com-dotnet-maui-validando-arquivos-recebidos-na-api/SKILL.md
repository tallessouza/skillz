---
name: rs-csharp-validando-arquivos-api
description: "Enforces secure file upload validation in .NET APIs by checking magic bytes instead of trusting file extensions or Content-Type. Use when user asks to 'upload file', 'validate file', 'receive image', 'accept file upload', or 'secure file endpoint' in C#/.NET projects. Applies File.TypeChecker library for byte-level verification, IFormFile handling, and Stream-based file reading. Make sure to use this skill whenever implementing file upload endpoints in .NET. Not for client-side file validation, JavaScript/frontend uploads, or non-.NET projects."
---

# Validacao Segura de Arquivos em APIs .NET

> Nunca confie na extensao ou Content-Type de um arquivo — valide os magic bytes para garantir que o arquivo e o que diz ser.

## Rules

1. **Nunca confie no Content-Type do IFormFile** — essa propriedade e preenchida com base na extensao do arquivo, que pode ser alterada manualmente, porque um arquivo .txt renomeado para .jpg engana a API completamente
2. **Valide pelos magic bytes usando File.TypeChecker** — todo arquivo tem bytes iniciais (magic numbers) que identificam seu tipo real, porque essa e a unica forma confiavel de verificar o tipo
3. **Seja especifico nos tipos aceitos** — nao use `.IsImage()` generico, especifique exatamente quais tipos aceitar (ex: JPG e PNG), porque `.IsImage()` aceita bitmap, WebP e GIF que voce pode nao querer
4. **Use Stream para ler o arquivo** — `file.OpenReadStream()` retorna um Stream que le o arquivo aos poucos, porque carregar tudo na memoria de uma vez pode sobrecarregar o servidor
5. **Lance excecao de validacao quando o tipo for invalido** — retorne mensagem clara como "Somente imagens PNG, JPG ou JPEG sao aceitas", porque o cliente precisa saber o que corrigir

## How to write

### Validacao completa de upload

```csharp
public async Task Execute(IFormFile file)
{
    var photoStream = file.OpenReadStream();

    var isImage = photoStream.Is<JointPhotographicExpertsGroup>()
        || photoStream.Is<PortableNetworkGraphic>();

    if (isImage.IsFalse())
    {
        throw new ErrorOnValidationException(
            new List<string> { ResourceMessagesException.ONLY_IMAGES_ACCEPTED }
        );
    }

    // Continuar processamento...
}
```

### Setup do pacote NuGet

```bash
# Package Manager Console
Install-Package File.TypeChecker -Version 4.2.0

# ou .NET CLI
dotnet add package File.TypeChecker --version 4.2.0
```

## Example

**Before (vulneravel — confia no Content-Type):**
```csharp
public async Task Execute(IFormFile file)
{
    // PERIGO: Content-Type vem da extensao, que pode ser falsificada
    if (file.ContentType != "image/jpeg" && file.ContentType != "image/png")
        throw new Exception("Tipo invalido");
}
```

**After (seguro — valida magic bytes):**
```csharp
public async Task Execute(IFormFile file)
{
    var stream = file.OpenReadStream();

    var isImage = stream.Is<JointPhotographicExpertsGroup>()
        || stream.Is<PortableNetworkGraphic>();

    if (!isImage)
        throw new ErrorOnValidationException(
            new List<string> { "Somente imagens PNG, JPG ou JPEG sao aceitas" }
        );
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Upload de foto de perfil | Aceite apenas JPG e PNG via magic bytes |
| Upload de documentos | Use `stream.Is<PortableDocumentFormat>()` |
| Precisa aceitar varios tipos de imagem | Avalie se `.IsImage()` generico e aceitavel |
| Arquivo grande | Stream ja cuida — nao carrega tudo na memoria |
| Precisa do nome/tamanho do arquivo | Use `IFormFile.FileName` e `IFormFile.Length` (Length em bytes) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `if (file.ContentType == "image/jpeg")` | `stream.Is<JointPhotographicExpertsGroup>()` |
| `if (Path.GetExtension(file.FileName) == ".jpg")` | `stream.Is<JointPhotographicExpertsGroup>()` |
| `file.IsImage()` sem saber o que aceita | `stream.Is<JPG>() \|\| stream.Is<PNG>()` explicito |
| Ler arquivo inteiro em `byte[]` para validar | `file.OpenReadStream()` para ler como Stream |
| Validar so no frontend | Validar sempre no backend com magic bytes |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
