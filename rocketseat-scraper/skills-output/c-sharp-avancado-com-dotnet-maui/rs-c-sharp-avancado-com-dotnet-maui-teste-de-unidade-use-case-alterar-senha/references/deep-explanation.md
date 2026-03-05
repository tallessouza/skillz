# Deep Explanation: Testes de Unidade com Classes Internas e Implementacoes Reais

## Por que substituir mock por implementacao real?

O instrutor (Wellison) explica que a classe `BcryptNet` nao recebe nada do servico de injecao de dependencia. Ela simplesmente repassa parametros para a biblioteca Bcrypt (NuGet package). Quando uma classe e tao simples — sem dependencias externas, sem estado complexo — criar um mock adiciona complexidade sem beneficio. O mock precisa ser configurado para retornar `true` ou `false` em cenarios especificos, enquanto a implementacao real faz isso naturalmente.

A reflexao chave: **mock existe para isolar dependencias externas**, nao para substituir toda e qualquer classe. Se a classe nao tem dependencias, nao precisa de isolamento.

## O problema do modificador de acesso

O instrutor enfatiza fortemente: **nunca mude `internal` para `public` por causa de testes**. Isso quebra o principio de encapsulamento. A classe `BcryptNet` e `internal` por uma razao de seguranca — nenhum outro projeto deveria poder instancia-la diretamente.

A analogia implicita: e como abrir uma porta trancada permanentemente so porque voce precisa entrar uma vez. A solucao correta e ter uma chave (InternalsVisibleTo), nao remover a fechadura.

## InternalsVisibleTo — o truque que poucos conhecem

O atributo `[assembly: InternalsVisibleTo("NomeDoProjeto")]` e descrito pelo instrutor como algo que "pouquissimos devs C# sabem". Pontos criticos:

1. **Posicionamento**: DEVE ficar acima do `namespace`, nunca acima da classe. O instrutor demonstra que colocar acima da classe causa erro.

2. **Escopo**: Libera TODO o namespace, nao apenas uma classe. Se voce tem outras classes `internal` no mesmo namespace, elas tambem ficam acessiveis. O instrutor demonstra isso criando uma classe temporaria "Ellison" no mesmo namespace e mostrando que ela tambem fica acessivel.

3. **Seguranca**: A permissao e por projeto. Outros projetos da solution continuam sem acesso.

## Tuplas nomeadas como retorno de builder

O problema: o `UserBuilder` retornava apenas a entidade `User`, mas a senha na entidade esta criptografada. Para testes de change password, o teste precisa da senha em texto puro (para enviar no request e o `IsValid` retornar `true`).

A solucao elegante do C#: retornar `(User user, string password)`. No chamador, voce pode desestruturar: `var (user, password) = UserBuilder.Build()`. Quando nao precisa de um dos valores, use `_`: `var (user, _) = UserBuilder.Build()`.

O instrutor destaca que retornos nomeados sao melhores que `(User, string)` porque fica claro o que cada valor representa — "Que string e essa? E o nome? O email? Nao, e o password."

## Mapeamento de cenarios

O instrutor demonstra como mapear cenarios olhando o codigo do use case:

1. **Sucesso**: validator passa, senha confere, nova senha e salva
2. **Falha de validacao**: nova senha vazia, validator rejeita antes de verificar match
3. **Falha de match**: nova senha valida, mas senha atual nao confere com hash

Cada branch no codigo do use case = um teste. O valor default de `bool` em C# e `false`, entao sem configurar o mock, `IsValid` sempre retornaria `false` — mais um motivo para usar a implementacao real.

## Assert por referencia

Insight importante: entidades em C# sao classes (reference types). Quando o use case altera `user.Password`, a variavel no teste tambem reflete a mudanca. O instrutor usa isso para um assert poderoso: salva o hash antigo antes de executar, depois verifica que `user.Password` mudou. Isso garante que o use case realmente alterou a senha, nao apenas "nao deu erro".