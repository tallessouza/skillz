# Code Examples: Validacao Segura de Arquivos em APIs .NET

## 1. Estrutura do Controller (endpoint de upload)

```csharp
// UsersController.cs
[HttpPut("change-photo")]
public async Task<IActionResult> ChangePhoto(IFormFile file)
{
    await _useCase.Execute(file);
    return NoContent();
}
```

O controller apenas recebe o arquivo e delega ao UseCase. Nenhuma validacao acontece no controller.

## 2. Interface do UseCase

```csharp
// IChangeUserPhotoUseCase.cs
// Localizado em: Application/UseCases/User/Photo/
public interface IChangeUserPhotoUseCase
{
    Task Execute(IFormFile file);
}
```

## 3. Implementacao completa do UseCase

```csharp
// ChangeUserPhotoUseCase.cs
// Localizado em: Application/UseCases/User/Photo/
using FileTypeChecker.Extensions;
using FileTypeChecker.Types;

public class ChangeUserPhotoUseCase : IChangeUserPhotoUseCase
{
    public async Task Execute(IFormFile file)
    {
        // Abre o stream para leitura do conteudo real do arquivo
        var photoStream = file.OpenReadStream();

        // Verifica magic bytes — nao confia na extensao
        var isImage = photoStream.Is<JointPhotographicExpertsGroup>()
            || photoStream.Is<PortableNetworkGraphic>();

        if (isImage.IsFalse())
        {
            throw new ErrorOnValidationException(
                new List<string>
                {
                    ResourceMessagesException.ONLY_IMAGES_ACCEPTED
                }
            );
        }

        // Continuar com salvamento da foto...
    }
}
```

## 4. Registro na injecao de dependencia

```csharp
// DependencyInjectionExtension.cs
public static class DependencyInjectionExtension
{
    public static void AddUseCases(this IServiceCollection services)
    {
        // ... outros use cases de User
        services.AddScoped<IChangeUserPhotoUseCase, ChangeUserPhotoUseCase>();
    }
}
```

## 5. Mensagem de erro como resource

```csharp
// ResourceMessagesException.resx (ou classe estatica)
public static string ONLY_IMAGES_ACCEPTED = "Somente imagens PNG, JPG ou JPEG sao aceitas";
```

## 6. Explorando o IFormFile

O `IFormFile` e uma interface do .NET que abstrai o arquivo recebido:

```csharp
public interface IFormFile
{
    string ContentType { get; }      // MIME type (baseado na extensao — NAO CONFIAVEL)
    long Length { get; }             // Tamanho em bytes
    string Name { get; }            // Nome do parametro no form
    string FileName { get; }        // Nome original do arquivo
    Stream OpenReadStream();        // Acesso ao conteudo real
    void CopyTo(Stream target);
    Task CopyToAsync(Stream target);
}
```

### Propriedades em diferentes cenarios:

**Arquivo real (foto.jpg):**
```
ContentType: "image/jpeg"
Length: 245832
FileName: "foto.jpg"
```

**Arquivo texto (teste.txt):**
```
ContentType: "text/plain"
Length: 5
FileName: "teste.txt"
```

**Arquivo texto disfarçado (teste.txt renomeado para teste.jpg):**
```
ContentType: "image/jpeg"  ← ENGANADO!
Length: 5
FileName: "teste.jpg"     ← ENGANADO!
```

## 7. Variacao — aceitar mais tipos

```csharp
// Para aceitar tambem GIF e WebP:
var isImage = photoStream.Is<JointPhotographicExpertsGroup>()
    || photoStream.Is<PortableNetworkGraphic>()
    || photoStream.Is<GraphicsInterchangeFormat>()
    || photoStream.Is<WebP>();
```

## 8. Variacao — validar PDF

```csharp
var isPdf = stream.Is<PortableDocumentFormat>();
if (!isPdf)
    throw new ErrorOnValidationException(
        new List<string> { "Somente arquivos PDF sao aceitos" }
    );
```

## 9. Instalacao do pacote

```bash
# Via Package Manager Console (Visual Studio)
Install-Package File.TypeChecker -Version 4.2.0

# Via .NET CLI
dotnet add package File.TypeChecker --version 4.2.0

# Via NuGet UI: botao direito no projeto > Manage NuGet Packages > Browse > "File.TypeChecker"
```