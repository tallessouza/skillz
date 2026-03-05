# Deep Explanation: Integrando App MAUI com API para Alterar Senha

## Distinção crítica: Alterar Senha vs Esqueci a Senha

O instrutor faz questão de separar esses dois fluxos porque são completamente diferentes:

- **Alterar senha**: usuário JÁ está logado, tem acesso à conta, fornece senha atual + nova senha. O token de autenticação já está sendo enviado via handler.
- **Esqueci a senha**: usuário NÃO está logado, precisa de outro fluxo (verificação por email, código, etc.), endpoints diferentes, ações diferentes na API.

Misturar esses conceitos é um erro comum de iniciantes que leva a implementações confusas e inseguras.

## Por que rotas HTTP não podem ser duplicadas

O instrutor explica com clareza: você pode ter `POST /users` e `GET /users` porque são métodos HTTP diferentes. Mas dois `PUT /users` no mesmo controller é proibido — o framework não sabe qual endpoint executar.

A solução é a sintaxe de rota específica:
```csharp
[HttpPut("change-password")]
```

Isso faz a rota final ser `/users/change-password`. A sintaxe funciona para qualquer método HTTP (GET, POST, PUT, DELETE) — basta abrir e fechar parênteses e dar um nome.

## O pipeline completo no MAUI com Refit

O fluxo sempre segue esta sequência:

1. **Interface Refit (`IUserApi`)** — Define a assinatura da chamada HTTP. O Refit implementa automaticamente.
2. **Use Case** — Contém a lógica de negócio. Recebe o model da ViewModel, transforma em request JSON, chama a API, interpreta a resposta.
3. **Registro no DI (`MauiProgram`)** — Sem isso, a ViewModel não consegue receber o use case por injeção de dependência.
4. **ViewModel** — Recebe o use case via construtor, expõe um `RelayCommand` que a View pode bindar.
5. **View (XAML)** — Botão com `Command="{Binding NomeDoCommand}"`.

## O bug do ObservableProperty nulo

O instrutor conta que o próprio Visual Studio sugeriu a correção — o model decorado com `[ObservableProperty]` não é inicializado automaticamente. Se a View tenta fazer binding com um model nulo, ocorre crash.

Detalhe importante: o source generator do Community Toolkit cria uma propriedade pública com a primeira letra maiúscula. Se você declarou `changePasswordModel` como campo, a propriedade gerada é `ChangePasswordModel`. Use sempre a versão com maiúscula no código e no XAML.

## O erro de navegação que o instrutor cometeu ao vivo

O instrutor implementou `await NavigationService.GoToAsync("..")` como última linha da função, fora do `if (sucesso)`. Ele percebeu depois e avisou: a navegação deve ocorrer SOMENTE se a alteração foi bem-sucedida. Se houve erro, o usuário deve permanecer na página para corrigir.

Esse é um padrão recorrente: ações de UI (navegação, toast, dialog) devem estar condicionadas ao resultado da operação.

## IApiResponse sem tipo genérico

Quando a API retorna 204 No Content (sucesso sem body), o Refit usa `IApiResponse` (sem `<T>`). Isso indica que não há dados para deserializar — apenas confirmação de sucesso. Erros ainda são acessíveis via `response.Error`.

## Estratégia de teste do instrutor

O instrutor testa de ponta a ponta:
1. Coloca breakpoint no endpoint da API
2. Verifica se a request chega com os dados corretos
3. Acompanha a execução do use case da API (busca usuário, valida, altera, commit)
4. Volta para o app e verifica o resultado
5. Deleta o app (simula logout) e tenta login com senha antiga (deve falhar) e nova (deve funcionar)

Essa abordagem prova que o fluxo inteiro funciona, não apenas a chamada HTTP.