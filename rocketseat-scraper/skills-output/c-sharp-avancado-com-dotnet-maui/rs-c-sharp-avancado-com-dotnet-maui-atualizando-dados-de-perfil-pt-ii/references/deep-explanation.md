# Deep Explanation: Atualizando Dados de Perfil no .NET MAUI

## Por que atualizar o UserStorage e critico

O instrutor usa o exemplo do Dashboard para ilustrar: quando o usuario navega de volta ao Dashboard, o nome exibido ("Bem-vindo, Bruce Wayne") vem do UserStorage local, nao de uma chamada a API. Se o usuario trocou o nome para "Ellison Arley" na tela de perfil mas o storage nao foi atualizado, o Dashboard continua mostrando "Bruce Wayne".

O construtor da DashboardViewModel e executado apenas uma vez (por ser a pagina principal). Entao o nome so seria atualizado se o usuario fechasse e reabrisse o aplicativo. Isso sera corrigido futuramente com `OnAppearing` no Dashboard, mas o storage deve ser atualizado imediatamente de qualquer forma.

## Records em C# — Imutabilidade e a sintaxe `with`

Records em C# tem valores imutaveis apos inicializacao. Voce nao pode fazer `record.Property = value`. A solucao e a sintaxe `with`:

```csharp
var novoRecord = recordOriginal with { Propriedade = novoValor };
```

Isso cria uma **nova instancia** copiando todos os valores do original, exceto os que voce especifica. No caso do perfil:

- `_userStorage.Get()` retorna um record com `Id` e `Name`
- `with { Name = model.Name }` cria novo record com mesmo `Id` mas `Name` atualizado
- O `Id` e preservado automaticamente — nao precisa especificar

## Por que a API nao retorna body no UpdateProfile

O endpoint de update profile foi configurado com Refit para nao esperar resposta (usa `IApiResponse` sem tipo generico). Isso significa que `response.Content` nao existe. Por isso usamos os dados do `model` (que veio da UI) e o `Id` do storage local para reconstruir o record.

## O if vazio no sucesso — decisao deliberada

O instrutor deixou o bloco `if (result.IsSuccess)` vazio propositalmente. A razao: nas proximas aulas sera implementado um sistema de alertas do .NET MAUI para dar feedback visual bonito ao usuario. Nao e aceitavel em producao — o usuario precisa saber se a operacao deu certo ou nao. Mas como feature pedagogica, ilustra que o ponto de extensao esta preparado.

## Padrao de copia entre Use Cases

O instrutor demonstra uma tecnica pratica: copiar o Use Case de registro (`RegisterUserUseCase`) e adaptar linha a linha para o update. A estrutura e quase identica:
1. Criar request
2. Chamar API
3. Verificar sucesso
4. Processar resposta (storage)
5. Tratar erros

A diferenca principal: registro salva token + user, update so salva user (sem token).

## StatusPage.Sending vs StatusPage.Loading

- **Loading**: indica que dados estao sendo buscados (GET) — mostra spinner ou skeleton
- **Sending**: indica que dados estao sendo enviados (POST/PUT) — mostra animacao de aviãozinho

Essa distincao visual ajuda o usuario a entender o que esta acontecendo.

## UserStorage.Save — substituicao segura

O `Save` interno armazena valores um a um com keys separadas (`id_key` → `user.Id.ToString()`, `name_key` → `user.Name`). Se o valor nao mudou, ele simplesmente sobrescreve com o mesmo valor — sem excecao, sem verificacao. Isso simplifica a logica: sempre salve, independente de ter mudado ou nao.