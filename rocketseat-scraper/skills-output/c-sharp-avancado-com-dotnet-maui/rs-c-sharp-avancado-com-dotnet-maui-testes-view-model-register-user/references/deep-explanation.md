# Deep Explanation: Testes de Unidade para ViewModel de Registrar User

## Por que o Builder recebe Result como parametro

O instrutor explica uma decisao arquitetural importante: o model (`UserHasherAccount`) que o use case recebe **nao esta associado diretamente com o resultado**. Ou seja, o Result (sucesso/falha) e independente dos dados de input.

Isso significa que:
- O builder nao precisa saber qual model sera passado → usa `It.IsAny<T>()`
- O builder **precisa** saber qual resultado devolver → recebe `Result` como parametro
- Quem decide o resultado e o **teste**, nao o builder

A logica e: "Se ele utiliza um resultado de sucesso, os asserts vao ser em funcao de navegar para a pagina de dashboard. Se for de erro, os asserts vao ser em funcao de navegar para a pagina de erro."

## Estrutura de pastas dos builders espelha a implementacao real

O instrutor enfatiza que a estrutura de pastas do builder (`Tests/Common/TestUtilities/UseCases/User/Hasher/`) segue exatamente a estrutura da implementacao real (`UseCases/User/Hasher/`). Isso facilita encontrar o builder correspondente a qualquer use case.

## StatusPage — por que verificar

O instrutor destaca um cenario de bug real: se o desenvolvedor esquece de resetar o StatusPage para `Default` apos a execucao (sucesso ou erro), a UI fica travada mostrando um indicador de loading ("aviãozinho") indefinidamente. Por isso, **todo teste de comando que altera StatusPage deve verificar que ele volta a Default**.

## Tres cenarios de teste para a ViewModel

1. **GoToLogin** — navegacao simples, sem use case, verifica apenas a rota
2. **Register com sucesso** — use case retorna `Result.Success()`, verifica navegacao para dashboard + StatusPage
3. **Register com erro** — use case retorna `Result.Failure(messages)`, verifica navegacao para pagina de erro com dicionario de parametros + StatusPage

O terceiro cenario (erro) e mais complexo porque a navegacao usa `GoToAsync` com uma rota E um dicionario de parametros contendo as mensagens de erro. Esse cenario sera coberto na aula seguinte.

## It.IsAny vs instancia especifica

Quando o mock recebe `It.IsAny<UserHasherAccount>()`, ele aceita **qualquer** instancia daquele tipo. O instrutor diz "a gente esta falando para o mock que ele precisa fazer uma vista grossa para a instancia que vai ser passada". Isso e preferivel quando o teste nao esta validando os dados de input, mas sim o comportamento apos o resultado.

## Result Pattern

A ViewModel trabalha com Result Pattern — o use case devolve `Result` que pode ser sucesso ou falha com mensagens. Isso permite que a ViewModel decida o fluxo:
- Sucesso → navega para dashboard
- Falha → navega para pagina de erro com lista de mensagens