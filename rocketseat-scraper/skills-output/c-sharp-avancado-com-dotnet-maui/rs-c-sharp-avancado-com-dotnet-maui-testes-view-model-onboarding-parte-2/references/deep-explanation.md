# Deep Explanation: Verificacao de Navegacao em Testes de ViewModel

## O problema da conversao implicita de ShellNavigationState

O .NET MAUI possui uma conversao implicita (implicit operator) que transforma strings em `ShellNavigationState`. Quando voce escreve:

```csharp
await NavigationService.GoToAsync(RoutesPages.LoginPage);
```

O que o .NET faz internamente e:

```csharp
var state = new ShellNavigationState(RoutesPages.LoginPage);
await NavigationService.GoToAsync(state);
```

Isso funciona perfeitamente em runtime. O problema surge nos testes.

## Por que o Verify falha com string direta

Quando voce escreve no Verify:

```csharp
mockNavigationService.Verify(
    nav => nav.GoToAsync(RoutesPages.LoginPage), Times.Once);
```

O Moq tambem faz a conversao implicita, criando uma **segunda instancia** de `ShellNavigationState`. Agora existem dois objetos:

- **Instancia 1:** Criada pela ViewModel ao chamar `GoToAsync`
- **Instancia 2:** Criada pelo Verify ao avaliar a expressao

O C# compara objetos por **referencia** (endereco de memoria), nao por **valor**. Como sao duas instancias diferentes alocadas em enderecos diferentes, a comparacao retorna `false`, e o Verify reporta que a funcao "nunca foi chamada com esse parametro".

### Analogia do instrutor

E como se voce tivesse dois cartoes identicos com o mesmo texto escrito, mas o C# nao le o texto — ele olha se e o **mesmo cartao fisico**. Como sao cartoes diferentes (mesmo com texto identico), ele diz que nao sao iguais.

## A solucao: It.Is com comparacao por propriedade

A sintaxe `It.Is<T>(predicate)` permite que voce defina uma funcao de comparacao customizada. Ao inves de comparar a referencia do objeto, voce compara o **valor interno**:

```csharp
It.Is<ShellNavigationState>(state =>
    state.Location.OriginalString == RoutesPages.LoginPage)
```

Aqui voce esta dizendo ao Moq: "aceite qualquer `ShellNavigationState` cuja propriedade `Location.OriginalString` seja igual a essa string". Agora a comparacao e por valor de string, que funciona corretamente.

## Validacao de testes: forcar erros propositais

O instrutor enfatiza a importancia de validar que o teste realmente funciona, nao apenas que ele passa. Duas tecnicas demonstradas:

### 1. Trocar a rota na ViewModel
Mude temporariamente `RoutesPages.LoginPage` para `"//ErrorPage"` na ViewModel. O teste deve falhar com mensagem: "Expected once, but was called 0 times with LoginPage parameter."

### 2. Duplicar a chamada de navegacao
Adicione uma segunda chamada `GoToAsync` na ViewModel. O teste deve falhar com: "Expected once, but was called 2 times."

Essas validacoes confirmam que o teste detecta tanto rotas erradas quanto chamadas duplicadas.

## Padrao repetivel para multiplos comandos

Cada comando de navegacao na ViewModel segue o mesmo padrao de teste:

1. Criar instancia da ViewModel com mock
2. Executar o comando com `ExecuteAsync(null)`
3. Verificar navegacao com `It.Is<ShellNavigationState>`

O instrutor demonstra isso copiando o primeiro teste e adaptando para `HazardUserAccountsCommand`, mostrando que o padrao e mecanico e previsivel.