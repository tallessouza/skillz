# Code Examples: Endpoint para Receber Arquivos no .NET

## Exemplo completo do controller (da aula)

```csharp
[ApiController]
[Route("[controller]")]
public class UsersController : ControllerBase
{
    // ... outros endpoints (PUT para perfil, PUT change-password, etc.)

    [HttpPut("change-photo")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status400BadRequest)]
    [AuthenticatedUser]
    public async Task<IActionResult> ChangeProfilePhoto(IFormFile file)
    {
        // TODO: implementar use case na proxima aula
        return NoContent();
    }
}
```

## Variacao: recebendo multiplos arquivos

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

O Swagger mostra botao "Add String Item" para adicionar mais arquivos (apesar do nome confuso, envia como arquivo, nao string).

## Testando via Swagger

1. Clicar em "Authorize" e colar token JWT: `Bearer {token}`
2. Expandir o endpoint PUT `/users/change-photo`
3. Clicar "Try It Out"
4. Usar "Choose File" para selecionar arquivo
5. Clicar "Execute"
6. Verificar resposta 204

## Inspecionando o IFormFile no debugger

```csharp
// Ao colocar breakpoint e passar mouse sobre 'file':
// file.ContentType = "image/jpeg"
// file.Length = 245760  (bytes)
// file.FileName = "1735_profile.jpg"
// file.Name = "file"  (nome do parametro)
```

## Padrao de rotas quando ha conflito de metodos HTTP

```csharp
// PUT padrao — atualizar perfil
[HttpPut]
public async Task<IActionResult> UpdateProfile(UpdateProfileRequest request) { ... }

// PUT nomeado — atualizar senha
[HttpPut("change-password")]
public async Task<IActionResult> ChangePassword(ChangePasswordRequest request) { ... }

// PUT nomeado — atualizar foto
[HttpPut("change-photo")]
public async Task<IActionResult> ChangeProfilePhoto(IFormFile file) { ... }

// DELETE nomeado — remover foto (endpoint separado)
[HttpDelete("photo")]
public async Task<IActionResult> DeleteProfilePhoto() { ... }
```