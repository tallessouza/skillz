# Deep Explanation: Return Pattern em C# / .NET MAUI

## Por que não usar exceções em apps mobile?

O instrutor (Ellison) faz uma distinção clara entre API e app mobile:

**Na API:**
- Ele prefere lançar exceções porque o .NET oferece uma estrutura organizada para tratamento (middleware, filtros)
- Ele controla o servidor — se precisar, aumenta memória/processamento
- Exceções permitem lógicas extras como notificar alguém sobre o erro

**No app mobile (.NET MAUI):**
- Se uma exceção não é tratada, o app **crasha e fecha**
- Não existe uma estrutura tão bem definida para tratamento de exceções como na API
- Tratar exceções no app envolve linhas extras de código sem a elegância do middleware
- Lançar exceções tem **custo computacional** — e você não controla o dispositivo do usuário
- O objetivo é criar um app leve que funcione na maioria dos dispositivos, com muita ou pouca memória

## O que é o Return Pattern?

Nas palavras do instrutor: "O Return Pattern nada mais é que um design de código que vai definir como as nossas funções devolvem, retornam resultado. De uma forma padronizada, clara e previsível."

## Por que a ViewModel precisa do resultado?

O cenário antes do Return Pattern: os use cases executavam e não devolviam nada. A ViewModel ficava "no escuro" — não sabia se deu certo ou errado.

Com o Result:
- **Sucesso** → ViewModel pode redirecionar para uma página específica
- **Falha** → ViewModel pode redirecionar para uma página de erro listando as mensagens

## Design decisions explicadas pelo instrutor

### Private set no IsSuccess
O `get` é público para que qualquer classe com a instância de Result possa verificar se deu sucesso. O `set` é privado para que somente a própria classe Result possa alterar — garantindo que ninguém de fora manipule o resultado.

### ErrorMessages nulável (?)
O ponto de interrogação indica que pode ser `null`. A lógica: se deu sucesso, para que ter uma lista vazia de mensagens de erro? Não faz sentido acessar essa propriedade em caso de sucesso.

### Métodos estáticos de fábrica
O método `Success()` é estático, então não precisa criar uma instância de Result para chamá-lo. Mas internamente, ele **devolve** uma instância de Result com IsSuccess = true. Isso torna o código do use case declarativo: `return Result.Success()` é autoexplicativo.

### Target-typed new (`new()` sem tipo)
O Visual Studio sugere simplificar `new Result { ... }` para `new() { ... }` quando o compilador já sabe que o retorno é do tipo Result. O instrutor aceita essa simplificação.

### IList vs List
O instrutor inicialmente usou `List<string>` mas mudou para `IList<string>` (interface) quando recebeu erro ao tentar usar uma lista vinda de uma interface que retornava `IList`. Usar a interface é mais flexível.

### Eliminação do else
Se dentro do `if` tem um `return`, as linhas seguintes só executam quando o `if` é falso. Logo, o `else` é redundante e pode ser removido para reduzir indentação.

## Incompletude intencional

O instrutor deixa claro que esta implementação está "50% completa". Falta o caso genérico `Result<T>` onde o sucesso precisa carregar um valor (ex: dados retornados pela API que a ViewModel precisa). Isso será implementado em aulas futuras. Para Login e Registro, a ViewModel só precisa saber sucesso/falha, sem dados adicionais.